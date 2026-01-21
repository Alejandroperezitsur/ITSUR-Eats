# 🚀 ITSUR Eats — Setup & Getting Started

**Documento de Inicio Rápido**
**Para**: Nuevos miembros del equipo
**Tiempo**: 30 minutos en total
**Profesor**: Usar esto para onboarding

---

## ⚡ Quick Start (30 minutos)

### Paso 1: Clonar Repositorio (3 minutos)

```bash
# Ir a tu carpeta de proyectos
cd ~/projects

# Clonar repo (cuando esté en GitHub)
git clone https://github.com/itsur/itsur-eats.git
cd itsur-eats

# Verificar estructura
ls -la
# Deberías ver:
# - mobile-app/
# - backend-api/
# - admin-panel/
# - database/
# - docs/
# - deployment/
```

### Paso 2: Instalar Dependencias (10 minutos)

#### Backend

```bash
cd backend-api

# Instalar Node.js (si no lo tienes)
# Descargar de https://nodejs.org (versión 18 LTS recomendada)

# Instalar dependencias
npm install

# Crear .env desde .env.example
cp .env.example .env

# Editar .env con tus valores locales
nano .env
# Deberías tener algo como:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/itsur_eats_dev
# JWT_SECRET=your_secret_here_change_in_prod
# STRIPE_SECRET_KEY=sk_test_xxx (sandbox key)
# FIREBASE_PROJECT_ID=your_firebase_project

# Generar cliente Prisma
npx prisma generate

# Crear BD + migraciones
npx prisma migrate dev

# Seed data (datos de prueba)
npx prisma db seed

# Verificar que compiló
npm run build
```

#### Mobile App

```bash
# Desde raíz del proyecto
cd mobile-app

# Instalar dependencias
npm install

# Verificar Expo
npx expo --version

# (No necesita más setup aquí, lo haremos al correr)
```

#### Admin Panel

```bash
cd admin-panel

npm install

# Crear .env
cp .env.example .env

# Editar si necesario
nano .env
```

### Paso 3: Levantar Backend (5 minutos)

```bash
cd backend-api

# Verificar que PostgreSQL está corriendo (via Docker)
docker ps
# Deberías ver contenedor postgres corriendo

# Si no está corriendo:
docker-compose up -d

# Esperar 5 segundos, luego iniciar backend
npm run dev

# Deberías ver:
# ✅ Server running on http://localhost:3000
# ✅ Database connected
# ✅ WebSocket server ready
```

### Paso 4: Levantar Mobile App (5 minutos)

```bash
# En otra terminal
cd mobile-app

# Iniciar Expo
npx expo start

# En consola verás:
# ▄▀▄▀▄▀ Press <i> for iOS / <a> for Android / <w> for web
# ▀▄▀▄▀▄

# Presionar 'w' para web preview (más fácil que emulador)
# Se abre en http://localhost:19000

# O si tienes Android Studio/Xcode:
# Presionar 'a' para Android / 'i' para iOS
```

### Paso 5: Verificar Setup (2 minutos)

```bash
# En el navegador, ir a:
http://localhost:3000/health

# Deberías ver:
# {"status": "ok", "database": "connected", "timestamp": "2026-01-20T..."}

# Intentar login:
# POST http://localhost:3000/auth/register
# Body: {
#   "email": "test@itsur.edu.mx",
#   "password": "TestPassword123",
#   "name": "Test User"
# }

# Deberías recibir token JWT

# ¡Éxito! Todo está corriendo.
```

---

## 📚 Documentos Clave Para Leer

| Documento | Propósito | Tiempo |
|-----------|-----------|--------|
| `ARCHITECTURE.md` | Entender diseño del sistema | 45 min |
| `ACADEMIC_ENGINEERING_TRACK_VOL1.md` | Stack y arquitectura | 30 min |
| `ACADEMIC_ENGINEERING_TRACK_VOL2.md` | API y base de datos | 1 hora |
| `docs/API.md` | Especificación de endpoints | 30 min |
| `docs/SECURITY.md` | Cómo funciona autenticación | 20 min |

**Lectura recomendada esta semana**: ARCHITECTURE.md + tu módulo específico (backend/mobile/frontend)

---

## 🏗️ Estructura de Carpetas (lo que necesitas saber)

```
itsur-eats/
│
├── backend-api/                ← Si trabajas BACKEND
│   ├── src/
│   │   ├── routes/            ← Aquí van los endpoints
│   │   ├── controllers/       ← Lógica de requests
│   │   ├── services/          ← Lógica de negocio
│   │   ├── middleware/        ← JWT, validation, etc
│   │   └── config/            ← Configuración
│   ├── prisma/schema.prisma   ← Esquema de BD
│   ├── .env.example           ← Template de variables
│   └── __tests__/             ← Tests unitarios
│
├── mobile-app/                 ← Si trabajas MOBILE
│   ├── src/
│   │   ├── screens/           ← Pantallas (LoginScreen, etc)
│   │   ├── components/        ← Componentes reutilizables
│   │   ├── services/          ← API calls, lógica
│   │   ├── redux/             ← State management
│   │   └── navigation/        ← Rutas de app
│   ├── app.json               ← Config Expo
│   └── __tests__/             ← Tests
│
├── admin-panel/                ← Si trabajas FRONTEND WEB
│   ├── src/
│   │   ├── pages/             ← Páginas principales
│   │   ├── components/        ← UI components
│   │   ├── hooks/             ← Lógica reutilizable
│   │   └── services/          ← API calls
│   └── __tests__/             ← Tests
│
├── docs/                       ← Documentación
│   ├── API.md                 ← Endpoints
│   ├── ARCHITECTURE.md        ← Diseño
│   ├── DATABASE.md            ← Schema
│   └── SECURITY.md            ← Auth & security
│
└── database/                   ← BD setup
    ├── docker-compose.yml     ← PostgreSQL local
    ├── schema/
    └── migrations/
```

---

## 💻 Comandos Útiles (por rol)

### Para BACKEND Engineer

```bash
cd backend-api

# Desarrollo
npm run dev                      # Start con hot reload
npm run build                    # Compilar TypeScript
npm test                         # Correr tests
npm run test:watch              # Tests con hot reload

# Base de datos
npx prisma studio              # GUI para ver BD
npx prisma migrate dev          # Hacer migración
npx prisma db seed             # Insertar datos de prueba

# Linting
npm run lint                    # Verificar código
npm run lint:fix                # Arreglarlo automáticamente

# Logs
npm run logs                    # Ver logs en producción
```

### Para MOBILE Engineer

```bash
cd mobile-app

# Desarrollo
npx expo start                  # Iniciar
npm test                        # Correr tests
npm run lint                    # ESLint

# Compilación
npm run build                   # Preparar para deploy
eas build --platform ios        # Build iOS (requiere Expo account)
eas build --platform android    # Build Android

# Debugging
npx expo start --dev-client    # Con red inspector
```

### Para FRONTEND Engineer (Admin Panel)

```bash
cd admin-panel

# Desarrollo
npm run dev                     # Start con Vite
npm run build                   # Compilar
npm run preview                 # Preview de build
npm test                        # Tests
npm run lint                    # ESLint

# Deploy a Vercel (después)
vercel                          # Deploy automático
```

---

## 🔑 Variables de Entorno Requeridas

### Backend (.env)

```env
# ════════════════════════════════════
# DATABASE
# ════════════════════════════════════
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/itsur_eats_dev

# ════════════════════════════════════
# JWT & AUTH
# ════════════════════════════════════
JWT_SECRET=your_super_secret_key_change_in_production_min_32_chars
REFRESH_SECRET=your_refresh_secret_key_change_in_production_min_32_chars

# ════════════════════════════════════
# STRIPE (Sandbox)
# ════════════════════════════════════
STRIPE_SECRET_KEY=sk_test_xxx  # Obtener de dashboard Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_yyy
STRIPE_WEBHOOK_SECRET=whsec_test_zzz

# ════════════════════════════════════
# FIREBASE (FCM Notifications)
# ════════════════════════════════════
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# ════════════════════════════════════
# ENVIRONMENT
# ════════════════════════════════════
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# ════════════════════════════════════
# CORS
# ════════════════════════════════════
CORS_ORIGIN=http://localhost:19000,http://localhost:3001,http://localhost:5173
```

### Mobile App (.env)

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_ENVIRONMENT=development
```

### Admin Panel (.env)

```env
VITE_API_URL=http://localhost:3000
VITE_ENVIRONMENT=development
```

---

## 🧪 Verificar Todo Está Funcionando

### Test 1: Backend Health

```bash
# Terminal 1: Backend corriendo
cd backend-api && npm run dev

# Terminal 2: Probar endpoint
curl http://localhost:3000/health

# Expected: {"status":"ok","database":"connected","timestamp":"..."}
```

### Test 2: Autenticación

```bash
# Registrarse
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@itsur.edu.mx",
    "password": "TestPassword123",
    "name": "Test User"
  }'

# Expected: {"accessToken":"eyJh...","expiresIn":900,"user":{...}}

# Copiar el accessToken

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@itsur.edu.mx",
    "password": "TestPassword123"
  }'

# Expected: mismo token
```

### Test 3: Endpoint Autenticado

```bash
# Usar el token del step anterior
TOKEN="eyJh..."

# Obtener menú
curl -X GET http://localhost:3000/products \
  -H "Authorization: Bearer $TOKEN"

# Expected: [{"id":"...","name":"Cappuccino",...},...]
```

### Test 4: Mobile App

```bash
# Abrir en navegador (si usaste 'w' en Expo)
http://localhost:19000

# Hacer login con credenciales de test anterior
# Email: test@itsur.edu.mx
# Password: TestPassword123

# Deberías ver: menú con productos
```

---

## 🐛 Troubleshooting

### Error: `PostgreSQL connection refused`

```bash
# Verificar que Docker está corriendo
docker ps

# Si no aparece postgres, iniciar:
cd database
docker-compose up -d

# Esperar 10 segundos, reintentar
npm run dev
```

### Error: `JWT_SECRET not defined`

```bash
# Falta .env file
# Solución:
cd backend-api
cp .env.example .env
# Editar .env y agregar valores
nano .env
```

### Error: `Module not found` en imports

```bash
# Falta hacer build TypeScript
cd backend-api
npm run build
npm run dev
```

### Mobile app no conecta a backend

```bash
# Verificar que backend está corriendo
curl http://localhost:3000/health

# Si funciona pero app no conecta:
# - En mobile-app/.env: EXPO_PUBLIC_API_URL=http://localhost:3000
# - En Android emulator: usar 10.0.2.2 en lugar de localhost
# - En iPhone simulator: localhost funciona directo
```

### Error: `Port 3000 already in use`

```bash
# Buscar qué usa el puerto
lsof -i :3000

# Matar proceso
kill -9 <PID>

# O usar otro puerto
PORT=3001 npm run dev
```

---

## 📖 Guía Por Rol

### Soy BACKEND Engineer (Express, Node.js, API)

**Esta semana:**
1. Lee: `ACADEMIC_ENGINEERING_TRACK_VOL2.md` (API section)
2. Revisa: `docs/API.md` (Swagger)
3. Corre: `npm run dev` y prueba un endpoint
4. Tarea: Implementar GET /products (ver archivo mock en `backend-api/src/routes/products.routes.ts`)

**Recursos:**
- Express docs: https://expressjs.com
- Prisma docs: https://prisma.io/docs
- JWT guide: `docs/SECURITY.md`
- Tests: `backend-api/__tests__/`

**Comandos clave:**
```bash
npm run dev       # Iniciar servidor
npm test          # Tests
npx prisma studio # Ver BD visualmente
```

---

### Soy MOBILE Engineer (React Native, Expo)

**Esta semana:**
1. Lee: `ACADEMIC_ENGINEERING_TRACK_VOL1.md` (Mobile section)
2. Revisa: Estructura de `mobile-app/src/screens/`
3. Corre: `npx expo start` y abre en navegador
4. Tarea: Hacer que LoginScreen conecte a backend

**Recursos:**
- Expo docs: https://docs.expo.dev
- React Native: https://reactnative.dev
- Redux Toolkit: https://redux-toolkit.js.org
- Testing: `mobile-app/__tests__/`

**Comandos clave:**
```bash
npx expo start     # Iniciar app
npx expo start -c  # Clear cache
npm test           # Tests
```

---

### Soy FRONTEND Engineer (React, Admin Panel)

**Esta semana:**
1. Lee: `ACADEMIC_ENGINEERING_TRACK_VOL1.md` (Frontend section)
2. Revisa: `admin-panel/src/pages/`
3. Corre: `npm run dev` en admin-panel
4. Tarea: Crear LoginPage que conecte a backend

**Recursos:**
- React: https://react.dev
- Vite: https://vitejs.dev
- Material-UI (si lo usamos): https://mui.com
- Testing: `admin-panel/__tests__/`

**Comandos clave:**
```bash
npm run dev        # Iniciar en localhost:5173
npm run build      # Compilar
npm test           # Tests
```

---

### Soy DEVOPS / Infrastructure

**Esta semana:**
1. Lee: `docs/DEPLOYMENT.md`
2. Revisa: `deployment/` y `database/docker-compose.yml`
3. Configura: AWS account (free tier)
4. Tarea: Hacer deployment a staging (Heroku)

**Recursos:**
- Docker: https://docker.com
- AWS Free Tier: https://aws.amazon.com/free
- GitHub Actions: https://github.com/features/actions
- Heroku: https://www.heroku.com

**Comandos clave:**
```bash
docker ps              # Ver containers
docker-compose up -d   # Levantar BD
heroku login          # Login Heroku
git push heroku main  # Deploy
```

---

## 📞 Ayuda & Preguntas

### Profesor Asesor
- Email: profesor@itsur.edu.mx
- Office hours: Martes/Jueves 14:00-16:00
- Slack: #itsur-eats (responde en 24h)

### Team Lead (Backend)
- Responsable de arquitectura, decisiones técnicas
- Daily standup: 09:00 (15 min)

### Code Review
- Todo code va en PR (pull request)
- Mínimo 1 review antes de merge
- Automated tests deben pasar

### Meetings
- Daily: 09:00 (15 min) - Quick sync
- Weekly: Viernes 15:00 (30 min) - Planning + retrospective
- Ad-hoc: When needed

---

## ✅ Checklist Para Nuevo Dev

- [ ] Cloné repositorio
- [ ] Instalé Node.js 18+
- [ ] Instalé Docker Desktop
- [ ] Instalé VSCode + extensions (ESLint, Prettier)
- [ ] Creé archivos `.env` (backend, mobile, admin)
- [ ] Base de datos corriendo (docker ps muestra postgres)
- [ ] Backend arranca sin errores (`npm run dev`)
- [ ] Mobile app arranca (`npx expo start`)
- [ ] Pasé tests (`npm test`)
- [ ] Leí ARCHITECTURE.md
- [ ] Leí mi módulo específico (API / Mobile / Frontend)
- [ ] Puedo hacer login en app
- [ ] Pregunté dudas al team

---

## 🎯 Tus Primeras Tareas

### Semana 1

**Backend Engineer:**
```
1. [ ] Setup local ✓ (30 min)
2. [ ] Lee ACADEMIC_ENGINEERING_TRACK_VOL2.md (1 hora)
3. [ ] Implementa GET /categories endpoint (2 horas)
4. [ ] Crea tests para GET /categories (1 hora)
5. [ ] Documenta en Swagger/OpenAPI (30 min)
```

**Mobile Engineer:**
```
1. [ ] Setup local ✓ (30 min)
2. [ ] Lee ACADEMIC_ENGINEERING_TRACK_VOL1.md (1 hora)
3. [ ] Implementa LoginScreen UI (2 horas)
4. [ ] Conecta a /auth/login endpoint (1.5 horas)
5. [ ] Tests para LoginScreen (1 hora)
```

**Frontend Engineer:**
```
1. [ ] Setup local ✓ (30 min)
2. [ ] Lee ACADEMIC_ENGINEERING_TRACK_VOL1.md (1 hora)
3. [ ] Implementa LoginPage (2 horas)
4. [ ] Conecta a /auth/login (1.5 horas)
5. [ ] Tests para LoginPage (1 hora)
```

**DevOps Engineer:**
```
1. [ ] Setup local ✓ (30 min)
2. [ ] Lee DEPLOYMENT.md (1 hora)
3. [ ] Configura GitHub Actions (2 horas)
4. [ ] Deploy staging a Heroku (1 hora)
5. [ ] Configura monitoring básico (1 hora)
```

---

## 🚀 Próximos Pasos

Después de terminar esta semana:

1. **Semana 2**: Completar tus primeras tareas + code review
2. **Semana 3**: Implementar features de tu módulo
3. **Semana 4**: Testing + integración
4. **Semana 5+**: Ver ACADEMIC_ENGINEERING_TRACK_VOL3.md para roadmap completo

---

## 📚 Recursos Externos Recomendados

### Learning
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [JavaScript.info](https://javascript.info)
- [React Official Docs](https://react.dev)
- [CS50 - Introduction to Computer Science](https://cs50.harvard.edu)

### Tools
- [VS Code](https://code.visualstudio.com)
- [GitHub Desktop](https://desktop.github.com) (si prefieres GUI)
- [Postman](https://www.postman.com) (probar endpoints)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Community
- Stack Overflow: Tag your questions with `[itsur-eats]`
- GitHub Discussions: En repo principal
- Dev.to: Comunidad de desarrolladores
- Twitter: #100DaysOfCode

---

## ⚖️ Antes de Hacer Commit

```bash
# 1. Asegurar que tests pasan
npm test

# 2. Asegurar que linter pasa
npm run lint

# 3. Si hay errores, arreglarlo
npm run lint:fix

# 4. Ver cambios
git diff

# 5. Agregar archivos
git add .

# 6. Mensaje de commit
git commit -m "feat(orders): add order creation endpoint"

# 7. Push
git push origin tu-rama

# 8. Hacer PR en GitHub
# Asigna un reviewer (team lead)
```

---

## 🎓 Preguntas Frecuentes

**P: ¿Qué si rompí algo?**
R: No problem! Git te permite revertir: `git revert <commit_hash>` o `git reset --hard <commit_hash>`. Lo importante es aprender.

**P: ¿Cuánto tiempo debería tardar cada tarea?**
R: La tabla de arriba da estimaciones. Si tardas el doble, ok - estás aprendiendo.

**P: ¿Necesito hacer commits perfectos?**
R: No, pero útiles. Un commit = una idea. Mensajes en inglés. "feat/fix/docs/test/refactor".

**P: ¿Qué pasa si tengo conflicto en merge?**
R: Avísale al team lead. Git conflict resolution es normal. Te lo mostraremos.

**P: ¿Puedo trabajar sin internet?**
R: Sí, backend + mobile corren localmente. Solo necesitas internet para push/pull y APIs externas (Stripe, Firebase).

---

## 🎉 ¡Bienvenido al Equipo!

Acabas de empezar un proyecto profesional.
Esto no es "una tarea escolar" — es experiencia real de ingeniería.

Los próximos 4 meses:
- ✅ Aprenderás nuevas tecnologías
- ✅ Resolverás problemas reales
- ✅ Trabajarás en equipo (comunicación = clave)
- ✅ Crearás un portafolio impresionante
- ✅ Divertirte construyendo algo útil

Good luck! 🚀

---

**Setup Document v1.0**
**Fecha**: 20 de Enero de 2026
**Para**: ITSUR Eats - Academic Engineering Team
**Última revisión**: [Actualizar cuando sea necesario]
