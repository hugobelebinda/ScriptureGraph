#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from "node:fs";
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

console.log("== Supabase / RLS Check ==");

const supabaseRegex =
  /supabase|auth\.uid\(|enable row level security|create policy|alter table .* enable row level security/i;
const allRefs = [];
for (const full of walkFiles(repoRoot)) {
  const rel = full.replace(`${repoRoot}/`, "");
  if (!rel.startsWith("Backend/") && !rel.startsWith("Frontend/")) continue;
  if (
    rel.startsWith("scripts/security/") ||
    rel.endsWith("package-lock.json") ||
    rel.endsWith(".md") ||
    rel.endsWith(".json") ||
    rel.endsWith(".mp4") ||
    rel.endsWith(".png") ||
    rel.endsWith(".jpg") ||
    rel.endsWith(".jpeg") ||
    rel.endsWith(".webp")
  ) {
    continue;
  }
  const content = safeRead(full);
  if (!content) continue;
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    if (supabaseRegex.test(lines[i])) {
      allRefs.push(`${rel}:${i + 1}:${lines[i].trim()}`);
    }
  }
}
const supabaseRefs = allRefs.join("\n");

if (!supabaseRefs) {
  console.log("No Supabase/RLS artifacts detected in repository.");
  console.log("RESULT: N/A (project appears to use Prisma/PostgreSQL directly, not Supabase)");
  process.exit(0);
}

console.log("Detected Supabase/RLS references:");
console.log(supabaseRefs);

const migrationSql = allRefs
  .filter((line) => line.startsWith("Backend/prisma/migrations/"))
  .join("\n");
const hasRls = Boolean(migrationSql);

console.log("\nPolicy-related references in migrations:");
console.log(migrationSql || "- none found -");

if (hasRls) {
  console.log("\nRESULT: PASS (RLS/policy statements detected)");
  process.exit(0);
}

console.log("\nRESULT: FAIL (Supabase references exist but no clear RLS policy statements found)");
process.exit(1);
