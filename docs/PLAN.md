# ShoppyGlobe Backend — Development Plan

> Internshala Backend Project · Node.js + Express + MongoDB · **Total: 225 marks**

## Objective

Build the backend for the **ShoppyGlobe** e-commerce application using Node.js, Express,
and MongoDB, with JWT-based authentication, a protected cart, and full documentation for
testing and submission.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js |
| Framework | Express |
| Language | TypeScript |
| Database | MongoDB (via Mongoose ODM) |
| Auth | JWT (`jsonwebtoken`) |
| Password hashing | `bcryptjs` |
| Env / CORS | `dotenv`, `cors` |
| Dev runner | `tsx` |
| Testing | ThunderClient |
| DB inspection | MongoDB Compass |

---

## Milestones & Phases

### Phase 0 — Project Scaffolding

**Goal:** A bare-bones TypeScript Express app that boots.

- Initialize `package.json`, `tsconfig.json`, and the folder structure
- Install deps: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `dotenv`, `cors`
- Install dev deps: `typescript`, `tsx`, `@types/*`
- Add `.env`, `.env.example`, `.gitignore`, and npm scripts (`dev` / `build` / `start`)
- Create `app.ts` + `server.ts` with a health-check route

**Deliverable:** App runs on `http://localhost:3000`.

---

### Phase 1 — MongoDB Integration & Models *(50 marks)*

**Goal:** Connect to MongoDB, define schemas, and seed sample data.

- `config/db.ts` — Mongoose connection with graceful error handling
- **Product** schema: `name`, `price`, `description`, `stock`, `category`
- **User** schema: `name`, `email`, `password` (hashed), `createdAt`
- **Cart** schema: `userId`, `items[{ productId, quantity }]`
- `seed.ts` — inserts ~10 realistic products (idempotent)
- Implement CRUD-ready model methods for products and cart

**Deliverable:** MongoDB Compass screenshots of `products`, `users`, `carts` collections.

---

### Phase 2 — Products API *(60 marks)*

**Goal:** Public read-only product endpoints with validation.

- `GET /products` — list all products (optional `?search=` and `?limit=`)
- `GET /products/:id` — single product by ID
- Validate MongoDB `ObjectId` format → 400 on bad ID
- Return 404 with a clear message when the product is missing

**Deliverable:** Both endpoints return proper JSON + error responses.

---

### Phase 3 — Authentication & Authorization *(60 marks)*

**Goal:** Register/login with JWT, plus middleware that guards protected routes.

- `POST /register` — validate fields, check duplicate email, hash password with `bcryptjs`, create user
- `POST /login` — verify credentials, sign a JWT (`7d` expiry), return it
- `middleware/auth.ts` — parse `Authorization: Bearer <token>`, verify, attach `req.userId`
- Return meaningful 400 / 401 errors (missing fields, invalid credentials, invalid/expired token)

**Deliverable:** Token works and unauthorized requests get 401.

---

### Phase 4 — Protected Cart API *(60 marks)*

**Goal:** Per-user cart endpoints, all locked behind the JWT middleware.

- `POST /cart` — body `{ productId, quantity }`; verify product exists & has stock, upsert into cart
- `PUT /cart/:productId` — update quantity (validate it's a number ≥ 1)
- `DELETE /cart/:productId` — remove item from cart
- `GET /cart` — fetch the user's cart (bonus, useful for testing)
- Reject adding a non-existent product before touching the cart (validation requirement)

**Deliverable:** Every cart route returns 401 without a valid token.

---

### Phase 5 — Error Handling & Validation Polish *(20 marks)*

**Goal:** Central, consistent error responses across all routes.

- Custom `AppError` class + global `errorHandler` middleware
- 404 catch-all handler for unknown routes
- `asyncHandler` wrapper so thrown errors reach the global handler
- Input validation helpers for IDs, quantities, emails, and required fields
- Mongoose duplicate-key & cast errors mapped to readable 400s

**Deliverable:** Every request returns a consistent `{ success, message }` shape.

---

### Phase 6 — Testing & Deliverables *(35 marks)*

**Goal:** Prove every route works and package the evidence.

- ThunderClient collection covering all 8 endpoints (happy + error paths)
- Save environment variables (`BASE_URL`, `TOKEN`) in ThunderClient
- Export the collection JSON and add it to the repo
- Capture screenshots: MongoDB Compass + ThunderClient for each route
- Write `README.md` — setup steps, API reference, screenshots

**Deliverable:** Complete, reproducible, submission-ready repo.

---

## Proposed Project Structure

```text
shoppy_globe_be/
├── src/
│   ├── server.ts                  # entry point
│   ├── app.ts                     # express app, middleware, routes
│   ├── config/
│   │   └── db.ts                  # mongoose connection
│   ├── models/
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   └── Cart.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── productController.ts
│   │   └── cartController.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── productRoutes.ts
│   │   └── cartRoutes.ts
│   ├── middleware/
│   │   ├── auth.ts                # JWT verification
│   │   └── errorHandler.ts
│   ├── utils/
│   │   ├── AppError.ts
│   │   └── asyncHandler.ts
│   └── seed.ts                    # product seed script
├── docs/                          # this documentation
├── thunderclient/                 # exported collection JSON
├── screenshots/                   # Compass + ThunderClient evidence
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## API Surface

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/products` | Public | List all products |
| GET | `/api/products/:id` | Public | Fetch single product |
| POST | `/api/auth/register` | Public | Register a user |
| POST | `/api/auth/login` | Public | Login → JWT token |
| POST | `/api/cart` | 🔒 JWT | Add product to cart |
| PUT | `/api/cart/:productId` | 🔒 JWT | Update quantity |
| DELETE | `/api/cart/:productId` | 🔒 JWT | Remove from cart |
| GET | `/api/cart` | 🔒 JWT | View cart (bonus) |

---

## Related Documents

| File | Contents |
| --- | --- |
| [`SETUP.md`](./SETUP.md) | Prerequisites, installation, environment variables, running |
| [`API.md`](./API.md) | Endpoint reference with request/response examples |
| [`SCHEMA.md`](./SCHEMA.md) | MongoDB collection structures |
| [`TESTING.md`](./TESTING.md) | Step-by-step ThunderClient testing guide |
| [`REQUIREMENTS.md`](./REQUIREMENTS.md) | Requirements → marking-scheme coverage mapping |

---

## Submission Checklist

- [ ] All 8 routes implemented and working
- [ ] Cart routes reject unauthenticated users
- [ ] Invalid product ID rejected before cart write
- [ ] Centralized error handling on every route
- [ ] MongoDB Compass screenshots of all 3 collections
- [ ] ThunderClient collection exported & committed
- [ ] ThunderClient screenshots for every endpoint
- [ ] Sample JWT token generated & verified
- [ ] Seed data present (products visible in DB)
- [ ] README with setup + testing instructions
