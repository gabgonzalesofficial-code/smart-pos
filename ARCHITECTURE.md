# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Next.js 14  │  │  React Query │  │   Zustand    │     │
│  │  App Router  │  │  (Data Sync) │  │  (State Mgmt)│     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │  Sync Manager  │                        │
│                    │  (Offline-First)│                       │
│                    └───────┬────────┘                        │
│                            │                                 │
│         ┌──────────────────┼──────────────────┐             │
│         │                  │                  │             │
│  ┌──────▼──────┐  ┌────────▼──────┐  ┌───────▼──────┐     │
│  │ IndexedDB   │  │  Sync Queue   │  │ Service Worker│     │
│  │  (Local)    │  │  (Pending)    │  │  (Background)│     │
│  └─────────────┘  └───────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                      Backend Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   NestJS     │  │   Prisma     │  │  PostgreSQL  │     │
│  │   (API)      │  │   (ORM)      │  │  (Database)  │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                 │
│  ┌─────────────────────────▼─────────────────────────────┐ │
│  │              Business Logic Modules                     │ │
│  │  Auth │ Users │ Products │ Sales │ Inventory │ Reports │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **React Query**: Server state management & caching
- **Zustand**: Client state management
- **IndexedDB**: Offline storage (via idb library)
- **PWA**: Progressive Web App capabilities

### Backend
- **NestJS**: Modular Node.js framework
- **Prisma**: Type-safe ORM
- **PostgreSQL**: Primary database
- **JWT**: Authentication tokens
- **Swagger**: API documentation
- **Redis**: (Optional) Caching & sessions

### Shared
- **TypeScript**: Shared types across frontend/backend
- **Monorepo**: Turbo for build orchestration

## Design Patterns

### 1. Clean Architecture
- **Separation of Concerns**: Each module handles one responsibility
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Interface Segregation**: Small, focused interfaces

### 2. Repository Pattern (via Prisma)
- Database access abstracted through Prisma Client
- Easy to swap database implementations
- Type-safe queries

### 3. Module Pattern (NestJS)
- Feature-based modules
- Dependency injection
- Lazy loading

### 4. Offline-First Pattern
- Local-first data storage
- Optimistic updates
- Background sync
- Conflict resolution

## Data Flow

### Read Flow
```
User Action → React Component → React Query Hook → 
API Client → Backend API → Prisma → PostgreSQL → 
Response → Cache → Update UI
```

### Write Flow (Online)
```
User Action → Local State Update → API Client → 
Backend API → Prisma → PostgreSQL → 
Response → Update Cache → Update UI
```

### Write Flow (Offline)
```
User Action → Local State Update → IndexedDB → 
Queue Operation → [Wait for Connection] → 
Background Sync → Backend API → Update Sync Status
```

## Security Architecture

### Authentication Flow
```
Login → Validate Credentials → Generate JWT → 
Store Token → Attach to Requests → 
Validate Token → Authorize Access
```

### Authorization
- **Role-Based Access Control (RBAC)**
  - Admin: Full access
  - Manager: Sales, Inventory, Reports
  - Cashier: Sales only

- **Permission-Based**: Granular permissions per action

### Data Protection
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure, signed tokens
- **Input Validation**: Class-validator on DTOs
- **SQL Injection**: Prisma prevents SQL injection
- **XSS Protection**: React escapes by default

## Scalability Considerations

### Horizontal Scaling
- **Stateless API**: Can scale across multiple instances
- **Database Connection Pooling**: Prisma handles pooling
- **Redis**: Shared cache/sessions across instances

### Vertical Scaling
- **Database Indexing**: Optimized queries
- **Caching**: React Query + Redis
- **Code Splitting**: Next.js automatic code splitting
- **Lazy Loading**: Module lazy loading

### Performance Optimization
- **Database Queries**: Optimized with Prisma
- **API Response Caching**: React Query cache
- **Image Optimization**: Next.js Image component
- **Bundle Size**: Tree shaking, code splitting

## Offline-First Architecture

### Key Principles
1. **Local-First**: All operations work offline
2. **Optimistic Updates**: UI updates immediately
3. **Background Sync**: Automatic when online
4. **Conflict Resolution**: Server-wins or manual

### Sync Strategy
- **Priority Queue**: Critical operations first
- **Batch Operations**: Group multiple changes
- **Exponential Backoff**: Retry failed syncs
- **Conflict Detection**: Timestamp-based

## Database Schema Design

### Core Entities
- **Users**: Authentication & authorization
- **Products**: Product catalog
- **Sales**: Transaction records
- **Inventory**: Stock tracking
- **Suppliers**: Vendor management

### Relationships
- **One-to-Many**: User → Sales, Product → SaleItems
- **Many-to-One**: SaleItems → Product, Products → Supplier
- **Many-to-Many**: (Future) Products ↔ Categories

### Indexing Strategy
- **Primary Keys**: UUID for distributed systems
- **Foreign Keys**: Indexed for joins
- **Search Fields**: Barcode, name indexes
- **Time-based**: CreatedAt indexes for reports

## API Design Principles

### RESTful Conventions
- **Resource-Based URLs**: `/products`, `/sales`
- **HTTP Methods**: GET, POST, PATCH, DELETE
- **Status Codes**: Proper HTTP status codes
- **Error Handling**: Consistent error format

### Response Format
```json
{
  "data": {...},
  "meta": {...},  // For paginated responses
  "error": {...}  // For errors
}
```

## Testing Strategy

### Unit Tests
- **Backend**: Jest for services and controllers
- **Frontend**: React Testing Library
- **Shared**: Type validation tests

### Integration Tests
- **API**: Supertest for endpoint testing
- **Database**: Test with test database
- **E2E**: Playwright/Cypress for full flows

### Test Coverage Goals
- **Backend**: 80%+ coverage
- **Frontend**: 70%+ coverage
- **Critical Paths**: 100% coverage

## Deployment Architecture

### Development
```
Local Machine → PostgreSQL (Local) → 
Next.js Dev Server → NestJS Dev Server
```

### Production (Recommended)
```
CDN → Next.js (Vercel/Netlify) → 
API Gateway → NestJS (AWS/DigitalOcean) → 
PostgreSQL (Managed Service) → 
Redis (Optional Cache)
```

### Environment Variables
- **Development**: `.env.local`
- **Staging**: Environment-specific configs
- **Production**: Secure secret management

## Monitoring & Observability

### Logging
- **Backend**: Winston/Pino for structured logs
- **Frontend**: Console logs (dev), Sentry (prod)
- **Database**: Query logging (dev only)

### Metrics
- **API Response Times**: Track endpoint performance
- **Error Rates**: Monitor error frequency
- **Sync Status**: Track offline sync success

### Alerts
- **High Error Rate**: Alert on threshold
- **Sync Failures**: Alert on persistent failures
- **Database Issues**: Alert on connection problems

## Future Enhancements

### Phase 1: Core Features ✅
- Authentication, Products, Sales, Inventory

### Phase 2: Offline Mode
- IndexedDB, Sync Engine, PWA

### Phase 3: Advanced Features
- Multi-branch, Advanced Reports, AI Insights

### Phase 4: Scale
- Microservices, Event-driven architecture
- Real-time updates via WebSocket
- Mobile apps (React Native)

## Best Practices

1. **Type Safety**: TypeScript everywhere
2. **Code Organization**: Feature-based modules
3. **Error Handling**: Consistent error responses
4. **Validation**: Client + Server validation
5. **Documentation**: Keep docs updated
6. **Testing**: Write tests for critical paths
7. **Performance**: Monitor and optimize
8. **Security**: Follow security best practices
