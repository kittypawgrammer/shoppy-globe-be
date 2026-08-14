# ShoppyGlobe Backend

A production-style REST API for the ShoppyGlobe e-commerce app, built with
**Node.js, Express 5, TypeScript, and MongoDB (Mongoose 9)**. It exposes a product
catalog, JWT-based authentication, and a per-user protected cart.

## Features

- Product catalog — list, search, and fetch single products
- Authentication — register, login (JWT), and current-user profile
- Protected cart — add, update quantity, view, and remove items per user
- Consistent response shape — `{ success, data }` / `{ success: false, message }`
- Centralized error handling + input validation (400 / 401 / 404 / 409)
- Idempotent product seeding

## Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js (ESM) |
| Framework | Express 5 |
| Language | TypeScript 7 (`tsc`, `moduleResolution: NodeNext`) |
| Database | MongoDB via Mongoose 9 |
| Auth | `jsonwebtoken` + `bcryptjs` |

## Getting Started

### Prerequisites

- **Node.js** v18+ (recommended: latest LTS)
- **MongoDB** — local install or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **MongoDB Compass** (optional, for inspecting data)
- **ThunderClient** VS Code extension (for API testing)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/kittypawgrammer/shoppy-globe-be.git
cd shoppy_globe_be

# 2. Install dependencies
npm install

# 3. Create your environment file from the template
cp .env.example .env
```

### Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Port the server listens on | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/shoppy_globe` |
| `JWT_SECRET` | Secret used to sign JWTs | *(required, set your own)* |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |

> ⚠️ Never commit `.env`. It is gitignored; commit `.env.example` instead.

### Run + Seed

```bash
# Start the dev server (auto-reload)
npm run dev

# In another terminal, populate the products collection (idempotent)
npm run seed

# Verify
curl http://localhost:3000/api/health
# → { "success": true, "message": "Server is running" }
```

## API Reference

Base URL: `http://localhost:3000/api`

All protected routes require an `Authorization: Bearer <token>` header.

### Response Format

```json
{ "success": true, "data": { ... } }
```

```json
{ "success": false, "message": "Human readable error" }
```

### Public Routes

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/health` | Health check |
| `GET` | `/products` | List products (`?search=&limit=`, default limit 50) |
| `GET` | `/products/:id` | Fetch a product by ObjectId (400 invalid id / 404 not found) |

### Auth Routes

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Register — body `{ name, email, password }` (201, 400, 409) |
| `POST` | `/auth/login` | Login — body `{ email, password }` → returns JWT (200, 400, 401) |
| `GET` | `/auth/me` | Current user profile — Bearer token (200, 401, 404) |

### Cart Routes (protected)

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/cart` | Add product — body `{ productId, quantity }` (200, 400, 401, 404) |
| `PUT` | `/cart/:productId` | Update quantity — body `{ quantity }` (200, 400, 401, 404) |
| `DELETE` | `/cart/:productId` | Remove product from cart (200, 400, 401, 404) |
| `GET` | `/cart` | Fetch the current user's cart (200, 401, 404) |

### Status Codes

| Code | Meaning |
| --- | --- |
| `200` | OK |
| `201` | Created (register) |
| `400` | Bad request / validation failure |
| `401` | Unauthenticated / invalid token |
| `404` | Resource not found |
| `409` | Duplicate email |
| `500` | Internal server error |

Detailed request/response examples: [`docs/API.md`](docs/API.md).

## Testing with ThunderClient

A ready-to-import collection is committed at
[`thunderclient/shoppyglobe.collection.json`](thunderclient/shoppyglobe.collection.json).
It covers **all endpoints** (happy + error paths) with response-code assertions.

1. Install the **Thunder Client** extension in VS Code.
2. Start the server: `npm run dev` and seed: `npm run seed`.
3. In Thunder Client → Collections → **Menu** → **Import** → select the collection file.
4. Open the **Env** tab — the `Local` environment is included:

   | Variable | Value |
   | --- | --- |
   | `BASE_URL` | `http://localhost:3000/api` |
   | `TOKEN` | *(auto-filled after running **Login**)* |

5. Run the requests in order (register → login → cart). The **Login** request
   automatically stores the returned JWT into `TOKEN`.
6. Optional: right-click the collection → **Run All** for a pass/fail run.

Step-by-step manual guide: [`docs/TESTING.md`](docs/TESTING.md).

## Screenshots (evidence)

Per the assignment, ThunderClient + MongoDB Compass screenshots are submitted as
evidence. The capture checklist and required file names live in
[`screenshots/README.md`](screenshots/README.md).

## Project Structure

```text
src/
├── server.ts            # Bootstrap (connect DB, listen)
├── app.ts               # Express app, middleware, routes, error handler
├── config/db.ts         # MongoDB connection
├── models/              # Mongoose models (Product, User, Cart)
├── controllers/         # Route handlers
├── routes/              # Express routers
├── middleware/          # auth, errorHandler, asyncHandler
├── utils/               # AppError, validation helpers
└── seed.ts              # Idempotent product seeding
docs/                    # API, setup, schema, testing, requirements
thunderclient/           # Exported ThunderClient collection
screenshots/             # Evidence screenshots + checklist
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server with auto-reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled output |
| `npm run seed` | Seed sample products (idempotent) |

## License

UNLICENSED — assignment project.
