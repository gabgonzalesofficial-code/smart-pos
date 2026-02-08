# 🔄 Offline-First Sync Engine Design

## Overview

The POS system implements an offline-first architecture that allows full functionality even when the internet connection is unavailable. All operations are performed locally first, then synced to the server when connectivity is restored.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   UI Layer   │  │  State Mgmt  │  │  API Client  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │          │
│         └──────────────────┼──────────────────┘          │
│                            │                            │
│                    ┌───────▼────────┐                   │
│                    │  Sync Manager  │                   │
│                    └───────┬────────┘                   │
│                            │                            │
│         ┌──────────────────┼──────────────────┐         │
│         │                  │                  │         │
│  ┌──────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐  │
│  │ IndexedDB   │  │  Sync Queue   │  │ Service Worker│ │
│  │  (Local DB) │  │  (Pending Ops) │  │  (Background) │  │
│  └─────────────┘  └───────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            │
┌───────────────────────────▼──────────────────────────────┐
│                  Backend API (NestJS)                    │
├──────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Sync API    │  │  Conflict    │  │  Sync Logs   │   │
│  │  Endpoints   │  │  Resolution   │  │  Tracking    │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└──────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Write Operations (Create/Update/Delete)

```
User Action → Local Write (IndexedDB) → Queue Operation → 
[If Online] Sync to Server → Update Sync Status
[If Offline] Wait for Connection → Background Sync
```

### 2. Read Operations

```
User Request → Check IndexedDB → 
[If Online] Fetch from Server → Update Local Cache
[If Offline] Return Cached Data
```

## Implementation Details

### 1. IndexedDB Schema

```typescript
// Local database structure
interface LocalDatabase {
  products: Product[];
  sales: Sale[];
  inventoryLogs: InventoryLog[];
  syncQueue: SyncQueueItem[];
  syncLogs: SyncLog[];
}

interface SyncQueueItem {
  id: string;
  entityType: 'sale' | 'inventory' | 'product';
  entityId: string;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: Date;
  retryCount: number;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
}
```

### 2. Sync Manager

```typescript
class SyncManager {
  // Check online status
  async isOnline(): Promise<boolean>;
  
  // Add operation to sync queue
  async queueOperation(item: SyncQueueItem): Promise<void>;
  
  // Process sync queue
  async processQueue(): Promise<void>;
  
  // Sync specific entity
  async syncEntity(item: SyncQueueItem): Promise<void>;
  
  // Handle conflicts
  async resolveConflict(local: any, server: any): Promise<any>;
  
  // Get sync status
  async getSyncStatus(): Promise<SyncStatus>;
}
```

### 3. Conflict Resolution Strategy

#### Last-Write-Wins (Default)
- Use timestamp to determine winner
- Simple but may lose data

#### Server-Wins (Recommended for Sales)
- Server is source of truth
- Local changes are merged carefully

#### Manual Resolution (For Critical Data)
- Flag conflicts for user review
- Show diff and let user decide

### 4. Sync API Endpoints

```typescript
// POST /api/sync/push
// Push local changes to server
{
  operations: SyncQueueItem[];
}

// POST /api/sync/pull
// Pull server changes
{
  lastSyncTimestamp: string;
  entityTypes: string[];
}

// POST /api/sync/conflicts
// Get conflicts that need resolution
{
  conflicts: Conflict[];
}
```

## Sync Scenarios

### Scenario 1: Creating a Sale Offline

1. User creates sale → Saved to IndexedDB immediately
2. Sale added to sync queue with status 'pending'
3. Receipt generated locally
4. When online → Sync manager processes queue
5. Sale synced to server → Status updated to 'synced'

### Scenario 2: Updating Product Stock

1. Stock adjustment → Local update
2. Queue operation
3. Sync → Check for conflicts
4. If conflict → Resolve (server-wins or manual)
5. Update local cache

### Scenario 3: Conflict Resolution

1. Local change timestamp: 10:00 AM
2. Server change timestamp: 10:05 AM
3. Conflict detected
4. Strategy: Server-wins
5. Local change merged with server data
6. User notified if manual resolution needed

## Service Worker Implementation

```javascript
// sw.js
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-sales') {
    event.waitUntil(syncSales());
  }
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
```

## Best Practices

### 1. Optimistic Updates
- Update UI immediately
- Show sync status indicator
- Handle failures gracefully

### 2. Data Validation
- Validate locally before queuing
- Server validates again on sync
- Return validation errors to client

### 3. Batch Operations
- Group multiple operations
- Reduce API calls
- Improve performance

### 4. Sync Priority
- Sales: High priority (critical)
- Inventory: Medium priority
- Products: Low priority (can wait)

### 5. Error Handling
- Retry with exponential backoff
- Max retry attempts (e.g., 5)
- Alert user on persistent failures

## Monitoring & Debugging

### Sync Status Indicators
- ✅ Synced
- 🔄 Syncing
- ⚠️ Conflict
- ❌ Failed
- 📴 Offline

### Debug Tools
- View sync queue
- Check sync logs
- Manual sync trigger
- Clear local cache

## Performance Considerations

1. **IndexedDB Size Limits**: Monitor and clean old data
2. **Sync Frequency**: Balance between real-time and battery
3. **Batch Size**: Limit operations per sync batch
4. **Compression**: Compress data before sync
5. **Differential Sync**: Only sync changes, not full entities

## Security

1. **Encryption**: Encrypt sensitive data in IndexedDB
2. **Authentication**: Validate tokens before sync
3. **Authorization**: Check permissions on server
4. **Audit Trail**: Log all sync operations

## Testing Strategy

1. **Unit Tests**: Sync manager logic
2. **Integration Tests**: API sync endpoints
3. **E2E Tests**: Full offline → online flow
4. **Load Tests**: Multiple concurrent syncs
5. **Conflict Tests**: Various conflict scenarios

## Future Enhancements

1. **Real-time Sync**: WebSocket for instant updates
2. **Multi-device Sync**: Sync across multiple devices
3. **Selective Sync**: Choose what to sync
4. **Compression**: Reduce bandwidth usage
5. **Delta Sync**: Only sync changes
