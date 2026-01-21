# ITSUR Eats v6.0 — Cloud, Scalability & Institutional Deployment

**Autor:** Cloud Architect Team  
**Versión:** 6.0.0-RELEASE  
**Fecha:** 2026-01-20  
**Estado:** Production Ready  

---

## 1. ARQUITECTURA MULTI-INSTANCE REAL

Para soportar +2,000 usuarios concurrentes y picos de tráfico en recesos, hemos migrado de una arquitectura monolítica simple a una arquitectura distribuida orientada a servicios.

### Diagrama de Infraestructura

```ascii
                                  [ INTERNET ]
                                       |
                             [ Cloud Load Balancer ]
                               (AWS ALB / DO LB)
                                       |
                       +---------------+---------------+
                       |                               |
              [ API Instance 1 ]              [ API Instance N ]
              (Node.js/Express)               (Node.js/Express)
                       |                               |
                       +---------------+---------------+
                                       |
            +--------------------------+--------------------------+
            |                          |                          |
    [ Redis Cluster ]          [ PostgreSQL HA ]          [ Worker Pool ]
    (Managed Service)          (Managed Service)         (Event Processor)
    - Cache                    - Primary (RW)             - Emails
    - Sessions                 - Replica (RO)             - Push Notif
    - Pub/Sub                                             - Audits
```

### Flujo de Petición (Móvil -> DB)

1.  **Request**: App Móvil envía `POST /orders` con JWT.
2.  **Ingress**: Load Balancer recibe tráfico (SSL Termination) y distribuye Round-Robin a una instancia saludable.
3.  **Auth Layer**: Middleware valida JWT. Si es válido, verifica sesión en **Redis** (baja latencia).
4.  **Service Layer**: `OrderService` inicia transacción en **PostgreSQL**.
5.  **Persistence**: Se guarda `Order` y `EventOutbox` (Atomicidad).
6.  **Response**: 201 Created al usuario inmediatamente.

### Flujo de Evento (Outbox -> Push)

1.  **Polling/Trigger**: El **Worker Pool** (separado de la API) escanea `EventOutbox` cada 5s.
2.  **Processing**: Worker toma evento `ORDER_CREATED`.
3.  **Locking**: Usa `updatedAt` y concurrencia optimista para evitar doble procesamiento.
4.  **Notification**: Envía notificación a través de **Firebase/OneSignal**.
5.  **Completion**: Marca evento como procesado en DB.

---

## 2. WEBSOCKETS HORIZONTALES

Socket.IO en memoria no escala. Hemos implementado **Redis Adapter** para sincronizar eventos entre instancias.

### Configuración Real

Ver `src/config/websocket.ts`. Se utiliza `@socket.io/redis-adapter` para publicar eventos a todas las instancias.

### Flujo de Mensajes Distribuidos

1.  Usuario A conectado a **Instancia 1**.
2.  Admin conectado a **Instancia 2**.
3.  **Instancia 1** recibe "Pedido Creado".
4.  **Instancia 1** publica evento en canal Redis `socket.io#/#user:admin#`.
5.  **Instancia 2** (suscrita a Redis) recibe el mensaje.
6.  **Instancia 2** emite el evento al socket del Admin local.

---

## 3. CONTENEDORIZACIÓN PROFESIONAL

Hemos estandarizado el entorno de ejecución usando Docker Multi-Stage Builds.

### Estructura de Contenedores

- **API**: `backend-api/Dockerfile.api` (Optimizado para producción, solo dist y node_modules prod)
- **Worker**: `backend-api/Dockerfile.worker` (Proceso ligero para tareas de fondo)
- **Admin**: `admin-panel/Dockerfile` (Nginx sirviendo estáticos de React/Vite)

### Docker Compose

El archivo `docker-compose.yml` en la raíz orquesta todo el entorno local, incluyendo un **Load Balancer Nginx** local para simular producción.

---

## 4. DESPLIEGUE CLOUD REAL

La infraestructura está definida en `app.yaml` (DigitalOcean App Platform Spec).

### Stack Recomendado

1.  **Compute**:
    *   **API Services**: 2+ réplicas. Escalado automático por CPU.
    *   **Worker Service**: 1 réplica. Reinicio automático.
2.  **Data**:
    *   **Managed PostgreSQL**: Alta disponibilidad (Primary + Standby).
    *   **Managed Redis**: Eviction policy `allkeys-lru`.
3.  **Network**:
    *   **HTTPS**: Certificados SSL automáticos.
    *   **Dominio**: `api.itsureats.edu.mx`.

### Pipeline CI/CD

1.  **Test**: `npm test` en GitHub Actions.
2.  **Build**: Construcción de imágenes Docker.
3.  **Deploy**: Push automático a DigitalOcean Container Registry y actualización de App Platform.

---

## 5. OBSERVABILIDAD DE SISTEMA

Implementado con **Prometheus** y **Grafana**.

### Métricas Clave (`/metrics`)

- `http_request_duration_seconds`: Latencia.
- `http_requests_total`: Tráfico y errores.
- `active_socket_connections`: Usuarios conectados en tiempo real.
- `order_creation_total`: KPI de negocio.

---

## 6. RESILIENCIA Y RECUPERACIÓN

1.  **Circuit Breakers**: En llamadas a servicios externos (Stripe, Firebase).
2.  **Retry Pattern**: Exponential Backoff en el Worker (5s, 25s, 125s).
3.  **Graceful Shutdown**: Manejo de señales `SIGTERM` para cerrar conexiones limpiamente.

---

## 7. ESCALADO INSTITUCIONAL

### Roadmap

1.  **Multi-Campus**: Agregar `campus_id` a tablas principales.
2.  **Multi-Tenant**: Esquema de DB aislado por institución (`schema_name = 'uni_a'`).

---

## 8. SEGURIDAD DE INFRAESTRUCTURA

1.  **Rate Limiting**: 100 req/min por IP.
2.  **Secrets Management**: Variables de entorno inyectadas en runtime, no en imagen.
3.  **VPC**: DB y Redis sin acceso público.

---

## 9. COSTOS Y PRESUPUESTO REAL

**Escenario Producción (+2,000 usuarios)**
*   API (x2): $20 USD
*   Worker (x1): $10 USD
*   PostgreSQL HA: $60 USD
*   Redis Cluster: $30 USD
*   LB: $10 USD
*   **Total: ~$130 USD / mes**

---

## 10. DEFENSA INSTITUCIONAL

**"¿Cómo explico esto al Director de TI?"**

> "Ingeniero, ITSUR Eats v6.0 es una plataforma empresarial. No depende de un solo servidor 'casero'. Está diseñada para sobrevivir a fallos, escalar automáticamente cuando los alumnos salen a receso, y proteger los datos institucionales con estándares de industria. Es una inversión en continuidad operativa y seguridad."
