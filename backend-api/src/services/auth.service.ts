import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword, isValidEmail } from '../utils/helpers';
import { generateTokens } from '../utils/jwt';
import type { RegisterRequest, LoginRequest, UserDTO, AuthToken } from '../types/index';

const prisma = new PrismaClient();

export class AuthService {
  /**
   * Registrar nuevo usuario
   */
  async register(data: RegisterRequest): Promise<{ user: UserDTO; tokens: AuthToken }> {
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
  async login(data: LoginRequest): Promise<{ user: UserDTO; tokens: AuthToken }> {
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

    // Actualizar lastLogin
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const userDTO = this.mapUserToDTO(user);

    return { user: userDTO, tokens };
  }

  /**
   * Obtener usuario por ID
   */
  async getUserById(id: string): Promise<UserDTO | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user ? this.mapUserToDTO(user) : null;
  }

  /**
   * Mapear usuario a DTO
   */
  private mapUserToDTO(user: any): UserDTO {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    };
  }
}

export const authService = new AuthService();
