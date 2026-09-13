import * as crypto from 'crypto';

export class Encryption {
  private static algorithm = 'aes-256-gcm';
  private static iterations = 100000;
  private static keylen = 32;
  private static digest = 'sha256';

  /**
   * Encrypts data using AES-256-GCM
   */
  static encrypt(text: string, secret: string): string {
    const salt = crypto.randomBytes(16);
    const iv = crypto.randomBytes(16);

    const key = crypto.pbkdf2Sync(secret, salt, this.iterations, this.keylen, this.digest);

    const cipher: any = crypto.createCipheriv(this.algorithm, key, iv);
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

  /**
   * Decrypts data encrypted with AES-256-GCM
   */
  static decrypt(encryptedData: string, secret: string): string {
    const data = Buffer.from(encryptedData, 'base64');

    const salt = data.slice(0, 16);
    const iv = data.slice(16, 32);
    const authTag = data.slice(32, 48);
    const encrypted = data.slice(48);

    const key = crypto.pbkdf2Sync(secret, salt, this.iterations, this.keylen, this.digest);

    const decipher: any = crypto.createDecipheriv(this.algorithm, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }

  /**
   * Hashes a password using bcrypt (for compatibility with existing code)
   */
  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16);
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
    return salt.toString('base64') + ':' + hash.toString('base64');
  }

  /**
   * Verifies a password against a hash
   */
  static verifyPassword(password: string, hash: string): boolean {
    const [salt, hashValue] = hash.split(':');
    const derivedKey = crypto.pbkdf2Sync(password, Buffer.from(salt, 'base64'), 100000, 64, 'sha512');
    return crypto.timingSafeEqual(Buffer.from(hashValue, 'base64'), derivedKey);
  }

  /**
   * Generates a random token
   */
  static generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generates a random OTP
   */
  static generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  /**
   * Hashes data using SHA-256
   */
  static hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Hashes data using HMAC-SHA-256
   */
  static hmac(data: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  /**
   * Encrypts a JWT payload (symmetric)
   */
  static encryptJWT(payload: any, secret: string): string {
    const text = JSON.stringify(payload);
    return this.encrypt(text, secret);
  }

  /**
   * Decrypts a JWT payload
   */
  static decryptJWT(encryptedPayload: string, secret: string): any {
    const decrypted = this.decrypt(encryptedPayload, secret);
    return JSON.parse(decrypted);
  }
}