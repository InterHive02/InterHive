import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../src/modules/auth/auth.service';
import { User } from '../../src/modules/users/schemas/user.schema';
import { MailService } from '../../src/common/services/mail.service';
import { RedisService } from '../../src/common/redis/redis.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserModel: any;
  let mockJwtService: any;
  let mockConfigService: any;
  let mockMailService: any;
  let mockRedisService: any;
  let mockCacheManager: any;

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      updateOne: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-token'),
      verify: jest.fn().mockReturnValue({ id: 'user-id' }),
    };

    mockConfigService = {
      get: jest.fn().mockReturnValue('test-secret'),
    };

    mockMailService = {
      sendVerificationEmail: jest.fn().mockResolvedValue(true),
      sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
    };

    mockRedisService = {
      set: jest.fn().mockResolvedValue(true),
      get: jest.fn().mockResolvedValue('mock-token'),
      del: jest.fn().mockResolvedValue(true),
    };

    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'Test@123456',
        employeeId: 'EMP0001',
      };

      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.prototype.save = jest.fn().mockResolvedValue({
        _id: 'user-id',
        ...registerDto,
        toObject: () => ({ ...registerDto }),
      });

      const result = await service.register(registerDto);

      expect(result.success).toBe(true);
      expect(result.data.email).toBe('test@example.com');
      expect(mockMailService.sendVerificationEmail).toHaveBeenCalled();
    });

    it('should throw conflict exception if user exists', async () => {
      const registerDto = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'Test@123456',
      };

      mockUserModel.findOne.mockResolvedValue({ email: 'test@example.com' });

      await expect(service.register(registerDto)).rejects.toThrow('User already exists');
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Test@123456',
      };

      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
        role: 'intern',
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(true),
        toObject: () => ({ email: 'test@example.com', role: 'intern' }),
        save: jest.fn().mockResolvedValue(true),
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.login(loginDto);

      expect(result.accessToken).toBe('mock-token');
      expect(result.refreshToken).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw unauthorized for invalid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      const mockUser = {
        email: 'test@example.com',
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('forgotPassword', () => {
    it('should send reset email for existing user', async () => {
      const forgotPasswordDto = {
        email: 'test@example.com',
      };

      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
        save: jest.fn().mockResolvedValue(true),
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.forgotPassword(forgotPasswordDto);

      expect(result.success).toBe(true);
      expect(mockMailService.sendPasswordResetEmail).toHaveBeenCalled();
    });

    it('should throw not found for non-existent user', async () => {
      const forgotPasswordDto = {
        email: 'nonexistent@example.com',
      };

      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.forgotPassword(forgotPasswordDto)).rejects.toThrow('User not found');
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const resetPasswordDto = {
        token: 'valid-token',
        newPassword: 'NewPassword@123',
      };

      mockJwtService.verify.mockReturnValue({ id: 'user-id' });
      mockRedisService.get.mockResolvedValue('valid-token');

      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
        password: 'OldPassword@123',
        save: jest.fn().mockResolvedValue(true),
      };

      mockUserModel.findById.mockResolvedValue(mockUser);

      const result = await service.resetPassword(resetPasswordDto);

      expect(result.success).toBe(true);
      expect(mockRedisService.del).toHaveBeenCalled();
    });

    it('should throw bad request for invalid token', async () => {
      const resetPasswordDto = {
        token: 'invalid-token',
        newPassword: 'NewPassword@123',
      };

      mockJwtService.verify.mockReturnValue({ id: 'user-id' });
      mockRedisService.get.mockResolvedValue(null);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow('Invalid or expired reset token');
    });
  });
});