# 🚀 Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

Optional but recommended:

- **Redis** 6+ (for caching and sessions)
- **VS Code** (with recommended extensions)

## Step 1: Clone and Install

```bash
# Navigate to your project directory
cd C:\xampp\htdocs\POS

# Install all dependencies
npm install
```

## Step 2: Database Setup

### 2.1 Create PostgreSQL Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE pos_db;

-- Exit psql
\q
```

### 2.2 Configure Database Connection

```bash
# Copy environment file
cp packages/prisma/.env.example packages/prisma/.env

# Edit packages/prisma/.env and update DATABASE_URL
# DATABASE_URL="postgresql://postgres:your_password@localhost:5432/pos_db?schema=public"
```

### 2.3 Run Migrations

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

## Step 3: Backend Setup

### 3.1 Configure Backend Environment

```bash
# Copy environment file
cp apps/api/.env.example apps/api/.env

# Edit apps/api/.env and configure:
# - DATABASE_URL (same as Prisma)
# - JWT_SECRET (generate a secure random string)
# - PORT (default: 3001)
# - FRONTEND_URL (default: http://localhost:3000)
```

### 3.2 Generate JWT Secret

```bash
# Generate a secure random string (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4: Frontend Setup

### 4.1 Configure Frontend Environment

```bash
# Copy environment file
cp apps/web/.env.example apps/web/.env.local

# Edit apps/web/.env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Step 5: Start Development Servers

### Option 1: Run All Services (Recommended)

```bash
# From root directory
npm run dev
```

This will start:

- Backend API on http://localhost:3001
- Frontend on http://localhost:3000
- API Docs on http://localhost:3001/api/docs

### Option 2: Run Separately

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

## Step 6: Verify Installation

1. **Backend Health Check**
   - Visit: http://localhost:3001/api/health
   - Should return: `{"status":"ok",...}`

2. **API Documentation**
   - Visit: http://localhost:3001/api/docs
   - Should show Swagger UI

3. **Frontend**
   - Visit: http://localhost:3000
   - Should redirect to login page

4. **Login**
   - Username: `admin`
   - Password: `admin123`

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
# Windows: Check Services
# Linux/Mac: sudo systemctl status postgresql

# Test connection
psql -U postgres -d pos_db
```

### Port Already in Use

```bash
# Find process using port 3001
# Windows:
netstat -ano | findstr :3001

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Prisma Client Not Generated

```bash
cd packages/prisma
npm run generate
```

### Module Resolution Errors

```bash
# Clean and reinstall
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
npm install
```

## Development Tools

### Prisma Studio (Database GUI)

```bash
npm run db:studio
```

Opens at http://localhost:5555

### Database Migrations

```bash
# Create new migration
cd packages/prisma
npm run migrate:dev -- --name migration_name

# Reset database (WARNING: Deletes all data)
npm run migrate:reset
```

## Next Steps

1. Read [DEVELOPMENT_ROADMAP.md](./docs/DEVELOPMENT_ROADMAP.md)
2. Review [API_ROUTES.md](./docs/API_ROUTES.md)
3. Check [PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)
4. Start building features!

## Production Deployment

See deployment guide in `docs/DEPLOYMENT.md` (to be created)

## Support

For issues or questions:

1. Check documentation in `docs/` folder
2. Review API docs at `/api/docs`
3. Check error logs in console
