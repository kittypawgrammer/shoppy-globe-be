# AGENTS.md

Backend for the ShoppyGlobe e-commerce app: TypeScript + Express 5 + Mongoose 9, run as ESM.

## Commands

- `npm run dev` — dev server with auto-reload (`tsx watch src/server.ts`)
- `npm run build` — `tsc`; the **only** verification step (no lint or test tooling exists)
- `npm start` — run built output in `dist/`
- `npm run seed` — idempotent product seeding; requires MongoDB to be running

## Setup

- `cp .env.example .env` (`.env` is gitignored; never commit it). Server **exits** if MongoDB is unreachable (`src/config/db.ts`).
- `JWT_SECRET` must be set — without it the auth middleware responds with a 500 instead of authenticating (`src/middleware/auth.ts`).
- No `engines` field; dev uses Node 25.

## ESM / TypeScript quirks

- `"type": "module"` + `moduleResolution: NodeNext` — **all relative imports must use the `.js` extension** (`import app from "./app.js"`), even though the source file is `.ts`. Missing extensions will not compile.
- Models derive types via `InferSchemaType` (`src/models/*.ts`); custom schema statics/methods are declared as interfaces and the model is cast (see `src/models/Cart.ts`).

## Architecture

Layered: `src/server.ts` (bootstrap) → `src/app.ts` (Express app) → `routes` → `controllers` → `models`; shared middleware in `middleware/`, helpers in `utils/`.

| Layer | Files | Purpose |
| --- | --- | --- |
| Bootstrap | `src/server.ts` | Loads env, connects MongoDB, starts listening on `PORT` |
| App | `src/app.ts` | CORS + JSON body, mounts routers, 404 catch-all, global error handler |
| Routes | `src/routes/` | Thin Express routers; the cart router is guarded by `authenticate` |
| Controllers | `src/controllers/` | Validate input, read/write models, respond; wrapped in `asyncHandler` |
| Models | `src/models/` | Mongoose schemas for `Product`, `User`, `Cart`; cart writes are schema methods |
| Middleware | `src/middleware/` | `authenticate` (JWT), `errorHandler` (global error → JSON) |
| Utils | `src/utils/` | `AppError`, `asyncHandler`, validation helpers |
| API docs | `src/swagger.ts` | Serves `docs/openapi.yaml` via Swagger UI at `/api-docs` |

### Current state

All phases are implemented and manually verified (`docs/TEST_REPORT.md`):

- **Products** — `GET /api/products` (search + limit), `GET /api/products/:id`.
- **Auth** — `POST /api/auth/register`, `POST /api/auth/login` (returns JWT), `GET /api/auth/me` (protected); passwords are bcrypt-hashed.
- **Cart** (JWT-protected) — `POST /api/cart`, `PUT /api/cart/:productId`, `DELETE /api/cart/:productId`, `GET /api/cart`.
- **Docs** — Swagger UI at `http://localhost:3000/api-docs`; static reference in `docs/API.md`.
- Response convention (used everywhere): `{ success: true, data }` on success, `{ success: false, message }` on errors.

## Workflow conventions

- Feature work goes on `feat/phase-N-*` branches merged to `main` via PRs (see git history).
- No automated tests. API verification is manual via ThunderClient (`docs/TESTING.md`); exported collection and screenshots are assignment deliverables per `docs/REQUIREMENTS.md`.
