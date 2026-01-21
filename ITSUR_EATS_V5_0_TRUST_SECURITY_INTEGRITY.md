# ITSUR EATS v5.0 — Trust, Security & Systems Integrity

**Nivel**: Producción  
**Clasificación**: Sistema Financiero Distribuido  
**Versión**: 5.0.0  
**Fecha**: 20 de enero de 2026  
**Arquitecto**: Ingeniero de Sistemas Distribuidos

---

## 📋 CONTENIDO EXECUTIVO

Este documento transforma ITSUR Eats de "funciona bien" a "confiable en producción":

✅ Sistema de autenticación JWT profesional con refresh token hashing  
✅ Revocación de sesiones en tiempo real  
✅ Event system confiable con Outbox Pattern (garantía at-least-once)  
✅ Arquitectura limpia con separación de capas  
✅ Integridad financiera a nivel transaccional  
✅ Manejo de concurrencia y conflictos  
✅ Auditoría completa y trazabilidad  
✅ Testing de sistema real (Jest)  
✅ Defensa técnica ante auditor senior  

---

## 1. SISTEMA DE AUTENTICACIÓN PROFESIONAL

### 1.1 Problema actual

```
❌ Tokens sin rotación → si se filtra, acceso permanente
❌ No hay fingerprint → tokens reutilizables en cualquier dispositivo
❌ No hay revocación real → logout no cierra todas las sesiones
❌ Refresh token en JWT → no se puede invalidar sin esperar expiración
```

### 1.2 Arquitectura nueva: JWT + Refresh Token Hashing

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Mobile/Admin)                    │
└────────────────────────────┬────────────────────────────────┘
                             │
                    1. POST /auth/login
                    (email, password, deviceId, deviceFingerprint)
                             │
                             ▼
                    ┌─────────────────────┐
                    │  Backend: Auth API  │
                    └─────────┬───────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
    Validar       Generar          Generar
    credenciales  Access Token     Refresh Token
                  (15 min)         (7 días)
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                    2. Hash refresh token
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
    Guardar en DB:    Generar Session    Enviar cliente:
    - refresh_token   entry con:         - accessToken (JWT)
    - device_id       - fingerprint      - refreshToken (sin hash)
    - fingerprint     - expires_at       - expiresIn
    - created_at      - version          - refreshExpiresIn
         │                    │
         └────────────────────┘
         
         3. Cliente almacena en storage seguro
         
         4. Próximas requests:
            Authorization: Bearer <accessToken>
```

### 1.3 Schema Prisma v5.0

```prisma
// USUARIOS Y AUTENTICACIÓN
model User {
  id                    String      @id @default(cuid())
  email                 String      @unique
  passwordHash          String
  name                  String
  role                  Role        @default(CUSTOMER)
  
  // Tokens y sesiones
  sessions              Session[]
  refreshTokens         RefreshToken[]
  
  // Auditoría
  auditLogs             AuditLog[]
  loginHistory          LoginHistory[]
  
  // Seguridad
  twoFactorEnabled      Boolean     @default(false)
  twoFactorSecret       String?
  blockedUntil          DateTime?
  loginAttempts         Int         @default(0)
  
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  
  @@index([email])
  @@index([role])
}

model Session {
  id                    String      @id @default(cuid())
  userId                String
  user                  User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Fingerprint del dispositivo
  deviceId              String
  deviceName            String      // "iPhone 13 Pro", "Admin Panel Chrome"
  fingerprint           String      // Hash: userAgent + ip + timestamp
  ipAddress             String
  userAgent             String
  
  // Token tracking
  tokenVersion          Int         @default(1)  // Incrementa en cada refresh
  refreshTokenHash      String      @unique      // Hash SHA-256 del refresh token
  
  // Validez
  expiresAt             DateTime
  revokedAt             DateTime?   // NULL si activo, fecha si revocado
  lastActivityAt        DateTime    @default(now())
  
  // Metadata
  location              String?     // Geolocalización IP
  osType                String?     // iOS, Android, Windows, MacOS
  
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  
  @@index([userId])
  @@index([deviceId])
  @@index([refreshTokenHash])
  @@index([expiresAt])
}

model RefreshToken {
  id                    String      @id @default(cuid())
  userId                String
  user                  User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  sessionId             String      // Link a sesión
  
  tokenHash             String      @unique
  tokenVersion          Int
  
  expiresAt             DateTime
  revokedAt             DateTime?
  
  createdAt             DateTime    @default(now())
  
  @@index([userId])
  @@index([tokenVersion])
  @@index([expiresAt])
}

model LoginHistory {
  id                    String      @id @default(cuid())
  userId                String
  user                  User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  ipAddress             String
  deviceId              String
  status                LoginStatus @default(SUCCESS)  // SUCCESS, FAILED, BLOCKED
  reason                String?     // "Invalid password", "Too many attempts", etc.
  
  timestamp             DateTime    @default(now())
  
  @@index([userId, timestamp])
  @@index([ipAddress])
}

enum Role {
  ADMIN
  VENDOR
  CUSTOMER
}

enum LoginStatus {
  SUCCESS
  FAILED
  BLOCKED
  SUSPICIOUS
}
```

### 1.4 Flujo de Login (Paso a paso)

```
PASO 1: Cliente envía credenciales
────────────────────────────────────
POST /auth/login
{
  "email": "user@example.com",
  "password": "segura123",
  "deviceId": "device_12345",
  "deviceName": "iPhone 13 Pro",
  "userAgent": "..."
}

PASO 2: Backend valida
────────────────────────────────────
✓ Email existe
✓ Contraseña correcta
✓ Cuenta no bloqueada
✓ No hay demasiados intentos fallidos
✓ deviceFingerprint único

Si falla: registrar en LoginHistory{status: FAILED}
Si demasiados intentos: user.blockedUntil = NOW + 15 min

PASO 3: Generar Access Token (JWT)
────────────────────────────────────
{
  "alg": "HS256",
  "typ": "JWT"
}
{
  "userId": "user_abc123",
  "email": "user@example.com",
  "role": "CUSTOMER",
  "sessionId": "session_xyz789",
  "tokenVersion": 1,
  "iat": 1704110400,
  "exp": 1704114000,  // 15 minutos
  "type": "ACCESS"
}

PASO 4: Generar Refresh Token (aleatorio)
────────────────────────────────────────────
randomString = crypto.randomBytes(32).toString('hex')
refreshTokenHash = SHA256(randomString)

PASO 5: Guardar en Database
────────────────────────────────────
INSERT INTO Session {
  userId: "user_abc123",
  deviceId: "device_12345",
  deviceName: "iPhone 13 Pro",
  fingerprint: SHA256(userAgent + ipAddress + createdAt),
  ipAddress: "192.168.1.1",
  userAgent: "...",
  tokenVersion: 1,
  refreshTokenHash: refreshTokenHash,
  expiresAt: NOW + 7 días,
  lastActivityAt: NOW
}

INSERT INTO RefreshToken {
  userId: "user_abc123",
  sessionId: "session_xyz789",
  tokenHash: refreshTokenHash,
  tokenVersion: 1,
  expiresAt: NOW + 7 días
}

INSERT INTO LoginHistory {
  userId: "user_abc123",
  status: SUCCESS,
  timestamp: NOW
}

PASO 6: Guardar en Redis (cache)
────────────────────────────────────
SET session:session_xyz789 {
  userId: "user_abc123",
  tokenVersion: 1,
  expiresAt: TIMESTAMP,
  fingerprint: "...",
  revokedAt: null
} EX 604800  // 7 días

PASO 7: Responder cliente
────────────────────────────────────
200 OK
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "0a1b2c3d...",  // SIN HASH
  "expiresIn": 900,                 // 15 minutos
  "refreshExpiresIn": 604800,       // 7 días
  "user": {
    "id": "user_abc123",
    "email": "user@example.com",
    "name": "Juan Pérez",
    "role": "CUSTOMER"
  }
}
```

### 1.5 Flujo de Refresh Token (Rotación segura)

```
PASO 1: Cliente tiene token expirado
───────────────────────────────────────
accessToken ya no funciona (exp < now)
refreshToken aún válido

PASO 2: POST /auth/refresh
──────────────────────────────────────
{
  "refreshToken": "0a1b2c3d...",
  "sessionId": "session_xyz789"
}

PASO 3: Backend busca en cache/DB
──────────────────────────────────────
Session = SELECT FROM db WHERE sessionId = "session_xyz789"
  AND revokedAt IS NULL
  AND expiresAt > NOW

Si no existe o revocado:
  → Responder 401 "Invalid refresh token"
  → Invalidar TODAS las sesiones del usuario
  → Esto indica posible reuso de token

PASO 4: Validar fingerprint
──────────────────────────────────────
fingerprint_actual = SHA256(userAgent_actual + ip_actual + ...)
fingerprint_esperado = Session.fingerprint

Si NO coinciden:
  → Posible ataque (token filtrado en otro dispositivo)
  → Revocar esta sesión
  → Responder 401 "Suspicious activity detected"
  → Registrar en LoginHistory{status: SUSPICIOUS}

PASO 5: Validar que NO es reuso
──────────────────────────────────────
refreshTokenHash_esperado = Session.refreshTokenHash
refreshTokenHash_nuevo = SHA256(refreshToken_enviado)

Si NO coinciden:
  → Token ya fue usado (alguien lo reutilizó)
  → Revocar TODAS las sesiones del usuario
  → Enviar email "Acceso no autorizado detectado"
  → Responder 401 "Invalid refresh token"

PASO 6: Generar nuevo Access Token
──────────────────────────────────────
Nuevo payload con tokenVersion incremented
{
  "userId": "user_abc123",
  "role": "CUSTOMER",
  "sessionId": "session_xyz789",
  "tokenVersion": 2,  // Incrementado
  "iat": 1704114000,
  "exp": 1704117600,  // 15 minutos después
  "type": "ACCESS"
}

PASO 7: Generar NUEVO Refresh Token (ROTACIÓN)
──────────────────────────────────────────────────
nuevoRefreshToken = crypto.randomBytes(32).toString('hex')
nuevoHash = SHA256(nuevoRefreshToken)

UPDATE Session
  SET tokenVersion = tokenVersion + 1,
      refreshTokenHash = nuevoHash,
      lastActivityAt = NOW

PASO 8: Guardar en Redis
──────────────────────────────────────────
SET session:session_xyz789 {
  tokenVersion: 2,
  lastActivityAt: NOW,
  ...
} EX 604800

PASO 9: Responder con nuevos tokens
──────────────────────────────────────
200 OK
{
  "accessToken": "eyJhbGc...",     // Nuevo
  "refreshToken": "new_0a1b2c3d...", // Nuevo y rotado
  "expiresIn": 900
}

PASO 10: Cliente guarda nuevo refreshToken
──────────────────────────────────────────
Reemplaza el anterior en storage seguro
El anterior ya no funciona (hash no coincide)
```

### 1.6 Detección de Reuso (Seguridad crítica)

```
ESCENARIO: Token filtrado y reutilizado

T=0:   Atacante obtiene refreshToken (ej: phishing, DB leak)
       refreshToken_original = "abc123..."
       hash_en_db = SHA256("abc123...")

T=1:   Usuario legítimo intenta refresh
       POST /auth/refresh { refreshToken: "abc123..." }
       
       Backend calcula: SHA256("abc123...") → coincide con hash_en_db
       → Válido, genera nuevo refresh token
       → Incrementa tokenVersion a 2
       → Nuevo hash en DB

T=2:   Atacante intenta reutilizar mismo token
       POST /auth/refresh { refreshToken: "abc123..." }
       
       Backend calcula: SHA256("abc123...")
       Busca en DB: Session.refreshTokenHash = hash_nuevo (NO coincide)
       
       ⚠️ DETECCIÓN: Token reusado
       
       → Revocar sesión actual
       → Revocar TODAS las sesiones del usuario
       → Enviar alerta de seguridad
       → Forzar nuevo login

RESULTADO: Ventana de explotación = timepo entre refresh del usuario
           y intento del atacante (típicamente < 1 minuto)
```

### 1.7 Código Backend: AuthService

```typescript
// backend-api/src/services/auth.service.ts

import { prisma } from '../config/prisma';
import { redis } from '../config/redis';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthService {
  
  /**
   * Login profesional con fingerprint y dispositivo
   */
  async login(
    email: string,
    password: string,
    deviceId: string,
    deviceName: string,
    userAgent: string,
    ipAddress: string
  ) {
    // PASO 1: Validar credenciales
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      await this.recordLoginAttempt(email, ipAddress, 'FAILED', 'User not found');
      throw new Error('Invalid credentials');
    }
    
    // Verificar bloqueo por demasiados intentos
    if (user.blockedUntil && user.blockedUntil > new Date()) {
      throw new Error('Account temporarily locked. Try again later.');
    }
    
    // Validar contraseña
    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      // Incrementar intentos fallidos
      const attempts = user.loginAttempts + 1;
      if (attempts >= 5) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: attempts,
            blockedUntil: new Date(Date.now() + 15 * 60 * 1000) // 15 min
          }
        });
      } else {
        await prisma.user.update({
          where: { id: user.id },
          data: { loginAttempts: attempts }
        });
      }
      
      await this.recordLoginAttempt(
        email, 
        ipAddress, 
        'FAILED', 
        `Invalid password (attempt ${attempts}/5)`
      );
      throw new Error('Invalid credentials');
    }
    
    // PASO 2: Generar fingerprint
    const fingerprint = this.generateFingerprint(userAgent, ipAddress);
    
    // PASO 3: Generar tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = crypto.randomBytes(32).toString('hex');
    const refreshTokenHash = this.hashToken(refreshToken);
    
    // PASO 4: Crear sesión
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        deviceId,
        deviceName,
        fingerprint,
        ipAddress,
        userAgent,
        tokenVersion: 1,
        refreshTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        lastActivityAt: new Date()
      }
    });
    
    // PASO 5: Guardar en Redis para validación rápida
    await redis.setex(
      `session:${session.id}`,
      7 * 24 * 60 * 60, // 7 días
      JSON.stringify({
        userId: user.id,
        tokenVersion: 1,
        fingerprint,
        revokedAt: null,
        expiresAt: session.expiresAt.getTime()
      })
    );
    
    // PASO 6: Registrar login exitoso
    await this.recordLoginAttempt(email, ipAddress, 'SUCCESS');
    
    // PASO 7: Reset intentos fallidos
    await prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0 }
    });
    
    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutos
      refreshExpiresIn: 7 * 24 * 60 * 60, // 7 días
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }
  
  /**
   * Refresh token con rotación y detección de reuso
   */
  async refreshAccessToken(
    refreshToken: string,
    sessionId: string,
    fingerprint: string,
    userAgent: string,
    ipAddress: string
  ) {
    // PASO 1: Validar sesión
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true }
    });
    
    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new Error('Invalid session');
    }
    
    // PASO 2: Validar fingerprint (anti-theft)
    if (fingerprint !== session.fingerprint) {
      // Posible ataque: token usado en diferente dispositivo
      await this.revokeAllUserSessions(session.userId, 'Suspicious activity');
      throw new Error('Unauthorized device');
    }
    
    // PASO 3: Validar refresh token (detección de reuso)
    const refreshTokenHash = this.hashToken(refreshToken);
    if (refreshTokenHash !== session.refreshTokenHash) {
      // ⚠️ CRITICAL: Token reusado = ataque probable
      await this.revokeAllUserSessions(
        session.userId,
        'Refresh token reuse detected'
      );
      
      // Registrar incidente
      await this.logSecurityEvent('TOKEN_REUSE', session.userId, ipAddress);
      
      throw new Error('Token compromised - all sessions revoked');
    }
    
    // PASO 4: Generar nuevo access token
    const newAccessToken = this.generateAccessToken(session.user, {
      tokenVersion: session.tokenVersion + 1
    });
    
    // PASO 5: Generar nuevo refresh token (ROTACIÓN)
    const newRefreshToken = crypto.randomBytes(32).toString('hex');
    const newRefreshTokenHash = this.hashToken(newRefreshToken);
    
    // PASO 6: Actualizar sesión
    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        tokenVersion: session.tokenVersion + 1,
        refreshTokenHash: newRefreshTokenHash,
        lastActivityAt: new Date()
      }
    });
    
    // PASO 7: Actualizar cache Redis
    await redis.setex(
      `session:${sessionId}`,
      7 * 24 * 60 * 60,
      JSON.stringify({
        userId: session.userId,
        tokenVersion: updatedSession.tokenVersion,
        fingerprint: session.fingerprint,
        revokedAt: null
      })
    );
    
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 15 * 60
    };
  }
  
  /**
   * Logout: revoca sesión actual
   */
  async logout(sessionId: string) {
    await prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() }
    });
    
    // Invalidar cache
    await redis.del(`session:${sessionId}`);
  }
  
  /**
   * Logout de todos los dispositivos del usuario
   */
  async revokeAllUserSessions(userId: string, reason: string) {
    const sessions = await prisma.session.findMany({
      where: { userId, revokedAt: null }
    });
    
    for (const session of sessions) {
      await prisma.session.update({
        where: { id: session.id },
        data: { revokedAt: new Date() }
      });
      
      await redis.del(`session:${session.id}`);
    }
    
    // Notificar usuario
    await this.logSecurityEvent('ALL_SESSIONS_REVOKED', userId, reason);
  }
  
  /**
   * Validar token en middleware
   */
  async validateAccessToken(token: string, sessionId: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      
      // Verificar que sesión sigue activa
      const sessionData = await redis.get(`session:${sessionId}`);
      if (!sessionData) {
        throw new Error('Session not found');
      }
      
      const session = JSON.parse(sessionData);
      if (session.revokedAt) {
        throw new Error('Session revoked');
      }
      
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  
  // ─── Helpers ───
  
  private generateAccessToken(user: any, options?: any) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId: options?.sessionId,
      tokenVersion: options?.tokenVersion || 1,
      type: 'ACCESS'
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '15m'
    });
  }
  
  private generateFingerprint(userAgent: string, ipAddress: string): string {
    return crypto
      .createHash('sha256')
      .update(`${userAgent}:${ipAddress}:${Date.now()}`)
      .digest('hex');
  }
  
  private hashToken(token: string): string {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
  }
  
  private async recordLoginAttempt(
    email: string,
    ipAddress: string,
    status: string,
    reason?: string
  ) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await prisma.loginHistory.create({
        data: {
          userId: user.id,
          ipAddress,
          deviceId: 'unknown',
          status,
          reason
        }
      });
    }
  }
  
  private async logSecurityEvent(event: string, userId: string, detail: string) {
    // Implementar en auditoría (sección 7)
    console.warn(`[SECURITY] ${event} - User: ${userId} - ${detail}`);
  }
}
```

### 1.8 Middleware de Validación

```typescript
// backend-api/src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      sessionId?: string;
    }
  }
}

const authService = new AuthService();

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const sessionId = req.headers['x-session-id'] as string;
    if (!sessionId) {
      return res.status(401).json({ error: 'No session ID' });
    }
    
    // Validar token
    const user = await authService.validateAccessToken(token, sessionId);
    req.user = user;
    req.sessionId = sessionId;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export const validateFingerprint = (req: Request, res: Response, next: NextFunction) => {
  const fingerprint = req.headers['x-fingerprint'] as string;
  
  if (!fingerprint) {
    return res.status(400).json({ error: 'Fingerprint required' });
  }
  
  // Se valida en authService.refreshAccessToken
  req.headers['x-device-fingerprint'] = fingerprint;
  next();
};
```

---

## 2. SISTEMA DE SESIONES Y REVOCACIÓN

### 2.1 Problemas resueltos

```
❌ Logout no es real → usuario sigue con token válido
❌ Admin no puede cerrar sesiones → usuarios maliciosos permanecen
❌ Sin visibilidad de sesiones → no sé cuántos dispositivos están activos
```

### 2.2 Endpoints de Sesiones

```typescript
// backend-api/src/routes/session.routes.ts

import { Router } from 'express';
import { SessionController } from '../controllers/session.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Rutas públicas
router.post('/logout', authenticateToken, SessionController.logout);
router.get('/active', authenticateToken, SessionController.getActiveSessions);

// Solo admin
router.get('/user/:userId', authenticateToken, SessionController.getUserSessions);
router.post('/revoke/:sessionId', authenticateToken, SessionController.revokeSession);
router.post('/user/:userId/revoke-all', authenticateToken, SessionController.revokeAllUserSessions);

export default router;
```

### 2.3 SessionController

```typescript
// backend-api/src/controllers/session.controller.ts

import { Request, Response } from 'express';
import { SessionService } from '../services/session.service';

const sessionService = new SessionService();

export class SessionController {
  
  /**
   * Logout del dispositivo actual
   */
  static async logout(req: Request, res: Response) {
    try {
      const { sessionId } = req;
      
      if (!sessionId) {
        return res.status(400).json({ error: 'No session ID' });
      }
      
      await sessionService.logout(sessionId);
      
      res.json({
        message: 'Logged out successfully',
        timestamp: new Date()
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  
  /**
   * Ver sesiones activas del usuario actual
   */
  static async getActiveSessions(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      
      const sessions = await sessionService.getUserActiveSessions(userId);
      
      res.json({
        count: sessions.length,
        sessions: sessions.map((s: any) => ({
          id: s.id,
          deviceName: s.deviceName,
          ipAddress: s.ipAddress,
          createdAt: s.createdAt,
          lastActivityAt: s.lastActivityAt,
          isCurrent: s.id === req.sessionId
        }))
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  
  /**
   * Admin: Ver sesiones de un usuario
   */
  static async getUserSessions(req: Request, res: Response) {
    try {
      // Validar que es admin
      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      const { userId } = req.params;
      const sessions = await sessionService.getUserAllSessions(userId);
      
      res.json({
        userId,
        activeSessions: sessions.filter((s: any) => !s.revokedAt).length,
        totalSessions: sessions.length,
        sessions
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  
  /**
   * Admin: Revocar sesión específica
   */
  static async revokeSession(req: Request, res: Response) {
    try {
      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      const { sessionId } = req.params;
      
      await sessionService.revokeSession(
        sessionId,
        `Revoked by admin: ${req.user.userId}`
      );
      
      res.json({ message: 'Session revoked' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  
  /**
   * Admin: Revocar todas las sesiones de un usuario
   */
  static async revokeAllUserSessions(req: Request, res: Response) {
    try {
      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      const { userId } = req.params;
      const { reason } = req.body;
      
      await sessionService.revokeAllUserSessions(
        userId,
        reason || `All sessions revoked by admin: ${req.user.userId}`
      );
      
      res.json({
        message: 'All user sessions revoked',
        userId
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

### 2.4 Casos de Abuso Prevenidos

```
CASO 1: Vendor compra pedidos sin pagar
────────────────────────────────────────
Detección:
  - Múltiples órdenes desde dispositivo diferente
  - IP sospechosa (cambió de país)
  - Patrón de creación muy rápido

Acción:
  - Revocar todas sus sesiones
  - Forzar re-login con 2FA
  - Congelar cuenta
  - Registrar en auditoría

CASO 2: Contraseña comprometida
─────────────────────────────────
Detección:
  - Múltiples login desde IPs diferentes simultáneamente
  - Accesos en horas anormales

Acción:
  - Revocar todas las sesiones
  - Email: "Acceso detectado desde X ubicaciones"
  - Forzar cambio de contraseña
  - Requerir 2FA

CASO 3: Empleado malicioso
────────────────────────────
Detección:
  - Vendedor descargando datos de clientes
  - Admin modificando órdenes

Acción:
  - Admin revoca todas sus sesiones
  - Registra con detalles en audit_log
  - Notifica a seguridad
  - Congelamiento de cuenta
```

---

## 3. EVENT SYSTEM CONFIABLE (OUTBOX PATTERN)

### 3.1 Problema: Pérdida de eventos

```
ESCENARIO ACTUAL (sin Outbox):

1. Usuario crea pedido
2. Backend crea Order en DB
3. Backend emite evento socket "order:created"
4. Error de conexión → evento se pierde
5. Cliente nunca se entera del pedido

RESULTADO: Inconsistencia de datos
```

### 3.2 Outbox Pattern

```
┌──────────────────────────────────────┐
│       Create Order (Transacción)     │
├──────────────────────────────────────┤
│                                      │
│  1. INSERT INTO orders { ... }       │
│  2. INSERT INTO event_outbox {       │
│       type: "order.created"          │
│       aggregate_id: order_123        │
│       data: { ... }                  │
│       created_at: NOW                │
│     }                                │
│                                      │
│  → Una sola transacción = atomicidad │
│  → Si falla, ambos fallan            │
│  → Si éxito, orden + evento en DB    │
│                                      │
└──────────────────────────────────────┘
                    │
                    ▼ (Transacción termina)
                    
┌──────────────────────────────────────┐
│     Event Processor Worker           │
│     (corre cada 5 segundos)          │
├──────────────────────────────────────┤
│                                      │
│  SELECT FROM event_outbox           │
│  WHERE published = false             │
│  ORDER BY created_at ASC             │
│  LIMIT 100                           │
│                                      │
│  Para cada evento:                   │
│    1. Emitir socket                  │
│    2. Enviar push notification       │
│    3. Registrar en audit_log         │
│    4. Actualizar UPDATE published=1  │
│                                      │
│  Si falla: reintenta exponencial     │
│    attempt 1: 5 segundos             │
│    attempt 2: 30 segundos            │
│    attempt 3: 5 minutos              │
│    attempt 4: 30 minutos             │
│    attempt 5+: log y alerta          │
│                                      │
└──────────────────────────────────────┘

GARANTÍA: "at least once delivery"
→ Evento llega al menos UNA vez
→ Puede llegar varias (diseño idempotente)
```

### 3.3 Schema Prisma para Outbox

```prisma
model EventOutbox {
  id                    String      @id @default(cuid())
  
  // Qué pasó
  eventType             String      // "order.created", "order.paid", etc.
  aggregateId           String      // order_123, vendor_456
  aggregateType         String      // "Order", "Vendor"
  
  // Datos del evento
  data                  Json        // Payload completo
  metadata              Json?       // Metadata extra
  
  // Publicación
  published             Boolean     @default(false)
  publishedAt           DateTime?
  attempts              Int         @default(0)
  lastAttemptAt         DateTime?
  error                 String?     // Último error
  
  // Prioridad
  priority              Int         @default(0)  // -1: baja, 0: normal, 1: alta
  
  // Timestamps
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  
  @@index([published, createdAt])
  @@index([eventType])
  @@index([aggregateId])
}

model EventPublished {
  id                    String      @id @default(cuid())
  outboxId              String      @unique
  outbox                EventOutbox @relation(fields: [outboxId], references: [id])
  
  // Subscriptores que ya recibieron
  subscribers           String[]    // ["socket:user_123", "email:user_123", "push:device_456"]
  
  // Idempotencia
  idempotencyKey        String      @unique
  
  createdAt             DateTime    @default(now())
  
  @@index([outboxId])
}
```

### 3.4 Crear evento en transacción

```typescript
// backend-api/src/services/order.service.ts

export class OrderService {
  
  async createOrder(data: CreateOrderDTO) {
    return await prisma.$transaction(async (tx) => {
      // PASO 1: Crear orden
      const order = await tx.order.create({
        data: {
          customerId: data.customerId,
          vendorId: data.vendorId,
          items: data.items,
          totalAmount: data.totalAmount,
          status: 'PENDING',
          createdAt: new Date()
        }
      });
      
      // PASO 2: Crear evento en mismo tx (ATOMICIDAD)
      await tx.eventOutbox.create({
        data: {
          eventType: 'order.created',
          aggregateId: order.id,
          aggregateType: 'Order',
          data: {
            orderId: order.id,
            customerId: order.customerId,
            vendorId: order.vendorId,
            items: order.items,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt.toISOString()
          },
          metadata: {
            userId: data.customerId,
            source: 'mobile_app',
            timestamp: new Date().toISOString()
          },
          priority: 1, // Alta prioridad
          published: false
        }
      });
      
      // PASO 3: Decrementar stock (si aplica)
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }
      
      return order;
    });
  }
}
```

### 3.5 Event Processor Worker

```typescript
// backend-api/src/workers/eventProcessor.worker.ts

import { prisma } from '../config/prisma';
import { io } from '../config/websocket';
import { pushNotificationService } from '../services/pushNotification.service';

class EventProcessorWorker {
  private isRunning = false;
  private retryIntervals = [5000, 30000, 5 * 60 * 1000, 30 * 60 * 1000];
  
  /**
   * Inicia el worker
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    console.log('✓ EventProcessor worker started');
    
    // Ejecutar cada 5 segundos
    setInterval(() => this.processEvents(), 5000);
  }
  
  /**
   * Procesar eventos no publicados
   */
  private async processEvents() {
    try {
      // Obtener eventos pendientes (ordenados por prioridad y antigüedad)
      const events = await prisma.eventOutbox.findMany({
        where: { published: false },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'asc' }
        ],
        take: 100
      });
      
      if (events.length === 0) return;
      
      for (const event of events) {
        await this.processEvent(event);
      }
    } catch (error) {
      console.error('[EventProcessor] Fatal error:', error);
    }
  }
  
  /**
   * Procesar un evento individual
   */
  private async processEvent(event: any) {
    try {
      // PASO 1: Decodificar evento
      const handlers = this.getEventHandlers(event.eventType);
      
      // PASO 2: Ejecutar handlers (socket, push, etc.)
      for (const handler of handlers) {
        try {
          await handler(event);
        } catch (handlerError) {
          console.error(`[EventProcessor] Handler ${handler.name} failed:`, handlerError);
          // Continuar con siguientes handlers
        }
      }
      
      // PASO 3: Marcar como publicado
      await prisma.eventOutbox.update({
        where: { id: event.id },
        data: {
          published: true,
          publishedAt: new Date(),
          attempts: event.attempts + 1
        }
      });
      
      console.log(`✓ Event published: ${event.eventType} (${event.aggregateId})`);
      
    } catch (error) {
      await this.handleEventError(event, error);
    }
  }
  
  /**
   * Manejar error con reintentos exponenciales
   */
  private async handleEventError(event: any, error: any) {
    const nextAttempt = event.attempts + 1;
    const maxAttempts = this.retryIntervals.length;
    
    if (nextAttempt >= maxAttempts) {
      // Máximos reintentos alcanzados
      await prisma.eventOutbox.update({
        where: { id: event.id },
        data: {
          error: `Max retries exceeded: ${error.message}`,
          lastAttemptAt: new Date()
        }
      });
      
      console.error(
        `✗ Event failed permanently: ${event.eventType} (${event.aggregateId})`
      );
      
      // Alertar a sistemas de monitoreo
      await this.alertMonitoring(event, error);
    } else {
      // Reintento con backoff exponencial
      const delayMs = this.retryIntervals[nextAttempt - 1];
      
      await prisma.eventOutbox.update({
        where: { id: event.id },
        data: {
          attempts: nextAttempt,
          error: error.message,
          lastAttemptAt: new Date(),
          // Sumar delay al createdAt para reintento posterior
          updatedAt: new Date(Date.now() + delayMs)
        }
      });
      
      console.warn(
        `⟳ Event retry scheduled: ${event.eventType} in ${delayMs / 1000}s`
      );
    }
  }
  
  /**
   * Handlers por tipo de evento
   */
  private getEventHandlers(eventType: string) {
    const handlers: { [key: string]: Function[] } = {
      'order.created': [
        this.notifyVendorSocket.bind(this),
        this.sendCustomerPushNotification.bind(this),
        this.logToAudit.bind(this)
      ],
      'order.accepted': [
        this.notifyCustomerSocket.bind(this),
        this.startEstimateTimer.bind(this),
        this.logToAudit.bind(this)
      ],
      'order.ready': [
        this.notifyCustomerSocket.bind(this),
        this.sendPushNotification.bind(this),
        this.logToAudit.bind(this)
      ],
      'payment.completed': [
        this.updateOrderStatus.bind(this),
        this.notifyBothSockets.bind(this),
        this.logToAudit.bind(this)
      ]
    };
    
    return handlers[eventType] || [];
  }
  
  /**
   * Handler: Notificar vendedor vía socket
   */
  private async notifyVendorSocket(event: any) {
    const { vendorId } = event.data;
    io.to(`vendor:${vendorId}`).emit('order:new', {
      orderId: event.aggregateId,
      ...event.data
    });
  }
  
  /**
   * Handler: Enviar push notification
   */
  private async sendCustomerPushNotification(event: any) {
    const { customerId } = event.data;
    
    await pushNotificationService.send(customerId, {
      title: 'Nuevo pedido',
      body: 'Tu pedido ha sido creado exitosamente',
      data: { orderId: event.aggregateId }
    });
  }
  
  /**
   * Handler: Log a auditoría
   */
  private async logToAudit(event: any) {
    await prisma.auditLog.create({
      data: {
        action: event.eventType,
        aggregateId: event.aggregateId,
        aggregateType: event.aggregateType,
        changes: JSON.stringify(event.data),
        timestamp: new Date()
      }
    });
  }
  
  private async notifyCustomerSocket(event: any) {
    // Similar a notifyVendorSocket
  }
  
  private async startEstimateTimer(event: any) {
    // Lógica de estimado
  }
  
  private async updateOrderStatus(event: any) {
    // Lógica de actualización
  }
  
  private async notifyBothSockets(event: any) {
    // Notificar ambos lados
  }
  
  private async alertMonitoring(event: any, error: any) {
    console.error(`[MONITORING] Critical event failure: ${event.eventType}`, error);
    // En producción: enviar a Datadog, NewRelic, etc.
  }
}

// Singleton
export const eventProcessor = new EventProcessorWorker();

// Iniciar en app.ts
// eventProcessor.start();
```

### 3.6 Ejemplo: Flujo de pedido confiable

```
USUARIO CREA PEDIDO (Mobile)
├─ 1. POST /orders { items, vendorId }
│
└─ Backend (En Transacción):
   ├─ INSERT Order
   ├─ INSERT EventOutbox { type: 'order.created', ... }
   ├─ DECREMENT stock
   └─ COMMIT
   
   ✓ Si error: ROLLBACK (orden + evento + stock se revierten)
   ✓ Si éxito: orden y evento garantizados en DB
   
   ├─ Responder cliente (200 OK, orderId)
   │
   └─ ASYNC: Event Processor corre
      ├─ Lee EventOutbox
      ├─ Emite socket a vendor
      ├─ Envía push notification al cliente
      ├─ Registra en audit_log
      ├─ UPDATE EventOutbox { published: true }
      
      ✓ Si falla: reintenta (exponencial backoff)
      ✓ Garantía: evento llega al menos UNA vez
      
VENDOR ACEPTA PEDIDO (Admin)
├─ 1. POST /orders/:id/accept
│
└─ Backend (En Transacción):
   ├─ UPDATE Order { status: 'ACCEPTED' }
   ├─ INSERT EventOutbox { type: 'order.accepted', ... }
   └─ COMMIT
   
   └─ Event Processor:
      ├─ Emite socket al cliente
      ├─ Inicia timer de estimado
      └─ Registra en auditoría
      
CLIENTE RECIBE NOTIFICACIÓN
├─ Push: "Tu pedido fue aceptado"
├─ Socket: OrderStatus actualizado
└─ UI: Muestra estimado de entrega

GARANTÍAS:
✓ No se pierde ningún evento
✓ Cliente siempre sincronizado
✓ Si socket falla, push llega
✓ Auditoría completa
✓ Recuperable de fallos
```

---

## 4. ARQUITECTURA LIMPIA

### 4.1 Estructura Actual vs. Nueva

```
ANTES (Código mezclado):
─────────────────────────
routes/order.routes.ts
  ├─ validación
  ├─ autenticación  
  ├─ lógica de negocio
  ├─ acceso a DB
  ├─ emitir sockets
  └─ responder HTTP

❌ Difícil testear
❌ Cambios complejos
❌ Dependencias acopladas


DESPUÉS (Arquitectura Limpia):
──────────────────────────────

┌─ Transport Layer (REST/WS)
│  └─ Controllers / WebSocket Handlers
│     └─ Validación básica
│
├─ Application Layer
│  └─ Services / Use Cases
│     └─ Orquestación de negocio
│     └─ Manejo de eventos
│
├─ Domain Layer
│  └─ Entities / Value Objects
│  └─ Business Rules
│  └─ Domain Services
│
└─ Infrastructure Layer
   └─ Prisma (DB)
   └─ Redis (Cache)
   └─ Socket.io
   └─ Email Service
```

### 4.2 Estructura de carpetas

```
backend-api/src/
│
├─ domain/                    # Lógica pura de negocio
│  ├─ entities/
│  │  ├─ Order.ts            # Order entity + métodos
│  │  ├─ Payment.ts
│  │  └─ User.ts
│  │
│  ├─ value-objects/
│  │  ├─ Money.ts            # Dinero con Decimal
│  │  ├─ OrderStatus.ts      # Enum tipado
│  │  └─ UserId.ts
│  │
│  └─ services/
│     ├─ OrderPricingService.ts
│     ├─ ConcurrencyService.ts
│     └─ OrderValidationService.ts
│
├─ application/              # Casos de uso
│  ├─ services/
│  │  ├─ CreateOrderService.ts
│  │  ├─ AcceptOrderService.ts
│  │  ├─ PayOrderService.ts
│  │  └─ CancelOrderService.ts
│  │
│  ├─ dto/
│  │  ├─ CreateOrderDTO.ts
│  │  ├─ OrderResponseDTO.ts
│  │  └─ PaymentDTO.ts
│  │
│  └─ exceptions/
│     ├─ InsufficientFundsException.ts
│     ├─ OrderNotFoundException.ts
│     └─ ConcurrencyException.ts
│
├─ infrastructure/           # Detalles técnicos
│  ├─ repositories/
│  │  ├─ OrderRepository.ts
│  │  ├─ UserRepository.ts
│  │  └─ BaseRepository.ts
│  │
│  ├─ events/
│  │  ├─ EventBus.ts
│  │  └─ EventPublisher.ts
│  │
│  ├─ persistence/
│  │  ├─ PrismaUnitOfWork.ts
│  │  └─ RedisCache.ts
│  │
│  └─ external/
│     ├─ PaymentGateway.ts
│     └─ NotificationService.ts
│
├─ presentation/             # REST / WebSocket
│  ├─ controllers/
│  │  ├─ OrderController.ts
│  │  └─ PaymentController.ts
│  │
│  ├─ websocket/
│  │  ├─ OrderSocket.ts
│  │  └─ NotificationSocket.ts
│  │
│  └─ middleware/
│     ├─ AuthMiddleware.ts
│     ├─ ValidationMiddleware.ts
│     └─ ErrorHandlerMiddleware.ts
│
└─ config/
   ├─ prisma.ts
   ├─ redis.ts
   ├─ websocket.ts
   └─ logger.ts
```

### 4.3 Ejemplo: OrderService limpio

```typescript
// backend-api/src/domain/entities/Order.ts

export class Order {
  id: string;
  customerId: string;
  vendorId: string;
  items: OrderItem[];
  totalAmount: Money;
  status: OrderStatus;
  createdAt: Date;
  
  constructor(data: OrderProps) {
    this.id = data.id;
    this.customerId = data.customerId;
    this.vendorId = data.vendorId;
    this.items = data.items;
    this.totalAmount = data.totalAmount;
    this.status = data.status || OrderStatus.PENDING;
    this.createdAt = data.createdAt || new Date();
    
    this.validate();
  }
  
  /**
   * Lógica de negocio: ¿puede este pedido ser aceptado?
   */
  canBeAccepted(): boolean {
    return this.status === OrderStatus.PENDING &&
           this.items.length > 0;
  }
  
  /**
   * Lógica de negocio: aceptar pedido
   */
  accept(): void {
    if (!this.canBeAccepted()) {
      throw new InvalidOrderStateException(
        `Cannot accept order in ${this.status} state`
      );
    }
    this.status = OrderStatus.ACCEPTED;
  }
  
  /**
   * Lógica de negocio: cancelar pedido
   */
  cancel(reason: string): void {
    if (!this.canBeCancelled()) {
      throw new InvalidOrderStateException(
        `Cannot cancel order in ${this.status} state`
      );
    }
    this.status = OrderStatus.CANCELLED;
  }
  
  private validate(): void {
    if (!this.customerId) throw new InvalidOrderException('Missing customerId');
    if (!this.vendorId) throw new InvalidOrderException('Missing vendorId');
    if (this.items.length === 0) throw new InvalidOrderException('Empty order');
    if (this.totalAmount.isNegative()) {
      throw new InvalidOrderException('Negative total amount');
    }
  }
}

// backend-api/src/domain/value-objects/Money.ts

export class Money {
  private readonly amount: number;  // En centavos para evitar decimales
  readonly currency: string;
  
  constructor(amount: number, currency: string = 'USD') {
    if (!Number.isInteger(amount)) {
      throw new Error('Money must be in cents (integer)');
    }
    this.amount = amount;
    this.currency = currency;
  }
  
  getValue(): number {
    return this.amount;
  }
  
  /**
   * Convertir a decimal para mostrar
   */
  toDecimal(): number {
    return this.amount / 100;
  }
  
  isNegative(): boolean {
    return this.amount < 0;
  }
  
  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }
}

// backend-api/src/application/services/CreateOrderService.ts

export class CreateOrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private inventoryService: IInventoryService,
    private eventPublisher: IEventPublisher,
    private unitOfWork: IUnitOfWork
  ) {}
  
  /**
   * Caso de uso: Crear pedido
   * 
   * Reglas:
   * 1. Validar que cliente existe
   * 2. Validar que vendor existe
   * 3. Validar inventario
   * 4. Calcular total
   * 5. Crear pedido y evento en la misma transacción
   * 6. Publicar evento (async)
   */
  async execute(dto: CreateOrderDTO): Promise<OrderResponseDTO> {
    return await this.unitOfWork.transaction(async () => {
      // Validar disponibilidad
      for (const item of dto.items) {
        const available = await this.inventoryService.checkStock(
          item.productId,
          item.quantity
        );
        
        if (!available) {
          throw new InsufficientStockException(
            `Product ${item.productId} out of stock`
          );
        }
      }
      
      // Crear entidad
      const order = new Order({
        id: generateId(),
        customerId: dto.customerId,
        vendorId: dto.vendorId,
        items: dto.items,
        totalAmount: this.calculateTotal(dto.items),
        status: OrderStatus.PENDING,
        createdAt: new Date()
      });
      
      // Persistir
      await this.orderRepository.save(order);
      
      // Descontar inventario
      for (const item of order.items) {
        await this.inventoryService.decrementStock(
          item.productId,
          item.quantity
        );
      }
      
      // Publicar evento
      await this.eventPublisher.publish({
        type: 'order.created',
        aggregateId: order.id,
        data: order.toPrimitives()
      });
      
      return this.mapToDTO(order);
    });
  }
  
  private calculateTotal(items: OrderItem[]): Money {
    let total = new Money(0);
    for (const item of items) {
      const subtotal = item.price.multiply(item.quantity);
      total = total.add(subtotal);
    }
    return total;
  }
  
  private mapToDTO(order: Order): OrderResponseDTO {
    return {
      id: order.id,
      customerId: order.customerId,
      vendorId: order.vendorId,
      totalAmount: order.totalAmount.toDecimal(),
      status: order.status,
      items: order.items,
      createdAt: order.createdAt
    };
  }
}

// backend-api/src/presentation/controllers/OrderController.ts

export class OrderController {
  constructor(
    private createOrderService: CreateOrderService,
    private acceptOrderService: AcceptOrderService
  ) {}
  
  /**
   * HTTP: POST /orders
   */
  async create(req: Request, res: Response) {
    try {
      // Solo validación básica aquí
      const { items, vendorId } = req.body;
      
      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Empty order' });
      }
      
      // Delegar al servicio de aplicación
      const result = await this.createOrderService.execute({
        customerId: req.user.userId,
        vendorId,
        items
      });
      
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof InsufficientStockException) {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  /**
   * HTTP: POST /orders/:id/accept
   */
  async accept(req: Request, res: Response) {
    try {
      const result = await this.acceptOrderService.execute({
        orderId: req.params.id,
        vendorId: req.user.userId
      });
      
      res.json(result);
    } catch (error) {
      // Manejo de errores
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
```

---

## 5. INTEGRIDAD FINANCIERA

### 5.1 Problema: Manipulación de precios

```
ATAQUE ACTUAL:
─────────────
1. Cliente obtiene precio de producto: $100.00
2. Cliente manipula JWT o enviaMonto alterado: $10.00
3. Backend confía en cliente y crea Order con $10.00
4. Vendor recibe $10.00 en lugar de $100.00

❌ No hay validación del lado servidor
❌ Decimales flotantes causan errores
❌ No hay auditoría de cambios de precio
```

### 5.2 Solución: Validación en servidor

```typescript
// backend-api/src/domain/value-objects/Money.ts

/**
 * Value Object inmutable para dinero
 * - Siempre en centavos (enteros)
 * - Sin errores de punto flotante
 * - Validable en domain
 */
export class Money {
  private readonly amountInCents: number;
  readonly currency: string;
  
  private constructor(amountInCents: number, currency: string) {
    if (!Number.isInteger(amountInCents) || amountInCents < 0) {
      throw new InvalidMoneyException('Money must be positive integer (cents)');
    }
    this.amountInCents = amountInCents;
    this.currency = currency;
  }
  
  /**
   * Factory: de decimal a centavos
   */
  static fromDecimal(decimal: number, currency: string = 'USD'): Money {
    const cents = Math.round(decimal * 100);
    return new Money(cents, currency);
  }
  
  /**
   * Factory: directamente de centavos
   */
  static fromCents(cents: number, currency: string = 'USD'): Money {
    return new Money(cents, currency);
  }
  
  /**
   * Retornar valor
   */
  getCents(): number {
    return this.amountInCents;
  }
  
  getDecimal(): number {
    return this.amountInCents / 100;
  }
  
  add(other: Money): Money {
    this.validateCurrency(other);
    return new Money(
      this.amountInCents + other.amountInCents,
      this.currency
    );
  }
  
  multiply(factor: number): Money {
    if (factor < 0) {
      throw new InvalidMoneyException('Cannot multiply by negative');
    }
    return new Money(
      Math.round(this.amountInCents * factor),
      this.currency
    );
  }
  
  private validateCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new CurrencyMismatchException(
        `Cannot operate ${this.currency} with ${other.currency}`
      );
    }
  }
}

// backend-api/src/application/dto/CreateOrderDTO.ts

export class CreateOrderDTO {
  customerId: string;
  vendorId: string;
  items: OrderItemDTO[];
  
  /**
   * Este DTO es solo del cliente
   * No confiar en estos precios
   */
}

export class OrderItemDTO {
  productId: string;
  quantity: number;
  // ⚠️ NO incluir precio aquí (viene del cliente)
}

// backend-api/src/application/services/CreateOrderService.ts

export class CreateOrderService {
  constructor(
    private productRepository: IProductRepository,
    private orderRepository: IOrderRepository
  ) {}
  
  async execute(dto: CreateOrderDTO): Promise<Order> {
    return await prisma.$transaction(async (tx) => {
      let totalMoney = Money.fromCents(0);
      const validatedItems = [];
      
      // PASO 1: Validar CADA item (precio desde DB, no cliente)
      for (const item of dto.items) {
        // Obtener producto de DB (verdad única)
        const product = await this.productRepository.findById(item.productId);
        
        if (!product) {
          throw new ProductNotFoundException(`Product ${item.productId} not found`);
        }
        
        // Validar cantidad
        if (item.quantity <= 0 || item.quantity > 100) {
          throw new InvalidQuantityException('Quantity must be 1-100');
        }
        
        // Validar stock
        if (product.stock < item.quantity) {
          throw new InsufficientStockException(
            `Product ${item.productId} only has ${product.stock} in stock`
          );
        }
        
        // Calcular subtotal (usando precio de DB)
        const unitPrice = Money.fromCents(product.priceInCents);
        const subtotal = unitPrice.multiply(item.quantity);
        
        validatedItems.push({
          productId: product.id,
          quantity: item.quantity,
          unitPriceInCents: product.priceInCents,
          subtotalInCents: subtotal.getCents()
        });
        
        totalMoney = totalMoney.add(subtotal);
      }
      
      // PASO 2: Crear orden con precio validado
      const order = await tx.order.create({
        data: {
          customerId: dto.customerId,
          vendorId: dto.vendorId,
          items: validatedItems,
          totalAmountInCents: totalMoney.getCents(),  // En cents
          status: 'PENDING',
          createdAt: new Date()
        }
      });
      
      // PASO 3: Auditar
      await tx.auditLog.create({
        data: {
          action: 'ORDER_CREATED',
          aggregateId: order.id,
          changes: JSON.stringify({
            customerId: dto.customerId,
            vendorId: dto.vendorId,
            totalAmountInCents: totalMoney.getCents(),
            itemCount: validatedItems.length
          }),
          timestamp: new Date()
        }
      });
      
      return order;
    });
  }
}

// backend-api/src/presentation/controllers/OrderController.ts

export class OrderController {
  async create(req: Request, res: Response) {
    try {
      // Cliente envía:
      const { items, vendorId } = req.body;
      
      // ⚠️ NUNCA confiar en items[].price si viene
      // Validación básica
      if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Invalid items' });
      }
      
      // Delegar a servicio que valida precios
      const result = await this.createOrderService.execute({
        customerId: req.user.userId,
        vendorId,
        items: items.map(i => ({
          productId: i.productId,
          quantity: i.quantity
          // price viene del servidor, no del cliente
        }))
      });
      
      res.status(201).json({
        orderId: result.id,
        totalAmount: result.totalAmountInCents / 100,  // Formatear para respuesta
        status: result.status
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
```

### 5.3 Triggers SQL para integridad adicional

```sql
-- Trigger: Validar que totalAmount = SUM(items.subtotal)

CREATE TRIGGER validate_order_total
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
  DECLARE calculated_total DECIMAL(10,2);
  
  SELECT COALESCE(SUM(items[*].quantity * items[*].unit_price), 0)
  INTO calculated_total
  FROM jsonb_array_elements(NEW.items) AS items;
  
  IF NEW.total_amount_cents != (calculated_total * 100)::BIGINT THEN
    RAISE EXCEPTION 'Order total mismatch: claimed % vs calculated %',
      NEW.total_amount_cents, (calculated_total * 100)::BIGINT;
  END IF;
END;

-- Trigger: Invalidar precio negativo

CREATE TRIGGER prevent_negative_prices
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW
BEGIN
  IF NEW.price_in_cents < 0 THEN
    RAISE EXCEPTION 'Price cannot be negative';
  END IF;
END;

-- Trigger: Auditar cambios de precio

CREATE TRIGGER audit_price_changes
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
  IF OLD.price_in_cents != NEW.price_in_cents THEN
    INSERT INTO audit_log (
      action, aggregate_id, aggregate_type, changes, timestamp
    ) VALUES (
      'PRICE_CHANGED',
      NEW.id,
      'Product',
      jsonb_build_object(
        'product_id', NEW.id,
        'old_price', OLD.price_in_cents,
        'new_price', NEW.price_in_cents,
        'changed_by', CURRENT_USER
      ),
      NOW()
    );
  END IF;
END;
```

---

## 6. CONCURRENCIA Y CONFLICTOS

### 6.1 Problema: Race conditions

```
ESCENARIO: Último pedido disponible

T=0:00
  Vendor A ve: 1 pizza disponible
  Vendor B ve: 1 pizza disponible

T=0:01
  Vendor A: "Aceptar pedido con pizza"
  Vendor B: "Aceptar pedido con pizza"

T=0:02
  ¿Quién obtiene la pizza?
  
RESULTADO SIN LOCKS: Ambos la obtienen → inconsistencia

IMPACTO:
  ✗ Doble pago
  ✗ Cliente recibe dos pedidos
  ✗ Vendor pierde dinero
```

### 6.2 Solución: Optimistic Locking

```prisma
model Order {
  id            String  @id
  ...
  version       Int     @default(1)  // Versión para optimistic locking
  ...
}
```

```typescript
// backend-api/src/services/order.service.ts

/**
 * Aceptar pedido con manejo de concurrencia
 * 
 * Optimistic Locking:
 * - No bloqueamos la fila
 * - Verificamos version al UPDATE
 * - Si version cambió → conflict
 */
export class AcceptOrderService {
  
  async execute(orderId: string, vendorId: string) {
    let retries = 3;
    
    while (retries > 0) {
      try {
        return await this.attemptAccept(orderId, vendorId);
      } catch (error) {
        if (error instanceof ConcurrencyException) {
          retries--;
          if (retries === 0) {
            throw new OrderAlreadyAcceptedException(
              'This order was accepted by another vendor'
            );
          }
          // Reintento con backoff
          await sleep(Math.random() * 1000);
          continue;
        }
        throw error;
      }
    }
  }
  
  private async attemptAccept(orderId: string, vendorId: string) {
    return await prisma.$transaction(async (tx) => {
      // PASO 1: Obtener pedido con versión
      const order = await tx.order.findUnique({
        where: { id: orderId }
      });
      
      if (!order) {
        throw new OrderNotFoundException();
      }
      
      if (order.status !== 'PENDING') {
        throw new InvalidOrderStateException(
          `Order is already ${order.status}`
        );
      }
      
      // PASO 2: Validar inventario con lock
      for (const item of order.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });
        
        if (!product || product.stock < item.quantity) {
          throw new InsufficientStockException(
            'Product no longer in stock'
          );
        }
      }
      
      // PASO 3: UPDATE con validación de versión (optimistic lock)
      const updated = await tx.order.updateMany({
        where: {
          id: orderId,
          version: order.version  // ← Versión esperada
        },
        data: {
          status: 'ACCEPTED',
          vendorId: vendorId,
          version: {
            increment: 1  // Incrementar versión
          },
          updatedAt: new Date()
        }
      });
      
      // Si updated.count === 0, significa que otro vendor lo aceptó
      if (updated.count === 0) {
        throw new ConcurrencyException(
          'Order version mismatch - already modified'
        );
      }
      
      // PASO 4: Decrementar stock (ahora garantizado)
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }
      
      // PASO 5: Crear evento
      await tx.eventOutbox.create({
        data: {
          eventType: 'order.accepted',
          aggregateId: orderId,
          data: { vendorId, orderId }
        }
      });
      
      return { status: 'ACCEPTED', version: order.version + 1 };
    });
  }
}
```

### 6.3 Scenario: Cancelación durante preparación

```
T=0:00  Cliente crea pedido → status: PENDING
T=0:05  Vendor acepta → status: ACCEPTED, version: 2
T=0:10  Vendor comienza preparación
        Simultáneamente:
        
        Thread A (Cliente): "Cancelar pedido"
        Thread B (Vendor): "Marcar como listo"

T=0:11
  Cliente envía: UPDATE order SET status='CANCELLED'
                 WHERE id=order_123 AND version=2
  
  Vendor envía:  UPDATE order SET status='READY'
                 WHERE id=order_123 AND version=2
  
  ¿Quién gana?
  
RESULTADO (primera que llega):
  
  Si Cliente primero:
    → status: CANCELLED, version: 3
    → Vendor intenta UPDATE version=2 → FALLA
    → ConcurrencyException
    → Vendor ve error: "Pedido fue cancelado"
    → Refund automático iniciado
  
  Si Vendor primero:
    → status: READY, version: 3
    → Cliente intenta UPDATE version=2 → FALLA
    → ConcurrencyException
    → Cliente ve: "Ya no puedes cancelar, el pedido está listo"
```

---

## 7. AUDITORÍA Y TRAZABILIDAD

### 7.1 Schema

```prisma
model AuditLog {
  id              String      @id @default(cuid())
  
  // Acción
  action          String      // CREATE, UPDATE, DELETE, LOGIN, PAYMENT
  
  // Qué se cambió
  aggregateId     String      // order_123, user_456
  aggregateType   String      // Order, Payment, User
  
  // Quién
  userId          String?
  userEmail       String?
  userRole        String?
  
  // Desde dónde
  ipAddress       String
  userAgent       String
  deviceId        String?
  
  // Cambios
  oldValues       Json?       // Valores antes
  newValues       Json?       // Valores después
  changes         String      // Resumen legible
  
  // Cuándo
  timestamp       DateTime    @default(now())
  
  // Auditoría de auditoría
  signature       String?     // Hash para verificar integridad
  
  @@index([aggregateId, aggregateType])
  @@index([userId, timestamp])
  @@index([action])
  @@index([timestamp])
}

model SecurityEvent {
  id              String      @id @default(cuid())
  eventType       String      // TOKEN_REUSE, FAILED_LOGIN, etc.
  severity        String      // LOW, MEDIUM, HIGH, CRITICAL
  userId          String?
  ipAddress       String
  details         Json
  timestamp       DateTime    @default(now())
  
  @@index([eventType])
  @@index([severity])
  @@index([timestamp])
}
```

### 7.2 Middleware de auditoría

```typescript
// backend-api/src/middleware/audit.ts

export async function auditMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now();
  
  // Capturar respuesta original
  const originalJson = res.json.bind(res);
  res.json = function(data) {
    const duration = Date.now() - startTime;
    
    // Registrar en auditoría
    recordAudit({
      action: `${req.method} ${req.path}`,
      userId: req.user?.userId,
      ipAddress: req.ip!,
      userAgent: req.get('User-Agent')!,
      status: res.statusCode,
      duration,
      body: req.body,
      response: data
    }).catch(err => console.error('Audit logging failed:', err));
    
    return originalJson(data);
  };
  
  next();
}

async function recordAudit(data: any) {
  await prisma.auditLog.create({
    data: {
      action: data.action,
      aggregateId: data.body?.id || 'N/A',
      userId: data.userId,
      ipAddress: data.ipAddress,
      changes: JSON.stringify({
        body: data.body,
        response: data.response,
        duration: data.duration
      }),
      timestamp: new Date()
    }
  });
}
```

### 7.3 Queries para reportes

```typescript
// backend-api/src/services/audit.service.ts

export class AuditService {
  
  /**
   * Línea temporal de un pedido
   */
  async getOrderTimeline(orderId: string) {
    return await prisma.auditLog.findMany({
      where: {
        aggregateId: orderId,
        aggregateType: 'Order'
      },
      orderBy: { timestamp: 'asc' }
    });
  }
  
  /**
   * Todas las acciones de un usuario
   */
  async getUserActivity(userId: string, days: number = 30) {
    return await prisma.auditLog.findMany({
      where: {
        userId,
        timestamp: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: { timestamp: 'desc' },
      take: 1000
    });
  }
  
  /**
   * Detección de anomalías
   */
  async findSuspiciousActivity(userId: string) {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const activity = await prisma.auditLog.findMany({
      where: {
        userId,
        timestamp: { gte: last24h },
        action: { in: ['ORDER_CREATED', 'PAYMENT_PROCESSED'] }
      }
    });
    
    // Heurística: > 20 órdenes en 24h = sospechoso
    if (activity.length > 20) {
      return {
        suspicious: true,
        reason: 'Unusual order volume',
        count: activity.length
      };
    }
    
    // Heurística: múltiples IPs en corto tiempo
    const ips = new Set(activity.map(a => a.ipAddress));
    if (ips.size > 5 && activity.length > 10) {
      return {
        suspicious: true,
        reason: 'Multiple IPs detected',
        ips: Array.from(ips)
      };
    }
    
    return { suspicious: false };
  }
}
```

---

## 8. TESTING DE SISTEMA REAL

### 8.1 Tests de flujo completo

```typescript
// backend-api/__tests__/orders.integration.test.ts

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../src/index';
import { prisma } from '../src/config/prisma';

describe('Order Flow - Integration Tests', () => {
  let customerToken: string;
  let vendorToken: string;
  let customerSessionId: string;
  let vendorSessionId: string;
  let orderId: string;
  
  beforeAll(async () => {
    // Setup: Crear usuarios
    await prisma.user.deleteMany({});
    
    const customer = await prisma.user.create({
      data: {
        email: 'customer@test.com',
        passwordHash: 'hashed_password',
        name: 'Test Customer',
        role: 'CUSTOMER'
      }
    });
    
    const vendor = await prisma.user.create({
      data: {
        email: 'vendor@test.com',
        passwordHash: 'hashed_password',
        name: 'Test Vendor',
        role: 'VENDOR'
      }
    });
    
    // Login
    const customerLogin = await request(app)
      .post('/auth/login')
      .send({
        email: 'customer@test.com',
        password: 'test_password',
        deviceId: 'device_1',
        deviceName: 'Test iPhone'
      });
    
    customerToken = customerLogin.body.accessToken;
    customerSessionId = customerLogin.body.sessionId;
  });
  
  it('should create order → vendor accepts → payment succeeds', async () => {
    // STEP 1: Customer creates order
    const orderResponse = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .set('X-Session-Id', customerSessionId)
      .send({
        vendorId: 'vendor_123',
        items: [
          { productId: 'pizza_1', quantity: 1 }
        ]
      });
    
    expect(orderResponse.status).toBe(201);
    expect(orderResponse.body).toHaveProperty('orderId');
    orderId = orderResponse.body.orderId;
    
    // STEP 2: Verify event was created
    const events = await prisma.eventOutbox.findMany({
      where: {
        eventType: 'order.created',
        aggregateId: orderId
      }
    });
    
    expect(events).toHaveLength(1);
    expect(events[0].published).toBe(false); // Aún no publicado
    
    // STEP 3: Wait for event processor
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // STEP 4: Verify event was published
    const publishedEvent = await prisma.eventOutbox.findUnique({
      where: { id: events[0].id }
    });
    
    expect(publishedEvent?.published).toBe(true);
    
    // STEP 5: Vendor accepts order
    const acceptResponse = await request(app)
      .post(`/orders/${orderId}/accept`)
      .set('Authorization', `Bearer ${vendorToken}`)
      .send({});
    
    expect(acceptResponse.status).toBe(200);
    
    // STEP 6: Payment
    const paymentResponse = await request(app)
      .post(`/orders/${orderId}/pay`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        paymentMethodId: 'card_123'
      });
    
    expect(paymentResponse.status).toBe(200);
    
    // STEP 7: Verify audit trail
    const timeline = await prisma.auditLog.findMany({
      where: { aggregateId: orderId },
      orderBy: { timestamp: 'asc' }
    });
    
    expect(timeline.map(t => t.action)).toEqual([
      'ORDER_CREATED',
      'ORDER_ACCEPTED',
      'PAYMENT_PROCESSED'
    ]);
  });
  
  it('should prevent price manipulation', async () => {
    // Cliente intenta enviar precio alterado
    const response = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        vendorId: 'vendor_123',
        items: [
          {
            productId: 'pizza_1',
            quantity: 1,
            price: 0.01  // ← Intentando pagar $0.01
          }
        ]
      });
    
    // Backend obtiene precio real de DB
    expect(response.body.totalAmount).toBe(15.99); // Precio real
  });
});
```

### 8.2 Tests de seguridad

```typescript
// backend-api/__tests__/security.test.ts

describe('Security Tests', () => {
  
  it('should detect refresh token reuse', async () => {
    // Obtener refresh token
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'user@test.com',
        password: 'password',
        deviceId: 'device_1'
      });
    
    const refreshToken = loginResponse.body.refreshToken;
    const sessionId = loginResponse.body.sessionId;
    
    // Primer refresh (legítimo)
    const refresh1 = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken, sessionId });
    
    expect(refresh1.status).toBe(200);
    
    // Intentar reutilizar mismo token (ataque)
    const refresh2 = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken, sessionId });
    
    // Debe fallar
    expect(refresh2.status).toBe(401);
    expect(refresh2.body.error).toContain('reuse');
    
    // Verificar que todas las sesiones fueron revocadas
    const sessions = await prisma.session.findMany({
      where: { userId: loginResponse.body.user.id }
    });
    
    expect(sessions.every(s => s.revokedAt)).toBe(true);
  });
  
  it('should block brute force login attempts', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/auth/login')
        .send({
          email: 'user@test.com',
          password: 'wrong_password'
        });
    }
    
    // 6ta intento debe ser bloqueado
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'user@test.com',
        password: 'correct_password'
      });
    
    expect(response.status).toBe(429); // Too Many Requests
  });
  
  it('should prevent concurrent order acceptance', async () => {
    // Crear pedido
    const order = await prisma.order.create({
      data: {
        customerId: 'customer_1',
        vendorId: 'vendor_1',
        items: [],
        status: 'PENDING'
      }
    });
    
    // 2 vendors intentan aceptar simultáneamente
    const vendor1Promise = acceptOrder(order.id, 'vendor_1');
    const vendor2Promise = acceptOrder(order.id, 'vendor_2');
    
    const [result1, result2] = await Promise.allSettled([
      vendor1Promise,
      vendor2Promise
    ]);
    
    // Uno debe éxito, otro debe fallar
    expect(
      (result1.status === 'fulfilled') !== (result2.status === 'fulfilled')
    ).toBe(true);
  });
});
```

### 8.3 Tests de recuperación de fallos

```typescript
describe('Resilience Tests', () => {
  
  it('should retry failed events', async () => {
    // Simular error en socket
    let attemptCount = 0;
    
    const originalEmit = io.emit;
    io.emit = function() {
      attemptCount++;
      if (attemptCount < 3) {
        throw new Error('Socket connection failed');
      }
      return originalEmit.apply(this, arguments);
    };
    
    // Crear orden
    const order = await createOrder({ items: [] });
    
    // Event processor debe reintentar 3 veces
    await runEventProcessor();
    
    expect(attemptCount).toBe(3);
    
    // Finalmente publicado
    const event = await prisma.eventOutbox.findFirst({
      where: { aggregateId: order.id }
    });
    
    expect(event?.published).toBe(true);
  });
});
```

---

## 9. DEFENSA TÉCNICA ANTE AUDITOR SENIOR

### 9.1 "Cómo explico este sistema en 5 minutos"

```
AUDITOR: "¿Qué tan seguro es este sistema?"

RESPUESTA (5 minutos):
──────────────────────────

Nivel 1: AUTENTICACIÓN
"Implementamos JWT con refresh token hashing y rotación.
 Cada login genera una sesión con fingerprint de dispositivo.
 Si un token se filtra, lo detectamos en el primer reuso:
 - Invalidamos TODAS las sesiones del usuario
 - No hay ventana de explotación > 1 minuto
 - Fingerprint previene uso en otro dispositivo"

Nivel 2: CONFIABILIDAD
"Usamos Outbox Pattern para eventos críticos.
 Antes de responder al cliente, el evento está en DB.
 Si el socket falla, el Event Processor reinenta con backoff.
 Garantía: cada evento llega al menos UNA vez
 - No se pierden datos
 - Recuperable de fallos de infraestructura"

Nivel 3: CONCURRENCIA
"Optimistic locking en órdenes críticas.
 Cuando dos vendors aceptan el mismo pedido:
 - Incrementamos version en UPDATE WHERE version = X
 - Si mismatch: uno falla, cliente ve error claro
 - Stock se decrementa DESPUÉS de aceptar
 - Sin race conditions, sin dobles pagos"

Nivel 4: INTEGRIDAD FINANCIERA
"Todos los precios vienen del servidor, nunca del cliente.
 Cálculo de totales en backend, validado con triggers SQL.
 Money Value Object en centavos → sin errores decimales.
 Si cliente intenta manipular precio:
 - El precio real viene de DB
 - Auditoría registra el intento
 - Monto final es SIEMPRE correcto"

Nivel 5: AUDITORÍA
"Cada acción registrada con:
 - Usuario, IP, dispositivo, timestamp
 - Valores antes/después del cambio
 - Firma hash para integridad
 Queries para: timeline de orden, actividad de usuario,
 detección de anomalías
 Todo queryable, inmutable, trazable"

AUDITOR: "¿Y si un vendor cambia el precio de su producto?"

RESPUESTA:
"TriggersSQL validan cada UPDATE.
 Cambio de precio se registra en audit_log.
 Órdenes existentes usan precio de cuando se crearon
 (guardado en items[].unit_price).
 Vendedor no puede afectar órdenes pasadas.
 Admin ve: quién cambió, cuándo, de qué valor a cuál."

AUDITOR: "¿Si se cae el servidor durante un pago?"

RESPUESTA:
"Transacción ACID en PostgreSQL.
 O payment se procesa completamente, o no se procesa.
 Event se crea en mismo tx.
 Si servidor cae:
 - Transacción se revierten (rollback automático)
 - Cliente nunca ve dinero debitado sin orden en DB
 - Event Processor reintenta en siguiente startup
 - Recuperación automática, sin pérdida"

AUDITOR: "¿Contraseña comprometida?"

RESPUESTA:
"Detectamos login desde múltiples IPs simultáneas.
 Revocamos automáticamente TODAS las sesiones.
 Usuario debe hacer login nuevamente.
 Forzamos cambio de contraseña si se detecta patrón.
 LoginHistory registra cada intento:
 - IP, dispositivo, hora, éxito/fallo
 Puede reportar: 'Alguien intentó acceder 5 veces desde Rusia'"
```

### 9.2 Diagramas ASCII de defensa

```
SEGURIDAD: Capas múltiples
──────────────────────────

        Cliente (Mobile/Admin)
              │
              ▼
    ┌─────────────────────┐
    │ SSL/TLS             │ ← Encriptación en tránsito
    └─────────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │ Validación HTTP     │ ← Rate limiting, CORS, Headers
    │ (Middleware)        │
    └─────────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │ Autenticación JWT   │ ← Verificar token + fingerprint
    │ (AuthMiddleware)    │
    └─────────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │ Autorización RBAC   │ ← Verify role (admin, vendor, etc)
    │ (RoleMiddleware)    │
    └─────────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │ Validación DTOs     │ ← Schema, tipos, rangos
    │ (Zod/Joi)           │
    └─────────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │ Lógica de Negocio   │ ← Domain Rules
    │ (Services)          │   - No precio negativo
    │                     │   - Stock > 0
    │                     │   - Totales verificados
    └─────────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │ Persistencia ACID   │ ← PostgreSQL Transactions
    │ (Prisma)            │   - Atomicidad
    │                     │   - Consistency
    │                     │   - Isolation
    │                     │   - Durability
    └─────────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │ Base de Datos       │ ← Triggers SQL
    │ (PostgreSQL)        │   - Validación adicional
    │                     │   - Constraints
    │                     │   - Auditoría
    └─────────────────────┘


CONFIABILIDAD: Recuperación
──────────────────────────

  Evento crítico
        │
        ▼
  ┌──────────────┐
  │ En transacción:
  │ - Crear Order
  │ - Crear EventOutbox ──── BD ────┐
  │ - UPDATE Inventory            │
  └──────────────┘                │
        │                         │
        ├─ Responder HTTP (OK)    │
        │                         │
        └─ ASYNC: Event Processor │
                                  │
           ┌──────────────────────┘
           ▼
         Intentar publicar
           │
       ┌───┴───┐
       │       │
      OK    FALLO
       │       │
       │      Reintento (5s)
       │       │
       │      ┌─ OK ✓
       │      │
       │      └─ FALLO
       │         Reintento (30s)
       │         │
       │        ┌─ OK ✓
       │        │
       │        └─ FALLO
       │           ... (max 5 intentos)
       │
    Publicado ─ Redis
              └─ EventPublished (idempotencia)
```

---

## 10. IMPLEMENTACIÓN ROADMAP

### Fase 1: Setup (1-2 días)
```
☐ Actualizar schema.prisma
☐ Crear carpetas de arquitectura limpia
☐ Setup Redis
☐ Crear tipos y DTOs
```

### Fase 2: Autenticación (2-3 días)
```
☐ AuthService con JWT + refresh token hashing
☐ SessionController
☐ Middleware de validación
☐ Tests de seguridad
```

### Fase 3: Event System (2 días)
```
☐ EventOutbox en Prisma
☐ Event Processor Worker
☐ Event handlers (socket, push, audit)
☐ Tests de confiabilidad
```

### Fase 4: Dominio (2 días)
```
☐ Money Value Object
☐ Order Entity
☐ Domain Services
☐ Crear ServiceLayer
```

### Fase 5: Seguridad Operacional (1-2 días)
```
☐ AuditLog middleware
☐ Queries de auditoría
☐ Detección de anomalías
☐ Alertas de seguridad
```

### Fase 6: Testing (2-3 días)
```
☐ Integration tests completos
☐ Security tests
☐ Load tests
☐ Chaos engineering
```

---

## 11. MÉTRICAS DE ÉXITO

```
SEGURIDAD:
  ✓ 100% de acciones auditadas
  ✓ 0 token reuses no detectados
  ✓ Detección de anomalías < 1 minuto
  ✓ 0 precios manipulados

CONFIABILIDAD:
  ✓ 99.95% de eventos publicados
  ✓ < 5 segundo tiempo de retry
  ✓ 0 datos perdidos en DB
  ✓ Recuperación automática de fallos

PERFORMANCE:
  ✓ Login < 500ms
  ✓ Refresh token < 300ms
  ✓ Crear orden < 200ms
  ✓ Event processing < 100ms

COMPLIANCE:
  ✓ Auditoría completa
  ✓ Immutable logs
  ✓ Integridad financiera
  ✓ Defensa ante auditor
```

---

## CONCLUSIÓN

ITSUR Eats v5.0 no es solo "un app que funciona".

Es un sistema que puedes defender ante un:
- **Auditor de seguridad**: "Mira toda la auditoría, mira los locks"
- **Auditor financiero**: "Cada centavo está verificado y rastreable"
- **Ingeniero senior**: "Arquitectura limpia, separación de capas, testing real"
- **DevOps**: "Recuperable de fallos, sin pérdida de datos, auto-healing"

🎯 **VERDAD**: Si completas esta v5.0, tu portafolio pasa de ser "Muy bueno para la escuela" a "Este chavo sí entiende sistemas distribuidos profesionales".

