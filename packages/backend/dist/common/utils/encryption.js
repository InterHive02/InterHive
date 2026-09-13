"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encryption = void 0;
const crypto = __importStar(require("crypto"));
class Encryption {
    static encrypt(text, secret) {
        const salt = crypto.randomBytes(16);
        const iv = crypto.randomBytes(16);
        const key = crypto.pbkdf2Sync(secret, salt, this.iterations, this.keylen, this.digest);
        const cipher = crypto.createCipheriv(this.algorithm, key, iv);
        const encrypted = Buffer.concat([
            cipher.update(text, 'utf8'),
            cipher.final(),
        ]);
        const authTag = cipher.getAuthTag();
        const encryptedData = Buffer.concat([
            salt,
            iv,
            authTag,
            encrypted,
        ]);
        return encryptedData.toString('base64');
    }
    static decrypt(encryptedData, secret) {
        const data = Buffer.from(encryptedData, 'base64');
        const salt = data.slice(0, 16);
        const iv = data.slice(16, 32);
        const authTag = data.slice(32, 48);
        const encrypted = data.slice(48);
        const key = crypto.pbkdf2Sync(secret, salt, this.iterations, this.keylen, this.digest);
        const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
        decipher.setAuthTag(authTag);
        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final(),
        ]);
        return decrypted.toString('utf8');
    }
    static hashPassword(password) {
        const salt = crypto.randomBytes(16);
        const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
        return salt.toString('base64') + ':' + hash.toString('base64');
    }
    static verifyPassword(password, hash) {
        const [salt, hashValue] = hash.split(':');
        const derivedKey = crypto.pbkdf2Sync(password, Buffer.from(salt, 'base64'), 100000, 64, 'sha512');
        return crypto.timingSafeEqual(Buffer.from(hashValue, 'base64'), derivedKey);
    }
    static generateToken(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }
    static generateOTP(length = 6) {
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return otp;
    }
    static hash(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }
    static hmac(data, secret) {
        return crypto.createHmac('sha256', secret).update(data).digest('hex');
    }
    static encryptJWT(payload, secret) {
        const text = JSON.stringify(payload);
        return this.encrypt(text, secret);
    }
    static decryptJWT(encryptedPayload, secret) {
        const decrypted = this.decrypt(encryptedPayload, secret);
        return JSON.parse(decrypted);
    }
}
exports.Encryption = Encryption;
Encryption.algorithm = 'aes-256-gcm';
Encryption.iterations = 100000;
Encryption.keylen = 32;
Encryption.digest = 'sha256';
