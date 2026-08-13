# Requirements Coverage

Mapping of the assignment requirements to the implementation and evidence.

## 1. Node.js and Express API Setup — 60 marks

| Requirement | Implementation | Evidence |
| --- | --- | --- |
| Node.js application using Express | `src/app.ts`, `src/server.ts` | `npm run dev` boots on `PORT` |
| `GET /products` — list products from MongoDB | `productController.list` | ThunderClient + MongoDB screenshots |
| `GET /products/:id` — single product by ID | `productController.getOne` | ThunderClient + MongoDB screenshots |
| `POST /cart` — add product to cart | `cartController.addItem` | ThunderClient + MongoDB screenshots |
| `PUT /cart/:productId` — update quantity | `cartController.updateQuantity` | ThunderClient + MongoDB screenshots |
| `DELETE /cart/:productId` — remove product | `cartController.removeItem` | ThunderClient + MongoDB screenshots |

## 2. MongoDB Integration — 50 marks

| Requirement | Implementation | Evidence |
| --- | --- | --- |
| MongoDB stores product + cart data | Mongoose models in `src/models/` | MongoDB Compass screenshots |
| `products` collection with name, price, description, stock | `Product.ts` | Compass screenshot of `products` |
| `carts` collection with product IDs and quantities | `Cart.ts` (`items[{ productId, quantity }]`) | Compass screenshot of `carts` |
| CRUD operations on products & cart | `productController`, `cartController` | ThunderClient requests |
| Screenshots from MongoDB Database | Saved under `screenshots/` | `screenshots/mongodb-*.png` |

## 3. API Error Handling and Validation — 20 marks

| Requirement | Implementation |
| --- | --- |
| Error handling for all API routes | Global `errorHandler` middleware + `asyncHandler` wrapper |
| Consistent error response shape | `{ success: false, message }` on every route |
| 404 for unknown routes | Catch-all handler in `app.ts` |
| Validate product ID before adding to cart | `Product.findById` check in `POST /cart` before write |
| Validate ObjectId format | `mongoose.isValidObjectId` helper → `400` |
| Validate quantities | Must be a number ≥ 1 → else `400` |

## 4. Authentication & Authorization — 60 marks

| Requirement | Implementation | Evidence |
| --- | --- | --- |
| JWT-based authentication | `jsonwebtoken`, secret in `.env` | Token returned on login |
| `POST /register` | `authController.register` (bcryptjs hash) | ThunderClient screenshot |
| `POST /login` → JWT token | `authController.login` | ThunderClient screenshot |
| Protect cart routes | `middleware/auth.ts` applied to `/cart` routes | Request without token → `401` |

## 5. Testing with ThunderClient — 35 marks

| Requirement | Evidence |
| --- | --- |
| All routes tested | `docs/TESTING.md` step-by-step guide |
| Exported collection | `thunderclient/shoppyglobe.collection.json` |
| Route screenshots | `screenshots/thunderclient-*.png` |

---

## Mark-Scheme Summary

| Section | Marks | Status |
| --- | --- | --- |
| Express API Setup | 60 | ☐ |
| MongoDB Integration | 50 | ☐ |
| Error Handling & Validation | 20 | ☐ |
| Authentication & Authorization | 60 | ☐ |
| ThunderClient Testing | 35 | ☐ |
| **Total** | **225** | ☐ |
