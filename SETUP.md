# ChocoSphere Setup Guide

This guide will help you set up ChocoSphere as a complete, fully functional shopping website.

## Prerequisites

Before starting, ensure you have:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download here](https://www.postgresql.org/download/)
- **npm** (comes with Node.js) or **bun** - [Download bun here](https://bun.sh/)

## Step 1: Set Up PostgreSQL Database

### Option A: Using PostgreSQL locally

1. Install PostgreSQL for your operating system
2. During installation, set a password for the `postgres` user (remember this password!)
3. Create a new database:

```bash
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE choco_sphere;

# Exit
\q
```

### Option B: Using Docker (Recommended for development)

```bash
docker run --name choco-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=choco_sphere \
  -p 5432:5432 \
  -d postgres:14
```

## Step 2: Backend Setup

### 2.1 Navigate to backend directory

```bash
cd backend
```

### 2.2 Install dependencies

```bash
npm install
```

### 2.3 Create .env file

The `.env` file is gitignored for security, so you need to create it manually:

**On Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**On Windows (Command Prompt):**
```cmd
copy .env.example .env
```

**On Mac/Linux:**
```bash
cp .env.example .env
```

### 2.4 Edit .env file

Open the newly created `.env` file and update it with your PostgreSQL credentials:

```env
# Database URL - Update with your PostgreSQL password
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/choco_sphere?schema=public"

# JWT Secret - Generate a random secret key
JWT_SECRET="your-long-random-secret-key-min-32-characters-long"

# Server Port
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"
```

**Important:**
- Replace `YOUR_PASSWORD` with your actual PostgreSQL password
- Change `JWT_SECRET` to a random, secure string (minimum 32 characters)
- If using Docker with the command above, your password is `postgres`

### 2.5 Generate Prisma Client

```bash
npm run prisma:generate
```

### 2.6 Run Database Migrations

```bash
npm run prisma:migrate
```

This will create all the necessary tables in your database.

### 2.7 Seed the Database

```bash
npm run prisma:seed
```

This will populate the database with:
- **3 Categories**: Dark Chocolate, Milk Chocolate, White Chocolate
- **3 Products**: With images and descriptions
- **2 Users**: 
  - Admin: `admin@chocosphere.com` / `Admin@123`
  - Customer: `customer@chocosphere.com` / `User@1234`
- **1 Sample Order**: For demonstration

### 2.8 Start Backend Server

```bash
npm run dev
```

The backend will start on `http://localhost:5000`

You should see:
```
Server running on port 5000
```

**Keep this terminal open!**

## Step 3: Frontend Setup

### 3.1 Navigate to frontend directory (in a new terminal)

```bash
cd frontend
```

### 3.2 Install dependencies

```bash
npm install
# OR if using bun
bun install
```

### 3.3 Create .env file

**On Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**On Windows (Command Prompt):**
```cmd
copy .env.example .env
```

**On Mac/Linux:**
```bash
cp .env.example .env
```

The `.env` file should contain:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3.4 Start Frontend Development Server

```bash
npm run dev
# OR if using bun
bun run dev
```

The frontend will start on `http://localhost:5173`

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

## Step 4: Verify Everything Works

### 4.1 Open the Website

Visit `http://localhost:5173` in your browser.

You should see:
- The ChocoSphere home page with featured products
- Navigation menu with Home, Shop, Orders links
- Cart icon in the header
- Dark/light mode toggle

### 4.2 Test Customer Flow

1. **Browse Products**: Click "Shop" in the navigation
2. **Add to Cart**: Click "Add to Cart" on any product
3. **View Cart**: Click the cart icon in the header
4. **Sign In**: 
   - Click "Sign In To Checkout" in the cart
   - Register a new account OR login with `customer@chocosphere.com` / `User@1234`
5. **Checkout**:
   - Fill in shipping address
   - Select payment method (Card or UPI)
   - Click "Place Order"
6. **View Order Success**: You'll see the order confirmation page
7. **View Order History**: Click "Orders" in navigation to see your orders

### 4.3 Test Admin Flow

1. **Logout** (if logged in as customer)
2. **Login as Admin**: Use `admin@chocosphere.com` / `Admin@123`
3. **Access Admin Dashboard**: Click "Admin" in the navigation
4. **View Orders**: See all customer orders
5. **Update Order Status**: Change status from PENDING to PAID, etc.
6. **Add Product**: Create a new product with image, description, price

## Troubleshooting

### Backend won't start

**Error: "Connection refused" or "Connection timeout"**
- Ensure PostgreSQL is running
- Check your DATABASE_URL in `.env` matches your PostgreSQL credentials
- If using Docker, ensure the Docker container is running: `docker ps`

**Error: "Database does not exist"**
- Create the database: `createdb choco_sphere`
- Or run: `psql -U postgres -c "CREATE DATABASE choco_sphere;"`

### Frontend shows demo products instead of real data

- Ensure backend is running on port 5000
- Check browser console for API errors
- Verify `VITE_API_BASE_URL` in frontend `.env` is correct

### Prisma migration fails

**Error: "P3006" or "Migration failed"**
- Drop the database and recreate:
  ```bash
  psql -U postgres -c "DROP DATABASE choco_sphere;"
  psql -U postgres -c "CREATE DATABASE choco_sphere;"
  npm run prisma:migrate
  npm run prisma:seed
  ```

### Login doesn't work

- Ensure you've run the seed command: `npm run prisma:seed`
- Check the backend logs for errors
- Verify the user exists in the database

## Default Credentials

**Admin Account:**
- Email: `admin@chocosphere.com`
- Password: `Admin@123`

**Customer Account:**
- Email: `customer@chocosphere.com`
- Password: `User@1234`

## Next Steps

Once everything is running:

1. **Customize the seed data** - Edit `backend/prisma/seed.js` to add your own products
2. **Change default passwords** - Update seed file with secure passwords
3. **Deploy to production** - Use Vercel for frontend, Railway/Heroku for backend
4. **Add payment integration** - Integrate Stripe or Razorpay for real payments

## Support

If you encounter issues:
1. Check the terminal logs for error messages
2. Ensure all prerequisites are installed correctly
3. Verify your `.env` files are configured properly
4. Check that PostgreSQL is running and accessible

## Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │
│   (React)       │────────▶│   (Express)     │
│   Port: 5173    │  API    │   Port: 5000    │
└─────────────────┘         └────────┬────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │   PostgreSQL    │
                             │   Port: 5432    │
                             └─────────────────┘
```

The frontend communicates with the backend via REST API endpoints. The backend stores all data in PostgreSQL using Prisma ORM.
