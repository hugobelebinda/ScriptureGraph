/**
 * Writes 320×200 decorative SVG “covers” to Frontend/public/books/{USFM}.svg
 * (unique gradients + open-book motif per code). Re-run after changing logic:
 *   node scripts/generate-book-cover-svgs.mjs
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");
const outDir = path.join(repoRoot, "Frontend/public/books");

const BOOK_ORDER = [
  "GEN", "EXO", "LEV", "NUM", "DEU", "JOS", "JDG", "RUT", "1SA", "2SA", "1KI", "2KI",
  "1CH", "2CH", "EZR", "NEH", "EST", "JOB", "PSA", "PRO", "ECC", "SNG", "ISA", "JER",
  "LAM", "EZK", "DAN", "HOS", "JOL", "AMO", "OBA", "JON", "MIC", "NAM", "HAB", "ZEP",
  "HAG", "ZEC", "MAL", "MAT", "MRK", "LUK", "JHN", "ACT", "ROM", "1CO", "2CO", "GAL",
  "EPH", "PHP", "COL", "1TH", "2TH", "1TI", "2TI", "TIT", "PHM", "HEB", "JAS", "1PE",
  "2PE", "1JN", "2JN", "3JN", "JUD", "REV",
];

function palette(id) {
  const h = crypto.createHash("sha256").update(id).digest();
  const r = (i) => h[i] / 255;
  const c1 = `hsl(${Math.floor(r(0) * 360)}, ${45 + Math.floor(r(1) * 25)}%, ${32 + Math.floor(r(2) * 18)}%)`;
  const c2 = `hsl(${Math.floor(r(3) * 360)}, ${35 + Math.floor(r(4) * 20)}%, ${48 + Math.floor(r(5) * 15)}%)`;
  const accent = `hsl(${Math.floor(r(6) * 360)}, 50%, ${70 + Math.floor(r(7) * 20)}%)`;
  return { c1, c2, accent };
}

function svgFor(id) {
  const i = BOOK_ORDER.indexOf(id);
  const isNt = i >= 39;
  const { c1, c2, accent } = palette(id);
  const frame = isNt ? "rgba(88,129,87,0.22)" : "rgba(163,177,138,0.28)";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200" role="img" aria-hidden="true">
  <defs>
    <linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <linearGradient id="s-${id}" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02"/>
    </linearGradient>
  </defs>
  <rect width="320" height="200" rx="16" fill="url(#g-${id})"/>
  <rect width="320" height="200" rx="16" fill="url(#s-${id})"/>
  <rect x="10" y="10" width="300" height="180" rx="12" fill="${frame}" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
  <g fill="rgba(255,255,255,0.88)" transform="translate(160,102)">
    <path d="M-85,-42 L-12,-32 L-12,46 L-88,38 Q-95,36 -95,28 L-95,-34 Q-95,-44 -85,-42 Z"/>
    <path d="M85,-42 L12,-32 L12,46 L88,38 Q95,36 95,28 L95,-34 Q95,-44 85,-42 Z"/>
    <path d="M-12,-32 L12,-32 L12,46 L-12,46 Z" fill="rgba(255,255,255,0.45)"/>
    <line x1="0" y1="-32" x2="0" y2="46" stroke="rgba(52,78,65,0.12)" stroke-width="1"/>
  </g>
  <circle cx="268" cy="34" r="5" fill="${accent}" opacity="0.85"/>
  <circle cx="52" cy="166" r="6" fill="${accent}" opacity="0.35"/>
  <text x="160" y="188" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-family="ui-sans-serif,system-ui,sans-serif" font-size="11" font-weight="600" letter-spacing="0.08em">${id}</text>
</svg>
`;
}

fs.mkdirSync(outDir, { recursive: true });
for (const id of BOOK_ORDER) {
  fs.writeFileSync(path.join(outDir, `${id}.svg`), svgFor(id), "utf8");
}
console.log(`Wrote ${BOOK_ORDER.length} SVGs to ${outDir}`);
