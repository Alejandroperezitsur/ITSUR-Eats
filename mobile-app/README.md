# ITSUR Eats - Mobile App

React Native app usando Expo. iOS y Android desde el mismo código.

## 📋 Requisitos

- Node.js 18+
- npm 9+
- Expo CLI: `npm install -g expo-cli`

## 🚀 Quick Start

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

### 3. Iniciar servidor Expo

```bash
npm start
# o: expo start
```

### 4. Abrir en dispositivo/emulador

Opciones:
- **Web**: Presionar `w`
- **iOS**: Presionar `i` (requiere Xcode)
- **Android**: Presionar `a` (requiere Android Studio)

## 📚 Scripts disponibles

```bash
npm start          # Iniciar Expo
npm run android    # Abrir en Android emulator
npm run ios        # Abrir en iOS simulator
npm run web        # Abrir en navegador
npm test           # Correr tests
npm run lint       # ESLint
npm run type-check # TypeScript check
```

## 🏗️ Estructura de carpetas

```
src/
├── screens/        # Pantallas (Login, Menu, Cart, Profile)
├── components/     # Componentes reutilizables
├── services/       # API calls
├── redux/          # State management
├── hooks/          # Custom React hooks
├── utils/          # Utilidades
├── types/          # TypeScript types
└── App.tsx         # Entry point

app.json           # Configuración Expo
```

## 🔌 Pantallas Principales

### LoginScreen
- Email + password input
- Error handling
- Loading state

### MenuScreen
- Listar categorías
- Listar productos con search
- Agregar al carrito

### CartScreen
- Ver items del carrito
- Cambiar cantidad
- Proceder a checkout

### ProfileScreen
- Ver información del usuario
- Settings
- Logout

## 🔄 Redux State Management

### Auth Slice
```typescript
- user: User | null
- accessToken: string | null
- isAuthenticated: boolean
- loading: boolean
- error: string | null
```

### Products Slice
```typescript
- categories: Category[]
- products: Product[]
- cart: { items: CartItem[], total: number }
- loading: boolean
- error: string | null
```

## 🔐 Autenticación

- JWT tokens guardados en AsyncStorage
- Interceptor de axios para refresh automático
- Protected routes

## 📡 API Integration

- API Client con axios
- Interceptors para auth tokens
- Error handling
- Base URL: `http://localhost:3000/api/v1`

## 🎯 Testing

```bash
npm test           # Correr tests Jest
npm run test:watch # Watch mode
```

## 📦 Deployment

### iOS
```bash
npm run build:ios
npm run submit:ios
```

### Android
```bash
npm run build:android
npm run submit:android
```

## 🐛 Troubleshooting

### Error: Metro bundler not working
```bash
npm start -- --clear
```

### AsyncStorage not working
Asegúrate de instalar: `npm install @react-native-async-storage/async-storage`

### Connection refused
- Backend debe estar corriendo en `http://localhost:3000`
- En Android emulator, usa `10.0.2.2` en lugar de `localhost`

## 📝 Licencia

MIT
