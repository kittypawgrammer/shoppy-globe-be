# AGENTS.md

Backend for the ShoppyGlobe e-commerce app: TypeScript + Express 5 + Mongoose 9, run as ESM.

## Commands

- `npm run dev` — dev server with auto-reload (`tsx watch src/server.ts`)
- `npm run build` — `tsc`; the **only** verification step (no lint or test tooling exists)
- `npm start` — run built output in `dist/`
- `npm run seed` — idempotent product seeding; requires MongoDB to be running

## Setup

- `cp .env.example .env` (`.env` is gitignored; never commit it). Server **exits** if MongoDB is unreachable (`src/config/db.ts`).
- No `engines` field; dev uses Node 25.

## ESM / TypeScript quirks

- `"type": "module"` + `moduleResolution: NodeNext` — **all relative imports must use the `.js` extension** (`import app from "./app.js"`), even though the source file is `.ts`. Missing extensions will not compile.
- Models derive types via `InferSchemaType` (`src/models/*.ts`).

## Architecture & current state

- Layered: `src/server.ts` (bootstrap) → `src/app.ts` (Express app) → `routes` → `controllers` → `models`; shared middleware in `middleware/`.
- **Work-in-progress.** Only Phase 0 (scaffold) and Phase 1 (models + seed) are done. `src/controllers`, `src/middleware`, `src/routes`, `src/utils` are **empty**; `app.ts` only exposes `GET /api/health`. `docs/API.md` and `docs/REQUIREMENTS.md` describe the *planned* endpoints (products, auth, JWT-protected cart) — do not assume they exist.
- Response convention (from docs, use it everywhere): `{ success: true, data }` for success, `{ success: false, message }` for errors.

## Workflow conventions

- Feature work goes on `feat/phase-N-*` branches merged to `main` via PRs (see git history).
- No automated tests. API verification is manual via ThunderClient (`docs/TESTING.md`); exported collection and screenshots are assignment deliverables per `docs/REQUIREMENTS.md`.
