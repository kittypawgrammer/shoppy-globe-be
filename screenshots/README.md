# Screenshots

This folder stores the evidence screenshots required for submission. Capture them
manually, then drop the files here with the exact names below so the README links work.

## How to capture

1. Make sure MongoDB is running and the server is up: `npm run dev`.
2. Seed data if needed: `npm run seed`.
3. Follow `docs/TESTING.md` to run each request in ThunderClient.
4. Take a full-window screenshot of ThunderClient (request + response visible) for
   each route, and of MongoDB Compass for each collection.

## Required files

### MongoDB Compass

| File | Shows |
| --- | --- |
| `mongodb-connection.png` | Connection tree with the `shoppy_globe` database |
| `mongodb-products.png` | `products` collection with seeded documents |
| `mongodb-users.png` | `users` collection after registering a test user |
| `mongodb-carts.png` | `carts` collection after adding an item to the cart |

### ThunderClient

| File | Route |
| --- | --- |
| `thunderclient-health.png` | `GET /api/health` |
| `thunderclient-products.png` | `GET /api/products` |
| `thunderclient-product-by-id.png` | `GET /api/products/:id` |
| `thunderclient-product-404.png` | `GET /api/products/:id` (invalid/not found → 404) |
| `thunderclient-register.png` | `POST /api/auth/register` |
| `thunderclient-login.png` | `POST /api/auth/login` (token in response) |
| `thunderclient-auth-me.png` | `GET /api/auth/me` (with token) |
| `thunderclient-auth-me-401.png` | `GET /api/auth/me` (without token → 401) |
| `thunderclient-cart-add.png` | `POST /api/cart` (with token) |
| `thunderclient-cart-add-401.png` | `POST /api/cart` (without token → 401) |
| `thunderclient-cart-update.png` | `PUT /api/cart/:productId` |
| `thunderclient-cart-delete.png` | `DELETE /api/cart/:productId` |

## Checklist

- [ ] All 4 MongoDB Compass screenshots captured
- [ ] All 12 ThunderClient screenshots captured
- [ ] Files saved in this folder with the names above
- [ ] README links resolve to the actual files
