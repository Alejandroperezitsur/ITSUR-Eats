# 🎓 ITSUR Eats — Academic Engineering Track
## De Documentación a Sistema Real: Implementación Universitaria

**Documento Técnico de Ingeniería**
**Nivel**: Residencia Profesional / Proyecto de Titulación
**Duración**: 16 semanas (1 semestre académico completo)
**Equipo**: 5-7 estudiantes de Ingeniería en Sistemas
**Profesor Asesor**: CTO/Arquitecto de Software
**Institución**: ITSUR (Instituto Tecnológico Superior Universitario Regional)

---

## PARTE 1: STACK UNIVERSITARIO OPTIMIZADO

### Principios de Selección

| Criterio | Requisito | Razón Académica |
|----------|-----------|-----------------|
| **Costo** | $0-500 | Presupuesto universitario limitado |
| **Escalabilidad** | Up to 5,000 users | Realista para ITSUR |
| **Aprendizaje** | 2-4 semanas máximo | Time-to-productivity |
| **Productivo** | Profesional, no juguete | Portfolio calidad real |
| **Independencia** | Runnable offline inicialmente | Laptops normales |

### Stack Final Seleccionado

#### 📱 Frontend Móvil

```
Tecnología: React Native (Expo)
├─ Por qué: 
│  ✅ Write once, run everywhere (iOS + Android)
│  ✅ JavaScript (curva aprendizaje baja)
│  ✅ Hot reload (desarrollo rápido)
│  ✅ Expo elimina compilación nativa
│  ✅ Comunidad masiva (Stack Overflow)
│  ✅ Profesional (usado en producción real)
│
├─ Herramientas:
│  ├─ expo-cli (scaffolding)
│  ├─ Redux Toolkit (state management)
│  ├─ axios (HTTP client)
│  ├─ react-native-paper (UI components)
│  └─ jest + detox (testing)
│
├─ Versión: Expo 50 + React Native 0.73
└─ Costo: $0 (open source)

Defensa ante jurado:
"Expo permite desarrollo multiplataforma sin xcode/android studio,
 reduciendo fricción y permitiendo que 2 estudiantes hagan mobile
 en laptops normales sin hardware especializado."
```

#### 🔌 Backend API

```
Tecnología: Node.js + Express (NO NestJS por simplicidad)
├─ Por qué Express en lugar de NestJS:
│  ✅ Curva aprendizaje mucho más corta
│  ✅ Menos boilerplate
│  ✅ Perfecto para 50K líneas de código
│  ✅ Mismo conceptos (middleware, routing)
│  ✅ Fácil de testear y debuggear
│  ✅ Deployment trivial
│  ❌ NestJS = overkill para este scope
│
├─ Librerías:
│  ├─ express (servidor HTTP)
│  ├─ prisma (ORM type-safe)
│  ├─ jsonwebtoken (auth)
│  ├─ joi (validación)
│  ├─ socket.io (real-time)
│  ├─ stripe (pagos sandbox)
│  ├─ firebase-admin (notificaciones)
│  ├─ dotenv (configuración)
│  └─ cors (seguridad básica)
│
├─ Versión: Node 18 LTS + Express 4.x
└─ Costo: $0 (open source)

Defensa ante jurado:
"Express es el estándar de facto en NodeJS para APIs REST.
 Ofrece productividad máxima sin complejidad de frameworks
 enterprise. Migraciones a NestJS son triviales si se necesita."
```

#### 💾 Base de Datos

```
Tecnología: PostgreSQL 15 (Local + AWS RDS)
├─ Por qué PostgreSQL:
│  ✅ Relacional, ACID completo
│  ✅ JSON support (flexible schema)
│  ✅ Full-text search built-in
│  ✅ Triggers y funciones procedurales
│  ✅ Row-level security (para v5 multi-tenant)
│  ✅ Free tier en AWS (eligible)
│  ✅ Estándar industrial
│
├─ Desarrollo Local:
│  ├─ Docker container (postgres:15-alpine)
│  ├─ docker-compose.yml (one-command startup)
│  └─ Seed scripts (datos de prueba)
│
├─ Producción:
│  ├─ AWS RDS PostgreSQL (12 meses free tier eligible)
│  ├─ Automated backups
│  └─ Multi-AZ (99.95% uptime)
│
├─ Versión: PostgreSQL 15
└─ Costo: $0 primer año (AWS free tier)

Defensa ante jurado:
"PostgreSQL es 'el estándar gold' en bases de datos open-source.
 Local development con Docker permite a cada estudiante tener
 ambiente aislado sin conflictos."
```

#### 🔐 Autenticación & Autorización

```
Tecnología: JWT + Refresh Tokens (Sin Auth0 por costo)
├─ Implementación:
│  ├─ JWT tokens (access, 15 min expiry)
│  ├─ Refresh tokens (7 días en httpOnly cookies)
│  ├─ Role-based access control (RBAC)
│  └─ Guards middleware en Express
│
├─ Flujo:
│  1. User login (email + password)
│  2. Server genera JWT + refresh token
│  3. Mobile store access token (memory) + refresh (AsyncStorage)
│  4. Requests incluyen "Authorization: Bearer <token>"
│  5. Server valida firma JWT
│  6. Si expirado: refresh token genera new JWT
│
├─ Seguridad:
│  ✅ Passwords hasheadas (bcrypt)
│  ✅ HTTPS obligatorio (TLS 1.3 en prod)
│  ✅ Tokens firmados (HMAC-SHA256)
│  ✅ Refresh tokens en httpOnly (CSRF safe)
│  ✅ CORS whitelist (dominio específico)
│
└─ Costo: $0 (implementación manual)

Defensa ante jurado:
"JWT es el estándar de facto para stateless authentication en APIs REST.
 Implementación manual enseña criptografía real, no depender de SaaS."
```

#### 📧 Notificaciones Push

```
Tecnología: Firebase Cloud Messaging (FCM) - Sandbox
├─ Por qué FCM:
│  ✅ Free tier generoso (hasta 40M mensajes/mes)
│  ✅ iOS + Android nativo
│  ✅ Topic-based targeting
│  ✅ API simple desde backend
│
├─ Implementación académica:
│  ├─ Firebase project gratuito
│  ├─ Mobile app register para FCM tokens
│  ├─ Backend almacena tokens en BD
│  ├─ Cuando evento (order ready): server envía push
│  └─ Device recibe en background + foreground
│
├─ Versión: Firebase SDK latest
└─ Costo: $0 (free tier)

Defensa ante jurado:
"FCM es industry standard. Implementación sandbox permite
 aprender notification architectures sin invertir dinero."
```

#### 💳 Pagos (Simulados)

```
Tecnología: Stripe Sandbox (SIN pagar real)
├─ Flujo:
│  1. App abre checkout Stripe
│  2. User entra tarjeta TEST (4242 4242 4242 4242)
│  3. Stripe sandbox autoriza (no cobra)
│  4. Backend recibe webhook
│  5. Registra transacción en BD
│
├─ Beneficio académico:
│  ✅ Código idéntico a producción
│  ✅ Entienden PCI-DSS (nunca ve tarjeta real)
│  ✅ Webhooks + event handling
│  ✅ Error handling (declined cards, etc)
│
├─ Alternativa (si Stripe no quiere free tier):
│  ├─ Simulador local (mock payment gateway)
│  ├─ Mismo código, solo respuestas predefnidas
│  └─ Suficiente para aprender architecture
│
└─ Costo: $0 (sandbox infinito)

Defensa ante jurado:
"Sandbox Stripe permite aprender payment processing sin riesgos reales.
 Si falla, es simulado. Si funciona, mismo código sirve en producción."
```

#### ☁️ Hosting & DevOps

```
Tecnología: AWS Free Tier (Año 1 gratuito)
├─ Backend API:
│  ├─ EC2 t2.micro (free tier eligible)
│  ├─ OR Heroku free dyno (simpler, 1 dynho)
│  └─ OR Render.com free tier (Node.js friendly)
│
├─ Base de datos:
│  ├─ RDS PostgreSQL t3.micro (free tier)
│  ├─ 20 GB storage incluido
│  └─ Automated backups
│
├─ Frontend Móvil:
│  ├─ Expo cloud hosting (preview builds gratis)
│  ├─ iOS: TestFlight beta (gratuito)
│  ├─ Android: Google Play internal testing (gratuito)
│  └─ Production: Play Store $25 one-time
│
├─ Admin Panel (React):
│  ├─ Vercel free tier (Next.js)
│  ├─ Auto-deploy from GitHub
│  └─ Staging + production
│
├─ Monitoreo:
│  ├─ Sentry free tier (error tracking)
│  ├─ Papertrail (logs)
│  └─ Simple uptime monitoring
│
└─ Costo: $0 primer año (AWS free tier)
   Año 2: ~$50-100/mes (negligible)

Recomendación inicial: Heroku free tier (más simple para principiantes)
Luego migrar a AWS cuando pase evaluación.

Defensa ante jurado:
"Cloud deployment es parte esencial de ingeniería moderna.
 Free tiers permiten experiencia real sin costo."
```

#### 🔨 Herramientas de Desarrollo

```
Entorno local:
├─ Editor: VS Code (free, profesional)
├─ Version control: Git + GitHub (free)
├─ Database: Docker + docker-compose
├─ Testing: Jest + Supertest
├─ API Documentation: Swagger / OpenAPI
└─ Diagramas: Mermaid (text-based)

CI/CD:
├─ GitHub Actions (free for public repos)
├─ Automated testing on push
├─ Automated deploy on merge to main
└─ Status badges

Comunicación:
├─ GitHub Discussions (free)
├─ Discord (free, para equipo)
└─ Weekly standup meetings

Costo total: $0
```

### Tabla Comparativa: Por qué estas tecnologías

| Tecnología | Alternativa Rechazada | Por qué elegimos |
|------------|----------------------|-----------------|
| React Native | Swift/Kotlin nativo | Código compartido, 1 equipo vs 2 |
| Express | NestJS, Django | Simplicidad, curva aprendizaje |
| PostgreSQL | MongoDB, MySQL | ACID, enterprise standard |
| JWT manual | Auth0, Firebase Auth | Educativo, control total |
| FCM | SendGrid, Twilio | Integración móvil nativa |
| Stripe Sandbox | PayPal, Adyen | Más simple, mejor docs |
| AWS Free | DigitalOcean, Heroku | Credibilidad, tier más generoso |

### Costo Total de Stack

```
AÑO 1 (Desarrollo + Lanzamiento):
├─ Softwares: $0
├─ Hosting: $0 (AWS free tier)
├─ Dominios: $12 (1 año)
├─ SSL: $0 (Let's Encrypt)
├─ Herramientas: $0
└─ TOTAL: $12

AÑO 2+ (Operación):
├─ AWS RDS: $30/mes
├─ EC2: $10/mes (si escalamos)
├─ CDN: $5/mes
├─ Dominio: $12/año
├─ Monitoring: $0 (free tier)
└─ TOTAL: ~$600/año

Valor agregado educativo:
- Aprender stack profesional real: $INFINITO
- Portafolio de ingeniería: Invaluable
- Experiencia con AWS, PostgreSQL, React: Career-defining
```

---

## PARTE 2: ARQUITECTURA SIMPLIFICADA (REALISTA)

### Diagrama ASCII — Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                    ITSUR EATS ARCHITECTURE                      │
│                    Academic Edition - v1.0                      │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────────────────┐
                    │   3G/4G/WiFi NETWORK         │
                    └──────────────────┬───────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         │                             │                             │
         ▼                             ▼                             ▼
    ┌─────────┐                 ┌──────────┐              ┌─────────────┐
    │  Mobile │                 │  Web App │              │  Hardware   │
    │ iOS/Andr│ (React Native)  │ (React)  │              │  Tablet     │
    │  Expo   │                 │          │              │  (Cafetería)│
    └────┬────┘                 └────┬─────┘              └────┬────────┘
         │                           │                        │
         │ API REST HTTPS            │ API REST HTTPS         │ WebSocket
         │ JWT Auth                  │ JWT Auth               │ +REST
         │ Expo Notifications        │ -                      │
         │                           │                        │
         └───────────────┬───────────┴────────────┬───────────┘
                         │                        │
                   ┌─────▼────────────────────────▼──────┐
                   │   🔑 API Gateway / Load Balancer    │
                   │   - CORS Whitelist                  │
                   │   - Rate Limiting (100 req/min)     │
                   │   - HTTPS/TLS 1.3                   │
                   │   - Request validation              │
                   └─────┬────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    ┌─────────┐    ┌──────────┐   ┌──────────────┐
    │ Auth    │    │ Orders   │   │ Menu         │
    │ Service │    │ Service  │   │ Service      │
    │         │    │          │   │              │
    │ (JWT)   │    │ (Orders) │   │ (Categories) │
    └────┬────┘    └────┬─────┘   └────┬─────────┘
         │              │              │
         │              ▼              │
         │         ┌──────────────────┐│
         │         │ WebSocket Server ││ (Real-time)
         │         │ (Socket.io)      ││ - Order updates
         │         │                  ││ - Status changes
         │         └──────────────────┘│
         │              │              │
         └──────────────┬──────────────┘
                        │
            ┌───────────┴──────────┐
            │                      │
            ▼                      ▼
        ┌─────────────┐      ┌────────────────┐
        │ PostgreSQL  │      │  FCM Service   │
        │ Database    │      │  (Notifications)
        │             │      │                │
        │ • Users     │      │  - Push tokens │
        │ • Orders    │      │  - Topics      │
        │ • Products  │      │  - Messages    │
        │ • Payments  │      │                │
        │ • Roles     │      └────────────────┘
        └─────────────┘             │
                                    │ Firebase SDK
                                    ▼
                            ┌──────────────────┐
                            │  Device (mobile) │
                            │  Background Push │
                            └──────────────────┘
```

### Diagrama Lógico — Capas

```
┌────────────────────────────────────────────────────────────────────┐
│                          PRESENTACIÓN                              │
│  ┌─────────────┬────────────┬──────────────┐                       │
│  │ Mobile App  │ Web Admin  │ Cafetería Tab│                       │
│  │ (Estudiante)│ (ITSUR)    │ (Barista)    │                       │
│  └─────────────┴────────────┴──────────────┘                       │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                      CAPA DE SERVICIOS API                         │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Express.js Router + Middleware                              │  │
│  │                                                              │  │
│  │ Routes:                                                      │  │
│  │ ├─ POST /auth/register      (JWT generation)               │  │
│  │ ├─ POST /auth/login         (Token refresh)                │  │
│  │ ├─ GET  /products           (Menu + búsqueda)              │  │
│  │ ├─ POST /orders             (Crear pedido)                 │  │
│  │ ├─ GET  /orders/:id         (Detalles pedido)              │  │
│  │ ├─ PUT  /orders/:id/accept  (Cafetería acepta)             │  │
│  │ ├─ PUT  /orders/:id/cancel  (Cancelar pedido)              │  │
│  │ ├─ POST /payments/intent    (Crear payment)                │  │
│  │ ├─ POST /payments/webhook   (Stripe callback)              │  │
│  │ └─ WebSocket: /orders       (Real-time updates)            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Middleware:                                                       │
│  ├─ authenticateJWT (valida tokens)                               │
│  ├─ authorizeCafeteria (solo personal cafetería)                  │
│  ├─ validateBody (Joi schemas)                                    │
│  ├─ rateLimiter (100 req/min por IP)                              │
│  ├─ corsWhitelist (dominios permitidos)                           │
│  └─ errorHandler (respuestas consistentes)                        │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                      CAPA DE NEGOCIOS                              │
│                                                                    │
│  ├─ AuthService        (login, JWT, refresh)                      │
│  ├─ OrderService       (crear, actualizar, cancelar)              │
│  ├─ PaymentService     (Stripe integration, webhook)              │
│  ├─ MenuService        (productos, categorías, búsqueda)          │
│  ├─ NotificationService (FCM push tokens, enviar)                │
│  ├─ ValidationService  (business rules)                           │
│  └─ AuditService       (logs de eventos)                          │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                      CAPA DE DATOS (Prisma ORM)                    │
│                                                                    │
│  Modelos:                                                          │
│  ├─ User (estudiantes, personal cafetería)                        │
│  ├─ Role (STUDENT, CAFETERIA_STAFF, ADMIN)                        │
│  ├─ Product (items de menú)                                       │
│  ├─ Order (pedidos)                                               │
│  ├─ OrderItem (items dentro de pedido)                            │
│  ├─ Payment (transacciones)                                       │
│  ├─ FcmToken (notificaciones push)                                │
│  ├─ AuditLog (auditoría)                                          │
│  └─ Category (categorías de producto)                             │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                      BASE DE DATOS                                 │
│         PostgreSQL (Local development + AWS RDS prod)              │
└────────────────────────────────────────────────────────────────────┘
```

### Matriz: Qué corre dónde

| Componente | Localización | Runtime | Requisitos | Criticidad |
|-----------|-------------|---------|-----------|-----------|
| **Mobile App** | Cliente | React Native (Expo) | iOS 13+ / Android 8+ | CRÍTICO |
| **Express API** | Cloud | Node.js 18 | Docker + 512MB RAM | CRÍTICO |
| **PostgreSQL** | Cloud | PostgreSQL 15 | 5GB disk, 1GB RAM | CRÍTICO |
| **WebSocket** | Cloud | Socket.io en Express | 256MB RAM adicional | IMPORTANTE |
| **FCM** | Cloud | Firebase SDK | API key | IMPORTANTE |
| **Web Admin** | Cloud | React 18 + Vercel | Static hosting | IMPORTANTE |
| **Cafetería Tablet** | Local | React 18 (web) | Tablet + WiFi | IMPORTANTE |
| **Docker Local** | Dev | Docker Desktop | Laptop 8GB RAM | IMPORTANTE |

### Decisiones Arquitectónicas Documentadas

#### Decisión 1: Express vs NestJS

```
Problema: Necesitamos framework robusto para API

Opciones evaluadas:
A) Express (minimal)
B) NestJS (enterprise)
C) Fastify (performance)

Decisión: Express

Justificación:
- ✅ Curva aprendizaje: 1-2 semanas vs 4-6 semanas NestJS
- ✅ Boilerplate: Mínimo, enfoque en lógica
- ✅ Deployment: Trivial (un archivo)
- ✅ Comunidad: 25M downloads/semana
- ✅ Extensibilidad: Si necesitamos NestJS después, mismo patrón

Riesgo mitigado:
- Si escalamos beyond 50K users → migración a NestJS
- Pero con Express llegamos ahí sin problemas

Aprobación: ✅ Equipo + Profesor
```

#### Decisión 2: PostgreSQL local con Docker vs SQLite

```
Problema: Ambiente de desarrollo aislado para 7 estudiantes

Opciones:
A) SQLite en archivo (simplista)
B) PostgreSQL local (complejo)
C) PostgreSQL Docker (mejor de ambos)

Decisión: PostgreSQL Docker

Justificación:
- ✅ Mismo motor que producción (AWS RDS)
- ✅ Reproducibilidad: cada dev ambiente idéntico
- ✅ No hay conflictos de estado
- ✅ Fácil reset: docker-compose down/up
- ✅ Aprendizaje: DevOps basics

Setup requerido:
- Docker Desktop (1 click install)
- docker-compose.yml (provided)
- 1 minuto setup

Aprobación: ✅ Equipo + Profesor
```

#### Decisión 3: Stripe Sandbox vs Mock Payment Gateway

```
Problema: Implementar transacciones sin cobrar real

Opciones:
A) Stripe Sandbox (free, pero requiere integración)
B) Mock local (simple, pero no realista)
C) Paddle Sandbox (alternativa)

Decisión: Stripe Sandbox + Mock fallback

Justificación:
- ✅ Stripe sandbox = producción idéntica
- ✅ Aprenden PCI-DSS
- ✅ Webhooks real-time
- ✅ Si falla Stripe: mock local cubre
- ✅ Free tier infinito

Riesgo mitigado:
- Si Stripe rechaza proyecto educativo → mock
- Pero código es 100% intercambiable

Aprobación: ✅ Equipo + Profesor
```

#### Decisión 4: JWT Manual vs Auth0

```
Problema: Autenticación segura sin vendor lock-in

Opciones:
A) Auth0 (completo, pero caro después)
B) Firebase Auth (Google, pero dependencia)
C) JWT manual (control total, educativo)

Decisión: JWT manual

Justificación:
- ✅ Comprenden criptografía real
- ✅ Zero vendor lock-in
- ✅ Implementación ~150 líneas
- ✅ Escalable indefinidamente
- ✅ Portafolio: demuestran conocimiento

Seguridad:
- Passwords: bcrypt (10 rounds)
- Tokens: HMAC-SHA256
- Storage: httpOnly cookies (refresh tokens)
- Expiry: 15min (access), 7 días (refresh)

Aprobación: ✅ Equipo + Profesor
```

### Flujo de Datos: Pedido Completo

```
Flujo: Un estudiante ordena café ☕

1. CLIENTE INICIA SESIÓN
   ┌─────────────────────────────────┐
   │ Mobile App                      │
   │ POST /auth/login                │
   │ Body: {email, password}         │
   └────────────┬────────────────────┘
                │
                ▼
   ┌─────────────────────────────────┐
   │ Backend - AuthService           │
   │ 1. Hash password con bcrypt     │
   │ 2. Comparar con BD              │
   │ 3. Si OK: generar JWT           │
   │ 4. Guardar refresh token        │
   └────────────┬────────────────────┘
                │
                ▼
   ┌─────────────────────────────────┐
   │ Response:                       │
   │ {                               │
   │   accessToken: "jwt...",        │
   │   expiresIn: 900,               │
   │   user: {...}                   │
   │ }                               │
   │ httpOnly cookie: refreshToken   │
   └─────────────────────────────────┘

2. CLIENTE VE MENÚ
   ┌─────────────────────────────────┐
   │ Mobile App                      │
   │ GET /products?category=cafe     │
   │ Header: Authorization: Bearer.. │
   └────────────┬────────────────────┘
                │ (JWT validado en middleware)
                ▼
   ┌─────────────────────────────────┐
   │ Backend - MenuService           │
   │ 1. Validar JWT                  │
   │ 2. Query PostgreSQL             │
   │    SELECT * FROM products       │
   │    WHERE category_id = 'cafe'   │
   │    AND available = true         │
   └────────────┬────────────────────┘
                │
                ▼
   ┌─────────────────────────────────┐
   │ Response: [{id, name, price}...]│
   └─────────────────────────────────┘

3. CLIENTE CREA PEDIDO
   ┌─────────────────────────────────┐
   │ Mobile App                      │
   │ POST /orders                    │
   │ Body: {                         │
   │   items: [                      │
   │     {productId, quantity}       │
   │   ]                             │
   │ }                               │
   └────────────┬────────────────────┘
                │
                ▼
   ┌─────────────────────────────────┐
   │ Backend - OrderService          │
   │ 1. Validar JWT                  │
   │ 2. Validar items existen        │
   │ 3. Calcular total               │
   │ 4. Crear record en BD           │
   │ 5. Emitir evento: ORDER_CREATED │
   └────────────┬────────────────────┘
                │
                ├─────────────────────────────┐
                │                             │
                ▼                             ▼
   ┌──────────────────────┐  ┌────────────────────────────────┐
   │ Event: ORDER_CREATED │  │ WebSocket: notificar cafetería│
   │ Subscribes:          │  │ (Socket.io emit)              │
   │ - PaymentService     │  │ "order:new" → Tablet barista  │
   │ - NotificationService│  └────────────────────────────────┘
   └──────────────────────┘

4. PAGO
   ┌─────────────────────────────────┐
   │ Mobile App                      │
   │ POST /payments/intent           │
   │ Body: {orderId, amount}         │
   └────────────┬────────────────────┘
                │
                ▼
   ┌─────────────────────────────────┐
   │ Backend - PaymentService        │
   │ 1. Crear Stripe PaymentIntent   │
   │ 2. Guardar en BD                │
   │ 3. Retornar client_secret       │
   └────────────┬────────────────────┘
                │
                ▼
   ┌─────────────────────────────────┐
   │ Mobile App - Stripe checkout    │
   │ User entra tarjeta TEST         │
   │ (4242 4242 4242 4242)           │
   └────────────┬────────────────────┘
                │
                ▼
   ┌─────────────────────────────────┐
   │ Stripe Sandbox                  │
   │ Autoriza (no cobra)             │
   │ Envía webhook                   │
   └────────────┬────────────────────┘
                │
                ▼
   ┌─────────────────────────────────┐
   │ Backend - Webhook               │
   │ POST /payments/webhook          │
   │ (verificar firma Stripe)        │
   │ 1. Buscar orderId               │
   │ 2. Actualizar payment status    │
   │ 3. Emitir evento: PAYMENT_OK    │
   └────────────┬────────────────────┘
                │
                ├─────────────────────────────┐
                │                             │
                ▼                             ▼
   ┌──────────────────────┐  ┌────────────────────────────────┐
   │ Event: PAYMENT_OK    │  │ Notificación FCM               │
   │ OrderService updates │  │ "Payment accepted" → Mobile    │
   │ order.status='PAID'  │  └────────────────────────────────┘
   └──────────────────────┘

5. CAFETERÍA ACEPTA
   ┌─────────────────────────────────┐
   │ Tablet (Cafetería)              │
   │ WebSocket conectado             │
   │ Ve orden nueva: "Café Grande"   │
   │ Toca botón: ACCEPT              │
   └────────────┬────────────────────┘
                │
                ▼
   ┌─────────────────────────────────┐
   │ WebSocket emit                  │
   │ "order:accept" {orderId}        │
   └────────────┬────────────────────┘
                │
                ▼
   ┌─────────────────────────────────┐
   │ Backend - OrderService          │
   │ 1. Validar cafeteria role       │
   │ 2. Actualizar status = ACCEPTED │
   │ 3. Emitir evento: ORDER_ACCEPTED│
   └────────────┬────────────────────┘
                │
                ├─────────────────────────────┐
                │                             │
                ▼                             ▼
   ┌──────────────────────┐  ┌────────────────────────────────┐
   │ WebSocket update     │  │ FCM Push notification          │
   │ "order:accepted"     │  │ "Orden aceptada! En prep..."   │
   │ → Mobile real-time   │  │ → Device estudiante            │
   └──────────────────────┘  └────────────────────────────────┘

6. ESTUDIANTE RETIRA
   ┌─────────────────────────────────┐
   │ Tablet (Cafetería)              │
   │ Barista prepara café            │
   │ Toca botón: READY               │
   └────────────┬────────────────────┘
                │
                ▼
   ┌─────────────────────────────────┐
   │ WebSocket emit                  │
   │ "order:ready" {orderId}         │
   └────────────┬────────────────────┘
                │
                ▼
   ┌─────────────────────────────────┐
   │ Backend - OrderService          │
   │ 1. Validar orderId              │
   │ 2. Actualizar status = READY    │
   │ 3. Guardar timestamp ready_at   │
   └────────────┬────────────────────┘
                │
                ├─────────────────────────────┐
                │                             │
                ▼                             ▼
   ┌──────────────────────┐  ┌────────────────────────────────┐
   │ WebSocket broadcast  │  │ FCM Push - ALTO PRIORITY       │
   │ "order:ready"        │  │ "¡Listo! Retira en caja 3"    │
   │ → Mobile estudiante  │  │ → Device estudiante (sonido)   │
   └──────────────────────┘  └────────────────────────────────┘

7. CICLO COMPLETO
   ┌─────────────────────────────────┐
   │ Mobile App                      │
   │ GET /orders/:id                 │
   │ Status = "READY"                │
   │ Estudiante retira de cafetería  │
   │ ¡ÉXITO!                         │
   └─────────────────────────────────┘

BD Audit Trail (AuditLog):
  - 08:30:15: ORDER_CREATED (student_id: 123, order_id: 456, amount: $4.50)
  - 08:30:22: PAYMENT_INITIATED (order_id: 456, stripe_id: pi_xxx)
  - 08:30:25: PAYMENT_SUCCESS (order_id: 456, amount: $4.50)
  - 08:30:28: ORDER_ACCEPTED (cafeteria_id: 1, order_id: 456)
  - 08:32:10: ORDER_READY (cafeteria_id: 1, order_id: 456)
```

---

## PARTE 3: ESTRUCTURA DE REPOSITORIOS REAL

### Repositorio principal: `itsur-eats`

```
itsur-eats/
│
├── 📱 mobile-app/               (React Native + Expo)
│   ├── src/
│   │   ├── components/          (Reutilizables: Button, Card, etc)
│   │   │   ├── OrderCard.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   └── ...
│   │   ├── screens/             (Vistas principales)
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── MenuScreen.tsx
│   │   │   ├── CartScreen.tsx
│   │   │   ├── OrdersScreen.tsx
│   │   │   ├── OrderDetailScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   ├── services/            (Lógica de negocio)
│   │   │   ├── authService.ts   (Login, tokens)
│   │   │   ├── orderService.ts  (CRUD órdenes)
│   │   │   ├── menuService.ts   (Productos)
│   │   │   ├── paymentService.ts (Stripe)
│   │   │   └── notificationService.ts (FCM)
│   │   ├── redux/               (Estado global)
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── cartSlice.ts
│   │   │   │   ├── orderSlice.ts
│   │   │   │   └── menuSlice.ts
│   │   │   └── store.ts
│   │   ├── utils/               (Helpers)
│   │   │   ├── axiosConfig.ts   (HTTP client setup)
│   │   │   ├── validators.ts    (Validaciones)
│   │   │   ├── formatters.ts    (Formato de datos)
│   │   │   └── constants.ts     (URLs, keys, etc)
│   │   ├── navigation/          (React Navigation)
│   │   │   └── RootNavigator.tsx
│   │   ├── App.tsx              (Entry point)
│   │   └── index.ts
│   ├── __tests__/               (Tests con Jest + Detox)
│   │   ├── components/
│   │   ├── services/
│   │   └── integration/
│   ├── app.json                 (Expo config)
│   ├── eas.json                 (EAS Build config)
│   ├── package.json
│   └── README.md

├── 🔌 backend-api/              (Express + Node.js)
│   ├── src/
│   │   ├── routes/              (Express routers)
│   │   │   ├── auth.routes.ts   (POST /auth/login, /auth/register)
│   │   │   ├── products.routes.ts
│   │   │   ├── orders.routes.ts
│   │   │   ├── payments.routes.ts
│   │   │   └── admin.routes.ts
│   │   ├── middleware/          (Express middleware)
│   │   │   ├── authenticateJWT.ts
│   │   │   ├── authorizeCafeteria.ts
│   │   │   ├── validateBody.ts  (Joi)
│   │   │   ├── rateLimiter.ts
│   │   │   └── errorHandler.ts
│   │   ├── services/            (Lógica de negocio)
│   │   │   ├── AuthService.ts   (JWT, bcrypt)
│   │   │   ├── OrderService.ts  (Lógica de pedidos)
│   │   │   ├── PaymentService.ts (Stripe)
│   │   │   ├── MenuService.ts   (BD queries)
│   │   │   ├── NotificationService.ts (FCM)
│   │   │   └── AuditService.ts  (Logging)
│   │   ├── controllers/         (Request handlers)
│   │   │   ├── authController.ts
│   │   │   ├── orderController.ts
│   │   │   ├── paymentController.ts
│   │   │   └── menuController.ts
│   │   ├── models/              (Prisma - en prisma/ folder)
│   │   │   └── (ver prisma/ folder below)
│   │   ├── websocket/           (Socket.io handlers)
│   │   │   ├── orderGateway.ts  (Order updates real-time)
│   │   │   └── notificationGateway.ts
│   │   ├── utils/
│   │   │   ├── validators.ts    (Business logic validation)
│   │   │   ├── jwt.ts           (Token generation)
│   │   │   ├── stripe.ts        (Stripe config)
│   │   │   └── firebase.ts      (FCM config)
│   │   ├── config/
│   │   │   ├── database.ts      (Prisma client)
│   │   │   └── env.ts           (Environment variables)
│   │   ├── app.ts               (Express app setup)
│   │   └── server.ts            (Entry point)
│   ├── prisma/
│   │   ├── schema.prisma        (Database schema)
│   │   └── migrations/          (Auto-generated)
│   │       ├── 001_init/
│   │       ├── 002_add_audit/
│   │       └── ...
│   ├── __tests__/               (Jest unit + integration tests)
│   │   ├── unit/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── integration/
│   │   │   ├── auth.test.ts
│   │   │   ├── orders.test.ts
│   │   │   └── payments.test.ts
│   │   └── fixtures/            (Test data)
│   ├── .env.example             (Template de variables)
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   ├── Dockerfile               (Para deployment)
│   └── README.md

├── 🎨 admin-panel/              (React web - Café Admin)
│   ├── src/
│   │   ├── components/
│   │   │   ├── OrderList.tsx
│   │   │   ├── OrderDetail.tsx
│   │   │   ├── MenuManager.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── OrdersPage.tsx
│   │   │   ├── MenuPage.tsx
│   │   │   └── AnalyticsPage.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useOrders.ts
│   │   │   └── useWebSocket.ts
│   │   ├── services/
│   │   │   ├── api.ts           (Axios instance)
│   │   │   └── websocket.ts     (Socket.io)
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── __tests__/
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md

├── 🗄️ database/
│   ├── schema/
│   │   ├── 00-init.sql          (Create tables)
│   │   ├── 01-add-audit.sql     (Audit logging)
│   │   ├── 02-add-indexes.sql   (Performance)
│   │   └── seed.sql             (Test data)
│   ├── migrations/
│   │   ├── V1__initial_schema.sql
│   │   └── (Flyway versioning)
│   ├── backups/
│   ├── docker-compose.yml       (Local PostgreSQL)
│   └── README.md

├── 📚 docs/
│   ├── API.md                   (Swagger/OpenAPI spec)
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md              (ER diagram, schema)
│   ├── SECURITY.md              (Auth, encryption, etc)
│   ├── DEPLOYMENT.md            (Cloud setup)
│   ├── TESTING.md               (Test strategy)
│   ├── CONTRIBUTING.md          (Dev guidelines)
│   └── sequences/               (Mermaid diagrams)
│       ├── auth-flow.md
│       ├── order-flow.md
│       └── payment-flow.md

├── ☁️ deployment/
│   ├── aws/
│   │   ├── cloudformation/      (IaC templates)
│   │   │   ├── vpc.yaml
│   │   │   ├── rds.yaml
│   │   │   ├── ec2.yaml
│   │   │   └── iam.yaml
│   │   ├── scripts/
│   │   │   ├── deploy.sh
│   │   │   ├── backup.sh
│   │   │   └── monitoring.sh
│   │   └── README.md
│   ├── heroku/
│   │   ├── Procfile
│   │   └── app.json
│   ├── docker/
│   │   ├── backend.dockerfile
│   │   ├── frontend.dockerfile
│   │   └── docker-compose.prod.yml
│   └── ci-cd/
│       ├── .github/workflows/
│       │   ├── test.yml         (Run tests on PR)
│       │   ├── deploy-staging.yml
│       │   └── deploy-prod.yml
│       └── README.md

├── 📋 .gitignore
├── 📋 .env.example
├── 📋 README.md (Project overview)
├── 📋 ROADMAP.md (Este documento)
└── 📋 SETUP.md (Instrucciones iniciales)
```

### Convenciones de Nombres

#### TypeScript/JavaScript

```
Clases & Interfaces:
✅ ClassName, UserService, OrderController
❌ userservice, OrderCtrl

Funciones & métodos:
✅ getUserById(), createOrder(), validateEmail()
❌ GetUserById, get_user_by_id

Constantes:
✅ MAX_RETRIES, JWT_SECRET, API_URL
❌ max_retries, jwtSecret

Variables:
✅ userId, orderTotal, isReady
❌ user_id, order_total, is_ready

Archivos:
✅ userService.ts, auth.routes.ts, OrderCard.tsx
❌ user-service.ts, authRoutes.ts
```

#### Database

```
Tablas (plural):
✅ users, orders, order_items, payments
❌ user, order

Columnas (snake_case):
✅ user_id, created_at, is_active
❌ userId, createdAt

ID columns:
✅ id (primary key)
✅ user_id, product_id (foreign keys)

Timestamps:
✅ created_at, updated_at, deleted_at
❌ createdDate, modifiedAt
```

#### Git Commits

```
Formato: <type>(<scope>): <subject>

Ejemplos válidos:
✅ feat(auth): add JWT token refresh
✅ fix(orders): resolve race condition on accept
✅ docs(api): update endpoint documentation
✅ test(payments): add Stripe webhook tests
✅ refactor(db): optimize user queries
✅ chore(deps): upgrade dependencies

Tipos:
- feat: Nueva funcionalidad
- fix: Bug fix
- docs: Documentación
- test: Tests
- refactor: Refactor de código
- chore: Dependencias, config, etc
- perf: Performance improvements
```

### Estándares de Código

```typescript
// ✅ CORRECTO

// 1. Imports organizados
import express, { Request, Response } from 'express';
import { prisma } from '@/config/database';
import { authenticateJWT } from '@/middleware/authenticateJWT';
import { validateBody } from '@/middleware/validateBody';

// 2. Tipos explícitos
interface CreateOrderRequest {
  items: Array<{ productId: string; quantity: number }>;
}

interface OrderResponse {
  id: string;
  userId: string;
  status: 'PENDING' | 'ACCEPTED' | 'READY' | 'COMPLETED';
  total: number;
  createdAt: Date;
}

// 3. Funciones con tipos
async function createOrder(
  req: Request<{}, {}, CreateOrderRequest>,
  res: Response<OrderResponse>,
): Promise<void> {
  try {
    const { userId } = req.user; // Del middleware JWT
    const { items } = req.body;

    // Validación
    if (!items || items.length === 0) {
      res.status(400).json({ error: 'Order must have items' });
      return;
    }

    // Lógica
    const order = await prisma.order.create({
      data: {
        userId,
        status: 'PENDING',
        items: {
          create: items,
        },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('CreateOrder error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// 4. Exportar
export const orderController = { createOrder };

// ❌ INCORRECTO

// - Tipos implícitos
const createOrder = (req, res) => { ... }

// - Imports sin orden
import validateBody from '../middleware/validateBody'
import { authenticateJWT } from '../../middleware/auth'
import express = require('express')

// - Sin manejo de errores
async function createOrder(req, res) {
  const order = await prisma.order.create({...})
  res.json(order)
}
```

---

## Continuación en siguiente documento...

**Este es el Volumen 1 de la transformación académica.**

Siguientes secciones (Documento 2):
- ✅ Base de Datos Académica Profesional
- ✅ API REST Completa (Endpoints reales)
- ✅ Sistema de Roles y Seguridad

---

**Documento preparado por**: CTO Asesor Académico
**Fecha**: 20 de Enero de 2026
**Status**: Completado (Parte 1-3)
**Próxima actualización**: Dentro de 24 horas
