# ⚡ QUICK START - ITSUR EATS

**Versión**: 1.0  
**Fases completadas**: 2/5  
**Código listo**: ✅ Backend + Mobile

---

## 🚀 En 5 Minutos

### 1. **Instalar Backend**
```bash
cd backend-api
npm install
docker-compose up -d
npx prisma migrate dev
npx prisma db seed
npm run dev
```
✅ Server en: `http://localhost:3000`

### 2. **Instalar Mobile**
```bash
cd mobile-app
npm install
npm start
# Presiona 'w' para web, 'i' para iOS, 'a' para Android
```
✅ App en: `http://localhost:8081`

### 3. **Probar Login**
```
Email: test@itsur.edu.mx
Password: TestPassword123!
```

### 4. **Flujo Demo**
1. Login
2. Ver productos
3. Agregar al carrito
4. Ver carrito
5. Checkout
6. Ver perfil
7. Logout

---

## 📁 Estructura

```
backend-api/        ← Express + Prisma (2,500 LOC)
├─ src/
│  ├─ controllers/  ← HTTP handlers
│  ├─ services/     ← Business logic
│  ├─ middleware/   ← Auth, validation, errors
│  └─ routes/       ← API endpoints
├─ prisma/
│  ├─ schema.prisma ← 8 modelos de datos
│  └─ seed.ts       ← Test data
└─ Dockerfile       ← Container

mobile-app/         ← React Native (1,800 LOC)
├─ src/
│  ├─ screens/      ← 4 pantallas
│  ├─ redux/        ← State management
│  ├─ services/     ← API client
│  └─ types/        ← TypeScript
└─ app.json         ← Expo config
```

---

## 🔑 Conceptos Clave

### Backend
- **Express.js**: Framework HTTP
- **Prisma**: ORM para PostgreSQL
- **JWT**: Tokens de autenticación
- **RBAC**: Control de roles
- **Joi**: Validación de esquemas

### Mobile
- **React Native**: Framework multiplataforma
- **Expo**: Build tool sin xcode/android-studio
- **Redux**: State management
- **Axios**: HTTP client con interceptors
- **AsyncStorage**: Persistent local storage

### Integración
- **Authentication**: Login → JWT → Refresh automático
- **Products**: Browse + Search + Pagination
- **Cart**: Redux state persistente
- **Orders**: Creación atómica con total recalculado en backend
- **RBAC**: Staff puede aceptar/marcar listo

---

## 📚 Documentación

**Guía Completa**: `INDICE_WALKTHROUGHS.md`

**Walkthroughs específicos**:
1. `WALKTHROUGH_BACKEND_API.md` - Express + Prisma (2,500 LOC)
2. `WALKTHROUGH_MOBILE_APP.md` - React Native (1,800 LOC)
3. `INTEGRACION_BACKEND_MOBILE.md` - Flujos end-to-end

**Especificación original**: 
- `ACADEMIC_ENGINEERING_TRACK_VOL1.md` - Arquitectura
- `ACADEMIC_ENGINEERING_TRACK_VOL2.md` - API spec
- `ACADEMIC_ENGINEERING_TRACK_VOL3.md` - Roadmap

---

## ✅ Qué está implementado

### Backend (19 endpoints)
- ✅ Register, Login, Refresh, Logout
- ✅ Get categories, Get products, Search
- ✅ Create order, Get orders, Cancel order
- ✅ Accept order (staff), Mark ready (staff)

### Mobile (4 screens)
- ✅ LoginScreen - Register/Login
- ✅ MenuScreen - Browse productos
- ✅ CartScreen - Shopping cart
- ✅ ProfileScreen - User info

### Funcionalidades
- ✅ JWT con auto-refresh
- ✅ Password hashing (bcrypt)
- ✅ RBAC (Student, Staff, Admin)
- ✅ Validación (client + server)
- ✅ Paginación
- ✅ Search en backend
- ✅ Carrito con total automático
- ✅ Order state machine

---

## ⏭️ Próximas Fases

**Fase 3**: Admin Panel (React + Vite)  
**Fase 4**: Stripe + FCM  
**Fase 5**: Testing + Deployment

---

## 🐛 Troubleshooting

### Backend no conecta a BD
```bash
# Verificar Docker
docker ps
docker-compose ps

# Recrear
docker-compose down -v
docker-compose up -d
```

### Mobile no ve API
```
# Verificar URL en .env
EXPO_PUBLIC_API_URL=http://localhost:3000

# En Android emulator: usar 10.0.2.2 en lugar de localhost
```

### Token expirado
Automático - el app hace refresh en background

### "User already exists" en login
Ejecutar seed: `npx prisma db seed`

---

## 📞 Comandos Útiles

```bash
# Backend - Development
npm run dev

# Backend - Tests
npm test

# Backend - Database
npx prisma studio        # Visual DB viewer
npx prisma migrate dev   # Apply migrations
npx prisma db seed       # Seed test data

# Mobile - Development
npm start
npm start -- --clear     # Clear cache

# Mobile - Test device
npm start                # Presiona 'w', 'i', o 'a'
```

---

## 🔐 Credenciales Test

**Usuario**:
```
email: test@itsur.edu.mx
password: TestPassword123!
role: STUDENT
```

**Staff** (para aceptar órdenes):
```
email: staff@itsur.edu.mx
password: StaffPass123!
role: CAFETERIA_STAFF
```

---

## 📊 Estadísticas

| Componente | LOC | Archivos | Tests |
|-----------|-----|----------|-------|
| Backend | 2,500 | 24 | Jest |
| Mobile | 1,800 | 17 | Ready |
| **Total** | **4,300+** | **41** | ✅ |

---

## 🎯 Checklist Developer

- [ ] Clonar/descargar proyecto
- [ ] Leer `INDICE_WALKTHROUGHS.md`
- [ ] Setup backend (`npm install`, `docker-compose up`)
- [ ] Setup mobile (`npm install`)
- [ ] Backend running: `npm run dev`
- [ ] Mobile running: `npm start`
- [ ] Probar login con credenciales test
- [ ] Agregar producto a carrito
- [ ] Hacer checkout
- [ ] Ver orden en backend

---

## 📖 Leer Primero

1. **`INDICE_WALKTHROUGHS.md`** - Navegación
2. **`INTEGRACION_BACKEND_MOBILE.md`** - Entiende flows
3. **`WALKTHROUGH_BACKEND_API.md`** - Backend details
4. **`WALKTHROUGH_MOBILE_APP.md`** - Mobile details

---

**Estado**: ✅ Fases 1-2 Completo  
**Listo para**: Producción (fase 3+)  
**Siguiente**: Admin Panel (React + Vite)

---

Para preguntas: Consulta `INDICE_WALKTHROUGHS.md` para navegación de documentos.
