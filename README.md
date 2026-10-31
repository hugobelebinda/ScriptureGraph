# ViaScripture

**ViaScripture** is a bilingual Bible exploration platform (English/French) designed to connect Scripture across **text, history, geography, and themes**.

Live site: [https://www.viascripture.com](https://www.viascripture.com)

> _"I am the way, and the truth, and the life."_ — John 14:6

## Why ViaScripture

- Explore verse-to-verse connections visually in a graph.
- Locate books in historical-geographical context through an atlas.
- Follow nine great biblical journeys stop by stop on a 3D globe.
- Open a biblical city and read the events that made it matter, down to the verse.
- Compare biblical order and historical order in one timeline view.
- Discover curated verses by emotional/spiritual themes.
- Hover a tagged word to see its Hebrew or Greek Strong's entry.
- Switch instantly between English and French across the whole UI.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/graph` | Graph |
| `/atlas` | Atlas |
| `/journeys` | Journey Visualizer |
| `/cities` | City Events Explorer (`?city=` deep link) |
| `/compass` | Emotional Compass |
| `/chronological` | Timeline |
| `/interlinear` | Interlinear (`?verse=GEN.1.1`) |
| `/interlinear/word/:strongsId` | Strong's concordance (paginated) |

## Core Modules

### Graph
- Verse-centered cross-reference visualization (Cytoscape).
- Server-ranked tiers:
  - **Direct Links**
  - **Strong Links**
  - **All** (list-only expansion)
- Localized current verse display and dedicated current-verse card.
- LSG numbering notice for known verse-merge edge cases.

### Atlas
- Mapbox historical canvas with timeline slider.
- Time-filtered empire overlays from local GeoJSON layers.
- Place-based authorship stars with side panel details.
- Localized mini-summaries (EN/FR), synchronized with timeline-style language.
- Attribution + feedback notice in map footer.

### Journeys
- Nine bilingual routes (Abraham through Paul) on a Mapbox globe.
- 93 stops, grouped when several visits share a place.
- Curved arcs for legibility, not as exact itineraries.
- Star markers and parchment popups scale with zoom; below zoom 5.4 the popup is compact (name, stop, refs).
- On phones the stop list sits under the map so it is not clipped.
- Coordinates and identification scores from [OpenBible.info Bible Geocoding](https://openbible.info/geo/) (CC BY).

### Cities
- 47 cities and 312 events, from headlines down to the verse itself.
- Star size follows narrative density (primary / major / notable / minor).
- Same zoom-linked popup behavior as Journeys: compact at low zoom, full blurb and provenance when zoomed in.
- Headlines first, then the full list grouped by period; a reference row fetches WEB / LSG text from the API.
- Deep link: `/cities?city=jerusalem`.
- Major cities are curated: not every event is listed. The panel says so.
- Same OpenBible.info coordinate provenance as Journeys.

### Timeline
- Two synchronized perspectives:
  - **Biblical order** (canonical)
  - **Chronological order**
- Section separators and scholarly tooltip summaries.
- One-click jump from timeline book to graph preselection.

### Emotional Compass
- Theme cards (peace, anxiety, loneliness, grief, guilt, hope, weariness, joy).
- Curated references + contextual summary.
- Verse/chapter retrieval with caching helpers.

### Interlinear
- Full-Bible chapter reader: Hebrew OT (Open Scriptures / WLC) and Greek NT (Nestle 1904).
- Hover or tap a dotted original-language word for a parchment Strong's card; WEB / LSG sits under each verse when the API is up.
- `/interlinear/word/:strongsId` lists other verses with that original word, 20 at a time, with Show more. Frequent words are not dumped in one list.
- Rebuild data with `npm run build:interlinear`.
- Credit: Strong's (public domain); French cards add a short UBS gloss and a fuller rendering of the English Strong's article; hover idea inspired by Église Baptiste Évangélique de Rosemont.

## Product Screenshots (to add)

- `docs/screenshots/home.png`
- `docs/screenshots/graph.png`
- `docs/screenshots/atlas.png`
- `docs/screenshots/journeys.png`
- `docs/screenshots/cities.png`
- `docs/screenshots/timeline.png`
- `docs/screenshots/compass.png`
- `docs/screenshots/interlinear.png`

Example markdown once added:

```md
![Home](docs/screenshots/home.png)
![Graph](docs/screenshots/graph.png)
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, React Router, Zustand, i18next, Mapbox GL, Cytoscape
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Data**: bilingual verse corpus (WEB / LSG) + OpenBible.info cross-references and geocoding

## Repository Structure

- `Frontend/` — Vite React app (`scripturegraph-frontend`)
- `Backend/` — Express + Prisma API (`scripturegraph-backend`)
- `scripts/` — dataset checks, security audits, Bible download, atlas mosaic
- `tests/` — k6 load tests
- `data-raw/` — raw import files (if present locally)

## Quick Start

### 1) Install

```bash
npm install
```

### 2) Configure environment

Copy `.env.example` to `.env` at the repo root. Minimum:

```env
DATABASE_URL=postgresql://<user>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://<user>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
LOCAL_DATABASE_URL=postgresql://<user>:<password>@localhost:5433/<database>
PORT=3001
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173
VITE_MAPBOX_TOKEN=pk.<your_mapbox_public_token>
```

- `DATABASE_URL` — Prisma / API. For Supabase’s transaction pooler (port `6543`), keep `?pgbouncer=true` so Prisma does not use prepared statements (avoids intermittent `prepared statement does not exist` 500s).
- `DIRECT_URL` — session pooler or direct DB (port `5432`) for Prisma migrations.
- `LOCAL_DATABASE_URL` — required only by `npm run migrate:data -w scripturegraph-backend` (one-off local → Supabase copy).
- `FRONTEND_ORIGIN` — CORS allowlist. On Vercel this must be the live origin (`https://www.viascripture.com`).
- `VITE_MAPBOX_TOKEN` — public Mapbox token. Vite reads env from the repo root (`Frontend/vite.config.ts` uses `envDir: ".."`). It must be present at **build** time for Atlas, Journeys, and Cities.

### 3) Run

```bash
# Terminal 1
npm run dev:api

# Terminal 2
npm run dev:web
```

Open `http://localhost:5173`.

## Scripts

From repo root:

- `npm run dev:api` — start backend (watch mode)
- `npm run dev:web` — start frontend
- `npm run build -w scripturegraph-frontend` — frontend build + typecheck
- `npm run seed -w scripturegraph-backend` — seed database
- `npm run prisma:migrate -w scripturegraph-backend` — Prisma migrations
- `npm run db:push -w scripturegraph-backend` — schema push
- `npm run migrate:data -w scripturegraph-backend` — copy local DB to Supabase (`LOCAL_DATABASE_URL` + `DATABASE_URL`)
- `npm run security:audit` — secrets, rate limit, RLS (N/A if unused), CORS, Zod validation
- `npm run build:interlinear` — rebuild Hebrew/Greek interlinear JSON into `Frontend/public/interlinear/`

Dataset checks (API must be running for verse-text checks):

```bash
npx tsx scripts/verify-journeys.ts
npx tsx scripts/verify-cities.ts
npx tsx scripts/verify-city-refs.ts
```

OpenBible.info cross-check for journey coordinates (download `ancient.jsonl` first; see the script header):

```bash
npx tsx scripts/crosscheck-journeys.ts
```

## Load tests (k6)

API baseline / stress:

```bash
BASE_URL=http://localhost:3001 k6 run tests/load-test.js
TEST_MODE=baseline BASE_URL=https://www.viascripture.com k6 run tests/load-test.js
```

Frontend map pages plus verse fetches:

```bash
WEB_URL=http://localhost:5173 API_URL=http://localhost:3001 k6 run tests/pages-load.js
```

`http_req_failed` includes intentional 400s from negative tests. Gate on `unexpected_error` instead.

## API Snapshot

- `GET /api/health`
- `GET /api/verses/:book/:chapter?lang=en|fr`
- `GET /api/connections/:verse_uid?lang=en|fr`
- Graph data endpoints consumed by `useBibleData` with ranked tier payloads (`core_uids`, `strong_uids`, `all_uids`)

Rate limits (in-memory, per isolate): 180/min general, 40/min on `/api/connections` and `/api/cross-references`. CORS allows `GET` and `HEAD` from `FRONTEND_ORIGIN` only.

## Current Notes

- Atlas borders are visual approximations.
- Some authorship/location mappings are interpretation-sensitive by design.
- Journey routes are drawn for reading, not as surveyed itineraries.
- City event lists are curated, especially for Jerusalem, Rome, and other primary sites.
- Coordinates come from OpenBible.info and carry an identification confidence score.
- Frontend bundle can be optimized further with additional code splitting (Vite warns above 500 KB).
- Supabase transaction pooler (port `6543`) must include `?pgbouncer=true` on `DATABASE_URL`. Without it, concurrent verse fetches can 500 with `prepared statement does not exist`.

## Name & Identity

- Project name: **ViaScripture**
- Main motto: **John 14:6**
