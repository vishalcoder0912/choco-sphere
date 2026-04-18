# Render Deployment Guide

## Prerequisites
- GitHub repository with your code pushed
- Render account (sign up at render.com)

---

## Step 1: Prepare Your Backend

### 1.1 Update server.js for Production

Make sure your `backend/src/server.js` listens on the correct port:

```js
import app from "./app.js";
import { env } from "./config/env.js";

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### 1.2 Add Procfile (optional - Render auto-detects)

Create `backend/Procfile`:
```
web: npm start
```

### 1.3 Update package.json

Ensure scripts in `backend/package.json`:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js",
    "build": "npx prisma generate"
  }
}
```

---

## Step 2: Create PostgreSQL on Render

### 2.1 Create Database
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **PostgreSQL**
3. Fill in:
   - **Name**: `choco-sphere-db`
   - **Plan**: Free (or paid if needed)
   - **Region**: Choose closest to your users
4. Click **Create Database**

### 2.2 Get Connection String
1. Wait for status to show **Available** (green)
2. Click on the database name
3. Scroll to **Connections** section
4. Copy the **Internal Connection URL** (starts with `postgres://`)

---

## Step 3: Create Web Service

### 3.1 Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `choco-sphere-api`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`

### 3.2 Add Environment Variables
In the **Environment** section, add these:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | (paste your PostgreSQL connection string from Step 2.2) |
| `JWT_SECRET` | (generate a strong random string - e.g., use a UUID or password generator) |
| `PORT` | `10000` (Render assigns this automatically) |
| `NODE_ENV` | `production` |

### 3.3 Deploy
1. Click **Create Web Service**
2. Wait for build to complete (~3-5 minutes)
3. Once deployed, you'll see a URL like: `https://choco-sphere-api.onrender.com`

---

## Step 4: Verify Deployment

### 4.1 Test Health Endpoint
```bash
curl https://your-service-name.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "API is healthy"
}
```

### 4.2 Test API Root
```bash
curl https://your-service-name.onrender.com/api
```

Expected response:
```json
{
  "success": true,
  "message": "ChocoSphere API is running",
  "version": "1.0.0"
}
```

---

## Step 5: Update Frontend (if needed)

Update your frontend's API base URL in `.env` or config:

```env
VITE_API_URL=https://choco-sphere-api.onrender.com/api
```

---

## Important Notes

### 1. Cold Start
- Render's free tier spins down after 15 min of inactivity
- First request after idle may take ~30 seconds

### 2. Environment Variables on Render
- NEVER commit `.env` file to GitHub
- All secrets stay in Render dashboard

### 3. Prisma Migration
For production, you may need to run migrations:
1. Go to your Web Service in Render
2. Click **Shell** to open terminal
3. Run: `npx prisma db push` (or `prisma migrate deploy`)

### 4. CORS
Ensure your backend allows your production frontend URL:
- In `app.js`, add your Vercel/production URL to `allowedOrigins`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build failed | Check build logs - usually missing dependencies or Prisma errors |
| 503 after deploy | Wait 1-2 min, cold start can delay |
| Database connection error | Verify DATABASE_URL is correct and database is available |
| CORS errors | Add your production URL to allowedOrigins in app.js |

---

## Quick Commands

```bash
# View logs
render logs choco-sphere-api

# Open shell
render exec choco-sphere-api sh

# Restart service
# From Render dashboard, click "Manual Deploy" → "Clear build cache & deploy"
```