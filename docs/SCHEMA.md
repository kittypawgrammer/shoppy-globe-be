# MongoDB Schema

Database name (default): `shoppy_globe`

Three collections:

- [`products`](#products)
- [`users`](#users)
- [`carts`](#carts)

---

## products

Stores the catalog items shown via `GET /products`.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | ✅ | Product title |
| `price` | number | ✅ | Price in INR (e.g. `2499`) |
| `description` | string | ✅ | Short product description |
| `stock` | number | ✅ | Units available; must be ≥ 0 |
| `category` | string | ❌ | Optional grouping, e.g. `Electronics` |
| `createdAt` | Date | auto | Set by Mongoose timestamps |
| `updatedAt` | Date | auto | Set by Mongoose timestamps |

**Example document**

```json
{
  "_id": "64f1c2d5e8a1b2c3d4e5f6a7",
  "name": "Wireless Headphones",
  "price": 2499,
  "description": "Over-ear Bluetooth headphones with ANC.",
  "stock": 15,
  "category": "Electronics",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

**Indexes:** none required (queries are by `_id` and `name` substring).

---

## users

Stores registered accounts.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | ✅ | Display name |
| `email` | string | ✅ | Unique; normalized to lowercase |
| `password` | string | ✅ | Hashed with `bcryptjs` (never stored plain) |
| `createdAt` | Date | auto | Set by Mongoose timestamps |

**Example document**

```json
{
  "_id": "64f1c2d5e8a1b2c3d4e5f6a8",
  "name": "Alice",
  "email": "alice@example.com",
  "password": "$2a$10$eQdPzq5...hashed...",
  "createdAt": "2024-01-01T10:00:00.000Z"
}
```

**Unique index:** `email` (unique: true).

---

## carts

One document per user, storing a list of cart items.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `userId` | ObjectId | ✅ | References `users._id`; unique per user |
| `items` | array | ✅ | Array of `{ productId, quantity }` |
| `createdAt` | Date | auto | Set by Mongoose timestamps |
| `updatedAt` | Date | auto | Set by Mongoose timestamps |

Each item:

| Field | Type | Notes |
| --- | --- | --- |
| `productId` | ObjectId | References `products._id` |
| `quantity` | number | ≥ 1 |

**Example document**

```json
{
  "_id": "64f1c2d5e8a1b2c3d4e5f6a9",
  "userId": "64f1c2d5e8a1b2c3d4e5f6a8",
  "items": [
    { "productId": "64f1c2d5e8a1b2c3d4e5f6a7", "quantity": 2 },
    { "productId": "64f1c2d5e8a1b2c3d4e5f6a1", "quantity": 1 }
  ],
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

**Unique index:** `userId` (unique: true) — one cart per user.

---

## Relationships

```text
users 1 ──── 1 carts      (each user has at most one cart)
products 1 ──── * cart items   (a product can appear in many carts)
```

No foreign keys are used; references are stored as `ObjectId`s.

---

## Seeding

`npm run seed` inserts ~10 documents into `products`. The script:

1. Drops nothing (safe) — checks if products already exist
2. Inserts only when the collection is empty (idempotent)
3. Logs the number of products inserted

## Screenshots for Submission

Take MongoDB Compass screenshots showing:

1. The connection tree with the `shoppy_globe` database
2. The `products` collection with seeded documents
3. The `users` collection after registering a test user
4. The `carts` collection after adding an item to the cart

Save them under `screenshots/` and reference them in the README.
