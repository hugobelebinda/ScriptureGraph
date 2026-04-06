# ScriptureGraph

Bilingual Bible visualization (EN/FR): graph navigation, cross-references, atlas, and compass-style discovery.

## Milestone: data layer and design tokens

### PostgreSQL + Prisma

- **Connection:** set `DATABASE_URL` in `.env` (see manifest; default port `5433`).
- **Schema:** `Backend/prisma/schema.prisma` — `Verse` (`uid` PK, `text_en`, `text_fr`, `book_name_en`, `book_name_fr`), `CrossReference` (`source_uid`, `target_uid`, `weight`, unique pair).
- **Migrate:** from `Backend/`: `export $(grep -v '^#' ../.env | xargs) && npx prisma migrate deploy`
- **Seed:** `npm run seed` in `Backend/` (loads root `.env` via `src/loadEnv.ts`).

### Seed verification (last run)

| Table              | Rows    |
|--------------------|---------|
| `Verse`            | 31,103  |
| `CrossReference`   | 614,043 |

Verses are merged from `data-raw/bible-en` and `data-raw/bible-fr` for the **66-book** Protestant canon (USFM folder names). Cross-references are read from `data-raw/cross_references.txt` with a **line stream**, OpenBible abbreviations normalized to UIDs (`JHN.3.16`), ranges expanded, and bulk `createMany` in **transactions of 2,000** rows.

### Tailwind (Sage)

`Frontend/tailwind.config.js` defines `sage.bg`, `sage.primary`, `sage.forest`, `sage.dark` for classes such as `bg-sage-bg`, `text-sage-dark`, `bg-sage-forest`.

### HTTP API (Express)

Run from repo root: `npm run dev:api` (or `npm run dev` in `Backend/`). Loads `.env` from the repo root (`PORT`, `DATABASE_URL`, optional `FRONTEND_ORIGIN`).

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Liveness check |
| GET | `/api/verses/:book/:chapter?lang=en` | Chapter verses; `lang=en` or `fr` selects `text` / `book_name` (both `text_en` / `text_fr` always included) |
| GET | `/api/connections/:verse_uid?lang=en` | Cross-references from `source_uid` (up to 500, by weight desc); optional target `text` / `book_name` for `lang` |

`verse_uid` is a single path segment, e.g. `/api/connections/JHN.3.16`. **CORS** allows `FRONTEND_ORIGIN` (default `http://localhost:5173`).

### Frontend (Vite + React)

From repo root: **`npm run dev:web`** (or `npm run dev` in `Frontend/`). Defaults to [http://localhost:5173](http://localhost:5173) with **`/api` proxied** to `http://localhost:3000` — run **`npm run dev:api`** in another terminal.

- **i18next** — `src/locales/en.json` / `fr.json`, init in `src/i18n/config.ts`, language persisted as `scripturegraph_lang`.
- **Zustand** — `useAppStore` holds `uiLang` (kept in sync with i18n via **LanguageToggle** in the sidebar).
- **`useBibleData`** — `fetchChapter` / `fetchConnections` call the Express API with **`?lang=`** from `uiLang`.
- **Sidebar** — nav routes + language toggle + **HierarchicalSearch** (book → chapter → verse using canonical metadata + live verse list from the API).

### Next steps

- `GraphView` four-level flow, Connection Rail, Cytoscape modal, verse destination modal from search
- Mapbox atlas, compass cards, chronological data

## Core architecture

- **Language:** TypeScript (strict)
- **Locale:** Bilingual (EN/FR) via i18next
- **UI:** Sage palette (`#E8EFE8`, `#A3B18A`, `#588157`, `#344E41`)
- **Graph:** 4-level drill-down (books → chapters → reading + connection rail → chapter graph)
