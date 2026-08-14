# API Reference

> This document mirrors the OpenAPI spec in [`openapi.yaml`](openapi.yaml), which
> also powers the live Swagger UI at `http://localhost:3000/api-docs`.

Base URL: `http://localhost:3000/api`

All protected routes require an `Authorization: Bearer <token>` header.

All responses use a consistent JSON shape:

```json
{ "success": true, "data": { ... } }
```

Errors:

```json
{ "success": false, "message": "Human readable error" }
```

---

## Public Routes

### GET `/health`

Server health check.

**Response 200**

```json
{ "success": true, "message": "Server is running" }
```

---

### GET `/products`

Fetch a list of all products.

**Optional query params**

| Param | Type | Description |
| --- | --- | --- |
| `search` | string | Filter by name (case-insensitive substring) |
| `limit` | number | Max number of results (default 50) |

**Response 200**

```json
{
  "success": true,
  "count": 2,
  "data": [
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
  ]
}
```

---

### GET `/products/:id`

Fetch a single product by its MongoDB `ObjectId`.

**Response 200** — same product object as above.

**Errors**

| Status | Case |
| --- | --- |
| 400 | Invalid ObjectId format |
| 404 | Product not found |

```json
{ "success": false, "message": "Product not found" }
```

---

### POST `/auth/register`

Register a new user.

**Request body**

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123"
}
```

**Response 201**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": { "id": "...", "name": "Alice", "email": "alice@example.com" }
}
```

**Errors**

| Status | Case |
| --- | --- |
| 400 | Missing/invalid fields, weak password |
| 409 | Email already registered |

---

### POST `/auth/login`

Authenticate a user and return a JWT.

**Request body**

```json
{ "email": "alice@example.com", "password": "secret123" }
```

**Response 200**

```json
{
  "success": true,
  "message": "Login successful",
  "data": { "token": "<JWT>", "user": { "id": "...", "name": "Alice", "email": "alice@example.com" } }
}
```

**Errors**

| Status | Case |
| --- | --- |
| 400 | Missing email/password |
| 401 | Invalid credentials |

---

### GET `/auth/me`

Fetch the profile of the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response 200**

```json
{
  "success": true,
  "data": { "id": "...", "name": "Alice", "email": "alice@example.com" }
}
```

**Errors**

| Status | Case |
| --- | --- |
| 401 | No/invalid token |
| 404 | User not found |

---

## Protected Routes (require JWT)

Header: `Authorization: Bearer <token>`

### POST `/cart`

Add a product to the logged-in user's cart. If the product is already in the cart,
the quantity is incremented.

**Request body**

```json
{ "productId": "64f1c2d5e8a1b2c3d4e5f6a7", "quantity": 2 }
```

**Response 200**

```json
{
  "success": true,
  "message": "Product added to cart",
  "data": {
    "_id": "...",
    "userId": "...",
    "items": [{ "productId": "...", "quantity": 2 }]
  }
}
```

**Errors**

| Status | Case |
| --- | --- |
| 400 | Missing/invalid fields, quantity < 1, invalid productId, out of stock |
| 401 | No/invalid token |
| 404 | Product does not exist |

---

### PUT `/cart/:productId`

Update the quantity of a product in the cart.

**Request body**

```json
{ "quantity": 5 }
```

**Response 200**

```json
{
  "success": true,
  "message": "Cart updated",
  "data": { "_id": "...", "items": [{ "productId": "...", "quantity": 5 }] }
}
```

**Errors**

| Status | Case |
| --- | --- |
| 400 | Invalid quantity (must be number ≥ 1), invalid productId |
| 401 | No/invalid token |
| 404 | Item not in cart / product not found |

---

### DELETE `/cart/:productId`

Remove a product from the cart.

**Response 200**

```json
{ "success": true, "message": "Product removed from cart" }
```

**Errors**

| Status | Case |
| --- | --- |
| 400 | Invalid productId |
| 401 | No/invalid token |
| 404 | Item not in cart |

---

### GET `/cart`

Fetch the logged-in user's cart (bonus — handy for verifying the other endpoints).

**Response 200**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "...",
    "items": [{ "productId": "...", "quantity": 5 }],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors**

| Status | Case |
| --- | --- |
| 401 | No/invalid token |
| 404 | No cart exists yet |

---

## Status Codes Summary

| Code | Meaning |
| --- | --- |
| 200 | OK |
| 201 | Created (register) |
| 400 | Bad request / validation failure |
| 401 | Unauthenticated / invalid token |
| 404 | Resource not found |
| 409 | Duplicate email |
| 500 | Internal server error |
