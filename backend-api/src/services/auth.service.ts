import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';
import { hashPassword, comparePassword, isValidEmail } from '../utils/helpers';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { sessionService } from './session.service';
import type { RegisterRequest, LoginRequest, UserDTO, AuthToken } from '../types/index';

const prisma = new PrismaClient();

export class AuthService {
  /**
   * Registrar nuevo usuario
   */
  async register(
    data: RegisterRequest,
    deviceInfo: { ip: string; userAgent: string; fingerprint: string }
  ): Promise<{ user: UserDTO; tokens: AuthToken }> {
    // Validar email
    if (!isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    // Verificar que no existe
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: passwordHash,
        name: data.name,
        role: 'STUDENT',
      },
    });

    // Generar tokens
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Crear sesión
    await sessionService.createSession(user.id, user.role, tokens, deviceInfo);

    // Actualizar lastLogin
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const userDTO = this.mapUserToDTO(user);

    return { user: userDTO, tokens };
  }

  /**
   * Login usuario
   */
  async login(
    data: LoginRequest,
    deviceInfo: { ip: string; userAgent: string; fingerprint: string }
  ): Promise<{ user: UserDTO; tokens: AuthToken }> {
    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isActive) {
      throw new Error('User account is inactive');
    }

    // Verificar password
    const passwordMatch = await comparePassword(data.password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    // Generar tokens
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Crear sesión
    await sessionService.createSession(user.id, user.role, tokens, deviceInfo);

    // Actualizar lastLogin
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const userDTO = this.mapUserToDTO(user);

    return { user: userDTO, tokens };
  }

  /**
   * Refresh Token
   */
  async refreshToken(
    token: string,
    deviceInfo: { ip: string; userAgent: string; fingerprint: string }
  ): Promise<AuthToken> {
    try {
      // Verificar token
      const payload = verifyRefreshToken(token);

      // Generar nuevos tokens
      const newTokens = generateTokens({
        id: payload.id,
        email: payload.email,
        role: payload.role,
      });

      // Rotar sesión
      await sessionService.rotateSession(token, newTokens, deviceInfo);

      return newTokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Logout
   */
  async logout(refreshToken: string): Promise<void> {
    const hash = createHash('sha256').update(refreshToken).digest('hex');
    const session = await prisma.session.findFirst({ where: { refreshTokenHash: hash } });
    if (session) await sessionService.revokeSession(session.id, 'User Logout');
  }

  /**
   * Get User By ID
   */
  async getUserById(userId: string): Promise<UserDTO | null> {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    return user ? this.mapUserToDTO(user) : null;
  }

  /**
   * Map User to DTO
   */
  private mapUserToDTO(user: any): UserDTO {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };
  }
}

export const authService = new AuthService();
