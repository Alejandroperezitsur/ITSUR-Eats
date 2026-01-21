# Admin Panel - ITSUR Eats

Panel de administración para ITSUR Eats, construido con React 18, Vite, TypeScript y Tailwind CSS.

## 🎯 Características

- ✅ Dashboard con analytics en tiempo real
- ✅ Gestión de órdenes (crear, actualizar, cancelar)
- ✅ Gestión de productos y categorías
- ✅ Sistema de autenticación JWT
- ✅ Responsivo (mobile, tablet, desktop)
- ✅ Gráficos interactivos con Recharts
- ✅ Interfaz moderna con Tailwind CSS
- ✅ State management con Zustand

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand
- **API Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6

## 📦 Instalación

```bash
cd admin-panel
npm install
```

## 🚀 Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🔨 Build

```bash
npm run build
```

## 📋 Estructura del Proyecto

```
admin-panel/
├── src/
│   ├── components/       # Componentes reutilizables
│   ├── pages/           # Páginas principales
│   ├── services/        # Servicios API
│   ├── store/           # Estado global (Zustand)
│   ├── types/           # TypeScript types
│   ├── layouts/         # Layouts
│   ├── App.tsx          # App principal
│   ├── main.tsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── vite.config.ts       # Config Vite
├── tailwind.config.js   # Config Tailwind
└── package.json
```

## 🔐 Autenticación

La aplicación usa JWT tokens para autenticación. Los tokens se almacenan en localStorage y se envían automáticamente en cada petición.

**Credenciales de Demo**:
- Email: `admin@itsur.edu.mx`
- Password: `AdminPassword123!`

## 📝 Endpoints API

La aplicación se conecta a los siguientes endpoints del backend:

- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/orders` - Listar órdenes
- `GET /api/orders/:id` - Obtener orden
- `PATCH /api/orders/:id` - Actualizar orden
- `POST /api/orders/:id/cancel` - Cancelar orden
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto
- `PATCH /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `GET /api/products/categories` - Listar categorías
- `GET /api/analytics/dashboard` - Dashboard analytics

## 🎨 Tailwind CSS

Se usan componentes de utilidad de Tailwind CSS. Algunos componentes personalizados:

- `.btn-primary` - Botón primario
- `.btn-secondary` - Botón secundario
- `.btn-danger` - Botón de eliminar
- `.input-field` - Campo de entrada
- `.card` - Card genérica
- `.badge` - Badge/etiqueta
- `.badge-success`, `.badge-warning`, `.badge-error`, `.badge-info` - Badges coloreados

## 🔄 State Management

Se usa Zustand para manejar el estado global:

- `useAuthStore` - Estado de autenticación
- `useOrderStore` - Estado de órdenes

## 📱 Responsividad

La aplicación es completamente responsiva:

- Versión mobile: Sidebar colapsable
- Versión tablet: Grid dinámico
- Versión desktop: Layout completo

## 🚀 Deployment

Para producción:

```bash
npm run build
```

Los archivos generados están en `dist/`. Puedes servir esto con cualquier servidor web estático.

## 📄 Licencia

Propiedad de ITSUR Eats © 2026
