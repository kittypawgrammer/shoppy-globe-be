# Setup Guide

## Prerequisites

- **Node.js** v18+ (recommended: latest LTS)
- **MongoDB** — either:
  - Local installation with `mongod` running on `mongodb://127.0.0.1:27017`, or
  - A free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
- **MongoDB Compass** (optional but recommended, for screenshots)
- **ThunderClient** VS Code extension (for testing)

## Installation

```bash
# 1. Clone / navigate into the project
cd shoppy_globe_be

# 2. Install dependencies
npm install

# 3. Create your environment file from the template
cp .env.example .env
```

## Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Port the server listens on | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/shoppy_globe` |
| `JWT_SECRET` | Secret used to sign JWTs | *(required, set your own)* |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |

Example `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/shoppy_globe
JWT_SECRET=change_me_to_a_long_random_string
JWT_EXPIRES_IN=7d
```

> ⚠️ Never commit `.env`. It is ignored by `.gitignore`. Commit `.env.example` instead.

## Running the App

```bash
# Development (with auto-reload)
npm run dev

# Build TypeScript to dist/
npm run build

# Production
npm start
```

## Seeding Sample Products

Once MongoDB is reachable, populate the products collection:

```bash
npm run seed
```

The seed script is **idempotent** — running it again will not duplicate data.
It inserts ~10 realistic products and prints the inserted count.

## Verify the Server is Up

```bash
curl http://localhost:3000/api/health
# → { "success": true, "message": "Server is running" }
```

## Common Issues

| Issue | Fix |
| --- | --- |
| `MongooseServerSelectionError` | Check MongoDB is running / URI is correct |
| `Missing required argument` (register) | Ensure you send all required body fields |
| `401` on cart routes | Include `Authorization: Bearer <token>` header |
| Port already in use | Change `PORT` in `.env` or kill the process |
