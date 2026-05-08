#!/usr/bin/env node
const baseUrl = process.env.API_BASE_URL || "http://localhost:3001";
const url = `${baseUrl}/api/health`;
const origin = process.env.TEST_ORIGIN || "https://evil.example";

console.log("== CORS & Network Security Check ==");
console.log(`URL: ${url}`);
console.log(`Origin header tested: ${origin}`);

const preflight = await fetch(url, {
  method: "OPTIONS",
  headers: {
    Origin: origin,
    "Access-Control-Request-Method": "GET",
    "Access-Control-Request-Headers": "content-type",
  },
});

const allowOrigin = preflight.headers.get("access-control-allow-origin");
const allowMethods = preflight.headers.get("access-control-allow-methods");
const allowHeaders = preflight.headers.get("access-control-allow-headers");

console.log(`- HTTP status: ${preflight.status}`);
console.log(`- access-control-allow-origin: ${allowOrigin ?? "<none>"}`);
console.log(`- access-control-allow-methods: ${allowMethods ?? "<none>"}`);
console.log(`- access-control-allow-headers: ${allowHeaders ?? "<none>"}`);

const wildcardOrigin = allowOrigin === "*";
const methodsContainsRisky =
  typeof allowMethods === "string" && /(PUT|PATCH|DELETE)/i.test(allowMethods);

if (!wildcardOrigin && !methodsContainsRisky) {
  console.log("\nRESULT: PASS (origin not wildcard; methods not overly broad)");
  process.exit(0);
}

console.log("\nRESULT: FAIL");
if (wildcardOrigin) console.log("- CORS origin is wildcard '*'");
if (methodsContainsRisky) console.log("- CORS methods expose PUT/PATCH/DELETE");
process.exit(1);
