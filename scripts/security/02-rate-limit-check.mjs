#!/usr/bin/env node
const baseUrl = process.env.API_BASE_URL || "http://localhost:3001";
const target = `${baseUrl}/api/connections/JHN.3.16?lang=en`;
const attempts = Number(process.env.RATE_LIMIT_ATTEMPTS || 80);

console.log("== Rate Limit Check ==");
console.log(`Target: ${target}`);
console.log(`Attempts: ${attempts}`);

let status429 = 0;
let status2xx = 0;
const buckets = new Map();

for (let i = 0; i < attempts; i += 1) {
  const res = await fetch(target, { method: "GET" });
  const code = res.status;
  buckets.set(code, (buckets.get(code) ?? 0) + 1);
  if (code === 429) status429 += 1;
  if (code >= 200 && code < 300) status2xx += 1;
}

for (const [code, count] of [...buckets.entries()].sort((a, b) => a[0] - b[0])) {
  console.log(`- HTTP ${code}: ${count}`);
}

if (status429 > 0) {
  console.log("\nRESULT: PASS (429 responses observed)");
  process.exit(0);
}

console.log("\nRESULT: FAIL (no 429 responses observed)");
console.log("Recommendation: add route-specific or global rate limiting middleware.");
process.exit(1);
