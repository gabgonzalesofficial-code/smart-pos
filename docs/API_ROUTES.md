# 📡 API Routes Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentication (`/auth`)

### POST `/auth/login`
Login and get access token.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@pos.local",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN",
    "isActive": true
  }
}
```

### GET `/auth/profile`
Get current user profile (protected).

---

## 👥 Users (`/users`)

### GET `/users`
Get all users (Admin/Manager only).

**Response:**
```json
[
  {
    "id": "uuid",
    "username": "admin",
    "email": "admin@pos.local",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### GET `/users/:id`
Get user by ID.

---

## 📦 Products (`/products`)

### GET `/products`
Get all products with optional filters.

**Query Parameters:**
- `search` (string): Search by name or barcode
- `category` (string): Filter by category

**Example:**
```
GET /products?search=coke&category=Beverages
```

### GET `/products/:id`
Get product by ID.

### GET `/products/barcode/:barcode`
Find product by barcode.

### GET `/products/categories`
Get all product categories.

### POST `/products`
Create a new product.

**Request:**
```json
{
  "barcode": "1000000001",
  "name": "Coca Cola 500ml",
  "description": "Carbonated soft drink",
  "price": 25.00,
  "cost": 15.00,
  "category": "Beverages",
  "trackInventory": true,
  "supplierId": "uuid"
}
```

### PATCH `/products/:id`
Update product.

### DELETE `/products/:id`
Soft delete product (sets isActive to false).

---

## 🛒 Sales (`/sales`)

### POST `/sales`
Create a new sale/transaction.

**Request:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "unitPrice": 25.00,
      "discount": 0,
      "total": 50.00
    }
  ],
  "subtotal": 50.00,
  "discount": 0,
  "tax": 0,
  "total": 50.00,
  "paymentMethod": "CASH",
  "amountPaid": 50.00,
  "change": 0,
  "notes": "Optional notes"
}
```

**Response:**
```json
{
  "id": "uuid",
  "receiptNumber": "RCP-20240101-ABC123",
  "cashierId": "uuid",
  "items": [...],
  "subtotal": 50.00,
  "discount": 0,
  "tax": 0,
  "total": 50.00,
  "paymentMethod": "CASH",
  "amountPaid": 50.00,
  "change": 0,
  "status": "COMPLETED",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### GET `/sales`
Get all sales with pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 50)
- `dateFrom` (string): Start date (ISO format)
- `dateTo` (string): End date (ISO format)

**Example:**
```
GET /sales?page=1&limit=20&dateFrom=2024-01-01&dateTo=2024-01-31
```

### GET `/sales/:id`
Get sale by ID.

### GET `/sales/receipt/:receiptNumber`
Find sale by receipt number.

### POST `/sales/:id/refund`
Refund a sale.

**Request:**
```json
{
  "reason": "Customer requested refund"
}
```

---

## 📊 Inventory (`/inventory`)

### GET `/inventory/logs`
Get inventory logs.

**Query Parameters:**
- `productId` (string): Filter by product
- `action` (string): Filter by action type
- `page` (number): Page number
- `limit` (number): Items per page

### POST `/inventory/logs`
Create inventory log entry.

**Request:**
```json
{
  "productId": "uuid",
  "quantity": 10,
  "action": "STOCK_IN",
  "notes": "Restocked",
  "reference": "PO-123"
}
```

### GET `/inventory/stock/:productId`
Get current stock for a product.

**Response:**
```json
{
  "productId": "uuid",
  "currentStock": 50
}
```

### GET `/inventory/stock-levels`
Get stock levels for all products.

**Query Parameters:**
- `threshold` (number): Low stock threshold (default: 10)

### GET `/inventory/low-stock`
Get products with low stock.

---

## 📈 Reports (`/reports`)

### GET `/reports/sales-summary`
Get sales summary.

**Query Parameters:**
- `dateFrom` (string): Start date
- `dateTo` (string): End date

**Response:**
```json
{
  "totalSales": 50000.00,
  "totalTransactions": 250,
  "averageTransaction": 200.00,
  "dateRange": {
    "from": "2024-01-01",
    "to": "2024-01-31"
  }
}
```

### GET `/reports/top-products`
Get top selling products.

**Query Parameters:**
- `limit` (number): Number of products (default: 10)
- `dateFrom` (string): Start date
- `dateTo` (string): End date

**Response:**
```json
[
  {
    "product": {
      "id": "uuid",
      "name": "Coca Cola 500ml",
      "barcode": "1000000001"
    },
    "quantity": 500,
    "revenue": 12500.00
  }
]
```

### GET `/reports/sales-by-hour`
Get sales breakdown by hour.

**Query Parameters:**
- `date` (string): Date (default: today)

**Response:**
```json
[
  {
    "hour": 0,
    "count": 0,
    "revenue": 0
  },
  {
    "hour": 9,
    "count": 5,
    "revenue": 250.00
  }
]
```

---

## 🔄 Sync (`/sync`) - Future

### POST `/sync/push`
Push local changes to server.

### POST `/sync/pull`
Pull server changes.

### GET `/sync/status`
Get sync status.

---

## Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Pagination

Paginated responses include metadata:

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 1000,
    "totalPages": 20
  }
}
```
