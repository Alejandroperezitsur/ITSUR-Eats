# 🔗 INTEGRACIÓN: Backend + Mobile

**Fecha**: 20 de enero de 2026  
**Fases**: 1-2 / 5  
**Estado**: ✅ COMPLETAMENTE INTEGRADO

---

## 📊 Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                     ITSUR EATS SYSTEM                        │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                         CLIENT TIER (Phase 2)                             │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────────────────────┐                                      │
│  │   React Native + Expo            │                                      │
│  │   (Mobile App)                   │                                      │
│  ├─────────────────────────────────┤                                      │
│  │  Screens:                        │                                      │
│  │  ✅ LoginScreen                  │ → Auth                               │
│  │  ✅ MenuScreen                   │ → Browse & Add to Cart               │
│  │  ✅ CartScreen                   │ → Review & Checkout                  │
│  │  ✅ ProfileScreen                │ → User Account                       │
│  │                                 │                                      │
│  │  Redux Store:                    │                                      │
│  │  ✅ authSlice                    │ → isAuthenticated, user, tokens      │
│  │  ✅ productSlice                 │ → categories, products, cart         │
│  └─────────────────────────────────┘                                      │
│           ▼                                                                │
│  ┌─────────────────────────────────┐                                      │
│  │   API Client (Axios)             │                                      │
│  │   - Auto JWT injection           │                                      │
│  │   - Token refresh on 401         │                                      │
│  │   - Error handling               │                                      │
│  └─────────────────────────────────┘                                      │
└──────────────────────────────────────────────────────────────────────────┘
                        │
                        │ HTTP/REST
                        │ (Port 3000)
                        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                    APPLICATION TIER (Phase 1)                             │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────────────────────┐                                      │
│  │   Express.js API Server          │                                      │
│  │   (Backend)                      │                                      │
│  ├─────────────────────────────────┤                                      │
│  │                                 │                                      │
│  │  Auth Routes:                    │                                      │
│  │  POST /auth/register             │                                      │
│  │  POST /auth/login                │                                      │
│  │  GET  /auth/me                   │                                      │
│  │                                 │                                      │
│  │  Product Routes:                 │                                      │
│  │  GET  /products/categories       │                                      │
│  │  GET  /products                  │                                      │
│  │  GET  /products/:id              │                                      │
│  │                                 │                                      │
│  │  Order Routes:                   │                                      │
│  │  POST /orders                    │                                      │
│  │  GET  /orders                    │                                      │
│  │  GET  /orders/:id                │                                      │
│  │  PUT  /orders/:id/cancel         │                                      │
│  │  PUT  /orders/:id/accept         │ (Staff only)                         │
│  │  PUT  /orders/:id/ready          │ (Staff only)                         │
│  │                                 │                                      │
│  └─────────────────────────────────┘                                      │
│           ▼                                                                │
│  ┌─────────────────────────────────┐                                      │
│  │   Services Layer                 │                                      │
│  │  - AuthService                   │                                      │
│  │  - ProductService                │                                      │
│  │  - OrderService                  │                                      │
│  └─────────────────────────────────┘                                      │
│           ▼                                                                │
│  ┌─────────────────────────────────┐                                      │
│  │   Middleware Stack               │                                      │
│  │  - JWT Authentication            │                                      │
│  │  - RBAC Authorization            │                                      │
│  │  - Joi Validation                │                                      │
│  │  - Error Handling                │                                      │
│  └─────────────────────────────────┘                                      │
└──────────────────────────────────────────────────────────────────────────┘
                        │
                        │ SQL Queries
                        │
                        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      DATA TIER                                             │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────────────────────────┐                                      │
│  │   PostgreSQL 15                  │                                      │
│  │   (Database)                     │                                      │
│  ├─────────────────────────────────┤                                      │
│  │                                 │                                      │
│  │  Tables:                         │                                      │
│  │  ✅ users                        │                                      │
│  │  ✅ categories                   │                                      │
│  │  ✅ products                     │                                      │
│  │  ✅ orders                       │                                      │
│  │  ✅ order_items                  │                                      │
│  │  ✅ payments (future)            │                                      │
│  │  ✅ fcm_tokens (future)          │                                      │
│  │  ✅ audit_logs                   │                                      │
│  │                                 │                                      │
│  │  With indices on:                │                                      │
│  │  - users.email                   │                                      │
│  │  - orders.userId                 │                                      │
│  │  - orders.status                 │                                      │
│  │  - products.available            │                                      │
│  │                                 │                                      │
│  └─────────────────────────────────┘                                      │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujos de Integración

### 1. FLUJO DE AUTENTICACIÓN

```
┌─ MOBILE (React Native) ──────────────────────────────┐
│                                                      │
│  User enters email + password                        │
│  │                                                   │
│  ├─ TextInput validation                             │
│  │  └─ Check not empty                               │
│  │                                                   │
│  └─ Dispatch(loginUser thunk)                        │
│     │                                                │
│     └─ authService.login(email, password)            │
│        │                                             │
│        └─ API call: axios.post('/auth/login', {...}) │
│           │                                          │
└─────────────┼──────────────────────────────────────┘
              │
              │ HTTP POST
              │ /api/v1/auth/login
              │ { email, password }
              ▼
┌─ BACKEND (Express) ───────────────────────────────┐
│                                                    │
│  authRoutes: POST /login → authController.login    │
│  │                                                 │
│  ├─ validateBody(schemas.login)                   │
│  │  └─ Joi validation                              │
│  │                                                 │
│  └─ authController.login(req, res)                 │
│     │                                              │
│     └─ authService.login({ email, password })     │
│        │                                           │
│        ├─ Find user by email (DB)                  │
│        │  └─ SELECT * FROM users WHERE email=?    │
│        │                                           │
│        ├─ Verify password (bcrypt compare)         │
│        │  └─ comparePassword(plain, hashed)        │
│        │                                           │
│        ├─ Update lastLogin timestamp               │
│        │  └─ UPDATE users SET lastLogin=now()      │
│        │                                           │
│        └─ Generate tokens                          │
│           ├─ generateAccessToken() → 15 min        │
│           └─ generateRefreshToken() → 7 days       │
│              │                                      │
│              └─ Return: {                           │
│                  user: { id, email, name, role },  │
│                  accessToken: "eyJhbG...",         │
│                  refreshToken: "eyJhbG..."         │
│                }                                    │
│                                                    │
└────────────┬─────────────────────────────────────┘
             │
             │ HTTP 200
             │ response body (JSON)
             │
┌─────────────▼────────────────────────────────────┐
│ MOBILE (React Native)                            │
│                                                  │
│ Receive response                                 │
│ │                                                │
│ ├─ loginUser.fulfilled (Redux)                   │
│ │  ├─ state.auth.user = response.user            │
│ │  ├─ state.auth.accessToken = response.token    │
│ │  ├─ state.auth.isAuthenticated = true          │
│ │                                                │
│ ├─ authService saves to AsyncStorage             │
│ │  ├─ AsyncStorage.setItem('accessToken', ...)   │
│ │  ├─ AsyncStorage.setItem('refreshToken', ...)  │
│ │  └─ AsyncStorage.setItem('user', ...)          │
│ │                                                │
│ └─ Redux drives navigation                       │
│    └─ isAuthenticated=true → MainApp (tabs)      │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Claves**:
- ✅ Validación en ambos lados (client + server)
- ✅ Bcrypt verificación de password (nunca en plain text)
- ✅ JWT tokens con vidas diferentes (access: 15min, refresh: 7 días)
- ✅ AsyncStorage para persistencia entre restarts
- ✅ Navigation automática (Redux → Stack.Navigator)

---

### 2. FLUJO DE TOKEN REFRESH (401 Interceptor)

```
┌─ MOBILE (Axios Interceptor) ─────────────────────────┐
│                                                       │
│  Hacer request con accessToken expirado               │
│  │                                                    │
│  └─ Axios request interceptor                        │
│     ├─ Get accessToken from AsyncStorage             │
│     └─ Add: Authorization: Bearer <token>            │
│        │                                             │
└────────┼──────────────────────────────────────────┘
         │
         │ HTTP GET /products
         │ Header: Authorization: Bearer eyJ...
         │
┌────────▼──────────────────────────────────────────┐
│ BACKEND (Express)                                 │
│                                                   │
│ authenticateJWT middleware                        │
│ │                                                 │
│ └─ verifyAccessToken(token)                       │
│    └─ jwt.verify(token, JWT_SECRET)               │
│       └─ TokenExpiredError: token expired         │
│          │                                         │
│          └─ Return 401                            │
│                                                   │
│ HTTP 401 Unauthorized                             │
│ { success: false, error: "Token expired" }        │
│                                                   │
└────────┬──────────────────────────────────────────┘
         │
         │ HTTP 401 response
         │
┌────────▼──────────────────────────────────────────┐
│ MOBILE (Axios Response Interceptor)               │
│                                                   │
│  response.status === 401                          │
│  │                                                │
│  └─ Get refreshToken from AsyncStorage            │
│     ├─ Check if exists                            │
│     │  └─ If not → logout() and reject            │
│     │                                             │
│     └─ Attempt refresh                            │
│        │                                          │
└────────┼──────────────────────────────────────────┘
         │
         │ HTTP POST /auth/refresh
         │ { refreshToken: "eyJ..." }
         │
┌────────▼──────────────────────────────────────────┐
│ BACKEND (Express)                                 │
│                                                   │
│ authController.refresh(req, res)                  │
│ │                                                 │
│ ├─ Get refreshToken from body/cookies             │
│ │                                                 │
│ └─ verifyRefreshToken(refreshToken)               │
│    └─ jwt.verify(token, JWT_REFRESH_SECRET)       │
│       ├─ If valid:                                │
│       │  └─ generateAccessToken(payload)          │
│       │     └─ Return new accessToken (15 min)    │
│       │                                            │
│       └─ If invalid:                              │
│          └─ Return 401                            │
│                                                   │
│ HTTP 200 OK                                       │
│ { data: { accessToken: "eyJ..." } }               │
│                                                   │
└────────┬──────────────────────────────────────────┘
         │
         │ HTTP 200 response
         │
┌────────▼──────────────────────────────────────────┐
│ MOBILE (Axios Response Interceptor)               │
│                                                   │
│ Save new accessToken to AsyncStorage               │
│ │                                                  │
│ └─ AsyncStorage.setItem('accessToken', newToken)  │
│    │                                               │
│    └─ Retry original request (GET /products)      │
│       ├─ Add new accessToken to header             │
│       └─ Request succeeds (200 OK)                 │
│                                                    │
│ Return products to screen component               │
│                                                    │
└─────────────────────────────────────────────────┘
```

**Flujo transparente** para el usuario:
- ✅ Usuario no ve logout + login de nuevo
- ✅ Mismo request se reintenta automáticamente
- ✅ Si refresh falla → logout automático

---

### 3. FLUJO DE LISTAR PRODUCTOS

```
┌─ MOBILE (MenuScreen) ────────────────────┐
│                                          │
│  useEffect() on mount                    │
│  │                                       │
│  ├─ dispatch(fetchCategories())          │
│  │  └─ API: GET /products/categories     │
│  │                                       │
│  └─ dispatch(fetchProducts())            │
│     └─ API: GET /products?page=1&limit=10
│                                          │
│  Render:                                 │
│  ├─ Category pills (horizontal scroll)   │
│  └─ Product list (FlatList)              │
│     ├─ On category select:               │
│     │  └─ Fetch with categoryId filter   │
│     │                                    │
│     └─ On search:                        │
│        └─ Fetch with search keyword      │
│                                          │
└────────┬────────────────────────────────┘
         │
         │ HTTP GET /api/v1/products/categories
         │ HTTP GET /api/v1/products
         │
┌────────▼─────────────────────────────────┐
│ BACKEND (productController)              │
│                                          │
│ GET /products/categories                 │
│ → productService.getCategories()         │
│  └─ SELECT * FROM categories            │
│     ORDER BY displayOrder ASC            │
│                                          │
│ GET /products?search=cappuccino           │
│ → productService.getProducts({...})      │
│  └─ SELECT * FROM products              │
│     WHERE name ILIKE '%cappuccino%'       │
│     OR description ILIKE '%cappuccino%'   │
│     LIMIT 10 OFFSET 0                    │
│                                          │
│ Response:                                │
│ {                                        │
│   data: [                                │
│     {                                    │
│       id: "prod_1",                      │
│       name: "Cappuccino",                │
│       description: "...",                │
│       price: "3.50",                     │
│       imageUrl: "...",                   │
│       available: true,                   │
│       category: { ... }                  │
│     },                                   │
│     { ... }                              │
│   ],                                     │
│   pagination: {                          │
│     page: 1,                             │
│     limit: 10,                           │
│     total: 7,                            │
│     pages: 1,                            │
│     hasNextPage: false                   │
│   }                                      │
│ }                                        │
│                                          │
└────────┬────────────────────────────────┘
         │
         │ HTTP 200 OK
         │
┌────────▼─────────────────────────────────┐
│ MOBILE (Redux Thunk)                     │
│                                          │
│ fetchProducts.fulfilled                  │
│ │                                        │
│ └─ state.products.products = action.payload.data
│    state.products.loading = false        │
│                                          │
│ MenuScreen re-renders with products      │
│ │                                        │
│ └─ FlatList renders products             │
│    ├─ Each product displays:             │
│    │  ├─ Name                            │
│    │  ├─ Description                     │
│    │  ├─ Price                           │
│    │  └─ [+] Add button                  │
│    │                                     │
│    └─ User taps [+] button               │
│       └─ dispatch(addToCart({...}))      │
│          ├─ product added to cart        │
│          ├─ quantity = 1                 │
│          └─ total recalculated           │
│                                          │
└──────────────────────────────────────────┘
```

**Características**:
- ✅ Pagination built-in
- ✅ Search en backend (no en cliente)
- ✅ Category filtering
- ✅ Redux stores results (no refetch on same filter)
- ✅ Loading states (spinner durante fetch)

---

### 4. FLUJO DE CREAR ORDEN

```
┌─ MOBILE (CartScreen) ──────────────────────────────┐
│                                                    │
│  User taps "Proceed to Checkout"                   │
│  │                                                 │
│  ├─ Check if cart.items.length > 0                │
│  │  └─ If empty → Alert                           │
│  │                                                 │
│  └─ Prepare payload:                              │
│     {                                             │
│       items: [                                    │
│         { productId: "prod_1", quantity: 2 },     │
│         { productId: "prod_2", quantity: 1 }      │
│       ],                                          │
│       notes: "Extra sugar"                        │
│     }                                             │
│                                                   │
│  └─ API: POST /orders                             │
│                                                   │
└────────┬────────────────────────────────────────┘
         │
         │ HTTP POST /api/v1/orders
         │ Header: Authorization: Bearer <token>
         │ Body: { items: [...], notes: "..." }
         │
┌────────▼─────────────────────────────────────────┐
│ BACKEND (orderController)                         │
│                                                  │
│ POST /orders                                     │
│ ├─ Middleware: authenticateJWT                  │
│ │  └─ req.user.userId ← JWT payload             │
│ │                                               │
│ ├─ Middleware: validateBody(schemas.createOrder) │
│ │  └─ items array validation                    │
│ │     └─ Each item has productId + quantity    │
│ │                                               │
│ └─ orderController.createOrder(req, res)        │
│    │                                            │
│    └─ orderService.createOrder(userId, data)   │
│       │                                         │
│       ├─ Validate items not empty               │
│       │  └─ items.length > 0                    │
│       │                                         │
│       ├─ Fetch ALL products from DB             │
│       │  └─ SELECT * FROM products WHERE id IN (...) │
│       │                                         │
│       ├─ Verify ALL products exist              │
│       │  └─ products.length === productIds.length   │
│       │                                         │
│       ├─ 🔴 CRITICAL: Recalculate total on backend │
│       │  ├─ Loop through items                  │
│       │  ├─ For each: totalPrice = product.price × qty │
│       │  └─ sum all totals                      │
│       │  └─ NEVER trust client calculation      │
│       │                                         │
│       └─ Create order atomically (transaction)  │
│          ├─ INSERT INTO orders(...)             │
│          │  └─ status: PENDING                  │
│          │  └─ total: computed                  │
│          │                                      │
│          └─ INSERT INTO order_items(...)        │
│             └─ For each item: productId, qty, unitPrice │
│                                                 │
│       └─ Log to audit_logs table                │
│          └─ action: CREATE, entity: Order       │
│                                                 │
│ Response 201 Created:                           │
│ {                                               │
│   data: {                                       │
│     id: "order_123",                            │
│     userId: "user_456",                         │
│     status: "PENDING",                          │
│     total: "7.00",                              │
│     items: [                                    │
│       {                                         │
│         id: "item_1",                           │
│         productId: "prod_1",                    │
│         quantity: 2,                            │
│         unitPrice: "3.50",                      │
│         subtotal: "7.00"                        │
│       }                                         │
│     ],                                          │
│     createdAt: "2026-01-20T15:30:00Z"           │
│   }                                             │
│ }                                               │
│                                                 │
└────────┬──────────────────────────────────────┘
         │
         │ HTTP 201 Created
         │
┌────────▼──────────────────────────────────────┐
│ MOBILE (Redux thunk)                           │
│                                                │
│ Receive order response                         │
│ │                                              │
│ ├─ Alert.alert("Order Placed", "...")         │
│ │                                              │
│ ├─ dispatch(clearCart())                      │
│ │  └─ Redux: cart.items = []                  │
│ │  └─ Redux: cart.total = 0                   │
│ │                                              │
│ ├─ Store order in local state (future)        │
│ │                                              │
│ └─ Navigate to ProfileScreen or refresh       │
│    └─ Next phase: Payment UI                  │
│                                                │
└──────────────────────────────────────────────┘
```

**Seguridad crítica**:
- ✅ Backend NUNCA confía en precio del cliente
- ✅ Backend recalcula total desde BD
- ✅ Previene fraude de manipulación de precios
- ✅ Transactional integrity (todo o nada)

---

## 🗄️ Flujos de Datos en Base de Datos

### Tabla: `users`

```sql
CREATE TABLE users (
  id CUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL (HASHED),
  name VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'STUDENT', -- STUDENT | CAFETERIA_STAFF | ADMIN
  avatar VARCHAR NULL,
  isActive BOOLEAN DEFAULT true,
  lastLogin TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP,
  INDEX ON email,
  INDEX ON role
);
```

**Ejemplos de registro**:
```
id          | email                | password (bcrypt)           | name      | role
user_1      | test@itsur.edu.mx    | $2b$10$sZWEa2T...          | Test User | STUDENT
user_2      | staff@itsur.edu.mx   | $2b$10$jXkF9D3...          | Staff     | CAFETERIA_STAFF
user_3      | admin@itsur.edu.mx   | $2b$10$mOkL5K2...          | Admin     | ADMIN
```

---

### Tabla: `products`

```sql
CREATE TABLE products (
  id CUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  imageUrl VARCHAR,
  stock INT DEFAULT 0,
  available BOOLEAN DEFAULT true,
  categoryId CUID FOREIGN KEY REFERENCES categories(id),
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP,
  INDEX ON available,
  INDEX ON categoryId
);
```

**Ejemplos**:
```
id      | name          | price  | available | categoryId | stock
prod_1  | Cappuccino    | 3.50   | true      | cat_1      | 50
prod_2  | Americano     | 2.50   | true      | cat_1      | 75
prod_3  | Croissant     | 2.00   | true      | cat_2      | 30
prod_4  | Banana Bread  | 3.00   | true      | cat_2      | 20
prod_5  | Cheesecake    | 4.50   | true      | cat_3      | 15
```

---

### Tabla: `orders` + `order_items`

```sql
CREATE TABLE orders (
  id CUID PRIMARY KEY,
  userId CUID FOREIGN KEY REFERENCES users(id),
  status VARCHAR DEFAULT 'PENDING', -- PENDING | PAID | ACCEPTED | READY | COMPLETED | CANCELLED
  total DECIMAL(10,2) NOT NULL,
  notes TEXT,
  acceptedById CUID REFERENCES users(id) NULL,
  acceptedAt TIMESTAMP NULL,
  readyAt TIMESTAMP NULL,
  completedAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP,
  INDEX ON userId,
  INDEX ON status,
  INDEX ON createdAt
);

CREATE TABLE order_items (
  id CUID PRIMARY KEY,
  orderId CUID FOREIGN KEY REFERENCES orders(id) ON DELETE CASCADE,
  productId CUID FOREIGN KEY REFERENCES products(id),
  quantity INT NOT NULL,
  unitPrice DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  createdAt TIMESTAMP,
  INDEX ON orderId,
  INDEX ON productId
);
```

**Ejemplo de orden**:
```
-- orders
id        | userId  | status   | total | acceptedById | createdAt
order_1   | user_1  | PENDING  | 7.00  | NULL        | 2026-01-20 15:30:00

-- order_items para order_1
id      | orderId | productId | quantity | unitPrice | subtotal
item_1  | order_1 | prod_1    | 2        | 3.50      | 7.00

-- Query para obtener orden completa:
SELECT 
  o.id, o.userId, o.status, o.total,
  i.productId, i.quantity, i.unitPrice, i.subtotal,
  p.name, p.imageUrl, p.description
FROM orders o
LEFT JOIN order_items i ON o.id = i.orderId
LEFT JOIN products p ON i.productId = p.id
WHERE o.id = 'order_1';

-- Resultado:
id      | userId  | status   | total | productId | quantity | name          | unitPrice | subtotal
order_1 | user_1  | PENDING  | 7.00  | prod_1    | 2        | Cappuccino    | 3.50      | 7.00
```

---

## 🔐 Seguridad: End-to-End

### 1. Contraseña del Usuario

```
CLIENTE (React Native)
├─ User enters: "MyPassword123!"
└─ Send to API (HTTPS only)
   
BACKEND
├─ Receive plaintext (HTTPS ensures encryption in transit)
├─ Hash con bcrypt(password, salt=10)
│  └─ Cost: 2^10 = 1024 rounds (~100ms to hash)
│  └─ Result: $2b$10$sZWEa2T...
└─ Store ONLY hash in database

DATABASE
└─ users.password = "$2b$10$sZWEa2T..."
   (Original password NEVER stored)

LOGIN VERIFICATION
├─ User enters: "MyPassword123!"
└─ Backend: bcrypt.compare(plaintext, hash)
   ├─ If match: JWT tokens generated
   └─ If no match: "Invalid password" error
```

### 2. JWT Tokens

```
ACCESS TOKEN (Corta vida: 15 minutos)
├─ Payload: { userId, email, role }
├─ Signed con: JWT_SECRET
├─ Expiry: 15 min (usado en cada request)
└─ Stored: Mobile app variable (memory)

REFRESH TOKEN (Larga vida: 7 días)
├─ Payload: { userId, email, role }
├─ Signed con: JWT_REFRESH_SECRET (diferente)
├─ Expiry: 7 días (rotated en login)
└─ Stored: AsyncStorage (persistent)

FLOW
├─ Client includes: Authorization: Bearer <accessToken>
├─ Backend verifies signature + expiry
├─ If expired: Client uses refreshToken to get new accessToken
└─ If refreshToken also expired: Logout requerido
```

### 3. Password Requirements

```
✅ Mínimo 8 caracteres
✅ Contiene mayúscula (A-Z)
✅ Contiene minúscula (a-z)
✅ Contiene número (0-9)
✅ Contiene caracter especial (@$!%*?&)

REGEX: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$

Ejemplos válidos:
✅ TestPassword123!
✅ SecurePass@1234

Ejemplos inválidos:
❌ password123 (sin mayúscula, sin especial)
❌ TESTPASS123 (sin minúscula)
❌ Test@1 (menos de 8 caracteres)
```

### 4. RBAC (Role-Based Access Control)

```
ROUTES PÚBLICOS
GET /products/categories
GET /products
GET /products/:id

ROUTES AUTENTICADAS (cualquier usuario logeado)
POST /auth/register
POST /auth/login
GET /auth/me
POST /orders (crear orden personal)
GET /orders (listar propias órdenes)

ROUTES STAFF ONLY
PUT /orders/:id/accept (aceptar orden)
PUT /orders/:id/ready (marcar como listo)

ROUTES ADMIN ONLY
(Futuro: DELETE /products, POST /staff/approve, etc)

MIDDLEWARE CHAIN
1. authenticateJWT (verifica JWT válido, token no expirado)
2. authorize(CAFETERIA_STAFF) (verifica req.user.role)
3. Si falla: return 403 Forbidden
```

---

## 🚀 Flujo Completo de Demo

### Escenario: Estudiante pide café

```
PASO 1: Login
├─ Abrir app → LoginScreen
├─ Ingresar: test@itsur.edu.mx / TestPassword123!
├─ POST /auth/login
├─ Recibe: accessToken + user
├─ Redux: isAuthenticated = true
└─ Navega a: MenuScreen (tab navigation)

PASO 2: Navegar Menu
├─ MenuScreen carga (useEffect)
├─ GET /products/categories
│  └─ Redux: categories = [Cafés, Desayunos, Postres]
├─ GET /products?page=1&limit=10
│  └─ Redux: products = [Cappuccino, Americano, ...]
├─ Ver listado de categorías
└─ Ver listado de productos

PASO 3: Buscar Producto
├─ Usuario digita: "cappuccino"
├─ GET /products?search=cappuccino
├─ Backend busca en name + description
└─ Filtro muestra: Cappuccino ($3.50)

PASO 4: Agregar al Carrito
├─ Usuario toca [+] en Cappuccino
├─ Redux action: addToCart({ product, quantity: 1 })
├─ cart.items = [{ product: Cappuccino, quantity: 1 }]
├─ cart.total = 3.50
├─ Badge en CartScreen tab muestra: 1 item
└─ Toast: "Added to cart"

PASO 5: Agregar otro producto
├─ Filtrar por categoría "Desayunos"
├─ GET /products?categoryId=cat_2
├─ Ve: Croissant ($2.00), Banana Bread ($3.00)
├─ Toca [+] Croissant
├─ cart.items = [
│    { product: Cappuccino, quantity: 1 },
│    { product: Croissant, quantity: 1 }
│  ]
├─ cart.total = 5.50
└─ Badge CartScreen: 2 items

PASO 6: Ver Carrito
├─ Toca CartScreen tab
├─ Ver items:
│  Cappuccino          $3.50
│  [−] 1 [+]          $3.50
│  Croissant           $2.00
│  [−] 1 [+]          $2.00
│  ─────────────────────────
│  Total:              $5.50
│
├─ [Proceed to Checkout]
└─ [Clear Cart] [X]

PASO 7: Cambiar cantidad
├─ Toca [+] en Cappuccino
├─ Redux: updateCartQuantity({productId, quantity: 2})
├─ cart.total = 3.50*2 + 2.00 = 9.00
└─ Total se actualiza en pantalla

PASO 8: Checkout
├─ Toca [Proceed to Checkout]
├─ Prepare payload:
│  {
│    items: [
│      { productId: prod_1, quantity: 2 },
│      { productId: prod_3, quantity: 1 }
│    ]
│  }
├─ POST /orders
├─ Backend recalcula total: 7.00 + 2.00 = 9.00 ✅
├─ INSERT INTO orders (status: PENDING)
├─ INSERT INTO order_items (2 rows)
├─ Response: order { id, status: PENDING, total: 9.00 }
├─ Alert: "Order placed! Order #order_123"
├─ Redux: clearCart()
│  └─ cart.items = [], cart.total = 0
└─ CartScreen muestra: "Your cart is empty"

PASO 9: Ver Perfil
├─ Toca ProfileScreen tab
├─ Muestra: Test User, test@itsur.edu.mx, STUDENT
├─ Badges: [Edit Profile] [Change Password] [Logout]
└─ Avatar con inicial: T

PASO 10: Logout
├─ Toca [Logout]
├─ Alert: "¿Estás seguro?"
├─ POST /auth/logout
├─ AsyncStorage.removeItem('accessToken')
├─ Redux: isAuthenticated = false
├─ Navega a: LoginScreen (stack navigation)
└─ App ready para siguiente usuario

TIEMPO TOTAL: ~2 minutos
```

---

## 📈 Estadísticas Finales

| Componente | Líneas | Archivos | Tests |
|-----------|--------|----------|-------|
| Backend | 2,500 | 24 | Jest configured |
| Mobile | 1,800 | 17 | Ready for Detox |
| **TOTAL** | **4,300+** | **41** | **Ready** |

---

## ✅ Checklist de Integración

### Autenticación
- ✅ JWT access + refresh tokens
- ✅ Token persistence (AsyncStorage)
- ✅ Auto-refresh en 401
- ✅ Logout clears everything
- ✅ Protected routes

### Data Flow
- ✅ Redux state management
- ✅ API client con interceptors
- ✅ Error handling (client + server)
- ✅ Loading states
- ✅ Validation (client + server)

### Seguridad
- ✅ Bcrypt password hashing
- ✅ RBAC middleware
- ✅ JWT signing + verification
- ✅ Backend total recalculation
- ✅ Audit logging

### Funcionalidades
- ✅ Register / Login / Logout
- ✅ Browse categories + products
- ✅ Search + pagination
- ✅ Add to cart
- ✅ Manage cart (qty, remove, clear)
- ✅ Place order
- ✅ View profile

---

**Documento generado**: 20 de enero de 2026  
**Fases completadas**: 1-2 / 5  
**Estado**: ✅ COMPLETAMENTE INTEGRADO

**Próxima fase**: Admin Panel (React + Vite) ⏭️
