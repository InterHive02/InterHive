import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export class Validators {
  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isPhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }

  static isUUID(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  static isObjectId(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }

  static isURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  static isString(value: any): boolean {
    return typeof value === 'string' || value instanceof String;
  }

  static isNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value);
  }

  static isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  static isArray(value: any): boolean {
    return Array.isArray(value);
  }

  static isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  static validateRequired(data: any, requiredFields: string[]): void {
    const missingFields = requiredFields.filter(field => {
      const value = data[field];
      return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
    });

    if (missingFields.length > 0) {
      throw new BadRequestException(`Missing required fields: ${missingFields.join(', ')}`);
    }
  }

  static validateEmail(email: string): void {
    if (!this.isEmail(email)) {
      throw new BadRequestException('Invalid email format');
    }
  }

  static validatePhone(phone: string): void {
    if (!this.isPhone(phone)) {
      throw new BadRequestException('Invalid phone number format');
    }
  }

  static validateUrl(url: string): void {
    if (!this.isURL(url)) {
      throw new BadRequestException('Invalid URL format');
    }
  }

  static validateObjectId(id: string): void {
    if (!this.isObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
  }

  static validateEmailExists(email: string): void {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    this.validateEmail(email);
  }

  static validatePassword(password: string): void {
    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      throw new BadRequestException('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      throw new BadRequestException('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      throw new BadRequestException('Password must contain at least one number');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      throw new BadRequestException('Password must contain at least one special character');
    }
  }

  static validateDateRange(startDate: Date, endDate: Date): void {
    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
  }

  static validateEnum(value: any, enumType: any): void {
    if (!Object.values(enumType).includes(value)) {
      throw new BadRequestException(`Invalid value. Must be one of: ${Object.values(enumType).join(', ')}`);
    }
  }

  static validateMin(value: number, min: number): void {
    if (value < min) {
      throw new BadRequestException(`Value must be at least ${min}`);
    }
  }

  static validateMax(value: number, max: number): void {
    if (value > max) {
      throw new BadRequestException(`Value must be at most ${max}`);
    }
  }

  static validateRange(value: number, min: number, max: number): void {
    this.validateMin(value, min);
    this.validateMax(value, max);
  }

  static validateStringLength(value: string, min: number, max: number): void {
    if (value.length < min) {
      throw new BadRequestException(`String must be at least ${min} characters long`);
    }
    if (value.length > max) {
      throw new BadRequestException(`String must be at most ${max} characters long`);
    }
  }

  static sanitizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  static sanitizePhone(phone: string): string {
    return phone.replace(/\s/g, '');
  }

  static sanitizeString(str: string): string {
    return str.trim().replace(/[<>]/g, '');
  }

  static sanitizeInput(data: any): any {
    if (typeof data === 'string') {
      return this.sanitizeString(data);
    }
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeInput(item));
    }
    if (typeof data === 'object' && data !== null) {
      const sanitized = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }
    return data;
  }
}