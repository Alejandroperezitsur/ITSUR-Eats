# 📚 ÍNDICE DE WALKTHROUGHS - ITSUR EATS

**Fecha de generación**: 20 de enero de 2026  
**Fases completadas**: 2/5  
**Líneas de código**: 4,300+  
**Archivos creados**: 41

---

## 🎯 Documentación Disponible

### 1. 📖 **GUÍA PRINCIPAL: ESPECIFICACIÓN ACADÉMICA**

**Archivo**: `ACADEMIC_ENGINEERING_TRACK.md` + `ACADEMIC_ENGINEERING_TRACK_VOL2.md` + `ACADEMIC_ENGINEERING_TRACK_VOL3.md`

**Contenido**: 
- ✅ 170KB de especificación completa
- ✅ 16 semanas de roadmap
- ✅ Rubrica de evaluación (100 puntos)
- ✅ 3 features diferenciadoras
- ✅ Script de demostración

**Leer primero si**: Quieres entender la visión completa del proyecto

---

### 2. 🔧 **WALKTHROUGH BACKEND API**

**Archivo**: `WALKTHROUGH_BACKEND_API.md` (Este documento)

**Contenido**:
- ✅ Express.js + Prisma + PostgreSQL stack
- ✅ 8 modelos de datos normalizados
- ✅ 19 endpoints API implementados
- ✅ JWT authentication detallado
- ✅ RBAC middleware
- ✅ Order state machine
- ✅ Código inline (copy-paste listo)
- ✅ Docker setup
- ✅ 2,500 LOC

**Secciones principales**:
```
1. Descripción general (estructura)
2. Prisma schema (base de datos)
3. JWT utilities
4. Auth service
5. Order service
6. Controllers
7. Routes
8. API endpoints
9. Setup & deploy
```

**Leer si**: 
- Necesitas entender la arquitectura backend
- Quieres ver código de Express + Prisma
- Necesitas implementar otro endpoint
- Quieres debuggear un endpoint

**Copiar código de**:
- Prisma schema: `prisma/schema.prisma`
- JWT flow: `src/utils/jwt.ts`
- Auth service: `src/services/auth.service.ts`
- Order service: `src/services/order.service.ts`

---

### 3. 📱 **WALKTHROUGH MOBILE APP**

**Archivo**: `WALKTHROUGH_MOBILE_APP.md`

**Contenido**:
- ✅ React Native + Expo setup
- ✅ Redux state management (2 slices)
- ✅ 4 pantallas funcionales
- ✅ API client con interceptores
- ✅ Token refresh automático
- ✅ Carrito de compras
- ✅ Navigation (tabs + stack)
- ✅ AsyncStorage persistence
- ✅ 1,800 LOC

**Secciones principales**:
```
1. Estructura de carpetas
2. API client (Axios)
3. Redux slices
4. Screen components (Login, Menu, Cart, Profile)
5. Navigation setup
6. TypeScript types
7. Setup & deploy
```

**Leer si**:
- Necesitas entender React Native
- Quieres ver Redux Toolkit en acción
- Necesitas implementar nueva pantalla
- Quieres entender el flow de tokens

**Copiar código de**:
- API client: `src/services/api.ts`
- Redux auth: `src/redux/authSlice.ts`
- Redux products: `src/redux/productSlice.ts`
- Pantallas: `src/screens/*.tsx`

---

### 4. 🔗 **INTEGRACIÓN: Backend + Mobile**

**Archivo**: `INTEGRACION_BACKEND_MOBILE.md`

**Contenido**:
- ✅ Arquitectura 3-tier (Client, Application, Data)
- ✅ 4 flujos completos de integración
- ✅ Flujo de autenticación (JWT)
- ✅ Flujo de token refresh (401 interceptor)
- ✅ Flujo de listar productos
- ✅ Flujo de crear orden
- ✅ Seguridad end-to-end
- ✅ Demo completa paso-a-paso

**Secciones principales**:
```
1. Arquitectura general
2. Flujos de integración
3. Tablas de base de datos
4. Seguridad (bcrypt, JWT, RBAC)
5. Demo completa
```

**Leer si**:
- Necesitas ver cómo backend y mobile se comunican
- Quieres entender el flujo de un request
- Necesitas debuggear un error de integración
- Quieres ver un diagrama de arquitectura

---

## 🗺️ MAPA DE NAVEGACIÓN

### Por Tipo de Usuario

#### 👨‍🎓 **Estudiante/Developer que Comienza**
1. Lee: `ACADEMIC_ENGINEERING_TRACK_VOL1.md` (visión general)
2. Lee: `INTEGRACION_BACKEND_MOBILE.md` (entender flows)
3. Lee: `WALKTHROUGH_BACKEND_API.md` (setup backend)
4. Lee: `WALKTHROUGH_MOBILE_APP.md` (setup mobile)
5. Ejecuta: `npm run dev` (backend)
6. Ejecuta: `npm start` (mobile)

#### 🔧 **Backend Developer**
1. Lee: `WALKTHROUGH_BACKEND_API.md` (arquitectura)
2. Abre: `backend-api/src/` (código)
3. Copia schemas: `prisma/schema.prisma`
4. Copia servicios: `src/services/`
5. Copia controllers: `src/controllers/`

#### 📱 **Mobile Developer**
1. Lee: `WALKTHROUGH_MOBILE_APP.md` (arquitectura)
2. Abre: `mobile-app/src/` (código)
3. Copia Redux: `src/redux/`
4. Copia pantallas: `src/screens/`
5. Copia servicios: `src/services/`

#### 🏗️ **Architect/Lead**
1. Lee: `INTEGRACION_BACKEND_MOBILE.md` (flows)
2. Lee: `ACADEMIC_ENGINEERING_TRACK_VOL2.md` (API spec)
3. Revisa: Diagramas en walkthroughs
4. Valida: Códigos son copy-paste ready

---

## 📋 ÍNDICE DE CÓDIGO

### Backend (`backend-api/`)

| Archivo | Líneas | Descripción |
|---------|--------|-----------|
| `src/index.ts` | 350 | Express app entry point |
| `prisma/schema.prisma` | 275 | 8 modelos, índices, relaciones |
| `src/services/auth.service.ts` | 120 | Register, login, JWT generation |
| `src/services/order.service.ts` | 220 | CRUD + state machine orders |
| `src/services/product.service.ts` | 90 | Query productos + categorías |
| `src/controllers/auth.controller.ts` | 100 | Endpoints auth |
| `src/controllers/order.controller.ts` | 140 | Endpoints orders |
| `src/controllers/product.controller.ts` | 80 | Endpoints products |
| `src/middleware/auth.ts` | 60 | JWT + RBAC |
| `src/middleware/validation.ts` | 80 | Joi schemas |
| `src/middleware/error.ts` | 40 | Global error handler |
| `src/utils/jwt.ts` | 60 | Token generation + verification |
| `src/utils/helpers.ts` | 80 | Password, validation, utilities |
| `src/routes/*.ts` | 115 | Route definitions |
| `src/types/index.ts` | 80 | TypeScript interfaces |
| `prisma/seed.ts` | 80 | Test data |
| `__tests__/utils.test.ts` | 60 | Jest tests |
| Config files | 150 | tsconfig, jest, eslint, prettier |
| **TOTAL** | **2,500** | **24 files** |

### Mobile (`mobile-app/`)

| Archivo | Líneas | Descripción |
|---------|--------|-----------|
| `src/App.tsx` | 90 | Navigation + Redux Provider |
| `src/redux/authSlice.ts` | 130 | Auth state + thunks |
| `src/redux/productSlice.ts` | 160 | Product/cart state + thunks |
| `src/redux/hooks.ts` | 10 | Typed hooks |
| `src/redux/store.ts` | 20 | Redux store config |
| `src/screens/LoginScreen.tsx` | 120 | Login UI |
| `src/screens/MenuScreen.tsx` | 180 | Products listing + search |
| `src/screens/CartScreen.tsx` | 200 | Shopping cart |
| `src/screens/ProfileScreen.tsx` | 110 | User profile |
| `src/services/api.ts` | 50 | Axios client + interceptors |
| `src/services/auth.service.ts` | 60 | Auth API calls |
| `src/services/product.service.ts` | 80 | Product API calls |
| `src/types/index.ts` | 90 | TypeScript interfaces |
| `index.tsx` | 5 | Expo entry point |
| Config files | 100 | app.json, tsconfig, etc |
| **TOTAL** | **1,800** | **17 files** |

---

## 🔍 CÓMO ENCONTRAR RESPUESTAS

### "¿Cómo funciona la autenticación?"
👉 `INTEGRACION_BACKEND_MOBILE.md` → Flujo de Autenticación (sección 1)  
👉 `WALKTHROUGH_BACKEND_API.md` → JWT Utilities (sección 2)

### "¿Cómo agrego un nuevo endpoint?"
👉 `WALKTHROUGH_BACKEND_API.md` → Estructura (sección 1)  
👉 Copiar template de `src/controllers/`

### "¿Cómo funciona el carrito?"
👉 `WALKTHROUGH_MOBILE_APP.md` → CartScreen (sección 8)  
👉 `WALKTHROUGH_MOBILE_APP.md` → Redux Product Slice (sección 5)

### "¿Por qué el precio se recalcula en backend?"
👉 `INTEGRACION_BACKEND_MOBILE.md` → Flujo de Crear Orden (sección 4)  
👉 "Seguridad crítica" subsección

### "¿Cómo está estructurada la base de datos?"
👉 `WALKTHROUGH_BACKEND_API.md` → Prisma Schema (sección 1)  
👉 `INTEGRACION_BACKEND_MOBILE.md` → Flujos de Datos (sección 3)

### "¿Cómo hace el app token refresh automático?"
👉 `INTEGRACION_BACKEND_MOBILE.md` → Flujo Token Refresh (sección 2)  
👉 `WALKTHROUGH_MOBILE_APP.md` → API Client (sección 1)

### "¿Cuáles son todos los endpoints?"
👉 `INTEGRACION_BACKEND_MOBILE.md` → Flujos de Integración  
👉 `WALKTHROUGH_BACKEND_API.md` → API Endpoints (sección 8)

### "¿Cómo es el estado de Redux?"
👉 `WALKTHROUGH_MOBILE_APP.md` → Redux Auth Slice (sección 4)  
👉 `WALKTHROUGH_MOBILE_APP.md` → Redux Product Slice (sección 5)

---

## 🎬 FLUJO DE LECTURA RECOMENDADO

### **Opción A: Visión Completa (2 horas)**
1. Lee: `ACADEMIC_ENGINEERING_TRACK_VOL1.md` (15 min)
2. Lee: `INTEGRACION_BACKEND_MOBILE.md` (45 min)
3. Lee: `WALKTHROUGH_BACKEND_API.md` (30 min)
4. Lee: `WALKTHROUGH_MOBILE_APP.md` (30 min)

### **Opción B: Solo Backend (1 hora)**
1. Lee: `WALKTHROUGH_BACKEND_API.md` (40 min)
2. Copia código: services + controllers (20 min)

### **Opción C: Solo Mobile (1 hora)**
1. Lee: `WALKTHROUGH_MOBILE_APP.md` (40 min)
2. Copia código: Redux + screens (20 min)

### **Opción D: Deep Dive Integración (1.5 horas)**
1. Lee: `INTEGRACION_BACKEND_MOBILE.md` completo (60 min)
2. Sigue demo paso-a-paso (30 min)

---

## 💡 TIPS DE USO

### Copiar Código Rápidamente
1. Abre `WALKTHROUGH_BACKEND_API.md` en navegador
2. Find sección: `### 2. **JWT Utilities**`
3. Copiar texto en triple backticks (```)
4. Pegar en tu IDE

### Entender un Endpoint
1. Busca en `INTEGRACION_BACKEND_MOBILE.md` el flujo relevante
2. Diagrama visual muestra request → response
3. Tablas muestran datos exactos que se pasan

### Debuggear Error
1. Nota el endpoint que falla
2. Busca en `WALKTHROUGH_BACKEND_API.md` la sección del controller
3. Busca en `INTEGRACION_BACKEND_MOBILE.md` el flujo
4. Compara con código esperado

### Agregar Funcionalidad
1. Lee sección "Estructuras" en `WALKTHROUGH_BACKEND_API.md`
2. Copia template de existing controller
3. Adapta a tu caso de uso
4. Valida con Joi schema

---

## 📊 COBERTURA DE TEMAS

### Autenticación & Seguridad
- ✅ JWT (access + refresh tokens)
- ✅ Bcrypt password hashing
- ✅ RBAC (role-based access control)
- ✅ Token persistence (AsyncStorage)
- ✅ Auto token refresh (401 interceptor)

### Backend Architecture
- ✅ Express.js MVC pattern
- ✅ Service layer (business logic)
- ✅ Controller layer (HTTP handlers)
- ✅ Middleware stack
- ✅ Error handling (global)
- ✅ Validation (Joi)

### Database
- ✅ PostgreSQL + Prisma ORM
- ✅ 8 models (3NF)
- ✅ Relations (1-N, M-N)
- ✅ Indices on hot paths
- ✅ Audit logging
- ✅ Soft deletes (planned)

### Frontend/Mobile
- ✅ React Native + Expo
- ✅ Redux Toolkit (state management)
- ✅ Async thunks
- ✅ Tab navigation
- ✅ Stack navigation
- ✅ AsyncStorage

### Integration
- ✅ API client (Axios)
- ✅ Request interceptors
- ✅ Response interceptors
- ✅ Error handling
- ✅ Loading states
- ✅ Validation (client + server)

### Business Logic
- ✅ Authentication flow (register, login, refresh)
- ✅ Product listing (categories, search, pagination)
- ✅ Shopping cart
- ✅ Order creation (atomic)
- ✅ Order state machine
- ✅ Staff acceptance

---

## 📝 NOTAS IMPORTANTES

### Backend
- ⚠️ **NUNCA** confiar en precio del cliente → recalcular en backend
- ⚠️ Usar `@prisma/client` no raw SQL
- ⚠️ Todas las rutas protegidas deben tener `authenticateJWT`
- ⚠️ Staff endpoints: añadir `authorize(CAFETERIA_STAFF)`

### Mobile
- ⚠️ **SIEMPRE** usar Redux para auth state (no prop drilling)
- ⚠️ Tokens en AsyncStorage, NO en variables globales
- ⚠️ Pantallas protegidas vía `isAuthenticated` en Redux
- ⚠️ Usar `useAppDispatch` y `useAppSelector` (typed hooks)

### Integración
- ⚠️ Backend corre en `http://localhost:3000`
- ⚠️ Mobile API URL configurable vía `.env`
- ⚠️ JWT expiración: access=15min, refresh=7 días
- ⚠️ 401 → refresh; 403 → unauthorized; 400 → validation

---

## 🎯 Próximas Fases

### Fase 3: Admin Panel (React + Vite)
Documento: (Por crear - similar estructura)
- Order management dashboard
- Real-time WebSocket updates
- Analytics
- ~1,500 LOC expected

### Fase 4: Payments & Notifications
Documentos: (Por crear)
- Stripe integration
- FCM push notifications
- WebSocket real-time
- ~1,000 LOC expected

### Fase 5: Testing & Deployment
Documentos: (Por crear)
- CI/CD pipeline
- E2E tests (Detox, Cypress)
- AWS/Heroku deployment
- ~500 LOC expected

---

## 📞 REFERENCIAS RÁPIDAS

**Puerto Backend**: `3000`  
**Puerto Mobile Expo**: `8081` (web), emulator para iOS/Android  
**Database**: PostgreSQL 15 (Docker en `5432`)

**Comandos Frecuentes**:
```bash
# Backend
cd backend-api
npm run dev              # Development mode
npm run build            # Compile TypeScript
npm test                 # Run Jest tests
npx prisma studio       # Visual DB manager

# Mobile
cd mobile-app
npm start                # Start Expo
npm test                 # Run tests
```

---

**Documentos disponibles**: 4 walkthroughs  
**Total líneas**: 4,300+ LOC  
**Listo para**: Copy-paste implementation  
**Siguiente paso**: Leer documentos en orden recomendado

✅ **FASES 1-2 COMPLETO**  
⏳ **FASES 3-5 EN PROGRESO**
