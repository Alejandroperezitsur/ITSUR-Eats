import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Promise with hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare plain password with hash
 * @param password - Plain text password
 * @param hash - Bcrypt hash
 * @returns Promise with boolean result
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Generate UUID
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * Convert decimal to string with 2 decimals
 */
export function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return num.toFixed(2);
}

/**
 * Get pagination metadata
 */
export function getPaginationMetadata(
  page: number,
  limit: number,
  total: number
): {
  page: number;
  limit: number;
  total: number;
  pages: number;
} {
  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)),
    total,
    pages: Math.ceil(total / Math.max(1, limit)),
  };
}

/**
 * Get offset for pagination
 */
export function getOffset(page: number, limit: number): number {
  return Math.max(0, (Math.max(1, page) - 1) * Math.max(1, limit));
}

/**
 * Log error safely
 */
export function logError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}
