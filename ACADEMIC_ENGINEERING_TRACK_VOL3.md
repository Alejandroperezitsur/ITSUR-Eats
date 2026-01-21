# 🎓 ITSUR Eats — Academic Engineering Track
## VOLUMEN 3: Plan de Desarrollo, Rúbrica y Demo Final

---

## PARTE 7: PLAN DE DESARROLLO SEMANAL (14-16 SEMANAS)

### Estructura General

```
Semanas 1-4:   FUNDAMENTOS & SETUP
Semanas 5-8:   BACKEND CORE
Semanas 9-12:  MOBILE APP
Semanas 13-14: INTEGRACIONES (Pagos, Notificaciones)
Semanas 15-16: TESTING, DOCS, PRESENTACIÓN
```

### Timeline Detallado por Semana

#### FASE A1: FUNDAMENTOS DE SISTEMAS (Semanas 1-4)

```
╔═══════════════════════════════════════════════════════════════════╗
║ SEMANA 1: SETUP, GIT, Y ARQUITECTURA                            ║
╚═══════════════════════════════════════════════════════════════════╝

Objetivos:
- ✅ Repositorio GitHub configurado
- ✅ Estructura de carpetas lista
- ✅ Ambiente local dockerizado
- ✅ Team alineado en arquitectura

Entregables Código:
  □ Repositorio itsur-eats/ con README.md completo
  □ docker-compose.yml con PostgreSQL local
  □ .env.example con todas las variables
  □ Scripts iniciales (setup.sh)

Entregables Documentación:
  □ ARCHITECTURE.md visual
  □ Database schema (en Prisma)
  □ API endpoints list (borrador)

Evaluación:
  □ Código limpio (ESLint pasando)
  □ README claro para nuevo dev
  □ Documentación sin errores de sintaxis
  □ Todos en repo con permisos correctos

Horas estimadas: 20 horas
Equipo: 2 personas (Backend lead + DevOps)

─────────────────────────────────────────────────────────────────

╔═══════════════════════════════════════════════════════════════════╗
║ SEMANA 2: DATABASE SCHEMA & PRISMA                              ║
╚═══════════════════════════════════════════════════════════════════╝

Objetivos:
- ✅ Schema Prisma 100% diseñado
- ✅ Migraciones funcionando
- ✅ Seed data para testing

Entregables Código:
  □ prisma/schema.prisma completo (10 modelos)
  □ prisma/migrations/ con seed.ts
  □ Database ERD en Mermaid
  □ Indexes & constraints definidos

Entregables Documentación:
  □ DATABASE.md con explicación de cada tabla
  □ ER diagram visual
  □ Convenciones de nombres documentadas

Testing:
  □ docker exec: psql connect test
  □ Prisma generate sin errores
  □ Seed data inserta correctamente
  □ Queries de ejemplo funcionan

Evaluación:
  □ Schema normalizado (3NF)
  □ Relaciones correctas
  □ Indices en columnas clave
  □ Documentación clara

Horas estimadas: 25 horas
Equipo: 1 Backend engineer + 0.5 Arquitecto

─────────────────────────────────────────────────────────────────

╔═══════════════════════════════════════════════════════════════════╗
║ SEMANA 3: AUTH BACKEND (JWT, BCRYPT, REFRESH)                   ║
╚═══════════════════════════════════════════════════════════════════╝

Objetivos:
- ✅ Sistema JWT funcional
- ✅ Login/Register endpoints
- ✅ Token refresh mechanism
- ✅ Tests unitarios

Entregables Código:
  □ utils/jwt.ts (generate, verify)
  □ utils/bcrypt.ts (hash, compare)
  □ middleware/authenticateJWT.ts
  □ middleware/authorize.ts (role guards)
  □ controllers/authController.ts
  □ routes/auth.routes.ts
  □ __tests__/auth.test.ts (Jest)

Entregables Documentación:
  □ SECURITY.md: JWT flow explained
  □ API docs para /auth endpoints
  □ Env variables requeridas

Testing Manual:
  □ POST /auth/register: crea usuario + retorna token
  □ POST /auth/login: valida credentials
  □ GET /products (sin token): 401
  □ GET /products (con token): 200
  □ POST /auth/refresh: genera nuevo token
  □ Token expirado: 401

Evaluación:
  □ Passwords hasheados (nunca plain en BD)
  □ Tokens válidos y verificables
  □ Refresh mechanism funciona
  □ Errores manejados (user exists, wrong password)
  □ 90%+ code coverage en tests

Horas estimadas: 30 horas
Equipo: 1 Backend engineer

─────────────────────────────────────────────────────────────────

╔═══════════════════════════════════════════════════════════════════╗
║ SEMANA 4: MENÚ & PRODUCTOS API                                  ║
╚═══════════════════════════════════════════════════════════════════╝

Objetivos:
- ✅ Productos listables y buscables
- ✅ Categorías de menú
- ✅ Filtros (precio, disponibilidad)

Entregables Código:
  □ controllers/menuController.ts
  □ routes/products.routes.ts
  □ services/MenuService.ts
  □ GET /products (all + pagination)
  □ GET /products/:id
  □ GET /categories
  □ __tests__/menu.test.ts

Entregables Documentación:
  □ MENU.md: estructura de productos
  □ Seed data: café, desayunos, etc
  □ Query examples en README

Testing:
  □ GET /products: retorna array de productos
  □ GET /products?category=cafe: filtra correcto
  □ GET /products?search=cappuccino: busca por nombre
  □ Pagination: limit=10&offset=0
  □ Stock management: available field

Evaluación:
  □ Queries optimizadas (índices usados)
  □ Paginación implementada correctamente
  □ Búsqueda full-text funciona
  □ Errores manejados (category not found)
  □ Response format consistente

Horas estimadas: 20 horas
Equipo: 1 Backend engineer

═══════════════════════════════════════════════════════════════════
CHECKPOINT FASE A1 (Final Semana 4):
- Base de datos: ✅ Completa y normalizada
- Autenticación: ✅ JWT funcional
- API Menú: ✅ Endpoints básicos
- Documentación: ✅ Suficiente para próxima fase
- Equipo capacitado: ✅ Stack entendido
═══════════════════════════════════════════════════════════════════
```

#### FASE A2: BACKEND & ARQUITECTURA (Semanas 5-8)

```
╔═══════════════════════════════════════════════════════════════════╗
║ SEMANA 5: ÓRDENES CRUD                                          ║
╚═══════════════════════════════════════════════════════════════════╝

Objetivos:
- ✅ Crear órdenes
- ✅ Listar órdenes (usuario + admin)
- ✅ Detalles de orden
- ✅ Cancelación

Entregables Código:
  □ controllers/orderController.ts (completo)
  □ services/OrderService.ts
  □ POST /orders (create)
  □ GET /orders (my orders)
  □ GET /orders/:id (detail)
  □ PUT /orders/:id/cancel
  □ __tests__/orders.test.ts

Entregables Documentación:
  □ ORDER_FLOW.md: diagrama de estados
  □ Validaciones documentadas
  □ Error codes: 400, 403, 404

Testing:
  □ POST /orders: crea con items
  □ Total calculado correctamente en backend
  □ GET /orders: user solo ve sus órdenes
  □ Cancelar solo si status = PENDING
  □ Auditoría registra cambios

Evaluación:
  □ Total recalculado (no confiar en cliente)
  □ Autorización: user solo ve sus órdenes
  □ Transacciones: crear order + items atómicamente
  □ Soft delete si aplica
  □ Audit logs creados

Horas estimadas: 25 horas
Equipo: 1 Backend engineer

─────────────────────────────────────────────────────────────────

╔═══════════════════════════════════════════════════════════════════╗
║ SEMANA 6: PAGOS (STRIPE INTEGRATION)                            ║
╚═══════════════════════════════════════════════════════════════════╝

Objetivos:
- ✅ Stripe sandbox integrado
- ✅ Payment intent flow
- ✅ Webhook handling
- ✅ Payment status tracking

Entregables Código:
  □ Stripe API key setup
  □ controllers/paymentController.ts
  □ services/PaymentService.ts
  □ POST /payments/intent (create intent)
  □ POST /payments/webhook (webhook callback)
  □ Payment status checks
  □ __tests__/payments.test.ts

Entregables Documentación:
  □ PAYMENTS.md: Stripe flow
  □ Test card numbers (4242...)
  □ Webhook validation explained

Testing:
  □ Create payment intent: returns clientSecret
  □ Frontend simulates payment
  □ Webhook received: update order status
  □ Payment status = SUCCEEDED → Order status = PAID
  □ Failed payment: status = FAILED

Evaluación:
  □ PCI-DSS: no almacena tarjetas
  □ Webhook signature validado
  □ Idempotency: no doble carga
  □ Error handling: decline, timeout, etc
  □ Sandbox operations: zero charges

Horas estimadas: 30 horas
Equipo: 1 Backend engineer + 0.5 Senior review

─────────────────────────────────────────────────────────────────

╔═══════════════════════════════════════════════════════════════════╗
║ SEMANA 7: ADMIN PANEL BACKEND                                   ║
╚═══════════════════════════════════════════════════════════════════╝

Objetivos:
- ✅ Endpoints admin-only
- ✅ Order acceptance (cafetería)
- ✅ Mark as ready
- ✅ Audit logs

Entregables Código:
  □ PUT /orders/:id/accept (cafetería acepta)
  □ PUT /orders/:id/ready (marcar listo)
  □ GET /admin/orders (todas, sin paginación inicial)
  □ GET /admin/audit-logs
  □ authorization middleware (CAFETERIA_STAFF, ADMIN)
  □ AdminController.ts

Entregables Documentación:
  □ ADMIN_GUIDE.md
  □ Workflows: aceptar, marcar listo
  □ Real-time requirements

Testing Manual:
  □ STUDENT crea orden: status = PENDING
  □ Payment procesado: status = PAID
  □ CAFETERIA staff acepta: status = ACCEPTED
  □ Timestamp acceptedAt registrado
  □ Notificación enviada (mock)
  □ CAFETERIA staff marca ready: status = READY

Evaluación:
  □ Role validation: solo staff autorizado
  □ State machine: transiciones válidas
  □ Audit trail: cada acción registrada
  □ Timestamps precisos
  □ Notificaciones triggered

Horas estimadas: 20 horas
Equipo: 1 Backend engineer

─────────────────────────────────────────────────────────────────

╔═══════════════════════════════════════════════════════════════════╗
║ SEMANA 8: WEBSOCKET REAL-TIME + POLISH                          ║
╚═══════════════════════════════════════════════════════════════════╝

Objetivos:
- ✅ Socket.io real-time order updates
- ✅ Cafetería tablet recibe órdenes live
- ✅ Rate limiting
- ✅ Error handling robustecido

Entregables Código:
  □ websocket/orderGateway.ts (Socket.io)
  □ Emit "order:new" cuando se crea orden
  □ Emit "order:accepted", "order:ready"
  □ Rate limiting middleware
  □ Error handling comprehensivo
  □ Integration tests WebSocket

Entregables Documentación:
  □ WEBSOCKET.md: eventos y payloads
  □ Real-time flow diagrams

Testing:
  □ Student crea orden
  □ Tablet café recibe "order:new" instantáneamente
  □ Staff acepta
  □ Student app recibe "order:accepted" live
  □ Staff marca ready
  □ Push notification + WebSocket update

Evaluación:
  □ Baja latencia (<500ms)
  □ Conexiones mantenidas correctamente
  □ Reconexión automática
  □ Data consistency
  □ No memory leaks

Horas estimadas: 25 horas
Equipo: 1 Backend engineer + DevOps

═══════════════════════════════════════════════════════════════════
CHECKPOINT FASE A2 (Final Semana 8):
- Órdenes: ✅ CRUD completo
- Pagos: ✅ Stripe sandbox funcional
- Admin: ✅ Aceptación de órdenes
- Real-time: ✅ WebSocket funcionando
- Testing: ✅ 85%+ coverage
- API: ✅ 30+ endpoints completos
═══════════════════════════════════════════════════════════════════
```

#### FASE A3: MOBILE APP PROFESIONAL (Semanas 9-12)

```
╔═══════════════════════════════════════════════════════════════════╗
║ SEMANA 9: REACT NATIVE SETUP & AUTH UI                          ║
╚═══════════════════════════════════════════════════════════════════╝

Objetivos:
- ✅ Expo proyecto scaffolded
- ✅ Login & Register screens
- ✅ Token management
- ✅ Navigation stack

Entregables Código:
  □ Expo project: npx create-expo-app
  □ Screens: LoginScreen.tsx, RegisterScreen.tsx
  □ Redux store + slices (auth, cart)
  □ API service (axios config)
  □ Navigation: Bottom tabs + stack
  □ __tests__/auth.integration.test.ts (Detox)

Entregables Documentación:
  □ MOBILE_SETUP.md
  □ Screen flow documentation
  □ Redux store structure

Testing:
  □ Render login screen
  □ Enter credentials → POST /auth/login
  □ Navigate to home on success
  □ Store token in AsyncStorage
  □ Auto-login if token valid

Evaluación:
  □ UI/UX: intuitive screens
  □ Navigation smooth
  □ Error handling: show toast on error
  □ Loading states displayed
  □ Accessibility basics (labels, contrast)

Horas estimadas: 25 horas
Equipo: 1 Mobile engineer

─────────────────────────────────────────────────────────────────

╔═══════════════════════════════════════════════════════════════════╗
║ SEMANA 10: MENÚ & CARRITO                                       ║
╚═══════════════════════════════════════════════════════════════════╝

Objetivos:
- ✅ Browse menú
- ✅ Add to cart
- ✅ Cart management
- ✅ Search & filter

Entregables Código:
  □ MenuScreen.tsx: lista productos con scroll virtual
  □ ProductDetail.tsx: detalle + agregar a carrito
  □ CartScreen.tsx: items, total, proceed checkout
  □ Redux cartSlice: add, remove, update quantity
  □ Search component: buscar por nombre
  □ Category tabs: Cafés, Desayunos, etc

Entregables Documentación:
  □ MENU_FLOW.md

Testing:
  □ GET /products: carga menú
  □ Select product: muestra detalle
  □ Add to cart: item agregado con cantidad
  □ Increase quantity: total actualizado
  □ Remove from cart: eliminado
  □ Search: filtra productos

Evaluación:
  □ Performance: scroll sin lag (FlatList)
  □ Imágenes optimizadas
  □ Total recalculado correctamente
  □ Empty states manejados
  □ Pull to refresh funciona

Horas estimadas: 25 horas
Equipo: 1 Mobile engineer

─────────────────────────────────────────────────────────────────

╔═══════════════════════════════════════════════════════════════════╗
║ SEMANA 11: CHECKOUT & PAGOS MOBILE                              ║
╚═══════════════════════════════════════════════════════════════════╝

Objetivos:
- ✅ Checkout screen
- ✅ Stripe integration mobile
- ✅ Order confirmation
- ✅ Order tracking screen

Entregables Código:
  □ CheckoutScreen.tsx: resumen de orden
  □ Stripe integration (Card element)
  □ PaymentScreen.tsx: completar pago
  □ OrderConfirmationScreen.tsx
  □ OrderTrackingScreen.tsx: status live
  □ Push notification integration (FCM)

Entregables Documentación:
  □ CHECKOUT_FLOW.md

Testing:
  □ Proceed from cart → checkout
  □ Enter Stripe test card (4242...)
  □ Process payment
  □ Backend webhook: update order status
  □ App receives notification: "Order ready!"
  □ Show order details + status

Evaluación:
  □ Payment flow secure
  □ Error handling: declined cards, timeouts
  □ Confirmation screen clear
  □ Real-time updates via WebSocket/FCM
  □ No payment attempted twice

Horas estimadas: 25 horas
Equipo: 1 Mobile engineer + 0.5 Backend support

─────────────────────────────────────────────────────────────────

╔═══════════════════════════════════════════════════════════════════╗
║ SEMANA 12: ÓRDENES HISTORY & PROFILE                            ║
╚═══════════════════════════════════════════════════════════════════╝

Objetivos:
- ✅ View past orders
- ✅ Profile screen
- ✅ Logout functionality
- ✅ Polish & edge cases

Entregables Código:
  □ OrdersHistoryScreen.tsx
  □ ProfileScreen.tsx
  □ Logout functionality
  □ Settings screen (basic)
  □ Error boundaries
  □ Offline handling basics

Entregables Documentación:
  □ USER_GUIDE.md

Testing:
  □ View all my past orders
  □ Filter by status
  □ Tap order → show details
  □ Profile shows user info
  □ Logout → redirect to login
  □ Re-open app → auto-login if token valid

Evaluación:
  □ Caching: local data when offline
  □ Loading states
  □ Error messages helpful
  □ UX consistent
  □ All screens polished

Horas estimadas: 20 horas
Equipo: 1 Mobile engineer

═══════════════════════════════════════════════════════════════════
CHECKPOINT FASE A3 (Final Semana 12):
- Mobile app: ✅ Feature-complete
- Authentication: ✅ Login/Logout working
- Menu: ✅ Browse, search, filter
- Cart: ✅ Add, remove, total
- Checkout: ✅ Stripe integration
- Order tracking: ✅ Real-time updates
- UI/UX: ✅ Professional quality
- Testing: ✅ Manual tests passed
═══════════════════════════════════════════════════════════════════
```

#### FASE A4: INTEGRACIONES & ADMIN (Semanas 13-14)

```
╔═══════════════════════════════════════════════════════════════════╗
║ SEMANA 13: ADMIN PANEL (REACT WEB)                              ║
╚═══════════════════════════════════════════════════════════════════╝

Objetivos:
- ✅ Admin panel web
- ✅ Dashboard con órdenes
- ✅ Staff management
- ✅ Producto CRUD

Entregables Código:
  □ React project: Vite + TypeScript
  □ Login page (reutiliza API backend)
  □ Dashboard: lista órdenes en tiempo real
  □ OrderDetail modal
  □ ManageProductsPage: CRUD
  □ AnalyticsPage: stats básicos

Entregables Documentación:
  □ ADMIN_PANEL_GUIDE.md

Testing Manual:
  □ Admin logs in
  □ Dashboard carga órdenes live
  □ Accept order: status actualiza live
  □ Mark ready: notificación enviada
  □ Create/edit product
  □ Sell-out product: stock = 0

Evaluación:
  □ Real-time updates (WebSocket)
  □ Responsive design
  □ Table virtualization (10K+ rows)
  □ Actions confirmadas (prevent accidents)
  □ Audit trail visible

Horas estimadas: 25 horas
Equipo: 1 Frontend engineer

─────────────────────────────────────────────────────────────────

╔═══════════════════════════════════════════════════════════════════╗
║ SEMANA 14: FCM & NOTIFICACIONES                                 ║
╚═══════════════════════════════════════════════════════════════════╝

Objetivos:
- ✅ FCM integration completo
- ✅ Push notifications
- ✅ Notification handling
- ✅ Testing & debugging

Entregables Código:
  □ Firebase project setup
  □ Mobile: register FCM token
  □ Backend: send FCM messages
  □ Handle notifications foreground + background
  □ Deep linking: tap notification → order detail
  □ __tests__/notifications.test.ts

Entregables Documentación:
  □ NOTIFICATIONS.md: flow documentado

Testing:
  □ Order created: student recibe push "Order confirmed"
  □ Order accepted: "Comenzamos a preparar"
  □ Order ready: "¡Listo!" con sonido
  □ Tap notification: abre app en orden correcta
  □ Foreground: banner visible
  □ Background: agrega a notification tray

Evaluación:
  □ Delivery reliable (logs verifican)
  □ Timing correcto (inmediato)
  □ Contenido apropiado
  □ Deep linking funciona
  □ No crashes on notification

Horas estimadas: 20 horas
Equipo: 1 Backend + 1 Mobile engineer

═══════════════════════════════════════════════════════════════════
CHECKPOINT FASE A4 (Final Semana 14):
- Admin panel: ✅ Funcional y polished
- Real-time: ✅ WebSocket + FCM
- Notificaciones: ✅ End-to-end working
- Integración: ✅ Todas las piezas conectadas
═══════════════════════════════════════════════════════════════════
```

#### FASE A5: TESTING, DOCS & PRESENTACIÓN (Semanas 15-16)

```
╔═══════════════════════════════════════════════════════════════════╗
║ SEMANA 15: TESTING, DOCUMENTACIÓN & DEPLOYMENT                  ║
╚═══════════════════════════════════════════════════════════════════╝

Objetivos:
- ✅ 90%+ code coverage
- ✅ Documentación exhaustiva
- ✅ Deploy a staging (Heroku/AWS)
- ✅ Performance benchmarking

Entregables Código:
  □ Unit tests: 95% coverage
  □ Integration tests: all flows
  □ E2E tests: Detox (mobile) + Cypress (web)
  □ CI/CD pipeline (GitHub Actions)
  □ Deploy scripts
  □ Monitoring setup (Sentry)

Entregables Documentación:
  □ README.md completado
  □ SETUP.md: instrucciones para nuevo dev
  □ API.md: Swagger/OpenAPI actualizado
  □ DEPLOYMENT.md: cómo deployar
  □ TROUBLESHOOTING.md: FAQs y soluciones
  □ Architecture diagrams ASCII/Mermaid

Testing:
  □ Jest coverage: backend 90%+
  □ Detox: mobile happy path
  □ Cypress: admin panel critical flows
  □ Load testing: 100 concurrent users
  □ Performance: API p95 < 200ms

Evaluación:
  □ Test coverage meets requirement
  □ CI/CD pipeline automatizado
  □ Staging deployment working
  □ Monitoring alerts configured
  □ Logs accessible
  □ Documentation para production-like environment

Horas estimadas: 30 horas
Equipo: 2 engineers (1 QA focus, 1 DevOps)

─────────────────────────────────────────────────────────────────

╔═══════════════════════════════════════════════════════════════════╗
║ SEMANA 16: PRESENTACIÓN FINAL & REFACTORING                    ║
╚═══════════════════════════════════════════════════════════════════╝

Objetivos:
- ✅ Demo ready
- ✅ Presentation slides
- ✅ Code review pass
- ✅ Refactor issues

Entregables Código:
  □ Code review: todos los PRs aprobados
  □ Technical debt: issues cerradas
  □ Final refactor: código limpio
  □ Demo mode: seed data lista
  □ Video demo: 5-10 min walkthrough

Entregables Documentación:
  □ PRESENTATION.md: slides en markdown
  □ Demo script: paso a paso
  □ Architecture final diagram
  □ Lessons learned document

Demo (En vivo):
  □ Student app: login → browse menú → comprar café
  □ Backend: muestra logs (orden creada → pagada)
  □ Admin panel: ve orden nueva
  □ Admin acepta: notification llega al student
  □ Student ve status cambió: "Aceptada"
  □ Admin marca ready: push notification
  □ Student ve "¡Listo!" en tiempo real
  □ Total flow: 2-3 minutos

Presentación:
  □ Arquitectura explicada
  □ Decisiones técnicas justificadas
  □ Problemas solucionados
  □ Lessons learned
  □ Future work

Evaluación:
  □ Demo fluido sin crashes
  □ Presentación clara y profesional
  □ Código limpio (último review)
  □ Documentación completa
  □ Responde preguntas técnicas
  □ Manifiesta aprendizaje real

Horas estimadas: 25 horas
Equipo: Todos + CTO asesor

═══════════════════════════════════════════════════════════════════
CHECKPOINT FINAL (Semana 16):
- Sistema: ✅ Producción-ready
- Testing: ✅ 90%+ coverage, CI/CD
- Documentación: ✅ Exhaustiva
- Demo: ✅ Fluido y convincente
- Team: ✅ Capacitado en stack real
- Portafolio: ✅ Project profesional
═══════════════════════════════════════════════════════════════════
```

### Matriz de Responsabilidades

```
Semana  Backend Lead  Backend Eng 2  Mobile Eng  Frontend Eng  DevOps
────────────────────────────────────────────────────────────────────
1       LEAD          Support        Setup       -            LEAD
2       LEAD          LEAD           -           -            Support
3       LEAD          LEAD           -           -            -
4       Support       LEAD           -           -            -
5       LEAD          LEAD           -           -            -
6       LEAD          LEAD           -           -            Support
7       Support       LEAD           -           -            -
8       LEAD          LEAD           -           -            LEAD
9       -             -              LEAD        -            -
10      -             -              LEAD        -            -
11      Support       LEAD           LEAD        -            -
12      -             -              LEAD        -            -
13      -             -              -           LEAD         -
14      LEAD          -              LEAD        -            -
15      Support       LEAD           Support     Support      LEAD
16      LEAD          All            All         All          Support
```

### Hitos y Entregables por Fase

| Fase | Semanas | Hito Principal | Entregables Código | Entregables Docs | Estado |
|------|---------|------------------|-------------------|-----------------|--------|
| A1 | 1-4 | Setup + Fundamentos | Repo, Docker, Schema, Auth | Architecture.md, Database.md | ✅ |
| A2 | 5-8 | Backend Completo | Órdenes, Pagos, Admin, WebSocket | API.md, Security.md | ✅ |
| A3 | 9-12 | Mobile App | Login, Menu, Checkout, Tracking | Mobile guide | ✅ |
| A4 | 13-14 | Integraciones | Admin Panel, FCM, Real-time | Integration guide | ✅ |
| A5 | 15-16 | Deploy & Presentación | Tests, CI/CD, Monitoring | README, Deployment | ✅ |

---

## PARTE 8: RÚBRICA DE EVALUACIÓN UNIVERSITARIA

### Rúbrica General (100 puntos)

```
╔═══════════════════════════════════════════════════════════════════╗
║          RÚBRICA DE EVALUACIÓN — ITSUR Eats                      ║
║                   Proyecto de Titulación                         ║
║              Ingeniería en Sistemas — ITSUR                      ║
╚═══════════════════════════════════════════════════════════════════╝

Profesor: _________________
Equipo: __________________
Fecha: __________________
Calificación Final: ______/100

═══════════════════════════════════════════════════════════════════
RÚBRICA DETALLADA
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│ 1. ARQUITECTURA DEL SISTEMA (20 puntos)                         │
└─────────────────────────────────────────────────────────────────┘

[20] Excelente
  ✓ Arquitectura multicapa bien definida (Presentación, Servicios, Datos)
  ✓ Separación de concerns clara
  ✓ Patrones de diseño aplicados correctamente (MVC, Service Layer, Repository)
  ✓ Escalabilidad considerada desde el inicio
  ✓ Diagramas ER, de flujo, arquitectura precisos y completos
  ✓ Documentación de decisiones arquitectónicas

[15] Bueno
  ✓ Arquitectura multicapa presente pero con pequeños problemas
  ✓ Separación de concerns mayormente lograda
  ✓ Algunos patrones de diseño aplicados
  ✓ Diagramas presentes pero incompletos
  ✓ Documentación presente pero superficial

[10] Satisfactorio
  ✓ Arquitectura básica presente
  ✓ Algunos problemas en separación de concerns
  ✓ Patrones de diseño no siempre evidentes
  ✓ Diagramas básicos
  ✓ Documentación mínima

[5] Deficiente
  ✓ Arquitectura confusa o monolítica
  ✓ Falta separación de concerns
  ✓ Patrones de diseño ausentes
  ✓ Sin diagramas o erróneos
  ✓ Sin documentación

[0] No entregado / No aplica

Puntuación: _______/20

─────────────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────────┐
│ 2. CALIDAD DE CÓDIGO (20 puntos)                                │
└─────────────────────────────────────────────────────────────────┘

[20] Excelente
  ✓ Código limpio, legible, bien nombrado
  ✓ Sigue convenciones del lenguaje (camelCase, etc)
  ✓ Funciones pequeñas, con propósito único
  ✓ Comentarios significativos donde es necesario
  ✓ Sin código duplicado (DRY principle)
  ✓ Manejo de errores comprehensivo
  ✓ Type safety (TypeScript, tipos explícitos)

[15] Bueno
  ✓ Código mayormente limpio
  ✓ Convenciones seguidas
  ✓ Funciones tienen propósito claro
  ✓ Algunos comentarios presentes
  ✓ Poco código duplicado
  ✓ Manejo de errores en casos principales
  ✓ Tipos parcialmente aplicados

[10] Satisfactorio
  ✓ Código legible pero con áreas mejorables
  ✓ Convenciones parcialmente seguidas
  ✓ Funciones pueden ser más pequeñas
  ✓ Comentarios insuficientes
  ✓ Código duplicado presente
  ✓ Manejo de errores incompleto
  ✓ Tipos mínimos

[5] Deficiente
  ✓ Código difícil de leer
  ✓ Convenciones no seguidas
  ✓ Funciones muy grandes
  ✓ Sin comentarios o inapropiados
  ✓ Código muy duplicado
  ✓ Manejo de errores falta
  ✓ Sin tipos

[0] No entregado

Puntuación: _______/20

─────────────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────────┐
│ 3. SEGURIDAD & VALIDACIÓN (15 puntos)                           │
└─────────────────────────────────────────────────────────────────┘

[15] Excelente
  ✓ Autenticación: JWT con tokens, refresh mechanism, httpOnly cookies
  ✓ Autorización: RBAC implementado correctamente
  ✓ Validación: inputs validados en backend (Joi, etc)
  ✓ Datos sensibles: passwords hasheados, no se guarda tarjetas
  ✓ SQL injection: imposible (Prisma ORM)
  ✓ CORS configurado apropiadamente
  ✓ Rate limiting en endpoints críticos
  ✓ Audit logging de acciones importantes
  ✓ Manejo seguro de errores (no revelan internals)

[12] Bueno
  ✓ Autenticación presente, puede mejorar
  ✓ Autorización implementada
  ✓ Validación en backend
  ✓ Datos sensibles protegidos
  ✓ SQL injection mitigado
  ✓ CORS presente
  ✓ Rate limiting en algunos endpoints
  ✓ Audit logging parcial
  ✓ Errores generalmente manejados

[9] Satisfactorio
  ✓ Autenticación básica
  ✓ Autorización presente pero incompleta
  ✓ Validación parcial
  ✓ Protecciones básicas presentes
  ✓ Rate limiting ausente
  ✓ Audit logging mínimo
  ✓ Algunos riesgos de seguridad

[6] Deficiente
  ✓ Autenticación débil
  ✓ Autorización ausente o incorrecta
  ✓ Validación insuficiente
  ✓ Vulnerabilidades potenciales
  ✓ Sin rate limiting
  ✓ Sin audit logs
  ✓ Múltiples problemas de seguridad

[0] No implementado

Puntuación: _______/15

─────────────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────────┐
│ 4. BASE DE DATOS (15 puntos)                                    │
└─────────────────────────────────────────────────────────────────┘

[15] Excelente
  ✓ Schema normalizado (3NF)
  ✓ Relaciones correctas (1:N, M:N)
  ✓ Foreign keys implementadas
  ✓ Índices en columnas frecuentemente consultadas
  ✓ Constraints apropiados (unique, not null, check)
  ✓ Triggers para auditoría/timestamps
  ✓ ER diagram preciso
  ✓ Migraciones versionadas
  ✓ Seed data para testing

[12] Bueno
  ✓ Schema mayormente normalizado
  ✓ Relaciones correctas
  ✓ Foreign keys presentes
  ✓ Índices en tablas principales
  ✓ Algunos constraints
  ✓ Triggers parciales
  ✓ ER diagram presente
  ✓ Migraciones presentes
  ✓ Seed data disponible

[9] Satisfactorio
  ✓ Schema básico, algunas denormalizaciones
  ✓ Relaciones presentes
  ✓ Foreign keys en tablas principales
  ✓ Índices mínimos
  ✓ Constraints parciales
  ✓ Sin triggers
  ✓ ER diagram simple
  ✓ Migraciones básicas
  ✓ Seed data limitado

[6] Deficiente
  ✓ Schema con problemas de diseño
  ✓ Relaciones incorrectas
  ✓ Foreign keys faltantes
  ✓ Sin índices
  ✓ Constraints ausentes
  ✓ Sin ER diagram
  ✓ Sin migraciones versionadas
  ✓ Sin seed data

[0] No implementado

Puntuación: _______/15

─────────────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────────┐
│ 5. FUNCIONALIDAD & FEATURES (10 puntos)                         │
└─────────────────────────────────────────────────────────────────┘

[10] Excelente
  ✓ Todas las features requeridas implementadas
  ✓ Flujo de orden completo: login → menú → compra → pago → tracking
  ✓ Pagos (Stripe sandbox) funcionando
  ✓ Notificaciones (FCM) entregadas
  ✓ Admin panel completamente funcional
  ✓ Real-time updates (WebSocket)
  ✓ Sin bugs críticos

[8] Bueno
  ✓ Todas las features presentes
  ✓ Flujo principal funciona
  ✓ Pagos funcionan
  ✓ Notificaciones mayormente funcionales
  ✓ Admin panel funciona
  ✓ Real-time parcialmente funcional
  ✓ Algunos bugs menores

[6] Satisfactorio
  ✓ Mayoría de features presente
  ✓ Flujo principal parcialmente funciona
  ✓ Pagos con problemas menores
  ✓ Notificaciones funcionales pero incompletas
  ✓ Admin panel básico
  ✓ Sin real-time
  ✓ Algunos bugs afectan uso

[4] Deficiente
  ✓ Features faltantes
  ✓ Flujo incompleto
  ✓ Pagos no funcionales o ausentes
  ✓ Notificaciones ausentes/no funcionales
  ✓ Admin panel falta
  ✓ Bugs afectan funcionalidad principal

[0] No funcional / No entregado

Puntuación: _______/10

─────────────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────────┐
│ 6. TESTING (10 puntos)                                          │
└─────────────────────────────────────────────────────────────────┘

[10] Excelente
  ✓ Unit tests: 90%+ coverage
  ✓ Integration tests: flujos principales cubiertas
  ✓ E2E tests: mobile + admin funcionalidad crítica
  ✓ Tests organizados y bien nombrados
  ✓ Fixtures para test data
  ✓ CI/CD pipeline automatizado (GitHub Actions)
  ✓ Tests pasan en CI/CD

[8] Bueno
  ✓ Unit tests: 80%+ coverage
  ✓ Integration tests presentes
  ✓ E2E tests parciales
  ✓ Tests mayormente bien organizados
  ✓ Fixtures presentes
  ✓ CI/CD parcialmente configurado
  ✓ Tests mayormente pasan

[6] Satisfactorio
  ✓ Unit tests: 60%+ coverage
  ✓ Algunos integration tests
  ✓ E2E tests ausentes
  ✓ Tests básicamente organizados
  ✓ CI/CD minimal
  ✓ Algunos tests fallan

[4] Deficiente
  ✓ Unit tests: < 60% coverage
  ✓ Pocos integration tests
  ✓ Sin E2E tests
  ✓ Tests desorganizados
  ✓ Sin CI/CD
  ✓ Muchos tests fallan

[0] Sin tests / No implementado

Puntuación: _______/10

─────────────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────────┐
│ 7. UX/UI & USABILIDAD (10 puntos)                               │
└─────────────────────────────────────────────────────────────────┘

[10] Excelente
  ✓ UI limpia, profesional, intuitiva
  ✓ Navegación fluida
  ✓ Loading states visibles
  ✓ Error messages útiles
  ✓ Responsive design (mobile + tablet + web)
  ✓ Accesibilidad básica (labels, contraste)
  ✓ Performance: app rápida, smooth animations
  ✓ Sin crashes o freezes

[8] Bueno
  ✓ UI clara y usable
  ✓ Navegación funcional
  ✓ Loading states presentes
  ✓ Mensajes de error claros
  ✓ Responsive en dispositivos principales
  ✓ Accesibilidad parcial
  ✓ Performance buena
  ✓ Raro crash

[6] Satisfactorio
  ✓ UI funcional, pero puede mejorar
  ✓ Navegación clara
  ✓ Loading states parciales
  ✓ Mensajes de error presentes
  ✓ Responsive básico
  ✓ Accesibilidad mínima
  ✓ Performance aceptable
  ✓ Algunos crashes ocasionales

[4] Deficiente
  ✓ UI confusa
  ✓ Navegación difícil
  ✓ Sin loading states
  ✓ Mensajes de error ausentes
  ✓ No responsive
  ✓ Accesibilidad falta
  ✓ Performance problemas
  ✓ Crashes frecuentes

[0] No implementado / Inusable

Puntuación: _______/10

─────────────────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────────┐
│ 8. DOCUMENTACIÓN (10 puntos)                                    │
└─────────────────────────────────────────────────────────────────┘

[10] Excelente
  ✓ README.md exhaustivo
  ✓ SETUP.md: instrucciones claras
  ✓ ARCHITECTURE.md: diagrams + explicación
  ✓ API.md: todos los endpoints documentados
  ✓ DATABASE.md: schema explicado
  ✓ DEPLOYMENT.md: cómo deployar
  ✓ Código comentado donde es necesario
  ✓ Diagramas visuales (ER, flow, etc)
  ✓ Sin errores gramaticales/ortográficos

[8] Bueno
  ✓ README presente
  ✓ SETUP.md funcional
  ✓ ARCHITECTURE presente
  ✓ API documentada
  ✓ DATABASE documentada
  ✓ DEPLOYMENT presente
  ✓ Código comentado
  ✓ Algunos diagramas
  ✓ Pocos errores de ortografía

[6] Satisfactorio
  ✓ Documentación básica presente
  ✓ SETUP presente pero incompleto
  ✓ ARCHITECTURE presente
  ✓ API parcialmente documentada
  ✓ Algunos comentarios
  ✓ Diagramas mínimos
  ✓ Errores de ortografía presentes

[4] Deficiente
  ✓ Documentación escasa
  ✓ SETUP confuso
  ✓ ARCHITECTURE falta
  ✓ API sin documentar
  ✓ Pocos comentarios
  ✓ Sin diagramas
  ✓ Muchos errores

[0] Sin documentación / Ilegible

Puntuación: _______/10

═══════════════════════════════════════════════════════════════════
SUBTOTAL: _______/100
═══════════════════════════════════════════════════════════════════
```

### Evaluación de Presentación (20 puntos extra - Bonus)

```
[20] Excelente
  ✓ Demo fluida sin crashes
  ✓ Explicación clara de arquitectura
  ✓ Decisiones técnicas bien justificadas
  ✓ Equipo responde preguntas técnicas
  ✓ Mencionan lessons learned
  ✓ Future work identificado
  ✓ Presentación profesional (slides, diapositivas)
  ✓ Manejo del tiempo correcto
  ✓ Evidencia de aprendizaje real

[15] Bueno
  ✓ Demo funciona mayormente
  ✓ Explicación clara
  ✓ Decisiones justificadas
  ✓ Preguntas respondidas correctamente
  ✓ Lessons learned mencionados
  ✓ Future work presente
  ✓ Presentación clara
  ✓ Tiempo OK

[10] Satisfactorio
  ✓ Demo funciona pero con pequeños problemas
  ✓ Explicación clara pero superficial
  ✓ Decisiones mencionadas
  ✓ Algunas preguntas respondidas
  ✓ Lessons learned mencionados
  ✓ Future work básico
  ✓ Presentación funcional

[5] Deficiente
  ✓ Demo con problemas
  ✓ Explicación confusa
  ✓ Decisiones no claras
  ✓ Preguntas no respondidas bien
  ✓ Sin lessons learned
  ✓ Sin future work
  ✓ Presentación poco clara

[0] No presentado

Bonus Puntuación: _______/20 (Opcional)
```

### Escala Final

```
90-100: A (Sobresaliente)
80-89:  B (Muy Bueno)
70-79:  C (Bueno)
60-69:  D (Satisfactorio)
<60:    F (No aprobado)

Nota Final: _______
Firma Profesor: _______
Fecha: _______
```

---

## PARTE 9: DEMO FINAL "ORGULLO ITSUR"

### Escenario de Demo (5-7 minutos)

```
ACTO 1: ESTUDIANTE COMPRA CAFÉ (2 minutos)
─────────────────────────────────────────

[00:00] Pantalla: "ITSUR Eats"
  Equipo: "Buenos días, esto es ITSUR Eats, la plataforma
           de pedidos de nuestra cafetería."

[00:05] Open mobile app
  Pantalla: Login screen
  Estudiante: "Primero, necesito ser un estudiante. Voy a hacer login."
  
[00:10] Type: estudiante@itsur.edu.mx / password123
  Tap: "Login"
  Pantalla: Loading spinner (1 segundo)
  
[00:13] Backend: Server console muestra:
  "POST /auth/login - User 123 authenticated"
  Token generado, JWT verificado
  
[00:15] App transiciona a MenuScreen
  Pantalla: "Menú del Día" con categorías: Cafés, Desayunos, Postres
  Equipo: "Aquí vemos el menú de la cafetería en tiempo real.
           Cada producto se obtiene desde la base de datos."

[00:20] Scroll: Buscar "Cappuccino"
  Pantalla: Filtra productos
  Tap: Cappuccino card
  Pantalla: ProductDetail - precio $4.50, descripción
  
[00:25] Tap: "Add to Cart"
  Redux dispatch: addToCart action
  Toast: "Agregado al carrito"
  
[00:28] Bottom tab: "Cart"
  Pantalla: 1x Cappuccino - $4.50
  Tap: "Proceed to Checkout"
  
[00:31] CheckoutScreen
  Pantalla: Resumen de orden, total: $4.50
  Equipo: "El total se recalcula en el backend para evitar fraude."

─────────────────────────────────────────

ACTO 2: PAGO CON STRIPE (1 minuto)
─────────────────────────────────────────

[00:35] PaymentScreen
  Pantalla: Stripe card input
  Equipo: "Usamos Stripe en sandbox mode, así no hay dinero real.
           Voy a usar tarjeta de prueba."
  
[00:40] Type: "4242 4242 4242 4242" (Stripe test card)
  Type: "12/25" expiry, "123" CVC
  Tap: "Pay $4.50"
  
[00:43] Backend: Payment flow
  Console: "POST /payments/intent - Creating payment intent"
  Console: "Stripe ID: pi_xxx"
  
[00:45] Stripe webhook simulated:
  Console: "Webhook received - payment.succeeded"
  BD: Payment status = "SUCCEEDED"
  BD: Order status = "PAID"
  
[00:48] Mobile app receives update via WebSocket
  Toast: "¡Pago exitoso! Tu orden está en la cola."
  Pantalla: OrderConfirmationScreen
  Order ID: "ORD-A1B2C3"
  Status: "PAID"

─────────────────────────────────────────

ACTO 3: ADMIN/CAFETERÍA ACEPTA ORDEN (2 minutos)
─────────────────────────────────────────────────

[00:52] Tablet en cafetería (también app react native)
  Pantalla: Admin dashboard
  Equipo: "Aquí está la cafetería recibiendo órdenes en tiempo real.
           Los nuevos pedidos llegan instantáneamente vía WebSocket."
  
[00:57] Nueva orden aparece en tabla:
  Tabla:
    Order ID: ORD-A1B2C3
    Student: Juan Pérez
    Item: Cappuccino x1
    Status: PAID
    Time: 09:05 AM
  
[01:01] Barista/Staff toca botón: "ACCEPT"
  Backend updates: order.status = "ACCEPTED"
  Timeline in dashboard updates: "Aceptada hace 2 seg"
  
[01:03] Push notification sent vía FCM
  Backend: NotificationService.send(student_id, {...})
  Mobile app receives: Notification center popup
  "¡Orden Aceptada! Comenzamos a preparar tu café."
  
[01:05] Student app actualiza en tiempo real (WebSocket)
  OrderTrackingScreen:
  Status: ACCEPTED
  Timeline: "2 min ago - Accepted by Barista (Maria)"
  
[01:07] Equipo: "Pueden ver que la notificación llegó instantáneamente
         y el app del estudiante se actualizó en vivo."

─────────────────────────────────────────

ACTO 4: ORDEN LISTA (1 minuto)
─────────────────────────────────────────

[01:10] Barista prepara el café (aquí es puro teatro)
  Equipo: "El barista prepara el café... 30 segundos..."
  
[01:12] Barista toca: "READY"
  Backend: order.status = "READY"
  
[01:13] Mobile: HIGH PRIORITY FCM notification
  Sound + vibración (device emulator muestra)
  Title: "¡Tu orden está lista! 🎉"
  Body: "Retira en caja #2"
  
[01:15] Student app:
  OrderTrackingScreen actualiza:
  Status: READY (en verde, animado)
  Timeline: "Hace 2 seg - Order ready!"
  
[01:17] Equipo: "La notificación con audio y vibración garantiza
         que el estudiante no se pierda su orden. El sistema está
         completamente integrado: app, backend, base de datos,
         pagos y notificaciones en tiempo real."

─────────────────────────────────────────

ACTO 5: DEMOSTRACIÓN TÉCNICA (1 minuto)
─────────────────────────────────────────

[01:18] Screen share: Backend Terminal
  Equipo: "Veamos qué pasó en el backend."
  
  Logs mostrados:
  [09:05] POST /auth/login - User 123 authenticated (JWT generated)
  [09:06] POST /orders - Order ORD-A1B2C3 created, total: $4.50
  [09:07] POST /payments/intent - Stripe intent created
  [09:08] Webhook received - payment.succeeded
  [09:08] Order status updated: PAID
  [09:09] WebSocket emit: order:accepted to tablet
  [09:09] FCM message sent to student_id
  [09:10] Order status updated: READY
  [09:10] FCM message (high priority) sent
  
[01:21] Database audit log (SQL query)
  SELECT * FROM audit_logs WHERE order_id = 'ORD-A1B2C3':
  
  |action        |user_id|timestamp  |changes
  |ORDER_CREATED |123    |09:05:30   |{status:PENDING}
  |PAYMENT_OK    |NULL   |09:07:45   |{status:PAID}
  |ORDER_ACCEPTED|456    |09:08:10   |{status:ACCEPTED}
  |ORDER_READY   |456    |09:09:40   |{status:READY}
  
  Equipo: "Cada acción se registra para auditoría y debugging."

─────────────────────────────────────────

CIERRE
─────────────────────────────────────────

[01:25] Resumen en slides:
  
  ITSUR Eats en 5 minutos:
  ✓ Login seguro con JWT
  ✓ Menú en tiempo real desde BD
  ✓ Pago seguro (Stripe)
  ✓ Órdenes fluyen en real-time (WebSocket)
  ✓ Notificaciones confiables (FCM)
  ✓ Auditoría completa
  
  Stack usado:
  - Mobile: React Native + Expo
  - Backend: Express + Node.js
  - BD: PostgreSQL
  - Auth: JWT + bcrypt
  - Pagos: Stripe Sandbox
  - Real-time: Socket.io
  - Notificaciones: Firebase
  
  Aprendizajes clave:
  - Arquitectura escalable desde día 1
  - Seguridad (PCI-DSS compatible)
  - Testing + CI/CD
  - DevOps (Docker, AWS)
  
[01:28] Preguntas

Total Demo: 5 minutos 28 segundos ✓
```

---

## PARTE 10: DIFERENCIALES ACADÉMICOS (3 FEATURES)

### Feature 1: Analytics Dashboard en Tiempo Real

```
DIFERENCIAL ACADÉMICO #1: ANALYTICS DASHBOARD

¿Qué es?
────────
Dashboard para ADMIN/ITSUR que muestra métricas en tiempo real:
- Órdenes completadas hoy/semana
- Ingresos en tiempo real
- Ítems más vendidos
- Predicción de demanda

Cómo lo haría:

1. Backend (Express + Redis):
   - Evento: cuando order.status = 'COMPLETED'
   - Redis: incrementar contador de órdenes
   - Redis: agregar total a revenue counter
   - WebSocket: emit "metrics:update" cada 5 seg

2. Frontend (React):
   - Chart library: Recharts (simple + limpio)
   - Real-time líneas: Órdenes/hora
   - Tarta: Top 5 productos
   - Gauge: Revenue goal vs actual

3. Base de datos:
   - Tabla: analytics_snapshots (para histórico)
   - Trigger: cada hora, snapshot de métricas

Código ejemplo:

// Backend
io.on('connection', (socket) => {
  setInterval(() => {
    const ordersToday = redis.get('orders:today');
    const revenueToday = redis.get('revenue:today');
    socket.emit('metrics:update', { ordersToday, revenueToday });
  }, 5000);
});

// Frontend
<LineChart data={metricsHistory}>
  <Line type="monotone" dataKey="orders" stroke="#8884d8" />
  <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
</LineChart>

Por qué es diferenciador:
- 90% de proyectos académicos = CRUD básico
- Este tiene analytics en vivo = profesional
- Demuestra comprensión de eventos, Redis, real-time
- Impresiona en presentación
- Difícil de copiar (requiere arquitectura correcta)

Complejidad: MEDIA (1-2 semanas)
Líneas de código: ~500
Impacto visual: ALTO
```

### Feature 2: Predicción de Demanda con ML Lite

```
DIFERENCIAL ACADÉMICO #2: SMART FORECAST (ML Lite)

¿Qué es?
────────
Predicción simple de cuántas órdenes habrá en la próxima hora,
basada en histórico y patrones (sin deep learning complejo).

Cómo lo haría:

1. Backend (Node.js):
   - Cada hora: contar órdenes creadas
   - Guardar en tabla: hourly_metrics
   - Simple linear regression: 
     next_hour_orders = avg(last_7_days_same_hour) * trend

2. Algoritmo simple:
   ```javascript
   function predictNextHour() {
     // Obtener órdenes de las últimas 7 horas a esta misma
     const historicalOrders = await db.query(
       `SELECT COUNT(*) as count 
        FROM orders 
        WHERE EXTRACT(HOUR FROM created_at) = NOW() HOUR
        AND created_at > NOW() - interval 7 days`
     );
     
     // Promedio
     const avg = historicalOrders / 7;
     
     // Trend (son más órdenes a las 12pm que a las 9am?)
     const trend = getCurrentHour() < 12 ? 1.1 : 0.9;
     
     return Math.round(avg * trend);
   }
   ```

3. Frontend:
   - Mostrar predicción en admin panel
   - "Se esperan ~15 órdenes en próxima hora"
   - Color rojo si > 20, verde si < 10

4. Cron job:
   - Cada hora: predecir y guardar
   - Comparar predicción vs real
   - Medir accuracy (MAPE)

Implementación:
```typescript
// services/ForecastService.ts
export class ForecastService {
  async predictNextHour(): Promise<number> {
    const now = new Date();
    const hour = now.getHours();
    
    const historicalOrders = await prisma.order.groupBy({
      by: ['hour'],
      where: {
        createdAt: {
          gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      _count: true,
    });
    
    const avgOrders = historicalOrders.reduce((s, h) => s + h._count, 0) / 7;
    const trend = hour < 12 ? 1.15 : 0.85;
    
    return Math.round(avgOrders * trend);
  }

  async recordPredictionAccuracy(prediction: number, actual: number) {
    const mape = Math.abs((actual - prediction) / prediction) * 100;
    
    await prisma.forecast.create({
      data: {
        predicted: prediction,
        actual: actual,
        mape: mape,
        timestamp: new Date(),
      },
    });
  }
}
```

Por qué es diferenciador:
- Machine Learning = fancy word en CV
- Este es "ML lite" = entendible + impactante
- Demuestra estadística + programación
- Admin panel usa predicción = práctico
- Casi nadie hace esto en proyectos universitarios
- Genera conversación ("¿Cómo predice?")

Complejidad: MEDIA-BAJA (porque es simple)
Líneas de código: ~300
Impacto en venta (pitch): MUY ALTO
```

### Feature 3: Gamification con Badges & Leaderboard

```
DIFERENCIAL ACADÉMICO #3: GAMIFICATION (Badges + Leaderboard)

¿Qué es?
────────
Sistema de badges que se desbloquean por acciones, + leaderboard
semanal. Engancha usuarios sin ser superficial.

Badges que se desbloquean:
- 🎯 "Primera Orden" (completar 1 orden)
- ⭐ "Top Buyer" (top 10 de la semana)
- 🔥 "Streak" (comprar 5 días seguidos)
- 🌯 "Experimentador" (probar 10 productos diferentes)
- 🌅 "Madrugador" (compra antes de 08:00)
- 💎 "VIP" (gastar > $100 en mes)

Implementación:

1. Database:
   ```prisma
   model Badge {
     id String @id @default(cuid())
     name String // "First Order"
     icon String // emoji
     description String
     criteria String // JSON: {minOrders: 1}
     points Int // reward points
   }
   
   model UserBadge {
     id String @id @default(cuid())
     user User @relation(fields: [userId], references: [id])
     userId String
     badge Badge @relation(fields: [badgeId], references: [id])
     badgeId String
     unlockedAt DateTime @default(now())
     @@unique([userId, badgeId]) // prevent duplicates
   }
   
   model Leaderboard {
     id String @id @default(cuid())
     user User @relation(fields: [userId], references: [id])
     userId String
     weekStart DateTime
     rank Int
     points Int
     ordersCount Int
   }
   ```

2. Backend (triggered on order completion):
   ```typescript
   async function checkBadges(userId: string) {
     const user = await prisma.user.findUnique({
       where: { id: userId },
       include: { orders: true },
     });
     
     // Check "First Order"
     if (user.orders.length === 1) {
       await grantBadge(userId, "FIRST_ORDER");
     }
     
     // Check "Experimentador" (10 different products)
     const distinctProducts = new Set(
       user.orders
         .flatMap(o => o.items.map(i => i.productId))
     );
     if (distinctProducts.size >= 10) {
       await grantBadge(userId, "EXPERIMENTADOR");
     }
     
     // Check "Streak" (5 consecutive days)
     const streak = calculateStreak(user.orders);
     if (streak >= 5) {
       await grantBadge(userId, "STREAK");
     }
   }
   ```

3. Frontend (Profile screen):
   ```jsx
   <BadgesGrid>
     {userBadges.map(badge => (
       <BadgeCard
         key={badge.id}
         icon={badge.icon}
         name={badge.name}
         unlockedAt={badge.unlockedAt}
       />
     ))}
   </BadgesGrid>
   
   <Leaderboard>
     {leaderboard.map((entry, idx) => (
       <LeaderboardRow
         rank={idx + 1}
         user={entry.user.name}
         points={entry.points}
         isCurrentUser={entry.userId === userId}
       />
     ))}
   </Leaderboard>
   ```

4. Cron job (daily):
   ```typescript
   // Recalcular leaderboard
   schedule('0 0 * * *', async () => {
     const weekStart = startOfWeek(new Date());
     
     const standings = await prisma.order.groupBy({
       by: ['userId'],
       where: {
         createdAt: { gte: weekStart },
         status: 'COMPLETED',
       },
       _count: true,
       _sum: { total: true },
     });
     
     standings.forEach(async (standing, rank) => {
       await prisma.leaderboard.upsert({
         where: {
           userId_weekStart: {
             userId: standing.userId,
             weekStart: weekStart,
           },
         },
         update: {
           rank: rank + 1,
           points: standing._sum.total,
           ordersCount: standing._count,
         },
         create: {
           userId: standing.userId,
           weekStart: weekStart,
           rank: rank + 1,
           points: standing._sum.total,
           ordersCount: standing._count,
         },
       });
     });
   });
   ```

Por qué es diferenciador:
- Demuestra comprensión de gamification principles
- Íntegra frontend + backend + BD
- Visible en app = impresiona en demo
- Típico de apps profesionales (Starbucks, Duolingo)
- Cron jobs + scheduling = DevOps knowledge
- Potencial para monetización (badges premium)

Complejidad: MEDIA (2-3 semanas)
Líneas de código: ~800
Reusabilidad: ALTA (código aplicable a otros proyectos)
```

---

## RESUMEN FINAL

```
╔═══════════════════════════════════════════════════════════════════╗
║          ITSUR EATS — PROYECTO ACADÉMICO PROFESIONAL             ║
║                  Transformación Completada                       ║
╚═══════════════════════════════════════════════════════════════════╝

📚 DOCUMENTACIÓN ENTREGADA:
───────────────────────────
✅ Vol 1: Stack, Arquitectura, Repositorios, BD
✅ Vol 2: API REST (39 endpoints), Seguridad
✅ Vol 3: Plan semanal (16 semanas), Rúbrica, Demo

📊 COBERTURA:
─────────────
✅ Arquitectura: Multicapa, escalable, profesional
✅ Database: Normalizada, 8 tablas, triggers, auditoría
✅ API: 39 endpoints REST, validación, auth, errors
✅ Seguridad: JWT, bcrypt, PCI-DSS, CORS, rate limiting
✅ Testing: 90%+ coverage, CI/CD, tests unitarios + E2E
✅ Documentación: Exhaustiva, clara, profesional
✅ UX/UI: Mobile + admin web, tiempo real, notificaciones
✅ Diferenciales: Analytics, ML forecast, gamification

🎯 TIMELINE:
────────────
Semanas 1-4:   A1 - Fundamentos
Semanas 5-8:   A2 - Backend core
Semanas 9-12:  A3 - Mobile app
Semanas 13-14: A4 - Integraciones
Semanas 15-16: A5 - Testing, docs, presentación

📈 COMPLEJIDAD:
───────────────
Fácil:    Setup, Auth basic, CRUD órdenes
Medio:    Pagos, WebSocket, Admin panel
Difícil:  ML forecast, Gamification, Optim performance

💼 STACK ELEGIDO:
─────────────────
Frontend:    React Native (Expo) + React (web)
Backend:     Express + Node.js
BD:          PostgreSQL + Prisma
Auth:        JWT manual + bcrypt
Real-time:   Socket.io
Pagos:       Stripe Sandbox
Notif:       Firebase Cloud Messaging
Infra:       Docker + AWS/Heroku
Testing:     Jest + Detox + Cypress
CI/CD:       GitHub Actions

🏆 DIFERENCIALES ACADÉMICOS:
────────────────────────────
1. Analytics Dashboard (real-time)
2. ML Lite Forecast (predicción demanda)
3. Gamification (badges + leaderboard)

Todos implementables, educativos, y visibles en demo.

✍️ EVALUACIÓN:
───────────────
Rúbrica con 8 categorías / 100 puntos
- Arquitectura: 20 pts
- Código: 20 pts
- Seguridad: 15 pts
- BD: 15 pts
- Funcionalidad: 10 pts
- Testing: 10 pts
- UX/UI: 10 pts
- Documentación: 10 pts
+ Demo bonus: 20 pts

🎬 DEMO FINAL:
───────────────
5-7 minutos, flujo completo:
1. Login (2 min)
2. Menú → compra → pago (2 min)
3. Admin acepta + notificación (1.5 min)
4. Orden lista (0.5 min)
5. Technical deep-dive (1 min)

Sin crashes, profesional, convincente.

📚 LECCIONES APRENDIDAS:
────────────────────────
✓ Escalabilidad desde día 1 (save 2 semanas después)
✓ Testing ahorra bugs costosos (90% coverage)
✓ Seguridad NO es afterthought (JWT, PCI-DSS)
✓ Documentation = mejor que código (future devs)
✓ CI/CD automation = time saver (deploy en 1 click)
✓ Real-time features = high engagement (users love)
✓ Gamification = retention booster (psychology)
✓ Team communication > individual skills (success factor)

🚀 POST-PROYECTO:
──────────────────
- Deploy a producción (AWS, Heroku, Vercel)
- Recopilar feedback de estudiantes
- Versión v2 con mejoras
- Monetización (premium features)
- Expansión a otras universidades (multi-tenant)

═══════════════════════════════════════════════════════════════════

CONCLUSIÓN:

ITSUR Eats no es "un proyecto más" de ingeniería.

Es un portafolio profesional que demuestra:
✓ Thinking arquitectónico (no solo código)
✓ Full-stack capabilities (mobile + web + backend)
✓ Security mindset (JWT, validation, audit logging)
✓ Practical experience (real stack, real problems)
✓ Communication skills (documentación, presentación)
✓ Ability to learn (nuevas tecnologías, patterns)

Un estudiante con este proyecto en CV conseguirá:
- Entrevistas en empresas grandes
- Negociación de salario más alto
- Confianza para roles senior
- Network en tech community

ITSUR (la institución):
- Tendrá plataforma de pedidos funcional
- Referencia para próximos proyectos
- Marketing: "app propria desarrollada aquí"
- Potencial de monetización

═══════════════════════════════════════════════════════════════════

Documento preparado por: CTO Asesor Académico
Fecha: 20 de Enero de 2026
Status: COMPLETADO - LISTO PARA IMPLEMENTACIÓN
Complejidad: MEDIA ★★★★☆
Realismo: MUY ALTO ★★★★★
Viabilidad: 16 semanas (1 semestre académico)
Equipo: 5-7 estudiantes + 1 profesor asesor

Siguiente paso: Formar equipo + comenzar SEMANA 1
═══════════════════════════════════════════════════════════════════
```

---

**Fin de ACADEMIC_ENGINEERING_TRACK (Volumen 3/3)**

Documento completado y listo para presentación.

Total de documentación entregada:
- ITSUR_Eats/ACADEMIC_ENGINEERING_TRACK.md (~50KB)
- ITSUR_Eats/ACADEMIC_ENGINEERING_TRACK_VOL2.md (~65KB)
- ITSUR_Eats/ACADEMIC_ENGINEERING_TRACK_VOL3.md (~55KB)
- **TOTAL: ~170KB de especificación profesional**

Tiempo de desarrollo proyectado: 16 semanas
Equipo: 5-7 estudiantes + 1 profesor asesor
Viabilidad: ✅ 100% realista para universidad
