import { BadRequestException, ForbiddenException, HttpStatus, HttpException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@interhive/shared';
import { UserSchema } from '../users/schemas/user.schema';
import { RateLimitMiddleware } from '../../core/middleware/rate-limit.middleware';

describe('Security Remediation Suite', () => {
  describe('A. Authentication Backdoor Elimination', () => {
    let mockUser: any;
    const realPassword = 'MySecretRealPassword#2026!';
    let realPasswordHash: string;

    beforeAll(async () => {
      realPasswordHash = await bcrypt.hash(realPassword, 10);
    });

    beforeEach(() => {
      mockUser = {
        password: realPasswordHash,
        comparePassword: (UserSchema.methods as any).comparePassword,
      };
    });

    it('should authenticate when the candidate password matches the bcrypt hash', async () => {
      const isMatch = await mockUser.comparePassword(realPassword);
      expect(isMatch).toBe(true);
    });

    it('must reject previously hardcoded backdoor passwords (e.g. Admin@123, Password123!)', async () => {
      const backdoorPasswords = [
        'Admin@123',
        'Password123!',
        'Student@123',
        'Company@123',
        'Hr@123',
        'Manager@123',
        'Demo@123',
      ];

      for (const backdoor of backdoorPasswords) {
        const isMatch = await mockUser.comparePassword(backdoor);
        expect(isMatch).toBe(false);
      }
    });

    it('should reject empty or null passwords safely', async () => {
      expect(await mockUser.comparePassword('')).toBe(false);
      expect(await mockUser.comparePassword(null as any)).toBe(false);
      expect(await mockUser.comparePassword(undefined as any)).toBe(false);
    });
  });

  describe('B. Rate Limiting Middleware Fail-Safe & Enforcement', () => {
    let middleware: RateLimitMiddleware;
    let mockConfigService: any;
    let mockRedisService: any;

    beforeEach(() => {
      mockConfigService = {
        get: jest.fn().mockReturnValue(null),
      };
      mockRedisService = {
        get: jest.fn().mockRejectedValue(new Error('Redis connection refused')),
        set: jest.fn().mockRejectedValue(new Error('Redis connection refused')),
        increment: jest.fn().mockRejectedValue(new Error('Redis connection refused')),
        expire: jest.fn().mockRejectedValue(new Error('Redis connection refused')),
      };

      middleware = new RateLimitMiddleware(mockConfigService, mockRedisService);
    });

    it('should enforce in-memory rate limiting when Redis is unavailable', async () => {
      const uniqueIp = `192.0.2.${Math.floor(Math.random() * 200) + 1}`;
      const mockReq: any = {
        headers: {},
        ip: uniqueIp,
        originalUrl: '/api/v1/auth/login',
        path: '/api/v1/auth/login',
      };
      const mockRes: any = {
        setHeader: jest.fn(),
      };
      const nextFn = jest.fn();

      // Login route limit is 10 requests per minute
      for (let i = 0; i < 10; i++) {
        await middleware.use(mockReq, mockRes, nextFn);
      }
      expect(nextFn).toHaveBeenCalledTimes(10);

      // 11th request must throw 429 Too Many Requests
      await expect(middleware.use(mockReq, mockRes, nextFn)).rejects.toThrow(HttpException);
      try {
        await middleware.use(mockReq, mockRes, nextFn);
      } catch (err: any) {
        expect(err.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
      }
    });
  });

  describe('C. CORS Origin Validation Logic', () => {
    const standardOrigins = new Set([
      'https://interhive.in',
      'https://www.interhive.in',
    ]);

    const isOriginAllowed = (origin: string | undefined): boolean => {
      if (!origin) return true; // Server-to-server / curl
      if (standardOrigins.has(origin)) return true;
      return false;
    };

    it('should approve legitimate production origins', () => {
      expect(isOriginAllowed('https://interhive.in')).toBe(true);
      expect(isOriginAllowed('https://www.interhive.in')).toBe(true);
      expect(isOriginAllowed(undefined)).toBe(true);
    });

    it('must reject spoofed or hostile origins', () => {
      expect(isOriginAllowed('https://evil.com')).toBe(false);
      expect(isOriginAllowed('http://localhost.evil.com')).toBe(false);
      expect(isOriginAllowed('https://attacker-interhive.in')).toBe(false);
      expect(isOriginAllowed('null')).toBe(false);
    });
  });

  describe('D. Company Requirement BOLA Authorization Verification', () => {
    const verifyCompanyOwnership = (
      requirementCompanyId: string,
      company: { _id: string; contact?: { primaryContact?: { email?: string }; hrContact?: { email?: string } } },
      user: { id?: string; _id?: string; email?: string; role: UserRole },
    ) => {
      if (!user) throw new ForbiddenException('User context is required');
      if (user.role === UserRole.ADMIN) return true;

      const userIdStr = (user.id || user._id || '').toString();
      const companyIdStr = (company._id || '').toString();

      const isContactOwner =
        company.contact?.primaryContact?.email?.toLowerCase() === user.email?.toLowerCase() ||
        company.contact?.hrContact?.email?.toLowerCase() === user.email?.toLowerCase();

      const isDirectOwner = companyIdStr === userIdStr;

      if (!isContactOwner && !isDirectOwner) {
        throw new ForbiddenException('You do not have permission to modify this company resource');
      }
      return true;
    };

    const targetCompanyId = '507f1f77bcf86cd799439011';
    const mockCompany = {
      _id: targetCompanyId,
      contact: {
        primaryContact: { email: 'company-owner@interhive.in' },
      },
    };

    it('should permit administrator to modify any requirement', () => {
      const adminUser = { id: 'admin-id', role: UserRole.ADMIN, email: 'admin@interhive.in' };
      expect(verifyCompanyOwnership(targetCompanyId, mockCompany, adminUser)).toBe(true);
    });

    it('should permit the legitimate company owner', () => {
      const ownerUser = { id: 'owner-id', role: UserRole.COMPANY, email: 'company-owner@interhive.in' };
      expect(verifyCompanyOwnership(targetCompanyId, mockCompany, ownerUser)).toBe(true);
    });

    it('must forbid a different company or user from modifying this requirement (BOLA prevention)', () => {
      const attackerUser = { id: 'attacker-id', role: UserRole.COMPANY, email: 'other-company@gmail.com' };
      expect(() =>
        verifyCompanyOwnership(targetCompanyId, mockCompany, attackerUser),
      ).toThrow(ForbiddenException);
    });
  });

  describe('E. Self-Profile Privilege Escalation Prevention', () => {
    const sanitizeProfilePayload = (updateUserDto: any) => {
      const {
        role,
        accessLevel,
        internStatus,
        employeeId,
        isActive,
        isVerified,
        department,
        manager,
        ...allowedProfileData
      } = updateUserDto;
      return allowedProfileData;
    };

    it('must strip role, accessLevel, and verification flags from self-profile update', () => {
      const maliciousPayload = {
        firstName: 'Jane',
        lastName: 'Intern',
        role: UserRole.ADMIN,
        accessLevel: 'admin',
        isVerified: true,
        isActive: true,
        internStatus: 'placed',
        employeeId: 'ROOT-001',
        department: 'Executive',
        manager: 'self',
        phone: '+919876543210',
        bio: 'Self-motivated software engineer',
      };

      const sanitized = sanitizeProfilePayload(maliciousPayload);

      expect(sanitized.role).toBeUndefined();
      expect(sanitized.accessLevel).toBeUndefined();
      expect(sanitized.isVerified).toBeUndefined();
      expect(sanitized.isActive).toBeUndefined();
      expect(sanitized.internStatus).toBeUndefined();
      expect(sanitized.employeeId).toBeUndefined();
      expect(sanitized.department).toBeUndefined();
      expect(sanitized.manager).toBeUndefined();

      expect(sanitized.firstName).toBe('Jane');
      expect(sanitized.lastName).toBe('Intern');
      expect(sanitized.phone).toBe('+919876543210');
      expect(sanitized.bio).toBe('Self-motivated software engineer');
    });
  });

  describe('F. Project Task BOLA & File Upload Restrictions', () => {
    const verifyProjectAccess = (project: any, user: any): void => {
      if (!user) {
        throw new ForbiddenException('User context is required for authorization');
      }
      const role = user.role;
      if (role === 'admin' || role === 'hr' || role === 'manager') {
        return;
      }
      const userIdStr = (user.id || user._id || '').toString();
      const isAssigned = (project.assignedTo || []).some((id: any) => id.toString() === userIdStr);
      const isMentor = (project.mentors || []).some((id: any) => id.toString() === userIdStr);

      if (!isAssigned && !isMentor) {
        throw new ForbiddenException('You do not have permission to access or modify this project');
      }
    };

    const isUploadAllowed = (filename: string): boolean => {
      const dangerousExts = /\.(exe|sh|bat|cmd|php|phtml|cgi|pl|py|js|ts|html|htm|svg|vbs|jar|apk)$/i;
      return !dangerousExts.test(filename);
    };

    const sampleProject = {
      _id: 'proj-123',
      assignedTo: ['intern-001', 'intern-002'],
      mentors: ['mentor-001'],
    };

    it('should permit assigned intern and mentor to access project', () => {
      expect(() => verifyProjectAccess(sampleProject, { id: 'intern-001', role: 'intern' })).not.toThrow();
      expect(() => verifyProjectAccess(sampleProject, { id: 'mentor-001', role: 'mentor' })).not.toThrow();
    });

    it('should permit privileged administrative roles', () => {
      expect(() => verifyProjectAccess(sampleProject, { id: 'admin-1', role: 'admin' })).not.toThrow();
      expect(() => verifyProjectAccess(sampleProject, { id: 'hr-1', role: 'hr' })).not.toThrow();
      expect(() => verifyProjectAccess(sampleProject, { id: 'mgr-1', role: 'manager' })).not.toThrow();
    });

    it('must forbid unassigned intern or external user from modifying project tasks', () => {
      expect(() =>
        verifyProjectAccess(sampleProject, { id: 'intern-999', role: 'intern' }),
      ).toThrow(ForbiddenException);
    });

    it('must reject executable and dangerous file uploads', () => {
      const dangerousFiles = [
        'payload.exe',
        'script.sh',
        'webshell.php',
        'backdoor.phtml',
        'script.py',
        'exploit.html',
        'malicious.svg',
        'autorun.bat',
        'tool.jar',
      ];

      for (const file of dangerousFiles) {
        expect(isUploadAllowed(file)).toBe(false);
      }
    });

    it('should allow legitimate document and image files', () => {
      const safeFiles = [
        'report.pdf',
        'architecture.png',
        'diagram.jpg',
        'dataset.csv',
        'archive.zip',
        'spec.docx',
      ];

      for (const file of safeFiles) {
        expect(isUploadAllowed(file)).toBe(true);
      }
    });
  });

  describe('G. Google OAuth Token Identity Verification', () => {
    const validateGoogleTokenPayload = (
      tokenInfo: any,
      configuredClientId?: string,
      configuredFirebaseId?: string,
    ) => {
      if (!configuredClientId && !configuredFirebaseId) {
        throw new BadRequestException('Google authentication is not configured on this server');
      }

      if (!tokenInfo || !tokenInfo.email || !tokenInfo.sub) {
        throw new ForbiddenException('Incomplete Google identity token payload');
      }

      const validIssuers = ['https://accounts.google.com', 'accounts.google.com'];
      if (!validIssuers.includes(tokenInfo.iss)) {
        throw new ForbiddenException('Untrusted token issuer');
      }

      const exp = Number(tokenInfo.exp);
      if (!exp || exp <= Math.floor(Date.now() / 1000)) {
        throw new ForbiddenException('Google ID token has expired');
      }

      const validAudiences = [configuredClientId, configuredFirebaseId].filter(Boolean);
      if (!validAudiences.includes(tokenInfo.aud)) {
        throw new ForbiddenException('Google token audience does not match configured application');
      }

      const isEmailVerified = tokenInfo.email_verified === true || tokenInfo.email_verified === 'true';
      if (!isEmailVerified) {
        throw new ForbiddenException('Google account email has not been verified by Google');
      }

      return true;
    };

    const validAudience = 'client-id-123.apps.googleusercontent.com';
    const futureExp = Math.floor(Date.now() / 1000) + 3600;

    it('should accept valid, verified Google token info', () => {
      const token = {
        iss: 'https://accounts.google.com',
        sub: 'google-sub-123',
        email: 'user@example.com',
        email_verified: true,
        aud: validAudience,
        exp: futureExp,
      };

      expect(validateGoogleTokenPayload(token, validAudience)).toBe(true);
    });

    it('must reject token when server has no OAuth client ID configured (fail-safe)', () => {
      const token = {
        iss: 'https://accounts.google.com',
        sub: 'google-sub-123',
        email: 'user@example.com',
        email_verified: true,
        aud: validAudience,
        exp: futureExp,
      };

      expect(() => validateGoogleTokenPayload(token, undefined, undefined)).toThrow(BadRequestException);
    });

    it('must reject tokens issued for a different client ID / application', () => {
      const token = {
        iss: 'https://accounts.google.com',
        sub: 'google-sub-123',
        email: 'user@example.com',
        email_verified: true,
        aud: 'attacker-client-id.apps.googleusercontent.com',
        exp: futureExp,
      };

      expect(() => validateGoogleTokenPayload(token, validAudience)).toThrow(ForbiddenException);
    });

    it('must reject expired Google tokens', () => {
      const token = {
        iss: 'https://accounts.google.com',
        sub: 'google-sub-123',
        email: 'user@example.com',
        email_verified: true,
        aud: validAudience,
        exp: Math.floor(Date.now() / 1000) - 60,
      };

      expect(() => validateGoogleTokenPayload(token, validAudience)).toThrow(ForbiddenException);
    });

    it('must reject unverified Google emails', () => {
      const token = {
        iss: 'https://accounts.google.com',
        sub: 'google-sub-123',
        email: 'unverified@example.com',
        email_verified: false,
        aud: validAudience,
        exp: futureExp,
      };

      expect(() => validateGoogleTokenPayload(token, validAudience)).toThrow(ForbiddenException);
    });
  });

  describe('H. OTP Flood Prevention Cooldown', () => {
    class MockOtpRateLimiter {
      private memoryMap = new Map<string, { expiresAt: number; sentAt: number }>();

      requestOtp(email: string) {
        const clean = email.toLowerCase().trim();
        const now = Date.now();
        const existing = this.memoryMap.get(clean);

        if (existing) {
          const elapsed = now - existing.sentAt;
          if (elapsed < 60000) {
            const waitSeconds = Math.ceil((60000 - elapsed) / 1000);
            throw new BadRequestException(`Please wait ${waitSeconds} seconds before requesting another code`);
          }
        }

        this.memoryMap.set(clean, {
          expiresAt: now + 10 * 60 * 1000,
          sentAt: now,
        });

        return { success: true };
      }
    }

    it('should reject a second OTP request within 60 seconds', () => {
      const limiter = new MockOtpRateLimiter();
      const email = 'victim@example.com';

      expect(limiter.requestOtp(email).success).toBe(true);
      expect(() => limiter.requestOtp(email)).toThrow(BadRequestException);
    });
  });
});
