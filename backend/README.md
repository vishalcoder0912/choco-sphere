# ChocoSphere Backend

Production-ready Express + Prisma backend for the `frontend/` React + Vite storefront.

## Folder Structure

```text
backend/
  src/
    config/
      env.js
    controllers/
      auth.controller.js
      category.controller.js
      order.controller.js
      product.controller.js
    middleware/
      auth.middleware.js
      error.middleware.js
    models/
      prismaClient.js
    routes/
      auth.routes.js
      category.routes.js
      index.js
      order.routes.js
      product.routes.js
    services/
      auth.service.js
      category.service.js
      order.service.js
      product.service.js
    utils/
      apiError.js
      asyncHandler.js
      jwt.js
      parseNumericId.js
    app.js
    server.js
  prisma/
    schema.prisma
    seed.js
  .env
  .env.example
  package.json
```

## API Summary

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` admin only
- `PUT /api/products/:id` admin only
- `DELETE /api/products/:id` admin only

### Categories

- `GET /api/categories`
- `POST /api/categories` admin only

### Orders

- `POST /api/orders` authenticated user only
- `GET /api/orders/:userId` authenticated owner or admin

## Example Request Bodies

### Register

```json
{
  "name": "Vishal",
  "email": "vishal@example.com",
  "password": "secret123"
}
```

### Login

```json
{
  "email": "admin@chocosphere.com",
  "password": "Admin@123"
}
```

### Create Product

```json
{
  "name": "Hazelnut Crunch Box",
  "description": "Crunchy hazelnut pralines in a premium gift box",
  "price": 3199,
  "image": "https://example.com/products/hazelnut-crunch.jpg",
  "categoryId": 1
}
```

### Create Order

```json
{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ]
}
```

## Frontend Integration

Set the frontend base URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### `fetch` example

```ts
const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

const response = await fetch(`${baseUrl}/products`);
const payload = await response.json();
const products = payload.data;
```

### Authenticated `fetch` example

```ts
const token = localStorage.getItem("token");

const response = await fetch(`${baseUrl}/orders`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    items: [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 }
    ]
  })
});
```

### `axios` example

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api"
});

const { data } = await api.post("/auth/login", {
  email: "customer@chocosphere.com",
  password: "User@1234"
});

localStorage.setItem("token", data.data.token);
```

## Setup

1. `cd backend`
2. `npm install`
3. Create PostgreSQL database `choco_sphere`
4. Update `.env`
5. `npm run prisma:generate`
6. `npm run prisma:migrate`
7. `npm run prisma:seed`
8. `npm run dev`

## Notes

- `price` and `totalAmount` are stored in cents to match the current frontend price formatting.
- Public product responses keep the same core fields the UI already uses: `id`, `name`, `description`, `price`, and `image`.
- Register always creates a `USER`. Seed data creates the first admin account.
