"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validators = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
class Validators {
    static isEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static isPhone(phone) {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(phone);
    }
    static isUUID(id) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
    }
    static isObjectId(id) {
        return mongoose_1.Types.ObjectId.isValid(id);
    }
    static isURL(url) {
        try {
            new URL(url);
            return true;
        }
        catch {
            return false;
        }
    }
    static isDate(date) {
        return date instanceof Date && !isNaN(date.getTime());
    }
    static isString(value) {
        return typeof value === 'string' || value instanceof String;
    }
    static isNumber(value) {
        return typeof value === 'number' && !isNaN(value);
    }
    static isBoolean(value) {
        return typeof value === 'boolean';
    }
    static isArray(value) {
        return Array.isArray(value);
    }
    static isObject(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }
    static validateRequired(data, requiredFields) {
        const missingFields = requiredFields.filter(field => {
            const value = data[field];
            return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
        });
        if (missingFields.length > 0) {
            throw new common_1.BadRequestException(`Missing required fields: ${missingFields.join(', ')}`);
        }
    }
    static validateEmail(email) {
        if (!this.isEmail(email)) {
            throw new common_1.BadRequestException('Invalid email format');
        }
    }
    static validatePhone(phone) {
        if (!this.isPhone(phone)) {
            throw new common_1.BadRequestException('Invalid phone number format');
        }
    }
    static validateUrl(url) {
        if (!this.isURL(url)) {
            throw new common_1.BadRequestException('Invalid URL format');
        }
    }
    static validateObjectId(id) {
        if (!this.isObjectId(id)) {
            throw new common_1.BadRequestException('Invalid ID format');
        }
    }
    static validateEmailExists(email) {
        if (!email) {
            throw new common_1.BadRequestException('Email is required');
        }
        this.validateEmail(email);
    }
    static validatePassword(password) {
        if (password.length < 8) {
            throw new common_1.BadRequestException('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            throw new common_1.BadRequestException('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            throw new common_1.BadRequestException('Password must contain at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            throw new common_1.BadRequestException('Password must contain at least one number');
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            throw new common_1.BadRequestException('Password must contain at least one special character');
        }
    }
    static validateDateRange(startDate, endDate) {
        if (startDate >= endDate) {
            throw new common_1.BadRequestException('Start date must be before end date');
        }
    }
    static validateEnum(value, enumType) {
        if (!Object.values(enumType).includes(value)) {
            throw new common_1.BadRequestException(`Invalid value. Must be one of: ${Object.values(enumType).join(', ')}`);
        }
    }
    static validateMin(value, min) {
        if (value < min) {
            throw new common_1.BadRequestException(`Value must be at least ${min}`);
        }
    }
    static validateMax(value, max) {
        if (value > max) {
            throw new common_1.BadRequestException(`Value must be at most ${max}`);
        }
    }
    static validateRange(value, min, max) {
        this.validateMin(value, min);
        this.validateMax(value, max);
    }
    static validateStringLength(value, min, max) {
        if (value.length < min) {
            throw new common_1.BadRequestException(`String must be at least ${min} characters long`);
        }
        if (value.length > max) {
            throw new common_1.BadRequestException(`String must be at most ${max} characters long`);
        }
    }
    static sanitizeEmail(email) {
        return email.trim().toLowerCase();
    }
    static sanitizePhone(phone) {
        return phone.replace(/\s/g, '');
    }
    static sanitizeString(str) {
        return str.trim().replace(/[<>]/g, '');
    }
    static sanitizeInput(data) {
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
exports.Validators = Validators;
