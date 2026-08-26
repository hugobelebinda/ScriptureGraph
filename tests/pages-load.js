import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

/**
 * Load test for the new map pages (Cities, Journeys) plus the verse API they call.
 *
 * WEB_URL: frontend origin (default http://localhost:5173)
 * API_URL: API origin (default http://localhost:3001)
 *
 *   WEB_URL=http://localhost:4173 API_URL=http://localhost:3001 k6 run tests/pages-load.js
 */

const WEB_URL = __ENV.WEB_URL || "http://localhost:5173";
const API_URL = __ENV.API_URL || "http://localhost:3001";

const pageDuration = new Trend("page_duration");
const verseDuration = new Trend("verse_duration");
const unexpectedError = new Rate("unexpected_error");

const PAGES = ["/", "/cities", "/journeys", "/atlas"];
const CITY_CHAPTERS = [
  ["GEN", 14],
  ["JOS", 6],
  ["2SA", 5],
  ["MAT", 21],
  ["JHN", 11],
  ["ACT", 2],
  ["ACT", 16],
  ["ACT", 17],
  ["ACT", 18],
  ["ACT", 28],
];

export const options = {
  scenarios: {
    pages: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10s", target: 3 },
        { duration: "40s", target: 3 },
        { duration: "10s", target: 0 },
      ],
      exec: "hitPages",
    },
    cityVerses: {
      executor: "constant-vus",
      vus: 2,
      duration: "50s",
      exec: "hitCityVerses",
      startTime: "5s",
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<2500"],
    page_duration: ["p(95)<1500"],
    verse_duration: ["p(95)<1200"],
    unexpected_error: ["rate<0.02"],
    "checks{type:page}": ["rate>0.98"],
    "checks{type:verses}": ["rate>0.95"],
    "checks{type:health}": ["rate>0.99"],
  },
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function setup() {
  const health = http.get(`${API_URL}/api/health`);
  check(health, { "api health 200": (r) => r.status === 200 }, { type: "health" });
  unexpectedError.add(health.status !== 200);
}

export function hitPages() {
  const path = pick(PAGES);
  const res = http.get(`${WEB_URL}${path}`, {
    headers: { Accept: "text/html" },
    tags: { name: `page ${path}` },
  });
  pageDuration.add(res.timings.duration);
  unexpectedError.add(res.status !== 200);
  check(
    res,
    {
      "page status 200": (r) => r.status === 200,
      "page is html": (r) => String(r.headers["Content-Type"] || "").includes("text/html"),
      "page has app root": (r) => String(r.body).includes("id=\"root\""),
    },
    { type: "page" },
  );
  sleep(1.2);
}

export function hitCityVerses() {
  const [book, chapter] = pick(CITY_CHAPTERS);
  const lang = Math.random() < 0.5 ? "en" : "fr";
  const res = http.get(`${API_URL}/api/verses/${book}/${chapter}?lang=${lang}`, {
    tags: { name: "city verses" },
  });
  verseDuration.add(res.timings.duration);
  unexpectedError.add(res.status !== 200);
  check(
    res,
    {
      "verses status 200": (r) => r.status === 200,
      "verses payload": (r) => Boolean(r.body && r.body.length > 40),
    },
    { type: "verses" },
  );
  sleep(1.6);
}
