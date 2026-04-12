# ChocoSphere Frontend

React + Vite + TypeScript storefront for ChocoSphere.

## Features

- API-driven catalog with graceful fallback demo data
- Category filtering and search
- Persistent cart with quantity controls
- Sign in and registration modal
- Checkout trigger connected to the backend order API
- Order history for authenticated users

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Environment

Create `frontend/.env` with:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```
