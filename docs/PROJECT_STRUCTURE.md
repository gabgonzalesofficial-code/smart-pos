# 📁 Project Structure

## Monorepo Overview

```
smart-pos-monorepo/
├── apps/
│   ├── api/                    # NestJS Backend API
│   └── web/                    # Next.js 14 Frontend
├── packages/
│   ├── prisma/                 # Prisma Schema & Client
│   └── shared/                 # Shared TypeScript Types
├── docs/                       # Documentation
├── package.json                # Root package.json (Turbo)
├── turbo.json                  # Turbo configuration
└── README.md                   # Main README
```

## Backend Structure (`apps/api`)

```
apps/api/
├── src/
│   ├── auth/                   # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   │   └── login.dto.ts
│   │   └── strategies/
│   │       ├── jwt.strategy.ts
│   │       └── local.strategy.ts
│   ├── users/                  # User management
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── products/               # Product management
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── products.module.ts
│   │   └── dto/
│   │       ├── create-product.dto.ts
│   │       └── update-product.dto.ts
│   ├── sales/                  # Sales & Checkout
│   │   ├── sales.controller.ts
│   │   ├── sales.service.ts
│   │   ├── sales.module.ts
│   │   └── dto/
│   │       └── create-sale.dto.ts
│   ├── inventory/              # Inventory management
│   │   ├── inventory.controller.ts
│   │   ├── inventory.service.ts
│   │   ├── inventory.module.ts
│   │   └── dto/
│   │       └── create-inventory-log.dto.ts
│   ├── reports/                # Reports & Analytics
│   │   ├── reports.controller.ts
│   │   ├── reports.service.ts
│   │   └── reports.module.ts
│   ├── common/                 # Shared utilities
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   └── guards/
│   │       ├── jwt-auth.guard.ts
│   │       └── roles.guard.ts
│   ├── app.module.ts           # Root module
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts                 # Application entry point
├── package.json
├── tsconfig.json
├── nest-cli.json
└── .env.example
```

## Frontend Structure (`apps/web`)

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page (redirects)
│   │   ├── globals.css         # Global styles
│   │   ├── providers.tsx       # React Query provider
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Dashboard page
│   │   ├── products/
│   │   │   └── page.tsx        # Products page (future)
│   │   ├── sales/
│   │   │   └── page.tsx        # Sales/Checkout page (future)
│   │   └── reports/
│   │       └── page.tsx        # Reports page (future)
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── layout/             # Layout components
│   │   └── features/           # Feature-specific components
│   ├── lib/                    # Utilities & helpers
│   │   ├── api-client.ts       # Axios client
│   │   └── db.ts               # IndexedDB setup (future)
│   ├── stores/                 # Zustand stores
│   │   ├── auth-store.ts       # Authentication state
│   │   └── sync-store.ts       # Sync state (future)
│   ├── hooks/                  # Custom React hooks
│   └── types/                  # TypeScript types (from shared)
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── icon-192.png            # App icon (to be added)
│   └── icon-512.png            # App icon (to be added)
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── .env.example
```

## Prisma Package (`packages/prisma`)

```
packages/prisma/
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed script
├── src/
│   ├── index.ts                # Prisma client export
│   └── generated/              # Generated Prisma Client
├── package.json
└── tsconfig.json
```

## Shared Package (`packages/shared`)

```
packages/shared/
├── src/
│   ├── types/
│   │   ├── api.ts              # API types
│   │   ├── auth.ts             # Auth types
│   │   ├── product.ts          # Product types
│   │   ├── sale.ts             # Sale types
│   │   ├── inventory.ts        # Inventory types
│   │   └── index.ts            # Barrel export
│   ├── constants/
│   │   └── permissions.ts      # Permission constants
│   └── index.ts                # Main export
├── package.json
└── tsconfig.json
```

## Key Files

### Configuration Files

- `package.json` (root): Turbo monorepo configuration
- `turbo.json`: Turbo build pipeline configuration
- `.prettierrc`: Code formatting rules
- `.gitignore`: Git ignore patterns

### Environment Files

- `apps/api/.env.example`: Backend environment variables
- `apps/web/.env.example`: Frontend environment variables
- `packages/prisma/.env.example`: Database connection

### Documentation

- `README.md`: Main project documentation
- `docs/DEVELOPMENT_ROADMAP.md`: Development phases
- `docs/OFFLINE_SYNC_DESIGN.md`: Offline sync architecture
- `docs/API_ROUTES.md`: API endpoint documentation
- `docs/PROJECT_STRUCTURE.md`: This file

## Module Organization Principles

### Backend (NestJS)

- **Feature-based modules**: Each feature has its own module
- **Separation of concerns**: Controller → Service → Repository pattern
- **DTOs**: Data Transfer Objects for validation
- **Guards**: Authentication and authorization guards
- **Decorators**: Custom decorators for common patterns

### Frontend (Next.js)

- **App Router**: File-based routing with App Router
- **Server Components**: Default, use Client Components when needed
- **Component organization**: UI → Layout → Features hierarchy
- **State management**: Zustand for global state
- **Data fetching**: React Query for server state

### Shared Code

- **Types**: Shared TypeScript interfaces and types
- **Constants**: Shared constants (permissions, enums)
- **No business logic**: Only types and constants

## Database Schema (Prisma)

### Core Entities

- `User`: System users with roles
- `Product`: Products catalog
- `Supplier`: Product suppliers
- `Sale`: Sales transactions
- `SaleItem`: Individual sale line items
- `InventoryLog`: Inventory movement logs
- `Discount`: Promotional discounts
- `Branch`: Multi-branch support (future)
- `SyncLog`: Offline sync tracking

## API Design

### RESTful Conventions

- `GET /resource`: List resources
- `GET /resource/:id`: Get single resource
- `POST /resource`: Create resource
- `PATCH /resource/:id`: Update resource
- `DELETE /resource/:id`: Delete resource

### Naming Conventions

- Kebab-case for URLs: `/sales-summary`
- CamelCase for JSON: `receiptNumber`
- PascalCase for types: `CreateSaleDto`

## Development Workflow

1. **Start Development**

   ```bash
   npm install
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

2. **Make Changes**
   - Backend: Edit files in `apps/api/src`
   - Frontend: Edit files in `apps/web/src`
   - Database: Edit `packages/prisma/prisma/schema.prisma`

3. **Database Changes**

   ```bash
   npm run db:migrate
   npm run db:generate
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Best Practices

1. **Type Safety**: Use TypeScript everywhere
2. **Code Organization**: Follow module structure
3. **Error Handling**: Consistent error responses
4. **Validation**: Validate on both client and server
5. **Documentation**: Keep docs updated
6. **Testing**: Write tests for critical paths
7. **Performance**: Optimize queries and bundle size
8. **Security**: Validate inputs, use prepared statements
