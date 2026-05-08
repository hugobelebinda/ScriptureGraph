#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const repoRoot = process.cwd();

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

const rgPattern =
  "postgresql://|service_role|SUPABASE_SERVICE_ROLE|VITE_MAPBOX_TOKEN\\s*=\\s*pk\\.|sk-[A-Za-z0-9]";
const secretRegex = new RegExp(rgPattern, "i");

const gitignorePath = join(repoRoot, ".gitignore");
const gitignore = safeRead(gitignorePath);
const envExamplePath = join(repoRoot, ".env.example");
const envExample = safeRead(envExamplePath);

const gitignoreChecks = [".env", ".env.local", ".env.production"].map((entry) => ({
  entry,
  ok: gitignore.includes(entry),
}));

const requiredExampleKeys = ["DATABASE_URL", "PORT", "NODE_ENV", "FRONTEND_ORIGIN", "VITE_MAPBOX_TOKEN"];
const envExampleChecks = requiredExampleKeys.map((key) => ({
  key,
  ok: envExample.includes(`${key}=`),
}));

const findings = [];
for (const fullPath of walkFiles(repoRoot)) {
  const relPath = fullPath.replace(`${repoRoot}/`, "");
  if (
    relPath.startsWith("scripts/security/") ||
    relPath === ".env" ||
    relPath.startsWith(".env.") ||
    relPath.endsWith(".mp4") ||
    relPath.endsWith(".png") ||
    relPath.endsWith(".jpg") ||
    relPath.endsWith(".jpeg") ||
    relPath.endsWith(".webp") ||
    relPath.endsWith("package-lock.json")
  ) {
    continue;
  }
  if (relPath === "README.md" || relPath === ".env.example") continue;
  const content = safeRead(fullPath);
  if (!content) continue;
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (secretRegex.test(line)) findings.push(`${relPath}:${i + 1}:${line.trim()}`);
  }
}

console.log("== Secret Management Audit ==");
console.log(`Potential secret/config matches (excluding README/.env.example): ${findings.length}`);
for (const f of findings) console.log(`- ${f}`);

console.log("\n.gitignore checks:");
for (const c of gitignoreChecks) console.log(`- ${c.entry}: ${c.ok ? "OK" : "MISSING"}`);

console.log("\n.env.example checks:");
if (!existsSync(envExamplePath)) {
  console.log("- .env.example: MISSING");
} else {
  console.log("- .env.example: OK");
  for (const c of envExampleChecks) console.log(`  - ${c.key}: ${c.ok ? "OK" : "MISSING"}`);
}

const pass = findings.length === 0 && gitignoreChecks.every((c) => c.ok) && envExampleChecks.every((c) => c.ok);
console.log(`\nRESULT: ${pass ? "PASS" : "FAIL"}`);
process.exit(pass ? 0 : 1);
