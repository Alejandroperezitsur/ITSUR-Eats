import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt';
import type { RequestUser } from '../types/index';

// Extender interfaz Express para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
      ip?: string;
    }
  }
}

/**
 * Middleware para verificar JWT
 */
export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          message: 'No token provided',
          code: 'NO_TOKEN',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Token verification failed';
    res.status(401).json({
      success: false,
      error: {
        message,
        code: 'INVALID_TOKEN',
      },
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Middleware para verificar rol
 */
export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized',
          code: 'UNAUTHORIZED',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Forbidden - Insufficient permissions',
          code: 'FORBIDDEN',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
}
