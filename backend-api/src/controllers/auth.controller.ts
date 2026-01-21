import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sessionService } from '../services/session.service';

const getDeviceInfo = (req: Request) => {
  return {
    ip: req.ip || (req.connection && req.connection.remoteAddress) || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
    fingerprint: (req.headers['x-device-fingerprint'] as string) || 'unknown',
  };
};

export class AuthController {
  /**
   * POST /auth/register
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;
      const deviceInfo = getDeviceInfo(req);

      const { user, tokens } = await authService.register(
        { email, password, name },
        deviceInfo
      );

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        success: true,
        data: {
          user,
          accessToken: tokens.accessToken,
          expiresIn: tokens.expiresIn,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      res.status(400).json({
        success: false,
        error: {
          message,
          code: 'REGISTRATION_ERROR',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /auth/login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const deviceInfo = getDeviceInfo(req);

      const { user, tokens } = await authService.login(
        { email, password },
        deviceInfo
      );

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        data: {
          user,
          accessToken: tokens.accessToken,
          expiresIn: tokens.expiresIn,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      res.status(401).json({
        success: false,
        error: {
          message,
          code: 'LOGIN_ERROR',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /auth/refresh
   */
  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          error: {
            message: 'No refresh token provided',
            code: 'NO_REFRESH_TOKEN',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const deviceInfo = getDeviceInfo(req);
      const tokens = await authService.refreshToken(refreshToken, deviceInfo);

      res.json(tokens);res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        data: {
          accessToken: tokens.accessToken,
          expiresIn: tokens.expiresIn,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Token refresh failed';
      res.status(401).json({
        success: false,
        error: {
          message,
          code: 'REFRESH_ERROR',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * POST /auth/logout
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;
      
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      
      res.clearCookie('refreshToken');
      res.status(200).json({
        success: true,
        data: { message: 'Logged out successfully' },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      // Logout should ideally not fail for the user
      res.clearCookie('refreshToken');
      res.status(200).json({
        success: true,
        data: { message: 'Logged out' },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /auth/me
   */
  async getMe(req: Request, res: Response): Promise<void> {
    try {
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

      const user = await authService.getUserById(req.user.id);

      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            message: 'User not found',
            code: 'NOT_FOUND',
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch user';
      res.status(500).json({
        success: false,
        error: {
          message,
          code: 'SERVER_ERROR',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * GET /auth/sessions
   * Get all active sessions for current user
   */
  async getSessions(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) throw new Error('Unauthorized');
        
        const sessions = await sessionService.getUserActiveSessions(req.user.id);
        
        res.status(200).json({
            success: true,
            data: sessions,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to fetch sessions' }
        });
    }
  }

  /**
   * DELETE /auth/sessions/:sessionId
   * Revoke specific session
   */
  async revokeSession(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) throw new Error('Unauthorized');
        const { sessionId } = req.params;
        
        await sessionService.revokeSession(sessionId, 'User Revocation');
        
        res.status(200).json({
            success: true,
            data: { message: 'Session revoked' }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { message: 'Failed to revoke session' }
        });
    }
  }

  /**
   * DELETE /auth/sessions
   * Revoke all other sessions
   */
  async revokeAllSessions(req: Request, res: Response): Promise<void> {
      try {
          if (!req.user) throw new Error('Unauthorized');
          
          await sessionService.revokeAllUserSessions(req.user.id, 'User Requested Full Logout');
          
          res.status(200).json({
              success: true,
              data: { message: 'All sessions revoked' }
          });
      } catch (error) {
          res.status(500).json({
              success: false,
              error: { message: 'Failed to revoke sessions' }
          });
      }
  }
}

export const authController = new AuthController();
