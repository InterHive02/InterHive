import { Email, PhoneNumber, UUID } from '../types/common.types';

export class Validators {
  static isEmail(email: string): email is Email {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isPhoneNumber(phone: string): phone is PhoneNumber {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }

  static isUUID(id: string): id is UUID {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  static isURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isDateString(date: string): boolean {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  }

  static isPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  static isStrongPassword(password: string): boolean {
    // At least 12 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    return strongRegex.test(password);
  }

  static isUrlSafeString(str: string): boolean {
    return /^[a-zA-Z0-9_-]+$/.test(str);
  }

  static isAlphaNumeric(str: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(str);
  }

  static isValidName(name: string): boolean {
    return name.length >= 2 && name.length <= 50 && /^[a-zA-Z\s']+$/.test(name);
  }

  static isValidSkillLevel(level: string): boolean {
    return ['beginner', 'intermediate', 'advanced', 'expert'].includes(level);
  }

  static isValidEnum<T extends Record<string, any>>(
    value: any,
    enumType: T
  ): value is T[keyof T] {
    return Object.values(enumType).includes(value);
  }

  static isNonEmptyString(value: any): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }

  static isPositiveNumber(value: any): boolean {
    return typeof value === 'number' && value > 0;
  }

  static isValidRange(min: number, max: number, value: number): boolean {
    return value >= min && value <= max;
  }

  static isValidPercentage(value: number): boolean {
    return value >= 0 && value <= 100;
  }

  static isValidScore(value: number): boolean {
    return value >= 0 && value <= 10;
  }

  static isValidDateRange(startDate: Date, endDate: Date): boolean {
    return startDate < endDate;
  }

  static isValidFileType(mimeType: string): boolean {
    const allowed = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'application/json',
      'text/csv',
    ];
    return allowed.includes(mimeType);
  }

  static isValidFileSize(size: number, maxSizeInMB: number = 5): boolean {
    return size <= maxSizeInMB * 1024 * 1024;
  }

  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  static sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  static capitalizeWords(str: string): string {
    return str.replace(/\w\S*/g, (word) => 
      word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    );
  }

  static truncateString(str: string, maxLength: number = 100): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
  }
}