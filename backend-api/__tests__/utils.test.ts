import { hashPassword, comparePassword, isValidEmail, isValidPassword } from '../src/utils/helpers';

describe('Helpers Utils', () => {
  describe('Password Hashing', () => {
    it('should hash a password', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);

      expect(hash).not.toEqual(password);
      expect(hash.length).toBeGreaterThan(10);
    });

    it('should compare password correctly', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);

      const isValid = await comparePassword(password, hash);
      expect(isValid).toBe(true);

      const isInvalid = await comparePassword('WrongPassword', hash);
      expect(isInvalid).toBe(false);
    });
  });

  describe('Email Validation', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user@itsur.edu.mx')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('Password Validation', () => {
    it('should validate strong password', () => {
      expect(isValidPassword('TestPassword123!')).toBe(true);
      expect(isValidPassword('SecurePass456@')).toBe(true);
    });

    it('should reject weak password', () => {
      expect(isValidPassword('weak')).toBe(false); // too short
      expect(isValidPassword('nouppercasehere123!')).toBe(false); // no uppercase
      expect(isValidPassword('NOLOWERCASEHERE123!')).toBe(false); // no lowercase
      expect(isValidPassword('NoNumbers!')).toBe(false); // no number
      expect(isValidPassword('NoSpecial123')).toBe(false); // no special char
    });
  });
});
