import { prisma } from '../config/prisma';
import { redis as redisPromise } from '../config/redis';
import { createHash } from 'crypto';
import { AuthToken } from '../types/index';
import { AuditAction } from '@prisma/client';

export class SessionService {
  private redis: any;

  constructor() {
    this.init();
  }

  async init() {
    this.redis = await redisPromise;
  }

  /**
   * Crear nueva sesión con expiración basada en rol
   */
  async createSession(
    userId: string,
    userRole: string,
    tokens: AuthToken,
    deviceInfo: {
      ip: string;
      userAgent: string;
      fingerprint: string;
    }
  ) {
    // Hash del refresh token para almacenamiento seguro
    const refreshTokenHash = tokens.refreshToken 
      ? createHash('sha256').update(tokens.refreshToken).digest('hex')
      : null;

    // Calcular expiración basada en rol
    const expiresAt = new Date();
    const isStaff = ['ADMIN', 'CAFETERIA_STAFF'].includes(userRole);
    
    if (isStaff) {
        expiresAt.setHours(expiresAt.getHours() + 12); // 12 horas para staff
    } else {
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 días para usuarios
    }

    // Crear sesión en DB
    const session = await prisma.session.create({
      data: {
        userId,
        token: tokens.accessToken,
        refreshToken: null,
        refreshTokenHash: refreshTokenHash,
        deviceId: deviceInfo.fingerprint,
        deviceHash: deviceInfo.fingerprint,
        ipAddress: deviceInfo.ip,
        userAgent: deviceInfo.userAgent,
        expiresAt: expiresAt,
      },
    });

    // Cachear sesión en Redis para validación rápida (solo estado)
    if (this.redis) {
      await this.redis.set(
        `session:${session.id}`,
        JSON.stringify({
          valid: true,
          userId,
          role: userRole,
          fingerprint: deviceInfo.fingerprint,
          expiresAt: expiresAt.toISOString()
        }),
        { EX: isStaff ? 12 * 60 * 60 : 7 * 24 * 60 * 60 }
      );
    }

    return session;
  }

  /**
   * Rotar sesión (Refresh Token)
   */
  async rotateSession(
    oldRefreshToken: string,
    newTokens: AuthToken,
    deviceInfo: { ip: string; userAgent: string; fingerprint: string }
  ) {
    const oldHash = createHash('sha256').update(oldRefreshToken).digest('hex');

    // Buscar sesión por hash e incluir usuario para verificar rol
    const session = await prisma.session.findFirst({
      where: { refreshTokenHash: oldHash },
      include: { user: true }
    });

    if (!session) {
      throw new Error('Invalid refresh token');
    }

    if (session.revokedAt) {
      await this.revokeAllUserSessions(session.userId, 'Security Alert: Reuse of revoked token detected');
      throw new Error('Token reuse detected - All sessions revoked');
    }

    // Validar fingerprint (Device Binding)
    if (session.deviceHash && session.deviceHash !== deviceInfo.fingerprint) {
       // Si el fingerprint cambia drásticamente, podríamos revocar.
       // Por ahora solo logueamos o advertimos.
       console.warn(`[Security] Fingerprint mismatch for session ${session.id}`);
    }

    const newHash = newTokens.refreshToken 
      ? createHash('sha256').update(newTokens.refreshToken).digest('hex')
      : null;
    
    // Recalcular expiración
    const userRole = session.user.role;
    const isStaff = ['ADMIN', 'CAFETERIA_STAFF'].includes(userRole);
    
    const expiresAt = new Date();
    if (isStaff) {
        expiresAt.setHours(expiresAt.getHours() + 12);
    } else {
        expiresAt.setDate(expiresAt.getDate() + 7);
    }

    // Actualizar sesión con nuevo hash (Rotación)
    const updatedSession = await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshTokenHash: newHash,
        token: newTokens.accessToken,
        ipAddress: deviceInfo.ip,
        userAgent: deviceInfo.userAgent,
        updatedAt: new Date(),
        expiresAt: expiresAt
      },
    });

    // Actualizar Redis
    if (this.redis) {
      await this.redis.set(
        `session:${session.id}`,
        JSON.stringify({
          valid: true,
          userId: session.userId,
          role: userRole,
          fingerprint: deviceInfo.fingerprint,
          expiresAt: expiresAt.toISOString()
        }),
        { EX: isStaff ? 12 * 60 * 60 : 7 * 24 * 60 * 60 }
      );
    }

    return updatedSession;
  }

  /**
   * Logout del dispositivo actual
   */
  async logout(sessionId: string) {
    await prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() }
    });

    if (this.redis) {
      await this.redis.del(`session:${sessionId}`);
    }
  }

  /**
   * Obtener sesiones activas del usuario
   */
  async getUserActiveSessions(userId: string) {
    return await prisma.session.findMany({
      where: {
        userId,
        revokedAt: null
      },
      select: {
        id: true,
        deviceHash: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  /**
   * Obtener todas las sesiones de un usuario (incluyendo revocadas)
   */
  async getUserAllSessions(userId: string) {
    return await prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Revocar sesión específica
   */
  async revokeSession(sessionId: string, reason: string) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });

    if (session && !session.revokedAt) {
      await prisma.session.update({
        where: { id: sessionId },
        data: { revokedAt: new Date() }
      });

      if (this.redis) {
        await this.redis.del(`session:${sessionId}`);
      }

      // Registrar auditoría
      await prisma.auditLog.create({
        data: {
          action: AuditAction.DELETE,
          entityId: sessionId,
          entityType: 'Session',
          userId: session.userId,
          changes: { reason },
          ipAddress: session.ipAddress,
          createdAt: new Date()
        }
      });
    }
  }

  /**
   * Revocar todas las sesiones de un usuario
   */
  async revokeAllUserSessions(userId: string, reason: string) {
    const sessions = await prisma.session.findMany({
      where: { userId, revokedAt: null }
    });

    for (const session of sessions) {
      await this.revokeSession(session.id, reason);
    }
  }
}

export const sessionService = new SessionService();
