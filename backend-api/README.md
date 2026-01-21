# ITSUR Eats - Backend API

Backend REST API para ITSUR Eats. Construido con Express.js, Prisma ORM y PostgreSQL.

## 📋 Requisitos

- Node.js 18+
- npm 9+
- Docker & Docker Compose (para PostgreSQL local)

## 🚀 Quick Start

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus valores
```

### 3. Iniciar PostgreSQL (Docker)

```bash
docker-compose up -d
```

### 4. Crear base de datos y migraciones

```bash
npx prisma migrate dev
```

### 5. Seed data (datos de prueba)

```bash
npx prisma db seed
```

### 6. Iniciar servidor

```bash
npm run dev
```

Servidor corriendo en `http://localhost:3000`

## 📚 Scripts disponibles

```bash
npm run dev              # Iniciar en desarrollo
npm run build            # Compilar TypeScript
npm start                # Ejecutar en producción
npm test                 # Correr tests
npm run test:watch       # Tests con hot reload
npm run test:coverage    # Coverage report
npm run lint             # ESLint
npm run lint:fix         # Arreglarlo
npm run prisma:studio   # GUI base de datos
npm run format           # Prettier format
```

## 🏗️ Estructura de carpetas

```
src/
├── controllers/    # Request handlers
├── services/       # Business logic
├── routes/         # API routes
├── middleware/     # Middleware (auth, validation, etc)
├── types/          # TypeScript types
├── utils/          # Helper functions
├── config/         # Configuration
└── index.ts        # App entry point

prisma/
├── schema.prisma   # Database schema
└── seed.ts         # Seed script

__tests__/          # Test files
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/v1/auth/register` - Registrarse
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user

### Productos
- `GET /api/v1/products/categories` - Get all categories
- `GET /api/v1/products` - List products
- `GET /api/v1/products/:id` - Get product by ID

### Órdenes
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - Get user's orders
- `GET /api/v1/orders/:id` - Get order by ID
- `PUT /api/v1/orders/:id/cancel` - Cancel order
- `PUT /api/v1/orders/:id/accept` - Accept order (staff)
- `PUT /api/v1/orders/:id/ready` - Mark ready (staff)

## 🔐 Autenticación

La API usa JWT (JSON Web Tokens) para autenticación:

1. Register/Login devuelve `accessToken` y `refreshToken`
2. Usa `Authorization: Bearer <accessToken>` en headers
3. Cuando expira, usa POST `/auth/refresh` para nuevo token

## 📖 Documentación

- Ver `docs/API.md` para especificación completa (OpenAPI 3.0)
- Ver `docs/SECURITY.md` para detalles de seguridad
- Ver `docs/DATABASE.md` para schema de BD

## 🧪 Testing

```bash
# Correr todos los tests
npm test

# Con coverage
npm run test:coverage
```

## 📦 Deployment

Ver `deployment/` carpeta para:
- Docker setup
- AWS deployment
- Heroku configuration
- GitHub Actions CI/CD

## 🐛 Troubleshooting

### Error: `PostgreSQL connection refused`

```bash
# Verificar que Docker está corriendo
docker ps

# Iniciar PostgreSQL
docker-compose up -d
```

### Error: `Module not found`

```bash
# Build TypeScript
npm run build
```

### Base de datos sin datos

```bash
# Ejecutar seed script
npx prisma db seed
```

## 📝 Licencia

MIT
