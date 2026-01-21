import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AuditAction } from '@prisma/client';

/**
 * Middleware de Auditoría
 * Registra automáticamente acciones exitosas en la base de datos
 */
export const auditMiddleware = (action: AuditAction, entityType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Interceptar res.json para capturar el ID de la entidad creada/modificada
    const originalJson = res.json;
    
    res.json = function (body) {
      res.locals.responseBody = body;
      return originalJson.call(this, body);
    };

    res.on('finish', async () => {
      // Solo registrar si la operación fue exitosa (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const userId = req.user?.id;
          
          // Intentar deducir entityId
          let entityId = req.params.id;
          if (!entityId && res.locals.responseBody) {
             const body = res.locals.responseBody;
             // Soportar estructuras { data: { id: ... } } o { id: ... }
             entityId = body.id || (body.data && body.data.id) || (body.user && body.user.id);
          }

          if (userId) {
              await prisma.auditLog.create({
                  data: {
                      action,
                      entityType,
                      entityId: entityId || 'UNKNOWN',
                      userId,
                      ipAddress: req.ip || (req.connection && req.connection.remoteAddress) || 'unknown',
                      userAgent: req.get('User-Agent'),
                      // Guardar payload relevante (sin passwords)
                      changes: ['POST', 'PUT', 'PATCH'].includes(req.method) ? sanitizeBody(req.body) : undefined
                  }
              });
          }
        } catch (err) {
            console.error('[AuditMiddleware] Failed to log action:', err);
        }
      }
    });

    next();
  };
};

function sanitizeBody(body: any): any {
    if (!body) return body;
    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'refreshToken', 'creditCard'];
    
    sensitiveFields.forEach(field => {
        if (field in sanitized) sanitized[field] = '***';
    });
    
    return sanitized;
}
