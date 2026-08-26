/**
 * Timed fetches for the new pages and the verse API they depend on.
 * Run with: node scripts/perf-pages.mjs
 *
 * WEB_URL default http://localhost:5173
 * API_URL default http://localhost:3001
 */
const WEB_URL = process.env.WEB_URL || "http://localhost:5173";
const API_URL = process.env.API_URL || "http://localhost:3001";
const ROUNDS = Number(process.env.ROUNDS || 8);

const PAGES = ["/", "/cities", "/journeys", "/atlas", "/graph", "/compass", "/chronological"];
const CITY_CHAPTERS = [
  ["GEN", 14],
  ["JOS", 6],
  ["2SA", 5],
  ["LUK", 2],
  ["MAT", 21],
  ["JHN", 4],
  ["JHN", 11],
  ["ACT", 2],
  ["ACT", 9],
  ["ACT", 16],
  ["ACT", 17],
  ["ACT", 18],
  ["ACT", 19],
  ["ACT", 28],
  ["ROM", 1],
];

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[idx];
}

function summary(values) {
  if (!values.length) return { n: 0, min: 0, median: 0, p95: 0, max: 0 };
  return {
    n: values.length,
    min: Math.min(...values),
    median: percentile(values, 50),
    p95: percentile(values, 95),
    max: Math.max(...values),
  };
}

function fmt(ms) {
  return `${ms.toFixed(0)}ms`;
}

async function timedGet(url) {
  const started = performance.now();
  const res = await fetch(url, { headers: { Accept: "text/html,application/json" } });
  const ttfb = performance.now() - started;
  const buf = Buffer.from(await res.arrayBuffer());
  const total = performance.now() - started;
  return {
    url,
    status: res.status,
    ttfb,
    total,
    bytes: buf.byteLength,
    contentType: res.headers.get("content-type") || "",
  };
}

async function measure(label, urls, pauseMs = 0) {
  const rows = [];
  for (let round = 0; round < ROUNDS; round += 1) {
    for (const url of urls) {
      rows.push(await timedGet(url));
      if (pauseMs) await new Promise((resolve) => setTimeout(resolve, pauseMs));
    }
  }
  const ok = rows.filter((r) => r.status >= 200 && r.status < 400);
  const failed = rows.filter((r) => r.status >= 400);
  const totals = ok.map((r) => r.total);
  const ttfbs = ok.map((r) => r.ttfb);
  const bytes = ok.map((r) => r.bytes);
  return {
    label,
    requests: rows.length,
    ok: ok.length,
    failed: failed.length,
    statusSample: failed[0]?.status ?? ok[0]?.status ?? 0,
    total: summary(totals),
    ttfb: summary(ttfbs),
    avgBytes: bytes.length ? Math.round(bytes.reduce((a, b) => a + b, 0) / bytes.length) : 0,
  };
}

function printBlock(result) {
  const t = result.total;
  const h = result.ttfb;
  console.log(
    `${result.label.padEnd(28)} ok=${result.ok}/${result.requests}  ` +
      `ttfb p50/p95 ${fmt(h.median)}/${fmt(h.p95)}  ` +
      `total p50/p95 ${fmt(t.median)}/${fmt(t.p95)}  ` +
      `avg ${result.avgBytes}B`,
  );
}

async function main() {
  const health = await timedGet(`${API_URL}/api/health`);
  if (health.status !== 200) {
    throw new Error(`API health ${health.status} at ${API_URL}`);
  }

  console.log(`WEB ${WEB_URL}  API ${API_URL}  rounds=${ROUNDS}\n`);

  const pageResults = [];
  for (const path of PAGES) {
    pageResults.push(await measure(path, [`${WEB_URL}${path}`]));
  }

  const verseUrls = CITY_CHAPTERS.map(
    ([book, chapter]) => `${API_URL}/api/verses/${book}/${chapter}?lang=en`,
  );
  const verseResult = await measure("city verse API", verseUrls, 400);

  const citiesDeep = await measure("cities?city=jerusalem", [`${WEB_URL}/cities?city=jerusalem`]);
  const journeysDeep = await measure("journeys?id=exodus", [`${WEB_URL}/journeys?id=exodus`]);

  console.log("Pages");
  for (const result of [...pageResults, citiesDeep, journeysDeep]) printBlock(result);
  console.log("\nAPI");
  printBlock(verseResult);
  printBlock(await measure("api health", [`${API_URL}/api/health`]));

  const worstPage = [...pageResults, citiesDeep, journeysDeep].sort(
    (a, b) => b.total.p95 - a.total.p95,
  )[0];
  const pageFail = [...pageResults, citiesDeep, journeysDeep].some((r) => r.failed > 0);
  const verseFail = verseResult.failed > 0;
  const slowPage = worstPage.total.p95 > 1500;
  const slowVerse = verseResult.total.p95 > 1200;

  console.log("\nReadiness");
  console.log(`  pages HTTP ok: ${pageFail ? "FAIL" : "PASS"}`);
  console.log(`  verse API ok: ${verseFail ? "FAIL" : "PASS"}`);
  console.log(
    `  slowest page p95: ${worstPage.label} ${fmt(worstPage.total.p95)} ${slowPage ? "(over 1.5s)" : "(under 1.5s)"}`,
  );
  console.log(
    `  verse API p95: ${fmt(verseResult.total.p95)} ${slowVerse ? "(over 1.2s)" : "(under 1.2s)"}`,
  );

  if (pageFail || verseFail) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
