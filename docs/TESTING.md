# Testing with ThunderClient

ThunderClient is a VS Code extension for API testing. Follow the steps below to test
every route of the ShoppyGlobe backend.

## Setup

1. Install the **Thunder Client** extension in VS Code.
2. Make sure the server is running: `npm run dev`.
3. Open the Thunder Client tab (lightning bolt icon in the activity bar).

## Step 1 — Create a Collection

1. Click **Collections**.
2. Click the **+** (new collection) → name it `ShoppyGlobe`.
3. Add requests to it as you test each route below.

## Step 2 — Environment Variables

1. Go to the **Env** tab.
2. Create environment `Local` with variables:

| Variable | Value |
| --- | --- |
| `BASE_URL` | `http://localhost:3000/api` |
| `TOKEN` | *(filled after login)* |

Use `{{BASE_URL}}` and `{{TOKEN}}` inside request URLs/headers.

---

## Test Sequence

> ⚠️ Order matters: register → login → add to cart → update → delete.

### 1. Health Check

| Field | Value |
| --- | --- |
| Method | `GET` |
| URL | `{{BASE_URL}}/health` |

**Expected:** `200`, `{ "success": true, "message": "Server is running" }`

### 2. Fetch Products

| Field | Value |
| --- | --- |
| Method | `GET` |
| URL | `{{BASE_URL}}/products` |

**Expected:** `200` with a `data` array of seeded products.

### 3. Fetch Single Product

| Field | Value |
| --- | --- |
| Method | `GET` |
| URL | `{{BASE_URL}}/products/64f1c2d5e8a1b2c3d4e5f6a7` |

**Expected:** `200` with the product object. *(Use a real seeded ID.)*

**Error test:** use an invalid ID like `123` → `400`; use a valid but nonexistent
ObjectId → `404`.

### 4. Register a User

| Field | Value |
| --- | --- |
| Method | `POST` |
| URL | `{{BASE_URL}}/auth/register` |
| Body | JSON → `{ "name": "Alice", "email": "alice@example.com", "password": "secret123" }` |

**Expected:** `201`, message `User registered successfully`.

**Error test:** register the same email again → `409`.

### 5. Login

| Field | Value |
| --- | --- |
| Method | `POST` |
| URL | `{{BASE_URL}}/auth/login` |
| Body | JSON → `{ "email": "alice@example.com", "password": "secret123" }` |

**Expected:** `200`, response contains `data.token`.

1. Copy the token.
2. Set the `TOKEN` environment variable to that value.

**Error test:** wrong password → `401`.

### 6. Fetch Current User (protected)

| Field | Value |
| --- | --- |
| Method | `GET` |
| URL | `{{BASE_URL}}/auth/me` |
| Headers | `Authorization: Bearer {{TOKEN}}` |

**Expected:** `200` with `{ "success": true, "data": { "id", "name", "email" } }`.

**Error test:** remove the Authorization header → `401`.

### 7. Add to Cart (protected)

| Field | Value |
| --- | --- |
| Method | `POST` |
| URL | `{{BASE_URL}}/cart` |
| Headers | `Authorization: Bearer {{TOKEN}}` |
| Body | JSON → `{ "productId": "<real product id>", "quantity": 2 }` |

**Expected:** `200`, message `Product added to cart`.

**Error test:** remove the Authorization header → `401`.

### 8. Update Quantity (protected)

| Field | Value |
| --- | --- |
| Method | `PUT` |
| URL | `{{BASE_URL}}/cart/<real product id>` |
| Headers | `Authorization: Bearer {{TOKEN}}` |
| Body | JSON → `{ "quantity": 5 }` |

**Expected:** `200`, message `Cart updated`.

**Error test:** quantity `0` → `400`.

### 9. View Cart (protected)

| Field | Value |
| --- | --- |
| Method | `GET` |
| URL | `{{BASE_URL}}/cart` |
| Headers | `Authorization: Bearer {{TOKEN}}` |

**Expected:** `200` with the cart items.

### 10. Delete from Cart (protected)

| Field | Value |
| --- | --- |
| Method | `DELETE` |
| URL | `{{BASE_URL}}/cart/<real product id>` |
| Headers | `Authorization: Bearer {{TOKEN}}` |

**Expected:** `200`, message `Product removed from cart`.

---

## Saving Evidence

1. After testing, open the **Collections** tab.
2. Right-click `ShoppyGlobe` → **Export** → save the JSON into
   `thunderclient/shoppyglobe.collection.json`.
3. Take a screenshot of ThunderClient for **each** route (request + response visible).
4. Save the screenshots in the `screenshots/` folder and reference them in the README.

### Required screenshots checklist

- [ ] GET `/health`
- [ ] GET `/products`
- [ ] GET `/products/:id` (happy path + 404)
- [ ] POST `/auth/register`
- [ ] POST `/auth/login`
- [ ] GET `/auth/me` (with and without token → 401)
- [ ] POST `/cart` (with and without token → 401)
- [ ] PUT `/cart/:productId`
- [ ] DELETE `/cart/:productId`
- [ ] Exported collection JSON committed to `thunderclient/`
