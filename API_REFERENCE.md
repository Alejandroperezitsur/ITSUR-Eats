# 🔌 API REFERENCE - ITSUR EATS

**Base URL**: `http://localhost:3000/api/v1`  
**Auth**: Bearer token en header `Authorization: Bearer <accessToken>`

---

## 📋 ENDPOINTS

### 🔐 AUTH ENDPOINTS

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "newuser@itsur.edu.mx",
  "password": "TestPassword123!",
  "name": "New User"
}

Response 201:
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "newuser@itsur.edu.mx",
      "name": "New User",
      "role": "STUDENT",
      "isActive": true,
      "createdAt": "2026-01-20T15:30:00Z"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "test@itsur.edu.mx",
  "password": "TestPassword123!"
}

Response 200:
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response 200:
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc..."
  }
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <accessToken>

Response 200:
{
  "success": true,
  "message": "Logged out"
}
```

#### Get Me
```http
GET /auth/me
Authorization: Bearer <accessToken>

Response 200:
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "test@itsur.edu.mx",
    "name": "Test User",
    "role": "STUDENT",
    "isActive": true,
    "lastLogin": "2026-01-20T15:30:00Z",
    "createdAt": "2026-01-15T10:00:00Z"
  }
}
```

---

### 🛍️ PRODUCT ENDPOINTS

#### Get Categories
```http
GET /products/categories

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "cat_1",
      "name": "Cafés",
      "description": "Coffee beverages",
      "icon": "☕",
      "displayOrder": 1
    },
    {
      "id": "cat_2",
      "name": "Desayunos",
      "icon": "🥐",
      "displayOrder": 2
    }
  ]
}
```

#### Get Products
```http
GET /products?page=1&limit=10&categoryId=cat_1&search=cappuccino

Response 200:
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "prod_1",
        "name": "Cappuccino",
        "description": "Italian espresso with steamed milk",
        "price": "3.50",
        "imageUrl": "https://...",
        "available": true,
        "stock": 50,
        "category": {
          "id": "cat_1",
          "name": "Cafés"
        },
        "createdAt": "2026-01-01T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 7,
      "pages": 1,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
}

Query Parameters:
- page: number (default: 1, min: 1)
- limit: number (default: 10, max: 100)
- categoryId: string (optional)
- search: string (optional, searches name + description)
```

#### Get Product by ID
```http
GET /products/:id

Response 200:
{
  "success": true,
  "data": {
    "id": "prod_1",
    "name": "Cappuccino",
    "description": "Italian espresso with steamed milk",
    "price": "3.50",
    "imageUrl": "https://...",
    "available": true,
    "stock": 50,
    "category": { ... },
    "createdAt": "2026-01-01T10:00:00Z"
  }
}
```

---

### 📦 ORDER ENDPOINTS

#### Create Order
```http
POST /orders
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "items": [
    {
      "productId": "prod_1",
      "quantity": 2
    },
    {
      "productId": "prod_3",
      "quantity": 1
    }
  ],
  "notes": "Extra sugar on cappuccino"
}

Response 201:
{
  "success": true,
  "data": {
    "id": "order_123",
    "userId": "user_456",
    "status": "PENDING",
    "total": "9.00",
    "items": [
      {
        "id": "item_1",
        "productId": "prod_1",
        "quantity": 2,
        "unitPrice": "3.50",
        "subtotal": "7.00",
        "product": { ... }
      },
      {
        "id": "item_2",
        "productId": "prod_3",
        "quantity": 1,
        "unitPrice": "2.00",
        "subtotal": "2.00",
        "product": { ... }
      }
    ],
    "notes": "Extra sugar on cappuccino",
    "createdAt": "2026-01-20T15:30:00Z"
  }
}

Note: Total is recalculated on backend!
```

#### Get My Orders
```http
GET /orders?page=1&limit=10
Authorization: Bearer <accessToken>

Response 200:
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "order_123",
        "userId": "user_456",
        "status": "PENDING",
        "total": "9.00",
        "items": [ ... ],
        "createdAt": "2026-01-20T15:30:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

#### Get Order by ID
```http
GET /orders/:id
Authorization: Bearer <accessToken>

Response 200:
{
  "success": true,
  "data": {
    "id": "order_123",
    "userId": "user_456",
    "status": "PENDING",
    "total": "9.00",
    "items": [ ... ],
    "acceptedBy": null,
    "acceptedAt": null,
    "readyAt": null,
    "createdAt": "2026-01-20T15:30:00Z",
    "updatedAt": "2026-01-20T15:30:00Z"
  }
}
```

#### Cancel Order
```http
PUT /orders/:id/cancel
Authorization: Bearer <accessToken>

Response 200:
{
  "success": true,
  "data": {
    "id": "order_123",
    "status": "CANCELLED",
    ...
  }
}

Can only cancel: PENDING or PAID orders
Can only cancel: Your own order
```

#### Accept Order (Staff Only)
```http
PUT /orders/:id/accept
Authorization: Bearer <staffToken>

Response 200:
{
  "success": true,
  "data": {
    "id": "order_123",
    "status": "ACCEPTED",
    "acceptedBy": {
      "id": "staff_user",
      "name": "Staff Member"
    },
    "acceptedAt": "2026-01-20T15:35:00Z",
    ...
  }
}

Requires: CAFETERIA_STAFF or ADMIN role
Order must be: PAID status
```

#### Mark Order Ready (Staff Only)
```http
PUT /orders/:id/ready
Authorization: Bearer <staffToken>

Response 200:
{
  "success": true,
  "data": {
    "id": "order_123",
    "status": "READY",
    "readyAt": "2026-01-20T15:40:00Z",
    ...
  }
}

Requires: CAFETERIA_STAFF or ADMIN role
Order must be: ACCEPTED status
Note: Triggers FCM push notification (future)
```

---

## 🛡️ ERROR RESPONSES

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email"
      }
    ]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "message": "Invalid or expired token"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "message": "Forbidden - insufficient permissions"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "message": "Order not found"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "message": "Internal server error"
  }
}
```

---

## 📋 VALIDATION RULES

### Email
- Must be valid email format
- Must be unique (per register)
- Example: `test@itsur.edu.mx`

### Password
- Minimum 8 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number
- Must contain special character (@$!%*?&)
- Example: `TestPassword123!`

### Product Quantity
- Minimum: 1
- Maximum: 999 (implied)

### Pagination
- Page: minimum 1
- Limit: minimum 1, maximum 100

---

## 🔑 AUTHENTICATION FLOW

```
1. User calls: POST /auth/register or POST /auth/login
   ↓
2. Server returns: { user, accessToken, refreshToken }
   ↓
3. Client stores: accessToken (in memory), refreshToken (storage)
   ↓
4. Client includes: Authorization: Bearer <accessToken> in every request
   ↓
5. If server returns 401:
   - Client calls: POST /auth/refresh with refreshToken
   - Server returns: { accessToken: new_token }
   - Client stores new accessToken
   - Client retries original request
   ↓
6. If refresh fails (refreshToken expired):
   - Client redirects to login page
   - User must login again
```

---

## 🧪 CURL EXAMPLES

### Register
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@itsur.edu.mx",
    "password": "TestPassword123!",
    "name": "New User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@itsur.edu.mx",
    "password": "TestPassword123!"
  }'
```

### Get Categories
```bash
curl -X GET http://localhost:3000/api/v1/products/categories
```

### Create Order
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "items": [
      {"productId": "prod_1", "quantity": 2}
    ]
  }'
```

---

## 📱 MOBILE CLIENT USAGE

### Axios Setup
```typescript
import apiClient from '@services/api';

// Register
const response = await apiClient.instance.post('/auth/register', {
  email, password, name
});

// Login
const response = await apiClient.instance.post('/auth/login', {
  email, password
});

// Get Products
const response = await apiClient.instance.get('/products', {
  params: { page: 1, limit: 10 }
});

// Create Order
const response = await apiClient.instance.post('/orders', {
  items: [{ productId, quantity }]
});
```

### Redux Usage
```typescript
// Dispatch actions
dispatch(registerUser({ email, password, name }));
dispatch(loginUser({ email, password }));
dispatch(logoutUser());
dispatch(fetchCategories());
dispatch(fetchProducts({ page, limit }));

// Use state
const { user, accessToken, isAuthenticated } = useAppSelector(s => s.auth);
const { products, categories, cart } = useAppSelector(s => s.products);
```

---

## 🔄 ORDER STATUS FLOW

```
PENDING (creado, esperando pago)
   ↓
PAID (pago completado, esperando staff)
   ↓
ACCEPTED (staff acepta la orden)
   ↓
READY (orden lista para recoger)
   ↓
COMPLETED (usuario recogió)

O en cualquier momento:
CANCELLED (usuario canceló)
```

---

## 🚀 HEALTH CHECK

```http
GET /health

Response 200:
{
  "status": "ok",
  "timestamp": "2026-01-20T15:30:00Z",
  "environment": "development",
  "version": "1.0.0"
}
```

---

**API Version**: 1.0  
**Base URL**: `http://localhost:3000/api/v1`  
**Updated**: 20 de enero de 2026
