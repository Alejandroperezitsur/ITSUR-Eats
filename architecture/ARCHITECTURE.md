# 🏗️ Arquitectura Técnica - ITSUR Eats

## 1. Visión Arquitectónica

### Principios Arquitectónicos
- **Microservicios**: Escalabilidad independiente de componentes
- **Cloud-Native**: Preparado para AWS, Azure o multi-cloud
- **API-First**: Separación clara entre frontend y backend
- **Real-time**: WebSockets para actualizaciones instantáneas
- **Security-by-Design**: Seguridad desde la arquitectura

---

## 2. Diagrama de Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                         CDN (CloudFront)                        │
│                                                                  │
└────────────┬──────────────────────────────────────────────────┘
             │
    ┌────────┴────────┬──────────────────┐
    │                 │                  │
┌───▼────┐      ┌────▼─────┐      ┌────▼─────┐
│ Mobile │      │  Web App  │      │ Admin UI │
│  (iOS) │      │ (React)   │      │(React)   │
└───┬────┘      └────┬─────┘      └────┬─────┘
    │                │                 │
    └────────────────┼─────────────────┘
                     │
              ┌──────▼──────┐
              │ API Gateway │
              │  (Kong/AWS) │
              └──────┬──────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
    ┌───▼───┐    ┌──▼──┐    ┌───▼────┐
    │ Auth  │    │ API │    │ Realtime│
    │Service│    │Service   │Service │
    └───┬───┘    └──┬──┘    └───┬────┘
        │           │            │
        └───────────┼────────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
┌───▼──────┐  ┌────▼────┐  ┌──────▼─┐
│PostgreSQL│  │ Redis   │  │Firebase│
│          │  │(Cache)  │  │(FCM)   │
└──────────┘  └─────────┘  └────────┘
    │
┌───▼──────────────────────┐
│  S3 (File Storage)       │
│  - Fotos de menú         │
│  - Recibos               │
└──────────────────────────┘
```

---

## 3. Componentes Principales

### 3.1 Frontend Móvil (React Native + Expo)

**Responsabilidades:**
- Interfaz de usuario para estudiantes y profesores
- Gestión de estado local con Redux
- Autenticación con JWT
- Notificaciones push (FCM)
- Integración de pagos
- Geolocalización

**Estructura de carpetas:**
```
mobile/
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   ├── menu/
│   │   ├── order/
│   │   ├── profile/
│   │   └── history/
│   ├── components/
│   ├── store/ (Redux)
│   ├── services/ (API calls)
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   └── theme/
├── app.json
├── eas.json
└── package.json
```

**Dependencias clave:**
```json
{
  "react-native": "0.73.0",
  "expo": "^50.0.0",
  "@react-navigation/native": "^6.1.0",
  "@reduxjs/toolkit": "^1.9.7",
  "react-native-paper": "^5.11.0",
  "@stripe/stripe-react-native": "^12.0.0",
  "react-native-push-notification": "^8.1.1"
}
```

---

### 3.2 Backend (NestJS)

**Responsabilidades:**
- API REST y GraphQL
- Lógica de negocio
- Autenticación y autorización
- Integración de pagos
- Notificaciones push
- Auditoría y logging

**Módulos principales:**
```
backend/
├── src/
│   ├── auth/
│   │   ├── strategies/ (JWT, OAuth)
│   │   ├── guards/
│   │   └── controllers/
│   ├── users/
│   ├── products/
│   ├── orders/
│   ├── payments/
│   ├── notifications/
│   ├── analytics/
│   ├── admin/
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── interceptors/
│   │   └── guards/
│   └── config/
├── prisma/
│   └── schema.prisma
└── test/
```

**Stack técnico:**
```
- NestJS 10.x
- TypeScript 5.x
- Prisma ORM
- GraphQL (Apollo)
- JWT Authentication
- Swagger/OpenAPI
- Jest (Testing)
- Docker
```

---

### 3.3 Panel Administrativo (React + Material-UI)

**Responsabilidades:**
- Gestión de productos y categorías
- Visualización de pedidos en tiempo real
- Dashboard con métricas
- Gestión de usuarios
- Reportes y estadísticas
- Configuración del sistema

**Estructura:**
```
admin-panel/
├── src/
│   ├── pages/
│   │   ├── dashboard/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── users/
│   │   ├── analytics/
│   │   └── settings/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── theme/
├── public/
└── package.json
```

---

### 3.4 Base de Datos (PostgreSQL)

**Esquema principal:**
```sql
-- Usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  institutional_id VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  department VARCHAR,
  role ENUM ('STUDENT', 'PROFESSOR', 'ADMIN') NOT NULL,
  phone VARCHAR,
  avatar_url VARCHAR,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categorías
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  icon_url VARCHAR,
  display_order INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Productos
CREATE TABLE products (
  id UUID PRIMARY KEY,
  category_id UUID REFERENCES categories(id),
  name VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR,
  available_quantity INT,
  is_available BOOLEAN DEFAULT TRUE,
  preparation_time INT, -- en minutos
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  status ENUM ('PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'CANCELLED') NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM ('CARD', 'CASH') NOT NULL,
  payment_status ENUM ('PENDING', 'COMPLETED', 'FAILED') NOT NULL,
  delivery_location VARCHAR,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  ready_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- Detalles de Pedido
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- Transacciones de Pago
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR DEFAULT 'MXN',
  gateway ENUM ('STRIPE', 'MERCADO_PAGO') NOT NULL,
  gateway_transaction_id VARCHAR UNIQUE,
  status ENUM ('PENDING', 'SUCCESS', 'FAILED') NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notificaciones
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type ENUM ('ORDER_ACCEPTED', 'ORDER_READY', 'ORDER_CANCELLED', 'PROMO') NOT NULL,
  title VARCHAR NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Auditoría
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR NOT NULL,
  resource_type VARCHAR NOT NULL,
  resource_id UUID,
  changes JSONB,
  ip_address VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. Flujos de Datos Principales

### 4.1 Flujo de Pedido

```
1. Usuario abre app → se autentica con JWT
2. Sistema carga menú desde Redis (caché)
3. Usuario selecciona productos
4. Envía pedido a API: POST /api/orders
5. Backend valida datos, calcula total
6. Crea registro en PostgreSQL
7. Emite evento de pedido a WebSocket (admin)
8. Retorna order_id al cliente
9. Admin recibe notificación en tiempo real
10. Usuario recibe notificación push (FCM)
```

### 4.2 Flujo de Pago

```
1. Usuario selecciona método de pago
2. Si tarjeta: abre formulario seguro de Stripe
3. Envía token de pago a backend: POST /api/payments
4. Backend valida token con Stripe
5. Procesa transacción
6. Guarda resultado en audit_logs
7. Actualiza estado de pedido
8. Envía confirmación a usuario
```

### 4.3 Flujo de Notificación en Tiempo Real

```
1. Admin acepta pedido en panel
2. Emite evento WebSocket: order.accepted
3. Backend envía push notification vía FCM
4. Backend actualiza estado en PostgreSQL
5. Cliente recibe push → actualiza pantalla
6. Usuario ve notificación del sistema
```

---

## 5. Seguridad en Arquitectura

### 5.1 Autenticación & Autorización

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │ correo + password
       ▼
┌──────────────────────┐
│ Auth Service         │
│ - Valida credenciales│
│ - Genera JWT Token   │
└──────┬───────────────┘
       │ Access + Refresh token
       ▼
┌──────────────────────┐
│ Frontend Storage     │
│ (Secure Storage)     │
└──────────────────────┘
```

**JWT Structure:**
```json
{
  "header": { "alg": "HS256", "typ": "JWT" },
  "payload": {
    "sub": "user_id",
    "email": "student@itsur.edu.mx",
    "role": "STUDENT",
    "institutional_id": "A12345678",
    "iat": 1695000000,
    "exp": 1695003600
  }
}
```

### 5.2 Roles y Permisos

```
STUDENT/PROFESSOR
├── Ver menú
├── Crear pedidos
├── Pagar
├── Ver historial

ADMIN_CAFETERIA
├── CRUD productos
├── CRUD categorías
├── Ver pedidos (todos)
├── Aceptar/rechazar pedidos
├── Ver estadísticas

SUPERADMIN
└── Control total del sistema
```

### 5.3 Validación Institucional

```
Usuario se registra:
1. Email debe ser @itsur.edu.mx
2. Verifica código institucional contra API ITSUR
3. Confirma correo con OTP
4. Activa cuenta
5. Primer login requiere 2FA
```

---

## 6. Real-Time Architecture

```
┌──────────────────────────────────────┐
│   Admin Panel (React)                │
└─────────────┬────────────────────────┘
              │
         Socket.io
              │
         ┌────▼──────────┐
         │  Socket Server │
         │  (Node + Redis)│
         └────┬──────────┘
              │
    ┌─────────┴─────────┐
    │                   │
    ▼                   ▼
PostgreSQL          Redis Pub/Sub
(Persistent)        (Fast cache)
```

### Eventos en tiempo real:
- `order:created` - Nuevo pedido
- `order:accepted` - Pedido aceptado
- `order:preparing` - En preparación
- `order:ready` - Listo para recoger
- `order:cancelled` - Cancelado
- `product:stock_updated` - Stock actualizado
- `user:online_status` - Estado del usuario

---

## 7. Escalabilidad Horizontal

### Strateg

ia de Scaling:

```
┌─────────────────────────────────────┐
│      Load Balancer (AWS ALB)        │
└──────────────────┬──────────────────┘
                   │
       ┌───────────┼───────────┐
       │           │           │
   ┌───▼──┐    ┌──▼───┐    ┌──▼───┐
   │API-1 │    │API-2 │    │API-3 │
   │ Pod  │    │ Pod  │    │ Pod  │
   └───┬──┘    └──┬───┘    └──┬───┘
       │          │          │
       └──────────┼──────────┘
              ┌───▼────────────────────┐
              │  Shared Services       │
              ├────────────────────────┤
              │ PostgreSQL (RDS)       │
              │ Redis (ElastiCache)    │
              │ Firebase (FCM)         │
              │ S3 (Static files)      │
              └────────────────────────┘
```

### Kubernetes Config (Production):
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-server
  template:
    metadata:
      labels:
        app: api-server
    spec:
      containers:
      - name: api-server
        image: itsur-eats-api:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
```

---

## 8. Monitoreo y Observabilidad

### Stack de Monitoreo:
- **Logs**: Datadog + ELK Stack
- **Métricas**: Prometheus + Grafana
- **Tracing**: Jaeger / DataDog APM
- **Errores**: Sentry + Rollbar
- **Uptime**: StatusPage.io

### Dashboards clave:
- API latency y throughput
- Error rate por endpoint
- Database query performance
- Cache hit rate
- WebSocket connections
- Payment success rate
- Server health

---

## 9. Deployment Pipeline

```
┌─────────────┐
│ Push a main │
└──────┬──────┘
       │
  ┌────▼─────────┐
  │ GitHub Actions│
  └────┬─────────┘
       │
   ┌───┴───────────┐
   │               │
   ▼               ▼
Tests          Build
   │               │
   └───┬───────────┘
       │
       ▼
   Deploy to staging
       │
       ▼
   Integration tests
       │
       ▼
   Deploy to production
```

---

## 10. Disaster Recovery

### Backup Strategy:
- **Database**: Automated snapshots every 6 hours
- **Files**: S3 with versioning enabled
- **Logs**: Retained for 90 days
- **Recovery Time Objective (RTO)**: 4 horas
- **Recovery Point Objective (RPO)**: 30 minutos

### High Availability:
- Multi-AZ deployment
- Database read replicas
- Automated failover
- Load balancing with health checks

---

## Conclusión

Esta arquitectura está diseñada para:
✅ Soportar 2,000+ usuarios concurrentes
✅ Escalabilidad horizontal ilimitada
✅ 99.9% uptime SLA
✅ Seguridad de nivel empresarial
✅ Experiencia de usuario optimizada
✅ Fácil mantenimiento y monitoreo

---

**Última actualización**: Enero 20, 2026
**Versión de arquitectura**: 1.0
**Estado**: Aprobado para implementación
