import { Request, Response } from 'express';
import { authService } from '@services/auth.service';
import { generateRefreshToken, verifyRefreshToken } from '@utils/jwt';

export class AuthController {
  /**
   * POST /auth/register
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;

      const { user, tokens } = await authService.register({
        email,
        password,
        name,
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

      // Set refresh token in httpOnly cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

      const { user, tokens } = await authService.login({
        email,
        password,
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

      // Set refresh token in httpOnly cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

      const payload = verifyRefreshToken(refreshToken);
      const newAccessToken = generateRefreshToken(payload);

      res.status(200).json({
        success: true,
        data: {
          accessToken: newAccessToken,
          expiresIn: 15 * 60, // 15 minutes
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
  async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('refreshToken');
    res.status(200).json({
      success: true,
      data: { message: 'Logged out successfully' },
      timestamp: new Date().toISOString(),
    });
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
      const message = error instanceof Error ? error.message : 'Error fetching user';
      res.status(500).json({
        success: false,
        error: {
          message,
          code: 'INTERNAL_ERROR',
        },
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export const authController = new AuthController();
