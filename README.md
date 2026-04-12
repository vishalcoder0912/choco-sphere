# ChocoSphere

ChocoSphere is now split into a clean two-app structure:

```text
choco-sphere/
  frontend/  React + Vite + TypeScript storefront
  backend/   Node.js + Express + Prisma + PostgreSQL API
```

## What is implemented

- API-driven product catalog with fallback demo data
- Category filtering and search
- Persistent cart with quantity controls
- Register and login flow backed by JWT
- Protected checkout flow posting orders to the backend
- Order history for signed-in users
- Modular Express backend with Prisma models for users, products, categories, orders, and order items

## Run the apps

### Frontend

```bash
npm run dev:frontend
```

### Backend

```bash
npm run dev:backend
```

## Backend setup

1. Update [`backend/.env.example`](./backend/.env.example) into `backend/.env`
2. Make sure PostgreSQL is running
3. Run:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Notes

- The frontend expects the backend at `http://localhost:5000/api` by default.
- If the API is unavailable, the catalog still renders bundled demo products so the UI does not collapse.
- Checkout and order history require valid PostgreSQL credentials in `backend/.env`.
