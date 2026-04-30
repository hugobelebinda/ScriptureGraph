# ScriptureGraph

Bilingual Bible exploration app (EN/FR) combining:
- chapter reading,
- cross-reference graph primitives,
- chronological timeline,
- emotional compass,
- historical atlas with timeline and map overlays.

This README is the **current implementation snapshot** so a new agent can pick up work with full context.

---

## 1) Monorepo Structure

- Root workspace: `scripturegraph`
- Packages:
  - `Backend` (`scripturegraph-backend`): Express + Prisma + seed pipeline
  - `Frontend` (`scripturegraph-frontend`): Vite + React + Tailwind + i18next + Mapbox
- Raw data directory (expected): `data-raw/`
  - `bible-en/` and `bible-fr/` chapter JSON files
  - `cross_references.txt`

---

## 2) Scripts

From repo root:

- `npm run dev:api` — start backend (`tsx watch src/server.ts`)
- `npm run dev:web` — start frontend (Vite)
- `npm run download-bible` — pull Bible JSON files from HelloAO API
- `npm run generate:book-covers` — generate `Frontend/public/books/*.svg`

Backend-specific:

- `npm run seed -w scripturegraph-backend` — seed verses + cross references
- `npm run prisma:migrate -w scripturegraph-backend`
- `npm run db:push -w scripturegraph-backend`

Frontend-specific:

- `npm run build -w scripturegraph-frontend`
- `npm run preview -w scripturegraph-frontend`

---

## 3) Environment Variables

Root `.env` currently used for both backend and frontend:

- `DATABASE_URL` (PostgreSQL)
- `PORT` (backend, default 3000)
- `NODE_ENV`
- `VITE_MAPBOX_TOKEN` (frontend map token)

Important frontend note:
- `Frontend/vite.config.ts` sets `envDir: ".."`, so Vite reads env from repo root.

---

## 4) Backend Status

### 4.1 Prisma schema

`Backend/prisma/schema.prisma`:
- `Verse`
  - `uid` (PK, `BOOK.CH.VS` format)
  - `text_en`, `text_fr`
  - `book_name_en`, `book_name_fr`
- `CrossReference`
  - `id` (auto)
  - `source_uid`, `target_uid`, `weight`
  - unique pair index + source/target indexes

### 4.2 Seed pipeline (`Backend/src/seed.ts`)

Implemented:
- bilingual merge of EN/FR chapter files
- robust verse text flattening from nested content pieces
- UID normalization (`JHN.3.16` format)
- streamed parsing of `cross_references.txt`
- OpenBible-style reference parsing + ranges
- batch inserts with Prisma transactions (2,000 rows)
- idempotent behavior via truncation before reseed

### 4.3 API routes (`Backend/src/server.ts`)

- `GET /api/health`
- `GET /api/verses/:book/:chapter?lang=en|fr`
- `GET /api/connections/:verse_uid?lang=en|fr`

Behavior:
- `lang` controls returned `text` and `book_name`
- both `text_en` and `text_fr` remain available in payload
- connections sorted by weight desc (cap 500)

### 4.4 Known runtime gotcha

If backend fails with `EADDRINUSE :::3000`, another process already occupies port 3000.

---

## 5) Frontend Status

### 5.1 Global stack

- React 19 + TypeScript strict
- React Router
- Zustand (`useAppStore` for UI language)
- i18next (`Frontend/src/i18n/config.ts`)
- Tailwind with Sage palette (`sage.bg`, `sage.primary`, `sage.forest`, `sage.dark`, `sage.footer`)

### 5.2 App shell

- Sidebar navigation + language toggle + hierarchical search
- Global `ScrollToTop` on route changes
- Global footer (`Frontend/src/components/Footer.tsx`) with pale sage background and bilingual notice

### 5.3 Home page

Implemented in `Frontend/src/pages/Home.tsx`:
- hero video background: `Frontend/public/scriptureGraph_Home.mp4`
- centered title (`ScriptureGraph`)
- 4 large feature cards (Chronological, Compass, Atlas, Graph)
- custom card imagery from `Frontend/public/home/*.png`
- responsive card spacing/size tuned iteratively

### 5.4 Chronological page

Implemented in `Frontend/src/pages/ChronologicalView.tsx`:
- historical narrative order sections (not canonical order)
- hover/focus tooltip with scholarly notes
- larger tooltip style + generated book cover visuals

### 5.5 Emotional Compass page

Implemented in `Frontend/src/pages/CompassView.tsx` + `src/data/compassThemes.ts`:
- emotion cards with muted palette
- verse list per theme
- click verse -> load chapter -> extract verse text
- localized explanatory summary
- cache bypass retry path for stale chapter cache cases

---

## 6) Atlas (Current State)

`Frontend/src/pages/AtlasView.tsx` + `Frontend/src/data/atlasData.ts`

### 6.1 What is implemented

- Mapbox map with year slider (`-1500` to `100`, default `-900`)
- Timeline-driven overlay filtering for empires/territories
- Glowing outline style for historical boundaries
- Region click -> right slide-in detail panel
- Book writing-location stars:
  - one star per place (not one per book)
  - stars remain visible independent of slider
  - click star -> panel shows books at place, then book-specific author/time/place/context

### 6.2 Geospatial sources currently used

Local files under `Frontend/public/atlas/geojson/` include:
- `persian_empire.geojson`
- `alexanders_empire.geojson`
- `roman_empire_bce_60.geojson`
- `roman_empire_ce_117_extent.geojson`
- `hasmonean_kingdom.geojson`
- `herods_kingdom.geojson`
- `egypt_bc1500.geojson`
- `assyria_bc700.geojson`
- `babylonia_bc700.geojson`
- `twelve_tribes.geojson` (converted from KMZ)

### 6.3 Atlas logic status note

Empire outline logic was recently restarted/refactored and remains an active iteration area.
Book star behavior is currently considered stable by user preference and should be preserved unless explicitly requested.

---

## 7) Graph View Status

`Frontend/src/pages/GraphView.tsx` is still placeholder-level:
- reads selected `book` from URL query
- displays queued localized book
- full 4-level graph flow + Cytoscape still pending

---

## 8) Data & i18n Files of Interest

- `Frontend/src/locales/en.json`
- `Frontend/src/locales/fr.json`
- `Frontend/src/locales/chronology-tooltips.en.json`
- `Frontend/src/locales/chronology-tooltips.fr.json`

They now contain substantial UI + feature text, including:
- compass summaries,
- atlas layer labels/scope/history,
- footer notice,
- chronology copy.

---

## 9) Key Known Limitations / TODO

1. **Graph feature completion**
   - chapter reading rail + graph modal not complete
2. **Atlas border fidelity**
   - ongoing refinement of historical boundary precision across full timeline
3. **Destination modal from sidebar search**
   - not implemented yet
4. **Potential frontend bundle size optimization**
   - Atlas/Mapbox increases bundle; dynamic route/code splitting is a candidate

---

## 10) Quick Start

1. Install deps:
   - `npm install`
2. Ensure `.env` has valid:
   - `DATABASE_URL`
   - `PORT=3000`
   - `VITE_MAPBOX_TOKEN=pk....`
3. Start backend:
   - `npm run dev:api`
4. Start frontend:
   - `npm run dev:web`
5. Open:
   - `http://localhost:5173`

