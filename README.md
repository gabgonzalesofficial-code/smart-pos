# 🧾 Smart POS System - Production-Grade Monorepo

A modern, offline-capable Point of Sale system built with Next.js 14, NestJS, PostgreSQL, and Prisma.

## 🏗️ Architecture

```
smart-pos-monorepo/
├── apps/
│   ├── web/              # Next.js 14 Frontend (App Router)
│   └── api/              # NestJS Backend API
├── packages/
│   ├── prisma/           # Prisma Schema & Client
│   ├── shared/           # Shared TypeScript types & utilities
│   └── ui/               # Shared UI components (optional)
└── docs/                 # Documentation
```

## 🚀 Tech Stack

### Frontend

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **PWA** (Progressive Web App)
- **IndexedDB** (offline storage)
- **React Query** (data fetching & sync)

### Backend

- **NestJS** (modular architecture)
- **PostgreSQL** (primary database)
- **Prisma ORM** (type-safe database access)
- **JWT** (authentication)
- **RBAC** (role-based access control)
- **Redis** (caching & sessions)

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+ (optional, for caching)
- npm 9+

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

3. **Set up database:**

   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

4. **Start development servers:**

   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Docs: http://localhost:3001/api

## 📁 Project Structure

### Apps

#### `apps/web` - Next.js Frontend

- App Router architecture
- Server & Client components
- Offline-first with IndexedDB
- PWA support

#### `apps/api` - NestJS Backend

- Modular architecture
- Clean separation of concerns
- RESTful API design
- Swagger documentation

### Packages

#### `packages/prisma` - Database Schema

- Prisma schema definitions
- Database migrations
- Seed scripts

#### `packages/shared` - Shared Code

- TypeScript types
- API contracts
- Utility functions
- Constants

## 🔐 Authentication & Authorization

- **JWT** tokens for authentication
- **Roles**: Admin, Manager, Cashier
- **Permissions**: Granular access control

## 📊 Core Features

### MVP

- ✅ Sales & Checkout
- ✅ Product Management
- ✅ Inventory Tracking
- ✅ User Management
- ✅ Sales Reports
- ✅ Barcode Scanning
- ✅ Receipt Printing

### Advanced

- 🔄 Offline-First Mode
- 🤖 AI Sales Insights
- 📱 Mobile App
- ☁️ Multi-Branch Support

## 🛠️ Development

### Database Commands

```bash
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
```

### Building

```bash
npm run build        # Build all packages
```

### Testing

```bash
npm run test         # Run all tests
```

## 📝 License

MIT
