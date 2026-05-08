# ViaScripture

**ViaScripture** is a bilingual Bible exploration platform (English/French) designed to connect Scripture across **text, history, geography, and themes**.

> _"I am the way, and the truth, and the life."_ — John 14:6

## Why ViaScripture

- Explore verse-to-verse connections visually in a graph.
- Locate books in historical-geographical context through an atlas.
- Compare biblical order and historical order in one timeline view.
- Discover curated verses by emotional/spiritual themes.
- Switch instantly between English and French across the whole UI.

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

## Product Screenshots (to add)

You can add screenshots here for GitHub visitors:

- `docs/screenshots/home.png`
- `docs/screenshots/graph.png`
- `docs/screenshots/atlas.png`
- `docs/screenshots/timeline.png`
- `docs/screenshots/compass.png`

Example markdown once added:

```md
![Home](docs/screenshots/home.png)
![Graph](docs/screenshots/graph.png)
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, React Router, Zustand, i18next, Mapbox GL, Cytoscape
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Data**: bilingual verse corpus + cross-reference dataset

## Repository Structure

- `Frontend/` — Vite React app (`scripturegraph-frontend`)
- `Backend/` — Express + Prisma API (`scripturegraph-backend`)
- `data-raw/` — raw import files (if present locally)

## Quick Start

### 1) Install

```bash
npm install
```

### 2) Configure environment

Create root `.env` with at least:

```env
DATABASE_URL=...
PORT=3000
VITE_MAPBOX_TOKEN=...
NODE_ENV=development
```

> Frontend reads env from repo root (`Frontend/vite.config.ts` uses `envDir: ".."`).

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

## API Snapshot

- `GET /api/health`
- `GET /api/verses/:book/:chapter?lang=en|fr`
- `GET /api/connections/:verse_uid?lang=en|fr`
- Graph data endpoints consumed by `useBibleData` with ranked tier payloads (`core_uids`, `strong_uids`, `all_uids`)

## Current Notes

- Atlas borders are visual approximations.
- Some authorship/location mappings are interpretation-sensitive by design.
- Frontend bundle can be optimized further with additional code splitting.

## Name & Identity

- Project name: **ViaScripture**
- Main motto: **John 14:6**

