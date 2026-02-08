# 🚀 Quick Start Guide

## Admin Credentials

**Username:** `admin`  
**Password:** `admin123`

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

#### 2.1 Create PostgreSQL Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE pos_db;

-- Exit
\q
```

#### 2.2 Configure Database Connection

The `.env` files should already be created, but verify:

**`packages/prisma/.env`** should contain:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pos_db?schema=public"
```

Update `postgres:postgres` with your actual PostgreSQL username and password.

### 3. Run Database Migrations

```bash
# Generate Prisma Client
npm run db:generate

# Create database tables
npm run db:migrate

# Add sample data (including admin user)
npm run db:seed
```

### 4. Configure Backend

**`apps/api/.env`** should contain:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pos_db?schema=public"
JWT_SECRET=smart-pos-super-secret-jwt-key-change-in-production-min-32-chars-12345
JWT_EXPIRES_IN=7d
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 5. Configure Frontend

**`apps/web/.env.local`** should contain:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 6. Start Development Servers

```bash
# This starts both frontend and backend
npm run dev
```

Or run separately:

**Terminal 1 - Backend:**

```bash
cd apps/api
npm run start:dev
```

**Terminal 2 - Frontend:**

```bash
cd apps/web
npm run dev
```

### 7. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **API Docs:** http://localhost:3001/api/docs

### 8. Login

Use the admin credentials:

- **Username:** `admin`
- **Password:** `admin123`

## Troubleshooting Network Errors

### Backend Not Running

**Check if backend is running:**

```bash
# Test backend health
curl http://localhost:3001/api/health
```

**If backend is not running:**

1. Make sure PostgreSQL is running
2. Check `apps/api/.env` exists and is configured
3. Run backend manually:
   ```bash
   cd apps/api
   npm run start:dev
   ```

### Frontend Can't Connect

**Check:**

1. Backend is running on port 3001
2. `apps/web/.env.local` exists with correct API URL
3. No firewall blocking port 3001
4. CORS is enabled (already configured in backend)

### Database Connection Issues

**Check:**

1. PostgreSQL is running
2. Database `pos_db` exists
3. Credentials in `.env` files are correct
4. Port 5432 is accessible

**Test connection:**

```bash
psql -U postgres -d pos_db -c "SELECT 1;"
```

## Common Issues

### "Cannot connect to server" Error

1. **Backend not running:**
   - Check terminal for backend server
   - Should see: `🚀 Backend API running on http://localhost:3001`

2. **Wrong API URL:**
   - Check `apps/web/.env.local`
   - Should be: `NEXT_PUBLIC_API_URL=http://localhost:3001/api`

3. **Port conflict:**
   - Check if port 3001 is already in use
   - Change PORT in `apps/api/.env` if needed

### "Invalid credentials" Error

1. **Database not seeded:**

   ```bash
   npm run db:seed
   ```

2. **Wrong credentials:**
   - Username: `admin`
   - Password: `admin123`

### "Database connection failed" Error

1. **PostgreSQL not running**
2. **Wrong DATABASE_URL** in `.env` files
3. **Database doesn't exist** - create it first

## Verify Everything Works

1. ✅ Backend health check: http://localhost:3001/api/health
2. ✅ API docs accessible: http://localhost:3001/api/docs
3. ✅ Frontend loads: http://localhost:3000
4. ✅ Can login with admin/admin123

## Next Steps

After successful login:

1. Explore the dashboard
2. Check API documentation at `/api/docs`
3. Start building features!

For detailed setup, see [SETUP.md](./SETUP.md)  
For troubleshooting, see [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
