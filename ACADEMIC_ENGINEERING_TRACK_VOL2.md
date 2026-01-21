# 🎓 ITSUR Eats — Academic Engineering Track
## VOLUMEN 2: Bases de Datos, API y Seguridad

---

## PARTE 4: BASE DE DATOS ACADÉMICA PROFESIONAL

### Diagrama ER (Entity-Relationship)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ITSUR EATS DATABASE                          │
│                    Versión Académica v1                         │
└─────────────────────────────────────────────────────────────────┘

                              ┌──────────┐
                              │  users   │
                              │(Estudiantes + Staff)
                              ├──────────┤
                              │ id (PK)  │◄───────┐
                              │ email    │        │
                              │ password │        │
                              │ name     │        │
                              │ role_id  │        │
                              │ created  │        │
                              └────┬─────┘        │
                                   │              │
                    ┌──────────────┼──────────────┤
                    │              │              │
                    ▼              ▼              ▼
              ┌─────────┐   ┌─────────┐   ┌──────────┐
              │  roles  │   │ products│   │ fcm_token│
              ├─────────┤   ├─────────┤   ├──────────┤
              │ id (PK) │   │ id (PK) │   │ id (PK)  │
              │ name    │   │ name    │   │ user_id  │◄─ (FK users.id)
              │ desc    │   │ price   │   │ token    │
              └─────────┘   │ stock   │   │ platform │
                            │ cat_id  │   │ active   │
                            └────┬────┘   └──────────┘
                                 │
                                 ▼
                            ┌──────────┐
                            │categories│
                            ├──────────┤
                            │ id (PK)  │
                            │ name     │
                            │ icon     │
                            └──────────┘

                    ┌──────────────────────────────┐
                    │         orders               │
                    ├──────────────────────────────┤
                    │ id (PK)                      │
                    │ user_id (FK users.id)◄──┐   │
                    │ status                   │   │
                    │ total                    │   │
                    │ created_at               │   │
                    │ accepted_by (FK users.id)◄┐ │
                    │ ready_at                 │ │ │
                    │ completed_at             │ │ │
                    └────┬──────────────────────┼─┘
                         │                      │
                         ▼                      │
                  ┌───────────────┐             │
                  │ order_items   │             │
                  ├───────────────┤             │
                  │ id (PK)       │             │
                  │ order_id (FK) │◄────┐       │
                  │ product_id(FK)│     │       │
                  │ quantity      │     │       │
                  │ unit_price    │     │       │
                  │ subtotal      │     │       │
                  └───────────────┘     │       │
                                        │       │
                  ┌──────────────────────┼───────┘
                  │                      │
                  ▼                      ▼
           ┌──────────────┐       ┌──────────────┐
           │ payments     │       │ audit_logs   │
           ├──────────────┤       ├──────────────┤
           │ id (PK)      │       │ id (PK)      │
           │ order_id (FK)│       │ entity_type  │
           │ amount       │       │ entity_id    │
           │ stripe_id    │       │ action       │
           │ status       │       │ user_id (FK) │
           │ created_at   │       │ changes      │
           │ updated_at   │       │ created_at   │
           └──────────────┘       └──────────────┘
```

### Schema SQL Completo (Prisma)

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ════════════════════════════════════════════════════════
// MODELO: Role (Roles y permisos)
// ════════════════════════════════════════════════════════

enum RoleType {
  STUDENT
  CAFETERIA_STAFF
  ADMIN
}

model Role {
  id          String   @id @default(cuid())
  name        RoleType @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  users User[]

  @@map("roles")
}

// ════════════════════════════════════════════════════════
// MODELO: User (Usuarios del sistema)
// ════════════════════════════════════════════════════════

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String   // Hasheado con bcrypt
  name          String
  role          Role     @relation(fields: [roleId], references: [id])
  roleId        String
  isActive      Boolean  @default(true)
  lastLogin     DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relaciones
  ordersCreated Order[]       @relation("OrderCreator")
  ordersAccepted Order[]      @relation("OrderAcceptor")
  fcmTokens     FcmToken[]
  auditLogs     AuditLog[]    @relation("AuditUser")

  @@index([email])
  @@index([roleId])
  @@map("users")
}

// ════════════════════════════════════════════════════════
// MODELO: Category (Categorías de productos)
// ════════════════════════════════════════════════════════

model Category {
  id          String   @id @default(cuid())
  name        String   @unique // "Cafés", "Desayunos", etc
  icon        String?  // URL o emoji
  description String?
  displayOrder Int     @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  products Product[]

  @@index([displayOrder])
  @@map("categories")
}

// ════════════════════════════════════════════════════════
// MODELO: Product (Ítems de menú)
// ════════════════════════════════════════════════════════

model Product {
  id          String   @id @default(cuid())
  name        String   // "Café Americano"
  description String?
  price       Decimal  @db.Decimal(10, 2)
  imageUrl    String?
  stock       Int      @default(999)  // Para control simple
  available   Boolean  @default(true)
  category    Category @relation(fields: [categoryId], references: [id])
  categoryId  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  orderItems OrderItem[]

  @@index([categoryId])
  @@index([available])
  @@map("products")
}

// ════════════════════════════════════════════════════════
// MODELO: Order (Pedidos)
// ════════════════════════════════════════════════════════

enum OrderStatus {
  PENDING       // Esperando pago
  PAID          // Pagado, en cola
  ACCEPTED      // Cafetería aceptó
  READY         // Listo para retirar
  COMPLETED     // Completado
  CANCELLED     // Cancelado
}

model Order {
  id              String      @id @default(cuid())
  user            User        @relation("OrderCreator", fields: [userId], references: [id])
  userId          String
  status          OrderStatus @default(PENDING)
  total           Decimal     @db.Decimal(10, 2)
  notes           String?
  
  // Quién aceptó
  acceptedBy      User?       @relation("OrderAcceptor", fields: [acceptedById], references: [id])
  acceptedById    String?
  acceptedAt      DateTime?

  // Timestamps
  readyAt         DateTime?
  completedAt     DateTime?
  cancelledAt     DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  // Relaciones
  items           OrderItem[]
  payments        Payment[]
  auditLogs       AuditLog[]  @relation("AuditOrder")

  @@index([userId])
  @@index([status])
  @@index([acceptedById])
  @@index([createdAt])
  @@map("orders")
}

// ════════════════════════════════════════════════════════
// MODELO: OrderItem (Items dentro de un pedido)
// ════════════════════════════════════════════════════════

model OrderItem {
  id          String   @id @default(cuid())
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId     String
  product     Product  @relation(fields: [productId], references: [id])
  productId   String
  quantity    Int      @default(1)
  unitPrice   Decimal  @db.Decimal(10, 2)
  subtotal    Decimal  @db.Decimal(10, 2) // quantity * unitPrice
  createdAt   DateTime @default(now())

  @@index([orderId])
  @@index([productId])
  @@map("order_items")
}

// ════════════════════════════════════════════════════════
// MODELO: Payment (Transacciones de pago)
// ════════════════════════════════════════════════════════

enum PaymentStatus {
  PENDING      // Esperando confirmación Stripe
  SUCCEEDED    // Pago procesado
  FAILED       // Rechazado
  CANCELLED    // Cancelado por usuario
}

enum PaymentMethod {
  CARD         // Tarjeta crédito/débito
  WALLET       // Billetera digital
}

model Payment {
  id            String        @id @default(cuid())
  order         Order         @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId       String        @unique
  amount        Decimal       @db.Decimal(10, 2)
  method        PaymentMethod @default(CARD)
  status        PaymentStatus @default(PENDING)
  
  // Datos Stripe (si aplica)
  stripeIntentId String?      @unique
  stripeChargeId String?
  
  // Error si falla
  errorMessage  String?
  
  // Timestamps
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  succeededAt   DateTime?

  @@index([orderId])
  @@index([status])
  @@map("payments")
}

// ════════════════════════════════════════════════════════
// MODELO: FcmToken (Tokens para notificaciones push)
// ════════════════════════════════════════════════════════

enum Platform {
  IOS
  ANDROID
}

model FcmToken {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  token     String   @unique // Token de Firebase
  platform  Platform
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([active])
  @@map("fcm_tokens")
}

// ════════════════════════════════════════════════════════
// MODELO: AuditLog (Auditoría de acciones)
// ════════════════════════════════════════════════════════

enum AuditAction {
  CREATE
  UPDATE
  DELETE
  LOGIN
  PAYMENT_ATTEMPTED
  PAYMENT_SUCCESS
  ORDER_ACCEPTED
  ORDER_READY
  ORDER_CANCELLED
}

model AuditLog {
  id           String      @id @default(cuid())
  action       AuditAction
  entityType   String      // "Order", "Payment", "User", etc
  entityId     String      // ID de la entidad modificada
  user         User?       @relation("AuditUser", fields: [userId], references: [id])
  userId       String?
  order        Order?      @relation("AuditOrder", fields: [orderId], references: [id], onDelete: SetNull)
  orderId      String?
  
  // Cambios (JSON para flexibilidad)
  changes      Json?       // {field: oldValue, field: newValue}
  ipAddress    String?
  userAgent    String?
  
  createdAt    DateTime    @default(now())

  @@index([action])
  @@index([entityType])
  @@index([userId])
  @@index([createdAt])
  @@map("audit_logs")
}
```

### Índices (Performance)

```sql
-- Estos se crean automáticamente por Prisma @index

-- Búsquedas frecuentes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Autenticación
CREATE INDEX idx_users_email ON users(email);

-- Menú
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_available ON products(available);

-- Auditoría
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- Real-time queries
CREATE INDEX idx_orders_accepted_by ON orders(accepted_by_id);
```

### Triggers para Auditoría Automática

```sql
-- Trigger: Actualizar 'updated_at' automáticamente

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Log order status changes automáticamente

CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO audit_logs (
            action, entity_type, entity_id, order_id, changes, created_at
        ) VALUES (
            CASE 
                WHEN NEW.status = 'ACCEPTED' THEN 'ORDER_ACCEPTED'::audit_action
                WHEN NEW.status = 'READY' THEN 'ORDER_READY'::audit_action
                WHEN NEW.status = 'COMPLETED' THEN 'ORDER_COMPLETED'::audit_action
                WHEN NEW.status = 'CANCELLED' THEN 'ORDER_CANCELLED'::audit_action
                ELSE 'UPDATE'::audit_action
            END,
            'Order',
            NEW.id,
            NEW.id,
            jsonb_build_object('status', OLD.status, 'new_status', NEW.status),
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_order_status_change
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION log_order_status_change();
```

### Defensa Académica de la BD

```
Preguntas que el profesor puede hacer:

P1: "¿Por qué usas roles separados?"
R: Normalización de datos (3NF). Evita duplicación
   y facilita agregar permisos en el futuro.

P2: "¿Por qué OrderItem es tabla separada?"
R: Normalización. Un Order tiene múltiples items.
   Relación 1:N entre Orders e OrderItems.

P3: "¿Cómo garantizas integridad referencial?"
R: Foreign keys (ON DELETE SET NULL/CASCADE).
   Prisma y PostgreSQL validan automáticamente.

P4: "¿Cómo auditas cambios?"
R: Tabla audit_logs con triggers automáticos.
   Cada cambio en orden registra acción, usuario, timestamp.

P5: "¿Qué pasa si alguien intenta hackear precios?"
R: application layer valida:
   - Producto debe existir en BD
   - Precio recalculado en backend (no confiar en cliente)
   - Payment procesado solo si monto == total recalculado

P6: "¿Performance: cómo manejas 5K usuarios?"
R: - Índices en columnas frecuentemente consultadas
   - Lazy loading en relaciones
   - Paginación en listas (limit/offset)
   - Redis caching en v2

P7: "¿Y si PostgreSQL falla?"
R: - Backups automáticos diarios (AWS RDS)
   - Transacciones ACID garantizan consistencia
   - En v2: read replicas + failover automático
```

---

## PARTE 5: API REST COMPLETA (ENDPOINTS REALES)

### Especificación Swagger/OpenAPI

```yaml
openapi: 3.0.0
info:
  title: ITSUR Eats API
  description: Backend para plataforma de pedidos de comida
  version: 1.0.0
  contact:
    name: ITSUR Development Team

servers:
  - url: https://api.itsureats.com
    description: Production
  - url: http://localhost:3000
    description: Development

tags:
  - name: Authentication
    description: Login, register, token refresh
  - name: Products
    description: Menu items
  - name: Orders
    description: Order management
  - name: Payments
    description: Payment processing
  - name: Admin
    description: Admin operations

components:
  schemas:
    # ════════════════════════════════════════════
    # SCHEMAS
    # ════════════════════════════════════════════

    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        name:
          type: string
        role:
          type: string
          enum: [STUDENT, CAFETERIA_STAFF, ADMIN]
        createdAt:
          type: string
          format: date-time

    Product:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        description:
          type: string
        price:
          type: number
          format: decimal
        imageUrl:
          type: string
          format: uri
        stock:
          type: integer
        available:
          type: boolean
        category:
          $ref: '#/components/schemas/Category'

    Category:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        icon:
          type: string

    Order:
      type: object
      properties:
        id:
          type: string
          format: uuid
        userId:
          type: string
          format: uuid
        status:
          type: string
          enum: [PENDING, PAID, ACCEPTED, READY, COMPLETED, CANCELLED]
        total:
          type: number
          format: decimal
        items:
          type: array
          items:
            $ref: '#/components/schemas/OrderItem'
        payment:
          $ref: '#/components/schemas/Payment'
        createdAt:
          type: string
          format: date-time
        acceptedAt:
          type: string
          format: date-time
        readyAt:
          type: string
          format: date-time

    OrderItem:
      type: object
      properties:
        id:
          type: string
          format: uuid
        product:
          $ref: '#/components/schemas/Product'
        quantity:
          type: integer
          minimum: 1
        unitPrice:
          type: number
          format: decimal
        subtotal:
          type: number
          format: decimal

    Payment:
      type: object
      properties:
        id:
          type: string
          format: uuid
        orderId:
          type: string
          format: uuid
        amount:
          type: number
          format: decimal
        status:
          type: string
          enum: [PENDING, SUCCEEDED, FAILED, CANCELLED]
        method:
          type: string
          enum: [CARD, WALLET]
        createdAt:
          type: string
          format: date-time
        succeededAt:
          type: string
          format: date-time

    Error:
      type: object
      properties:
        error:
          type: string
        message:
          type: string
        statusCode:
          type: integer
        timestamp:
          type: string
          format: date-time

  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: "JWT Access Token (15 min expiry)"

paths:
  # ════════════════════════════════════════════
  # AUTHENTICATION
  # ════════════════════════════════════════════

  /auth/register:
    post:
      tags: [Authentication]
      summary: Register new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  minLength: 8
                  pattern: '^(?=.*[A-Z])(?=.*[0-9])' # 1 mayús, 1 número
                name:
                  type: string
                  minLength: 2
              required: [email, password, name]
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  accessToken:
                    type: string
                  expiresIn:
                    type: integer
                    description: Seconds (900 = 15 min)
                  user:
                    $ref: '#/components/schemas/User'
        '400':
          description: Invalid input (email exists, weak password, etc)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '500':
          description: Server error

  /auth/login:
    post:
      tags: [Authentication]
      summary: Login user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
              required: [email, password]
      responses:
        '200':
          description: Login successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  accessToken:
                    type: string
                  expiresIn:
                    type: integer
                  user:
                    $ref: '#/components/schemas/User'
          headers:
            Set-Cookie:
              schema:
                type: string
                example: "refreshToken=abc123; Path=/; HttpOnly; SameSite=Strict"
        '401':
          description: Invalid credentials
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/refresh:
    post:
      tags: [Authentication]
      summary: Refresh access token
      description: "Uses refreshToken from httpOnly cookie"
      responses:
        '200':
          description: New token generated
          content:
            application/json:
              schema:
                type: object
                properties:
                  accessToken:
                    type: string
                  expiresIn:
                    type: integer
        '401':
          description: Refresh token invalid or expired
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  # ════════════════════════════════════════════
  # PRODUCTS (MENU)
  # ════════════════════════════════════════════

  /products:
    get:
      tags: [Products]
      summary: Get all products (menu)
      parameters:
        - name: category
          in: query
          schema:
            type: string
            description: "Filter by category ID (optional)"
        - name: search
          in: query
          schema:
            type: string
            description: "Search by name or description"
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
      responses:
        '200':
          description: List of products
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Product'
                  total:
                    type: integer
                  limit:
                    type: integer
                  offset:
                    type: integer

  /products/{id}:
    get:
      tags: [Products]
      summary: Get product by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Product details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '404':
          description: Product not found

  /categories:
    get:
      tags: [Products]
      summary: Get all product categories
      responses:
        '200':
          description: List of categories
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Category'

  # ════════════════════════════════════════════
  # ORDERS
  # ════════════════════════════════════════════

  /orders:
    post:
      tags: [Orders]
      summary: Create new order
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                items:
                  type: array
                  items:
                    type: object
                    properties:
                      productId:
                        type: string
                      quantity:
                        type: integer
                        minimum: 1
                  minItems: 1
                notes:
                  type: string
                  maxLength: 500
              required: [items]
      responses:
        '201':
          description: Order created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '400':
          description: Invalid items or quantity
        '401':
          description: Unauthorized

    get:
      tags: [Orders]
      summary: Get user's orders
      security:
        - BearerAuth: []
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [PENDING, PAID, ACCEPTED, READY, COMPLETED, CANCELLED]
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
      responses:
        '200':
          description: List of user's orders
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Order'
                  total:
                    type: integer

  /orders/{id}:
    get:
      tags: [Orders]
      summary: Get order details
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Order details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '404':
          description: Order not found
        '403':
          description: Forbidden (not owner)

  /orders/{id}/cancel:
    put:
      tags: [Orders]
      summary: Cancel order (only if PENDING or PAID)
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Order cancelled
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '400':
          description: Cannot cancel order in this status

  /orders/{id}/accept:
    put:
      tags: [Orders]
      summary: Cafetería accepts order
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Order accepted
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '403':
          description: Only CAFETERIA_STAFF can accept

  /orders/{id}/ready:
    put:
      tags: [Orders]
      summary: Mark order as ready
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Order marked ready
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'

  # ════════════════════════════════════════════
  # PAYMENTS
  # ════════════════════════════════════════════

  /payments/intent:
    post:
      tags: [Payments]
      summary: Create Stripe PaymentIntent
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                orderId:
                  type: string
      responses:
        '201':
          description: PaymentIntent created
          content:
            application/json:
              schema:
                type: object
                properties:
                  clientSecret:
                    type: string
                  amount:
                    type: number
                  currency:
                    type: string
                    enum: [MXN, USD]

  /payments/webhook:
    post:
      tags: [Payments]
      summary: Stripe webhook callback (no auth)
      description: "Stripe posts to this URL on payment events"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
      responses:
        '200':
          description: Webhook received
        '400':
          description: Invalid webhook signature

  /payments/{id}:
    get:
      tags: [Payments]
      summary: Get payment details
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Payment details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Payment'

  # ════════════════════════════════════════════
  # ADMIN
  # ════════════════════════════════════════════

  /admin/orders:
    get:
      tags: [Admin]
      summary: Get all orders (cafetería dashboard)
      security:
        - BearerAuth: []
      parameters:
        - name: status
          in: query
          schema:
            type: string
        - name: limit
          in: query
          schema:
            type: integer
            default: 50
      responses:
        '200':
          description: All orders
        '403':
          description: Only CAFETERIA_STAFF

  /admin/products:
    post:
      tags: [Admin]
      summary: Create product (ADMIN only)
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                price:
                  type: number
                categoryId:
                  type: string
      responses:
        '201':
          description: Product created
        '403':
          description: Only ADMIN
```

### Implementación de Endpoints (Express)

```typescript
// backend-api/src/routes/orders.routes.ts

import express, { Router } from 'express';
import { authenticateJWT } from '@/middleware/authenticateJWT';
import { validateBody } from '@/middleware/validateBody';
import { orderController } from '@/controllers/orderController';
import * as Joi from 'joi';

const router: Router = express.Router();

// Validación Joi
const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().uuid().required(),
        quantity: Joi.number().integer().min(1).max(100).required(),
      })
    )
    .min(1)
    .required(),
  notes: Joi.string().max(500).optional(),
});

// POST /orders - Crear pedido
router.post(
  '/',
  authenticateJWT,
  validateBody(createOrderSchema),
  orderController.create
);

// GET /orders - Listar órdenes del usuario
router.get(
  '/',
  authenticateJWT,
  orderController.listUserOrders
);

// GET /orders/:id - Detalle de orden
router.get(
  '/:id',
  authenticateJWT,
  orderController.getById
);

// PUT /orders/:id/cancel - Cancelar
router.put(
  '/:id/cancel',
  authenticateJWT,
  orderController.cancel
);

// PUT /orders/:id/accept - Cafetería acepta
router.put(
  '/:id/accept',
  authenticateJWT,
  orderController.accept  // Valida CAFETERIA_STAFF role
);

// PUT /orders/:id/ready - Marcar como listo
router.put(
  '/:id/ready',
  authenticateJWT,
  orderController.ready
);

export default router;
```

```typescript
// backend-api/src/controllers/orderController.ts

import { Request, Response } from 'express';
import { prisma } from '@/config/database';
import { OrderService } from '@/services/OrderService';
import { NotificationService } from '@/services/NotificationService';
import { AuditService } from '@/services/AuditService';

const orderService = new OrderService(prisma);
const notificationService = new NotificationService();
const auditService = new AuditService(prisma);

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const orderController = {
  /**
   * POST /orders
   * Crear nuevo pedido
   */
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { items, notes } = req.body;

      // 1. Validar que productos existen
      const productIds = items.map((item: any) => item.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        res.status(400).json({ error: 'Some products not found' });
        return;
      }

      // 2. Calcular total (recalcular en backend, NO confiar en cliente)
      let total = 0;
      const orderItems: any[] = [];
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          res.status(400).json({ error: 'Product not found' });
          return;
        }
        const subtotal = product.price * item.quantity;
        total += subtotal;
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price,
          subtotal,
        });
      }

      // 3. Crear orden en BD
      const order = await prisma.order.create({
        data: {
          userId,
          notes,
          total,
          status: 'PENDING',
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // 4. Auditar
      await auditService.log({
        action: 'CREATE',
        entityType: 'Order',
        entityId: order.id,
        userId,
        orderId: order.id,
      });

      // 5. Responder
      res.status(201).json({
        id: order.id,
        status: order.status,
        total: order.total,
        items: order.items,
        createdAt: order.createdAt,
      });
    } catch (error) {
      console.error('CreateOrder error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * GET /orders
   * Listar órdenes del usuario actual
   */
  async listUserOrders(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { status, limit = '20', offset = '0' } = req.query;

      const where: any = { userId };
      if (status) {
        where.status = status.toString().toUpperCase();
      }

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            items: {
              include: {
                product: true,
              },
            },
            payment: true,
          },
          orderBy: { createdAt: 'desc' },
          take: parseInt(limit as string),
          skip: parseInt(offset as string),
        }),
        prisma.order.count({ where }),
      ]);

      res.json({
        data: orders,
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });
    } catch (error) {
      console.error('ListUserOrders error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * GET /orders/:id
   * Obtener detalle de una orden
   */
  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          payment: true,
          user: true,
        },
      });

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      // Autorización: solo el dueño o staff
      if (order.userId !== userId && req.user!.role !== 'CAFETERIA_STAFF') {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }

      res.json(order);
    } catch (error) {
      console.error('GetOrder error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * PUT /orders/:id/cancel
   * Cancelar orden (solo si PENDING o PAID)
   */
  async cancel(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const order = await prisma.order.findUnique({
        where: { id },
      });

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      // Solo dueño puede cancelar
      if (order.userId !== userId) {
        res.status(403).json({ error: 'Forbidden' });
        return;
      }

      // Solo se puede cancelar si está PENDING o PAID
      if (!['PENDING', 'PAID'].includes(order.status)) {
        res.status(400).json({
          error: `Cannot cancel order in ${order.status} status`,
        });
        return;
      }

      // Actualizar
      const updated = await prisma.order.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
        },
      });

      // Auditar
      await auditService.log({
        action: 'UPDATE',
        entityType: 'Order',
        entityId: id,
        userId,
        changes: { status: order.status, newStatus: 'CANCELLED' },
      });

      // Notificar
      await notificationService.send(userId, {
        title: 'Orden Cancelada',
        body: `Tu orden #${id.slice(0, 8)} ha sido cancelada`,
      });

      res.json(updated);
    } catch (error) {
      console.error('CancelOrder error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * PUT /orders/:id/accept
   * Cafetería acepta orden (WebSocket también)
   */
  async accept(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const staffId = req.user!.id;

      // Solo CAFETERIA_STAFF puede aceptar
      if (req.user!.role !== 'CAFETERIA_STAFF') {
        res.status(403).json({ error: 'Only CAFETERIA_STAFF can accept orders' });
        return;
      }

      const order = await prisma.order.findUnique({
        where: { id },
      });

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      if (order.status !== 'PAID') {
        res.status(400).json({ error: 'Order must be PAID to accept' });
        return;
      }

      // Actualizar
      const updated = await prisma.order.update({
        where: { id },
        data: {
          status: 'ACCEPTED',
          acceptedById: staffId,
          acceptedAt: new Date(),
        },
        include: {
          user: true,
          items: {
            include: { product: true },
          },
        },
      });

      // Auditar
      await auditService.log({
        action: 'ORDER_ACCEPTED',
        entityType: 'Order',
        entityId: id,
        userId: staffId,
        orderId: id,
      });

      // Notificar estudiante
      await notificationService.send(order.userId, {
        title: '¡Orden Aceptada!',
        body: 'Comenzamos a preparar tu pedido',
        data: { orderId: id, action: 'ORDER_ACCEPTED' },
      });

      // WebSocket: emit a todos en tablet de cafetería
      // (vía socket.io event en otra parte)

      res.json(updated);
    } catch (error) {
      console.error('AcceptOrder error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  /**
   * PUT /orders/:id/ready
   * Marcar orden como lista
   */
  async ready(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const staffId = req.user!.id;

      if (req.user!.role !== 'CAFETERIA_STAFF') {
        res.status(403).json({ error: 'Only CAFETERIA_STAFF can mark as ready' });
        return;
      }

      const order = await prisma.order.findUnique({
        where: { id },
      });

      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      if (order.status !== 'ACCEPTED') {
        res.status(400).json({ error: 'Order must be ACCEPTED to mark as ready' });
        return;
      }

      const updated = await prisma.order.update({
        where: { id },
        data: {
          status: 'READY',
          readyAt: new Date(),
        },
      });

      // Auditar
      await auditService.log({
        action: 'ORDER_READY',
        entityType: 'Order',
        entityId: id,
        userId: staffId,
      });

      // Notificar estudiante - ALTA PRIORIDAD
      await notificationService.send(order.userId, {
        title: '¡Tu orden está lista! 🎉',
        body: `Retira en caja #${staffId}`,
        data: { orderId: id, action: 'ORDER_READY' },
        priority: 'high', // Sonido + vibración
      });

      res.json(updated);
    } catch (error) {
      console.error('ReadyOrder error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
```

---

## PARTE 6: SISTEMA DE ROLES Y SEGURIDAD

### Modelo de Autenticación Explicado

```
┌──────────────────────────────────────────────────────────────────┐
│                   FLUJO DE AUTENTICACIÓN JWT                     │
└──────────────────────────────────────────────────────────────────┘

1. REGISTRO
   ┌─────────────┐
   │ POST /auth/register
   │ {email, password, name}
   └────────┬────┘
            │
            ▼
   ┌─────────────────────────────────────┐
   │ Backend:                            │
   │ 1. Validar email no existe          │
   │ 2. Hash password: bcrypt(10 rounds) │
   │ 3. Crear User en BD                 │
   │ 4. Generar JWT (15 min)             │
   │ 5. Generar refresh token (7 días)   │
   └────────┬────────────────────────────┘
            │
            ▼
   ┌─────────────────────────────────────┐
   │ Response (201):                     │
   │ {                                   │
   │   accessToken: "eyJh...",           │
   │   expiresIn: 900,                   │
   │   user: {id, email, name, role}     │
   │ }                                   │
   │ Cookie: refreshToken (httpOnly)     │
   └─────────────────────────────────────┘

2. LOGIN SUBSECUENTE
   ┌─────────────────────────────────────┐
   │ POST /auth/login                    │
   │ {email, password}                   │
   └────────┬────────────────────────────┘
            │
            ▼
   ┌─────────────────────────────────────┐
   │ Backend:                            │
   │ 1. Buscar user por email            │
   │ 2. bcrypt.compare(password, hash)   │
   │ 3. Si OK: generar nuevos tokens     │
   │ 4. Si NO: error 401                 │
   └────────┬────────────────────────────┘
            │
            ▼
   Same response as registro

3. LLAMADAS AUTENTICADAS
   ┌─────────────────────────────────────┐
   │ GET /orders                         │
   │ Headers: {                          │
   │   Authorization: "Bearer <token>"   │
   │ }                                   │
   └────────┬────────────────────────────┘
            │
            ▼
   ┌─────────────────────────────────────┐
   │ Middleware: authenticateJWT         │
   │ 1. Extraer token del header         │
   │ 2. Verificar firma JWT              │
   │ 3. Si válido: req.user = {id, role}│
   │ 4. Si inválido: error 401           │
   │ 5. Si expirado: error 401           │
   └────────┬────────────────────────────┘
            │
            ▼
   ┌─────────────────────────────────────┐
   │ Controller ejecuta lógica           │
   │ (req.user ya tiene datos)           │
   └─────────────────────────────────────┘

4. TOKEN EXPIRADO - REFRESH
   ┌─────────────────────────────────────┐
   │ GET /orders (token expirado)        │
   │ Response: 401 TOKEN_EXPIRED         │
   └────────┬────────────────────────────┘
            │ (Cliente detecta 401)
            ▼
   ┌─────────────────────────────────────┐
   │ POST /auth/refresh                  │
   │ (automático, con refresh token)     │
   └────────┬────────────────────────────┘
            │
            ▼
   ┌─────────────────────────────────────┐
   │ Backend:                            │
   │ 1. Validar refresh token            │
   │ 2. Si OK: generar nuevo access token│
   │ 3. Responder con nuevo token        │
   └────────┬────────────────────────────┘
            │
            ▼
   ┌─────────────────────────────────────┐
   │ Cliente retry original request      │
   │ con nuevo token                     │
   └─────────────────────────────────────┘
```

### Implementación JWT

```typescript
// backend-api/src/utils/jwt.ts

import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;
const ACCESS_EXPIRY = '15m'; // 15 minutos
const REFRESH_EXPIRY = '7d'; // 7 días

interface JwtPayload {
  sub: string; // user ID
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const jwtUtils = {
  /**
   * Generar access token (15 min)
   */
  generateAccessToken(user: User): string {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: ACCESS_EXPIRY }
    );
  },

  /**
   * Generar refresh token (7 días)
   */
  generateRefreshToken(user: User): string {
    return jwt.sign(
      {
        sub: user.id,
        type: 'refresh',
      },
      REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRY }
    );
  },

  /**
   * Verificar y decodificar access token
   */
  verifyAccessToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      return decoded;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        console.log('Token expired');
      } else {
        console.log('Token verification failed:', error.message);
      }
      return null;
    }
  },

  /**
   * Verificar refresh token
   */
  verifyRefreshToken(token: string): { sub: string } | null {
    try {
      const decoded = jwt.verify(token, REFRESH_SECRET) as any;
      return decoded;
    } catch (error) {
      return null;
    }
  },
};
```

### Middleware de Autenticación

```typescript
// backend-api/src/middleware/authenticateJWT.ts

import { Request, Response, NextFunction } from 'express';
import { jwtUtils } from '@/utils/jwt';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Middleware que valida JWT en el header Authorization
 * Si válido: añade req.user
 * Si inválido/expirado: responde 401
 */
export function authenticateJWT(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    // 1. Extraer token del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid authorization header' });
      return;
    }

    const token = authHeader.slice(7); // Remove "Bearer "

    // 2. Verificar token
    const payload = jwtUtils.verifyAccessToken(token);
    if (!payload) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    // 3. Adjuntar datos del usuario al request
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

### Autorización por Roles

```typescript
// backend-api/src/middleware/authorize.ts

import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Factory function que retorna middleware de autorización
 * Uso: app.put('/orders/:id/accept', authorizeRole(['CAFETERIA_STAFF']), controller)
 */
export function authorizeRole(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Forbidden: requires one of ${allowedRoles.join(', ')}`,
      });
      return;
    }

    next();
  };
}

// Uso en rutas:
router.put(
  '/:id/accept',
  authenticateJWT,
  authorizeRole(['CAFETERIA_STAFF']),
  orderController.accept
);
```

### Seguridad: Protecciones Implementadas

```
┌──────────────────────────────────────────────────────────────────┐
│                  MATRIZ DE SEGURIDAD ITSUR EATS                  │
└──────────────────────────────────────────────────────────────────┘

1. AUTENTICACIÓN
   ✅ Passwords hasheados con bcrypt (10 rounds)
   ✅ JWT tokens con firma HMAC-SHA256
   ✅ Refresh tokens en httpOnly cookies (CSRF safe)
   ✅ Token expiry: 15 min access, 7 días refresh
   ✅ Rate limiting: 5 intentos login por minuto

2. AUTORIZACIÓN
   ✅ Role-based access control (RBAC)
   ✅ Roles: STUDENT, CAFETERIA_STAFF, ADMIN
   ✅ Guards en cada endpoint sensible
   ✅ Validación en backend (NO confiar en cliente)

3. DATOS SENSIBLES
   ✅ Passwords: NUNCA en logs
   ✅ Tokens: NUNCA en localStorage (httpOnly)
   ✅ Tarjetas: NUNCA en BD (Stripe tokenization)
   ✅ Precios: Recalculados en backend

4. VALIDACIÓN
   ✅ Input validation con Joi
   ✅ SQL injection: Imposible (Prisma ORM)
   ✅ XSS: Frontend escapes, backend valida
   ✅ CSRF: httpOnly cookies + CORS whitelist

5. TRANSPORTE
   ✅ HTTPS/TLS 1.3 obligatorio
   ✅ CORS whitelist (solo dominios ITSUR)
   ✅ CSP headers (Content Security Policy)
   ✅ HSTS headers (Force HTTPS)

6. PAGOS
   ✅ PCI-DSS Level 1 (Stripe tokenization)
   ✅ Webhook signature validation (Stripe secret)
   ✅ Idempotency keys (evita doble pago)
   ✅ Payment logs auditados

7. AUDITORÍA
   ✅ Todos los cambios logged en audit_logs
   ✅ User ID registrado en cada acción
   ✅ Timestamps precisos
   ✅ Cambios anteriores/posteriores guardados
   ✅ IP address y user agent registrados

8. RATE LIMITING
   ✅ 100 requests por minuto (global)
   ✅ 5 login attempts por minuto
   ✅ 10 payment attempts por minuto
   ✅ 500 requests por hora (por IP)

9. ERROR HANDLING
   ✅ No revelar detalles internos (server errors → generic)
   ✅ SQL errors logged, no mostrados al cliente
   ✅ Stack traces SOLO en desarrollo
   ✅ 404 para no encontrado (no 403 diferenciado)

10. SECRETOS
    ✅ .env file (NUNCA en git)
    ✅ Secrets en AWS Secrets Manager (producción)
    ✅ Diferentes secretos por environment
    ✅ Rotación trimestral de secrets
```

### "Explicar en 3 Minutos al Profesor"

```
ESTUDIANTE: "Profesor, aquí está el sistema de seguridad."

PROFESOR: "¿Cómo proteges contra SQL injection?"
ESTUDIANTE: "Usamos Prisma ORM que parameteriza queries
             automáticamente. No concatenamos strings."

PROFESOR: "¿Cómo almacenas passwords?"
ESTUDIANTE: "Con bcrypt, algoritmo de hashing criptográfico.
             Incluso nosotros no podemos ver el password original.
             Para login: hash del ingresado == hash en BD."

PROFESOR: "¿Qué pasa si roban tokens?"
ESTUDIANTE: "Access tokens expiran en 15 minutos.
             Refresh tokens en cookies httpOnly (imposibles de robar vía JavaScript).
             Y todo por HTTPS, así nadie ve en tránsito."

PROFESOR: "¿Y las tarjetas de crédito?"
ESTUDIANTE: "NUNCA tocamos tarjetas. Stripe hace checkout en su iframe.
             Nosotros recibimos un token de Stripe, lo guardamos.
             PCI-DSS compliance = no almacenamos datos sensibles."

PROFESOR: "¿Quién puede aceptar órdenes?"
ESTUDIANTE: "Solo usuarios con role CAFETERIA_STAFF.
             Validamos en cada endpoint (guards middleware).
             Role viene en el JWT, verificado con firma."

PROFESOR: "¿Qué si alguien manipula un JSON para cambiar precio?"
ESTUDIANTE: "No importa. En el backend recalculamos el total basado en
             precios en BD. Nunca confiamos en números del cliente."

PROFESOR: "Perfect. Avanza con logging."
ESTUDIANTE: "Cada acción importante registra en audit_logs:
             user_id, action, timestamp, cambios anteriores/nuevos.
             Esto es para auditoría y debugging."
```

---

## CONTINUACIÓN EN DOCUMENTO SIGUIENTE

**Este es Volumen 2 (completado):**
✅ Base de Datos Académica Profesional
✅ API REST Completa (39 endpoints especificados)
✅ Sistema de Roles y Seguridad

**Volumen 3 incluirá:**
- Plan de Desarrollo Semanal (14-16 semanas)
- Rúbrica de Evaluación Universitaria
- Demo Final "Orgullo ITSUR"
- Features Diferenciadoras Académicas (3)
- Setup.md con instrucciones iniciales

---

**Documento preparado por**: CTO Asesor Académico
**Fecha**: 20 de Enero de 2026
**Status**: Completado (Parte 4-6)
**Volumen**: 2/3
