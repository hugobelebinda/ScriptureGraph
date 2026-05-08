# ViaScripture Security & Hardening Audit

Date: 2026-05-08  
Scope: repository-level audit for secret management, rate limiting, RLS posture, CORS/network hardening, and input validation.

## Summary

- Secret Management: **PASS** (gitignored env files + `.env.example` placeholders + compose now reads env vars)
- Rate Limiting: **PASS** (tiered limiter active; burst requests produce `429`)
- Supabase/RLS: **N/A** (no Supabase usage detected in this codebase)
- CORS & Network Security: **PASS** (origin scoped + methods restricted to `GET,HEAD`)
- Input Validation & Sanitization: **PASS** (Zod schemas with inferred TS types + malformed input rejected)

---

## 1) Secret Management Audit

### Findings

- `.env` remains local-only and is excluded from version control.
- `docker-compose.yml` no longer hardcodes credentials; it now uses environment variables:
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DB`
  - `DATABASE_URL`
  - `PORT`
  - `NODE_ENV`
  - `FRONTEND_ORIGIN`
- `.gitignore` now includes:
  - `.env`
  - `.env.local`
  - `.env.production`
- `.env.development`
- `.env.example` has been added with placeholder values only.

### Recommendation

- Keep `.env` local only (never commit).
- For production, inject compose variables via CI/secret manager instead of local `.env`.

### Proof Script

```bash
npm run security:secrets
```

---

## 2) Rate Limiting Implementation

### Findings

- `express-rate-limit` is enabled:
  - global limiter for baseline abuse protection
  - stricter limiter on heavy graph routes:
    - `/api/connections/:verse_uid`
    - `/api/cross-references/:verseId`
- Burst test now shows `429` under load (expected behavior).

### Recommendation

- Add dedicated auth limiter when auth routes are introduced.
- Consider proxy-level rate limits (Nginx/Cloudflare) as a second layer.

### Proof Script

```bash
npm run security:ratelimit
```

---

## 3) Authentication & Supabase RLS

### Findings

- No Supabase integration detected.
- No Supabase RLS policy artifacts present (expected, because project uses Prisma + PostgreSQL directly).

### Recommendation

- If migrating to Supabase or exposing public Data API, enforce RLS on all `public` tables and add per-user policies.

### Proof Script

```bash
npm run security:rls
```

---

## 4) CORS & Network Security

### Findings

- Origin is restricted to configured `FRONTEND_ORIGIN` (good).
- CORS methods are now restricted to `GET,HEAD`, matching current API needs.

### Recommendation

- Keep method allowlist aligned with real routes when new endpoints are added.
- Keep explicit domain allowlist for staging/production.

### Proof Script

```bash
npm run security:cors
```

---

## 5) Input Validation & Sanitization

### Findings

- Invalid/malicious route inputs are rejected (either `400` by validation or `429` when abuse limits trigger) for tested endpoints:
  - `/api/verses/:book/:chapter`
  - `/api/connections/:verse_uid`
  - `/api/cross-references/:verseId`
- Zod schemas are implemented in `Backend/src/schemas/`.
- TypeScript types are inferred directly from schemas via `z.infer<typeof schema>`.

### Recommendation

- Extend schema-based validation to all future write endpoints (`POST/PUT/PATCH`) and body payloads.

### Proof Script

```bash
npm run security:validation
```

---

## Run Full Audit

```bash
npm run security:audit
```
