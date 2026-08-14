# Local Test Report

Date: 2026-08-14 · Verified manually against a running server with curl.

Environment: MongoDB running locally, products seeded (10), server via `npm start`.

Verification of every endpoint in `docs/API.md` plus error-path cases. All 29 checks
passed.

---

## Build & Startup

| Check | Result |
| --- | --- |
| `npm run build` (`tsc`) | Exit 0, compiles clean |
| `npm start` | `MongoDB connected: shoppy_globe`, `Server running on http://localhost:3000` |
| `npm run seed` | Idempotent — skipped, 10 products already present |

---

## Products (public)

| # | Request | Expected | Actual |
| --- | --- | --- | --- |
| 1 | `GET /api/health` | `200` | ✓ `{"success":true,"message":"Server is running"}` |
| 2 | `GET /api/products?limit=3` | `200`, data array | ✓ 3 products returned with `count` |
| 3 | `GET /api/products?search=head` | `200`, filtered | ✓ Only "Wireless Headphones" returned |
| 4 | `GET /api/products/123` | `400` | ✓ `"Invalid product id format"` |
| 5 | `GET /api/products/64f1c2d5e8a1b2c3d4e5f6a7` | `404` | ✓ `"Product not found"` |

---

## Auth (public)

| # | Request | Expected | Actual |
| --- | --- | --- | --- |
| 6 | `POST /api/auth/register` (unique email) | `201` | ✓ `"User registered successfully"` |
| 7 | `POST /api/auth/register` (duplicate email) | `409` | ✓ `"Email already registered"` |
| 8 | `POST /api/auth/register` (weak password `"abc"`) | `400` | ✓ `"Password must be at least 6 characters"` |
| 9 | `POST /api/auth/register` (missing name) | `400` | ✓ `"Name is required"` |
| 10 | `POST /api/auth/login` (valid creds) | `200` + JWT | ✓ `data.token` + user object |
| 11 | `POST /api/auth/login` (wrong password) | `401` | ✓ `"Invalid email or password"` |
| 12 | `POST /api/auth/login` (missing password) | `400` | ✓ `"Password is required"` |
| 13 | `GET /api/auth/me` (Bearer token) | `200` | ✓ `{id, name, email}` |
| 14 | `GET /api/auth/me` (no header) | `401` | ✓ `"No token provided"` |
| 15 | `GET /api/auth/me` (garbage token) | `401` | ✓ `"Invalid or expired token"` |

---

## Cart (protected)

| # | Request | Expected | Actual |
| --- | --- | --- | --- |
| 16 | `POST /api/cart` (no token) | `401` | ✓ `"No token provided"` |
| 17 | `POST /api/cart` `{productId, quantity: 2}` | `200` | ✓ `"Product added to cart"` |
| 18 | `POST /api/cart` (same product, qty 3) | `200`, increments | ✓ quantity 2 → 5 |
| 19 | `POST /api/cart` (quantity 0) | `400` | ✓ `"Quantity must be an integer greater than or equal to 1"` |
| 20 | `POST /api/cart` (nonexistent product) | `404` | ✓ `"Product not found"` |
| 21 | `POST /api/cart` (invalid productId) | `400` | ✓ `"Invalid product id format"` |
| 22 | `PUT /api/cart/:id` `{quantity: 5}` | `200` | ✓ `"Cart updated"` |
| 23 | `PUT /api/cart/:id` (quantity 0) | `400` | ✓ validation message |
| 24 | `PUT /api/cart/:id` (item not in cart) | `404` | ✓ `"Item not in cart"` |
| 25 | `GET /api/cart` (Bearer token) | `200` | ✓ cart with items |
| 26 | `GET /api/cart` (no token) | `401` | ✓ `"No token provided"` |
| 27 | `DELETE /api/cart/:id` | `200` | ✓ `"Product removed from cart"` |
| 28 | `DELETE /api/cart/:id` (already removed) | `404` | ✓ `"Item not in cart"` |
| 29 | `GET /api/nonexistent-route` | `404` | ✓ `"Route not found"` |

---

## Notes

- All responses match the `{ success: true, data }` / `{ success: false, message }`
  convention from `docs/API.md`.
- One throwaway test user (`alice.test<timestamp>@example.com`) was created during
  register testing and left in the `shoppy_globe` DB (`mongosh` unavailable to clean up).
