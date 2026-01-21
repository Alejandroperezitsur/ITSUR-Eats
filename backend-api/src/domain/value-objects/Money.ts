/**
 * Money Value Object
 * Representa dinero de forma segura usando centavos (enteros)
 * Evita errores de punto flotante y permite validación de negocio
 */

export class Money {
  private readonly amountInCents: number;
  readonly currency: string;

  private constructor(amountInCents: number, currency: string = 'USD') {
    if (!Number.isInteger(amountInCents) || amountInCents < 0) {
      throw new Error('Money must be a positive integer (cents)');
    }
    this.amountInCents = amountInCents;
    this.currency = currency;
  }

  /**
   * Factory: crear desde decimal (ej: 99.99 USD)
   */
  static fromDecimal(decimal: number, currency: string = 'USD'): Money {
    const cents = Math.round(decimal * 100);
    return new Money(cents, currency);
  }

  /**
   * Factory: crear desde centavos directamente
   */
  static fromCents(cents: number, currency: string = 'USD'): Money {
    return new Money(cents, currency);
  }

  /**
   * Factory: cero
   */
  static zero(currency: string = 'USD'): Money {
    return new Money(0, currency);
  }

  /**
   * Obtener valor en centavos
   */
  getCents(): number {
    return this.amountInCents;
  }

  /**
   * Obtener valor en decimal (para mostrar)
   */
  getDecimal(): number {
    return this.amountInCents / 100;
  }

  /**
   * Obtener valor formateado para display
   */
  format(): string {
    return `${this.currency} ${(this.amountInCents / 100).toFixed(2)}`;
  }

  /**
   * Sumar dinero
   */
  add(other: Money): Money {
    this.validateCurrency(other);
    return new Money(this.amountInCents + other.amountInCents, this.currency);
  }

  /**
   * Restar dinero
   */
  subtract(other: Money): Money {
    this.validateCurrency(other);
    const result = this.amountInCents - other.amountInCents;
    if (result < 0) {
      throw new Error('Cannot subtract - result would be negative');
    }
    return new Money(result, this.currency);
  }

  /**
   * Multiplicar por factor
   */
  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('Cannot multiply by negative factor');
    }
    if (!Number.isFinite(factor)) {
      throw new Error('Factor must be a finite number');
    }
    return new Money(Math.round(this.amountInCents * factor), this.currency);
  }

  /**
   * Dividir
   */
  divide(divisor: number): Money {
    if (divisor <= 0) {
      throw new Error('Divisor must be positive');
    }
    return new Money(Math.round(this.amountInCents / divisor), this.currency);
  }

  /**
   * Comparar igualdad
   */
  equals(other: Money): boolean {
    return this.amountInCents === other.amountInCents &&
           this.currency === other.currency;
  }

  /**
   * Comparar mayor que
   */
  isGreaterThan(other: Money): boolean {
    this.validateCurrency(other);
    return this.amountInCents > other.amountInCents;
  }

  /**
   * Comparar mayor o igual
   */
  isGreaterThanOrEqual(other: Money): boolean {
    this.validateCurrency(other);
    return this.amountInCents >= other.amountInCents;
  }

  /**
   * Comparar menor que
   */
  isLessThan(other: Money): boolean {
    this.validateCurrency(other);
    return this.amountInCents < other.amountInCents;
  }

  /**
   * ¿Es cero?
   */
  isZero(): boolean {
    return this.amountInCents === 0;
  }

  /**
   * ¿Es positivo?
   */
  isPositive(): boolean {
    return this.amountInCents > 0;
  }

  /**
   * Serializar para JSON
   */
  toJSON() {
    return {
      cents: this.amountInCents,
      decimal: this.getDecimal(),
      currency: this.currency,
      formatted: this.format()
    };
  }

  private validateCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(
        `Cannot operate between ${this.currency} and ${other.currency}`
      );
    }
  }
}
