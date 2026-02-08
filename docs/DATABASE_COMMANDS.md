# 🗄️ Database Commands Reference

## Quick Start Commands

These three commands set up your database from scratch:

```bash
npm run db:generate   # Generate Prisma Client
npm run db:migrate     # Create database tables
npm run db:seed        # Add sample data
```

## Command Details

### 1. `npm run db:generate`

**What it does:**

- Generates the Prisma Client based on your schema
- Creates TypeScript types for your database models
- Must be run after schema changes

**When to use:**

- After modifying `prisma/schema.prisma`
- After pulling changes that include schema updates
- Before running migrations

**Output:**

- Creates/updates `packages/prisma/src/generated/` folder
- Generates type-safe database client

---

### 2. `npm run db:migrate`

**What it does:**

- Creates a new migration file
- Applies the migration to your database
- Creates all tables, indexes, and relationships

**When to use:**

- After modifying the Prisma schema
- When setting up the database for the first time
- After pulling schema changes

**What happens:**

1. Prisma compares your schema with the database
2. Creates a migration file in `prisma/migrations/`
3. Applies the migration to PostgreSQL
4. Updates the `_prisma_migrations` table

**Note:** This command is interactive - it will prompt you to name the migration.

---

### 3. `npm run db:seed`

**What it does:**

- Runs the seed script (`prisma/seed.ts`)
- Populates the database with initial data

**What gets created:**

- ✅ Admin user (username: `admin`, password: `admin123`)
- ✅ Sample supplier
- ✅ 4 sample products (Coca Cola, Pepsi, Bread, Milk)
- ✅ Initial inventory stock (100 units each)

**When to use:**

- After running migrations
- When resetting the database
- For development/testing

**Note:** The seed script uses `upsert`, so it's safe to run multiple times.

---

## Additional Database Commands

### View Database in Browser

```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555 - a visual database browser.

### Reset Database (⚠️ Deletes all data)

```bash
cd packages/prisma
npm run migrate:reset
```

This will:

1. Drop the database
2. Recreate it
3. Run all migrations
4. Run the seed script

### Create Migration Without Applying

```bash
cd packages/prisma
npx prisma migrate dev --create-only
```

### Apply Existing Migrations (Production)

```bash
cd packages/prisma
npm run migrate:deploy
```

### Format Prisma Schema

```bash
cd packages/prisma
npm run format
```

---

## Common Workflows

### First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up database connection
cp packages/prisma/.env.example packages/prisma/.env
# Edit .env with your database credentials

# 3. Generate Prisma Client
npm run db:generate

# 4. Create and apply migrations
npm run db:migrate

# 5. Seed with sample data
npm run db:seed
```

### After Schema Changes

```bash
# 1. Update schema.prisma
# 2. Generate client
npm run db:generate

# 3. Create and apply migration
npm run db:migrate
```

### Reset Everything

```bash
cd packages/prisma
npm run migrate:reset
# This will also run seed automatically
```

---

## Troubleshooting

### Error: "Prisma Client not generated"

```bash
cd packages/prisma
npm run generate
```

### Error: "Database connection failed"

1. Check PostgreSQL is running
2. Verify DATABASE_URL in `.env` file
3. Test connection: `psql -U postgres -d pos_db`

### Error: "Migration failed"

```bash
# Check migration status
cd packages/prisma
npx prisma migrate status

# If needed, reset (WARNING: deletes data)
npm run migrate:reset
```

### Error: "Seed script failed"

- Make sure migrations have been applied
- Check that Prisma Client is generated
- Verify database connection
- Check seed.ts file for syntax errors

### Error: "Cannot find module '../src/generated'"

```bash
# Generate Prisma Client first
npm run db:generate
```

---

## Environment Variables

Make sure `packages/prisma/.env` contains:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/pos_db?schema=public"
```

**Format:**

```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

---

## Database Schema Location

The database schema is defined in:

```
packages/prisma/prisma/schema.prisma
```

After modifying the schema:

1. Run `npm run db:generate`
2. Run `npm run db:migrate`
3. (Optional) Run `npm run db:seed` to refresh sample data

---

## Seed Data Details

### Default Admin Account

- **Username:** `admin`
- **Password:** `admin123`
- **Role:** `ADMIN`
- **Email:** `admin@pos.local`

### Sample Products

1. Coca Cola 500ml - ₱25.00
2. Pepsi 500ml - ₱25.00
3. Bread Loaf - ₱45.00
4. Milk 1L - ₱65.00

All products start with 100 units in stock.

---

## Production Considerations

### For Production Deployment:

```bash
# Use migrate:deploy instead of migrate:dev
cd packages/prisma
npm run migrate:deploy

# Don't run seed in production!
# Seed is only for development
```

### Migration Best Practices:

1. Always test migrations in development first
2. Backup database before running migrations
3. Review migration files before applying
4. Use `migrate:deploy` in production (non-interactive)
