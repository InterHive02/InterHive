export class Validators {
  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isPhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }

  static isURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isStrongPassword(password: string): boolean {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  }

  static isValidName(name: string): boolean {
    return name.length >= 2 && name.length <= 50 && /^[a-zA-Z\s']+$/.test(name);
  }

  static isValidEnum<T extends Record<string, any>>(value: any, enumType: T): value is T[keyof T] {
    return Object.values(enumType).includes(value);
  }

  static isNonEmptyString(value: any): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }

  static isPositiveNumber(value: any): boolean {
    return typeof value === 'number' && value > 0;
  }

  static isValidPercentage(value: number): boolean {
    return value >= 0 && value <= 100;
  }

  static isValidDateRange(startDate: Date, endDate: Date): boolean {
    return startDate < endDate;
  }

  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  static sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  static validateRequired(data: any, requiredFields: string[]): string[] {
    return requiredFields.filter(field => {
      const value = data[field];
      return value === undefined || value === null || 
        (typeof value === 'string' && value.trim() === '');
    });
  }
}
