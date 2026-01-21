# 🍽️ ITSUR Eats - Sistema Oficial de Pedidos de Cafetería

## Visión Ejecutiva

**ITSUR Eats** es una plataforma móvil y web de gestión de pedidos de alimentos, diseñada específicamente para el Instituto Tecnológico Superior del Sur de Guanajuato (ITSUR). El sistema permite a estudiantes y profesores realizar pedidos desde su salón de clases, eliminando filas y mejorando significativamente la experiencia de compra en la cafetería.

### Propósito Estratégico
- Mejorar la eficiencia operativa de la cafetería
- Optimizar la experiencia del usuario
- Generar datos analíticos de negocio
- Establecer infraestructura escalable para expansión institucional
- Posicionar a ITSUR como institución tecnológicamente innovadora

---

## 📊 Métricas Objetivo (3 años)

| Métrica | Año 1 | Año 2 | Año 3 |
|---------|-------|-------|-------|
| Usuarios Activos | 500 | 1,200 | 2,500+ |
| Pedidos Diarios | 150 | 400 | 800+ |
| Tasa Adopción | 25% | 60% | 80%+ |
| Ingresos Mensuales | $8K | $20K | $40K+ |
| Satisfacción (NPS) | 50+ | 70+ | 75+ |

---

## 🏗️ Estructura del Proyecto

```
ITSUR Eats/
├── docs/                           # Documentación general
├── architecture/                   # Diagramas de arquitectura
├── project-structure/              # Estructura técnica detallada
├── roadmap/                        # Roadmap de fases
├── versions/                       # Especificaciones por versión
├── mobile/                         # App móvil (React Native/Expo)
├── backend/                        # Servidor (NestJS)
├── admin-panel/                    # Panel web administrativo
├── database/                       # Esquemas y migraciones
└── infrastructure/                 # Configuración de deploy
```

---

## 🚀 Fases de Desarrollo (Roadmap)

### **v1.0.0** - Core Ordering System
Funcionalidad base: autenticación, menú, pedidos, estados básicos

### **v2.0.0** - Payments & Notifications
Integración de pagos (Stripe, MercadoPago) y notificaciones push

### **v3.0.0** - Scalability & Performance
Optimización, caché, real-time updates, escalabilidad horizontal

### **v4.0.0** - Analytics & Intelligence
Dashboard avanzado, reportes, predicción de demanda

### **v5.0.0** - Institutional Expansion
Multi-campus, integraciones SSO, personalización

### **v6.0.0** - Production & Growth
Play Store, App Store, soporte 24/7, mantenimiento

---

## 🛠️ Stack Tecnológico

### Frontend Móvil
- **Framework**: React Native + Expo
- **State Management**: Redux Toolkit
- **UI Components**: React Native Paper
- **Payments**: Stripe SDK, MercadoPago SDK
- **Notifications**: Firebase Cloud Messaging (FCM)
- **Maps/Location**: React Native Maps

### Backend
- **Runtime**: Node.js
- **Framework**: NestJS
- **API**: GraphQL + REST
- **Database**: PostgreSQL
- **Cache**: Redis
- **ORM**: Prisma
- **Auth**: JWT + OAuth2

### Admin Panel
- **Framework**: React 18
- **UI Library**: Material-UI v5
- **Charts**: Recharts
- **State**: React Query + Zustand
- **Real-time**: Socket.io

### Infrastructure
- **Hosting**: AWS (EC2, RDS, ElastiCache)
- **CDN**: CloudFront
- **Storage**: S3
- **Monitoring**: DataDog, Sentry
- **CI/CD**: GitHub Actions
- **Containerization**: Docker + Kubernetes

---

## 📱 Usuarios & Roles

| Rol | Funciones |
|-----|-----------|
| **Estudiante/Profesor** | Ver menú, hacer pedidos, pagar, recibir notificaciones, ver historial |
| **Admin Cafetería** | Gestionar productos, ver pedidos, aceptar/rechazar, ver estadísticas |
| **Superadmin** | Gestión completa del sistema, usuarios, reportes, configuración |

---

## 🔐 Principios de Seguridad

✅ Autenticación de dos factores (2FA)
✅ Validación institucional obligatoria
✅ Encriptación end-to-end de datos sensibles
✅ PCI DSS compliance para pagos
✅ Rate limiting y protección contra ataques
✅ Auditoría de todas las transacciones

---

## 📌 Documentación

Cada versión tiene especificación completa en `/versions/`:
- Objetivos y problemas resueltos
- Funcionalidades detalladas por módulo
- Arquitectura técnica
- Seguridad
- UX/UI
- Preparación para producción

**Ver documentación completa**: Ver archivos en `/versions/`

---

## 🏆 Filosofía de Desarrollo

1. **Calidad Institucional**: código limpio, testing exhaustivo, documentación
2. **UX-First**: decisiones basadas en usuario real
3. **Escalabilidad**: arquitectura preparada para 10,000+ usuarios
4. **Seguridad**: compliance y protección proactiva
5. **Data-Driven**: métricas en cada decisión

---

## 📞 Contacto & Soporte

**Project Lead**: Arquitectura de Software
**Product Manager**: Gestión de Versiones
**DevOps**: Infrastructure & Deployment

---

**Última actualización**: Enero 20, 2026
**Estado**: En Especificación
**Siguiente hito**: Iniciar v1.0.0
