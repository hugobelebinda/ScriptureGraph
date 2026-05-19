import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

/**
 * ViaScripture API load tests (k6)
 *
 * TEST_MODE:
 *   - baseline (default): light traffic from one IP, stays under tiered rate limits; expect mostly HTTP 200.
 *   - stress: aggressive traffic; HTTP 429 is expected and treated as a successful throttle response.
 *
 * BASE_URL: API origin (default https://www.viascripture.com)
 *
 * Examples:
 *   BASE_URL=http://localhost:3001 k6 run tests/load-test.js
 *   TEST_MODE=stress BASE_URL=https://www.viascripture.com k6 run tests/load-test.js
 */

const BASE_URL = __ENV.BASE_URL || "https://www.viascripture.com";
const TEST_MODE = (__ENV.TEST_MODE || "baseline").toLowerCase();
const IS_STRESS = TEST_MODE === "stress";

/** Counts responses that are neither success nor an expected throttle / validation error. */
const unexpectedError = new Rate("unexpected_error");

const UIDS = ["JHN.3.16", "ROM.8.28", "PSA.23.1", "MAT.5.9", "GEN.1.1"];
const VERSE_TARGETS = [
  ["JHN", 3],
  ["ROM", 8],
  ["PSA", 23],
  ["MAT", 5],
  ["GEN", 1],
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickLang() {
  return Math.random() < 0.5 ? "en" : "fr";
}

/** Baseline only: any non-200 is unexpected (should stay under rate limits). */
function recordUnexpectedNon200(res) {
  unexpectedError.add(res.status !== 200);
}

const baselineOptions = {
  scenarios: {
    steady_reads: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "20s", target: 3 },
        { duration: "90s", target: 3 },
        { duration: "20s", target: 0 },
      ],
      exec: "steadyReads",
    },
    heavy_graph: {
      executor: "constant-vus",
      vus: 1,
      duration: "75s",
      exec: "heavyGraph",
      startTime: "2m15s",
    },
    /** Run after heavy_graph: invalid `/connections` calls still hit the heavy route limiter. */
    negative_inputs: {
      executor: "constant-vus",
      vus: 1,
      duration: "50s",
      exec: "negative",
      startTime: "3m40s",
    },
    /** Cross-reference only; keep total crossrefs/min ≤ heavy tier (40/IP) even with 2 VUs. */
    light_spike: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10s", target: 2 },
        { duration: "35s", target: 2 },
        { duration: "10s", target: 0 },
      ],
      exec: "spike",
      startTime: "4m40s",
    },
  },
  thresholds: {
    /** Do not use raw http_req_failed here: intentional 400s from negative_inputs still count as "failed" in k6. */
    http_req_duration: ["p(95)<2500"],
    unexpected_error: ["rate<0.02"],
    "checks{type:health}": ["rate>0.99"],
    "checks{type:verses}": ["rate>0.95"],
    "checks{type:connections}": ["rate>0.92"],
    "checks{type:crossrefs}": ["rate>0.92"],
    "checks{type:negative}": ["rate>0.99"],
  },
};

const stressOptions = {
  scenarios: {
    steady_reads: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 10 },
        { duration: "1m", target: 10 },
        { duration: "30s", target: 0 },
      ],
      exec: "steadyReads",
    },
    heavy_graph: {
      executor: "constant-vus",
      vus: 6,
      duration: "2m",
      exec: "heavyGraph",
      startTime: "15s",
    },
    spike_test: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "15s", target: 2 },
        { duration: "20s", target: 30 },
        { duration: "20s", target: 30 },
        { duration: "15s", target: 0 },
      ],
      exec: "spike",
      startTime: "45s",
    },
    negative_inputs: {
      executor: "constant-vus",
      vus: 2,
      duration: "90s",
      exec: "negative",
      startTime: "20s",
    },
  },
  thresholds: {
    // Many 429s are expected; k6 still marks them as http_req_failed — do not gate on that here.
    http_req_duration: ["p(95)<5000"],
    unexpected_error: ["rate<0.02"],
    "checks{type:health}": ["rate>0.99"],
    "checks{type:verses}": ["rate>0.85"],
    "checks{type:connections}": ["rate>0.85"],
    "checks{type:crossrefs}": ["rate>0.80"],
    "checks{type:negative}": ["rate>0.99"],
  },
};

export const options = IS_STRESS ? stressOptions : baselineOptions;

export function setup() {
  const res = http.get(`${BASE_URL}/api/health`);
  check(res, { "health is up": (r) => r.status === 200 }, { type: "health" });
}

export function steadyReads() {
  const [book, chapter] = pick(VERSE_TARGETS);
  const res = http.get(`${BASE_URL}/api/verses/${book}/${chapter}?lang=${pickLang()}`);

  if (IS_STRESS) {
    const ok = res.status === 200 || res.status === 429;
    unexpectedError.add(!ok);
    check(
      res,
      {
        "verses 200 or throttled 429": (r) => r.status === 200 || r.status === 429,
        "verses body ok when 200": (r) => r.status !== 200 || Boolean(r.body && r.body.length > 20),
      },
      { type: "verses" },
    );
  } else {
    recordUnexpectedNon200(res);
    check(
      res,
      {
        "verses status 200": (r) => r.status === 200,
        "verses body non-empty": (r) => Boolean(r.body && r.body.length > 20),
      },
      { type: "verses" },
    );
  }

  sleep(IS_STRESS ? 0.4 : 1.5);
}

export function heavyGraph() {
  const uid = pick(UIDS);
  const connections = http.get(`${BASE_URL}/api/connections/${uid}?lang=${pickLang()}`);

  if (IS_STRESS) {
    const okC = connections.status === 200 || connections.status === 429;
    unexpectedError.add(!okC);
    check(
      connections,
      {
        "connections 200 or 429": (r) => r.status === 200 || r.status === 429,
        "connections payload if 200": (r) => r.status === 429 || Boolean(r.body && r.body.length > 20),
      },
      { type: "connections" },
    );
  } else {
    recordUnexpectedNon200(connections);
    check(
      connections,
      {
        "connections status 200": (r) => r.status === 200,
        "connections body non-empty": (r) => Boolean(r.body && r.body.length > 20),
      },
      { type: "connections" },
    );
  }

  const crossrefs = http.get(`${BASE_URL}/api/cross-references/${uid}?lang=${pickLang()}`);

  if (IS_STRESS) {
    const okX = crossrefs.status === 200 || crossrefs.status === 429;
    unexpectedError.add(!okX);
    check(
      crossrefs,
      {
        "crossrefs 200 or 429": (r) => r.status === 200 || r.status === 429,
        "crossrefs payload if 200": (r) => r.status === 429 || Boolean(r.body && r.body.length > 20),
      },
      { type: "crossrefs" },
    );
  } else {
    recordUnexpectedNon200(crossrefs);
    check(
      crossrefs,
      {
        "crossrefs status 200": (r) => r.status === 200,
        "crossrefs body non-empty": (r) => Boolean(r.body && r.body.length > 20),
      },
      { type: "crossrefs" },
    );
  }

  sleep(IS_STRESS ? 0.8 : 3);
}

export function spike() {
  const uid = pick(UIDS);
  const res = http.get(`${BASE_URL}/api/cross-references/${uid}?lang=${pickLang()}`);

  if (IS_STRESS) {
    const ok = res.status === 200 || res.status === 429;
    unexpectedError.add(!ok);
    check(res, { "spike 200 or 429": (r) => r.status === 200 || r.status === 429 }, { type: "crossrefs" });
    sleep(0.2);
  } else {
    recordUnexpectedNon200(res);
    check(res, { "light spike crossrefs 200": (r) => r.status === 200 }, { type: "crossrefs" });
    sleep(3.0);
  }
}

export function negative() {
  const badUid = http.get(`${BASE_URL}/api/connections/not-a-uid?lang=en`);
  const badChapter = http.get(`${BASE_URL}/api/verses/JHN/not-a-chapter?lang=fr`);

  for (const r of [badUid, badChapter]) {
    const ok = r.status === 400 || r.status === 429;
    unexpectedError.add(!ok);
  }

  check(badUid, { "invalid uid rejected": (r) => r.status === 400 || r.status === 429 }, { type: "negative" });
  check(
    badChapter,
    { "invalid chapter rejected": (r) => r.status === 400 || r.status === 429 },
    { type: "negative" },
  );
  sleep(IS_STRESS ? 0.5 : 2);
}
