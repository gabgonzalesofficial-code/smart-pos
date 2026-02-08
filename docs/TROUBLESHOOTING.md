# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 1. Database Migration Fails

#### Error: `Environment variable not found: DATABASE_URL`

**Solution:**

1. Create `.env` file in `packages/prisma/` directory:

   ```bash
   cp packages/prisma/.env.example packages/prisma/.env
   ```

2. Edit `packages/prisma/.env` with your PostgreSQL credentials:

   ```env
   DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=public"
   ```

3. Example for default PostgreSQL installation:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pos_db?schema=public"
   ```

#### Error: `Can't reach database server`

**Solutions:**

- Verify PostgreSQL is running:

  ```bash
  # Windows (Check Services)
  services.msc
  # Look for "postgresql-x64-XX" service

  # Or test connection
  psql -U postgres -h localhost
  ```

- Check PostgreSQL port (default: 5432)
- Verify database exists:

  ```sql
  psql -U postgres
  \l  -- List databases
  CREATE DATABASE pos_db;  -- If doesn't exist
  ```

- Check firewall settings
- Verify credentials in `.env` file

#### Error: `Database does not exist`

**Solution:**

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE pos_db;

-- Exit
\q
```

#### Error: `Migration failed` or `relation already exists`

**Solutions:**

```bash
# Option 1: Reset migrations (WARNING: Deletes all data)
cd packages/prisma
npm run migrate:reset

# Option 2: Check migration status
npx prisma migrate status

# Option 3: Mark migrations as applied (if tables exist)
npx prisma migrate resolve --applied <migration_name>
```

---

### 2. Prisma Client Generation Issues

#### Error: `Cannot find module '@prisma/client'`

**Solution:**

```bash
cd packages/prisma
npm install
npm run generate
```

#### Error: `Prisma Client not generated`

**Solution:**

```bash
cd packages/prisma
npm run generate
```

---

### 3. Seed Script Fails

#### Error: `Cannot find module '../src/generated'`

**Solution:**

```bash
# Generate Prisma Client first
npm run db:generate
```

#### Error: `bcrypt` module not found

**Solution:**

```bash
cd packages/prisma
npm install bcrypt
```

#### Error: `Unique constraint failed`

**Solution:**

- Seed script uses `upsert`, so this shouldn't happen
- If it does, check for duplicate data:
  ```bash
  # Reset and reseed
  cd packages/prisma
  npm run migrate:reset
  ```

---

### 4. Backend API Issues

#### Error: `Cannot connect to database`

**Solutions:**

1. Check `apps/api/.env` file exists
2. Verify `DATABASE_URL` matches `packages/prisma/.env`
3. Ensure PostgreSQL is running
4. Check database credentials

#### Error: `JWT_SECRET not found`

**Solution:**

1. Create `apps/api/.env` from `.env.example`
2. Generate a secure JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Add to `.env`:
   ```env
   JWT_SECRET=your_generated_secret_here
   ```

#### Error: `Port 3001 already in use`

**Solution:**

```bash
# Windows: Find process
netstat -ano | findstr :3001

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or change port in apps/api/.env
PORT=3002
```

---

### 5. Frontend Issues

#### Error: `Cannot find module '@pos/shared'`

**Solution:**

```bash
# Install dependencies
npm install

# Build shared package
cd packages/shared
npm run build
```

#### Error: `API request failed`

**Solutions:**

1. Check backend is running: http://localhost:3001/api/health
2. Verify `NEXT_PUBLIC_API_URL` in `apps/web/.env.local`
3. Check CORS settings in backend
4. Verify authentication token is valid

#### Error: `Module not found` in Next.js

**Solution:**

```bash
cd apps/web
rm -rf .next
npm run dev
```

---

### 6. Monorepo Issues

#### Error: `Workspace not found`

**Solution:**

```bash
# Reinstall dependencies
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
npm install
```

#### Error: `Turbo command failed`

**Solution:**

```bash
# Install Turbo globally (optional)
npm install -g turbo

# Or use npx
npx turbo run dev
```

---

### 7. TypeScript Errors

#### Error: `Cannot find type definitions`

**Solution:**

```bash
# Install type definitions
npm install --save-dev @types/node @types/react @types/react-dom

# Regenerate Prisma types
npm run db:generate
```

#### Error: `Type errors in Prisma Client`

**Solution:**

```bash
cd packages/prisma
npm run generate
```

---

### 8. PostgreSQL Connection Issues

#### Windows: PostgreSQL Service Not Running

**Solution:**

1. Open Services (`services.msc`)
2. Find `postgresql-x64-XX` service
3. Right-click → Start
4. Set to Automatic startup

#### Connection Refused

**Solutions:**

- Check `pg_hba.conf` file (usually in PostgreSQL data directory)
- Verify `postgresql.conf` allows connections
- Check if PostgreSQL is listening on correct port:
  ```bash
  netstat -an | findstr 5432
  ```

#### Authentication Failed

**Solution:**

- Reset PostgreSQL password:
  ```sql
  ALTER USER postgres WITH PASSWORD 'new_password';
  ```
- Update `.env` file with new password

---

## Quick Diagnostic Commands

### Check Database Connection

```bash
psql -U postgres -d pos_db -c "SELECT version();"
```

### Check Prisma Status

```bash
cd packages/prisma
npx prisma migrate status
```

### Check Environment Variables

```bash
# Windows PowerShell
Get-Content packages/prisma/.env

# Verify DATABASE_URL is set
```

### Test API Health

```bash
curl http://localhost:3001/api/health
```

---

## Getting Help

1. **Check Logs:**
   - Backend: Check console output
   - Database: Check PostgreSQL logs
   - Frontend: Check browser console

2. **Verify Setup:**
   - All `.env` files exist and are configured
   - Dependencies installed (`npm install`)
   - Database is running and accessible
   - Ports are available (3000, 3001, 5432)

3. **Common First Steps:**

   ```bash
   # 1. Install dependencies
   npm install

   # 2. Set up environment files
   cp packages/prisma/.env.example packages/prisma/.env
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env.local

   # 3. Configure .env files with your credentials

   # 4. Generate Prisma Client
   npm run db:generate

   # 5. Run migrations
   npm run db:migrate

   # 6. Seed database
   npm run db:seed
   ```

---

## Still Having Issues?

1. Check the error message carefully
2. Verify all prerequisites are installed
3. Ensure all environment variables are set
4. Check that services (PostgreSQL) are running
5. Review the [SETUP.md](../SETUP.md) guide
6. Check [DATABASE_COMMANDS.md](./DATABASE_COMMANDS.md) for database-specific help
