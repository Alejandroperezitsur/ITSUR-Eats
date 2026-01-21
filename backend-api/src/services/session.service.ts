/**
 * SessionService v5.0
 * Gestión de sesiones y revocación
 */

import { prisma } from '../config/prisma';
import { redis } from '../config/redis';

export class SessionService {
  
  /**
   * Logout del dispositivo actual
   */
  async logout(sessionId: string) {
    await prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() }
    });

    await redis.del(`session:${sessionId}`);
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
        deviceName: true,
        ipAddress: true,
        createdAt: true,
        lastActivityAt: true
      },
      orderBy: { lastActivityAt: 'desc' }
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

      await redis.del(`session:${sessionId}`);

      // Registrar auditoría
      await prisma.auditLog.create({
        data: {
          action: 'SESSION_REVOKED',
          aggregateId: sessionId,
          aggregateType: 'Session',
          userId: session.userId,
          changes: reason,
          timestamp: new Date()
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
