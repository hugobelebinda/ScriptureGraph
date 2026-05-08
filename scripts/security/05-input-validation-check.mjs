#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const repoRoot = process.cwd();
const baseUrl = process.env.API_BASE_URL || "http://localhost:3001";

function safeRead(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

function walkFiles(dir, out = []) {
  const skipDirs = new Set(["node_modules", "dist", ".git", ".cursor"]);
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (skipDirs.has(entry)) continue;
      walkFiles(full, out);
    } else if (st.isFile()) {
      out.push(full);
    }
  }
  return out;
}

console.log("== Input Validation & Sanitization Check ==");

const libRegex = /from "zod"|from "joi"|from "yup"|express-validator|validator/i;
const refLines = [];
for (const fullPath of walkFiles(repoRoot)) {
  const relPath = fullPath.replace(`${repoRoot}/`, "");
  if (!relPath.startsWith("Backend/") && !relPath.startsWith("Frontend/")) continue;
  if (!/\.(ts|tsx|js|mjs|cjs)$/i.test(relPath)) continue;
  const content = safeRead(fullPath);
  if (!content) continue;
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    if (libRegex.test(lines[i])) refLines.push(`${relPath}:${i + 1}:${lines[i].trim()}`);
  }
}
const libRefs = refLines.join("\n");
console.log(`Validation library references: ${libRefs ? "FOUND" : "NOT FOUND"}`);
if (libRefs) console.log(libRefs);

const tests = [
  `${baseUrl}/api/verses/JHN/not-a-number?lang=en`,
  `${baseUrl}/api/connections/not-a-uid?lang=en`,
  `${baseUrl}/api/cross-references/INVALID_INPUT?lang=en`,
];

let protectedRejectCount = 0;
for (const target of tests) {
  const res = await fetch(target);
  console.log(`- ${target} -> HTTP ${res.status}`);
  if (res.status === 400 || res.status === 429) protectedRejectCount += 1;
}

const endpointValidationPass = protectedRejectCount === tests.length;
if (endpointValidationPass && libRefs) {
  console.log("\nRESULT: PASS (strict libs present + endpoints reject malformed input)");
  process.exit(0);
}

if (endpointValidationPass && !libRefs) {
  console.log(
    "\nRESULT: PARTIAL (malformed inputs rejected, but no dedicated validation library detected)",
  );
  process.exit(1);
}

console.log("\nRESULT: FAIL (one or more malformed inputs were accepted)");
process.exit(1);
