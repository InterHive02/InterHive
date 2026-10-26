import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  Inject,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import * as crypto from 'crypto';
import axios from 'axios';

import { User, UserDocument } from '../users/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { MailService } from '../../common/mail/mail.service';
import { RedisService } from '../../common/redis/redis.service';
import { UserRole } from '@interhive/shared';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  private otpMemoryMap = new Map<string, { code: string; expiresAt: number; attempts: number }>();

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private redisService: RedisService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async register(registerDto: RegisterDto) {
    throw new ForbiddenException(
      'Public registration is disabled. InterHive accounts are created exclusively by the HR/Admin team upon candidate selection.',
    );
  }

  async firstLoginPasswordChange(userId: string, newPassword: string) {
    if (!newPassword || newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = newPassword; // Will be hashed by UserSchema.pre('save')
    user.mustChangePassword = false;
    await user.save();

    return {
      success: true,
      message: 'Password changed successfully. You now have full access to your account.',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const normalizedEmail = (email || '').toLowerCase().trim();

    this.logger.log(`🔑 Login attempt received for: "${normalizedEmail}"`);

    // Find user by email
    const user = await this.userModel.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      this.logger.warn(`❌ Login rejected: User "${normalizedEmail}" not found in database`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      this.logger.warn(`❌ Login rejected: Account "${normalizedEmail}" is deactivated`);
      throw new UnauthorizedException('Account is deactivated');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      this.logger.warn(`❌ Login rejected: Incorrect password provided for "${normalizedEmail}"`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`✅ Login successful for: "${normalizedEmail}" (Role: ${user.role})`);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const userIdStr = user._id ? user._id.toString() : user.id;
    const payload = { id: userIdStr, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.generateRefreshToken(userIdStr);

    // Store refresh token
    await this.redisService.set(
      `refresh:${userIdStr}`,
      refreshToken,
      30 * 24 * 60 * 60, // 30 days
    );

    // Remove sensitive data
    const userData = user.toObject();
    delete userData.password;

    return {
      user: userData,
      accessToken,
      refreshToken,
      expiresIn: this.configService.get('jwt.expiresIn', '7d'),
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });

      // Check if token exists in Redis
      const storedToken = await this.redisService.get(`refresh:${payload.id}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new access token
      const user = await this.userModel.findById(payload.id);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      const newPayload = { id: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(newPayload);

      return {
        success: true,
        data: {
          accessToken,
          expiresIn: this.configService.get('jwt.expiresIn', '1h'),
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string, token?: string | null) {
    // Remove refresh token
    try {
      await this.redisService.del(`refresh:${userId}`);
    } catch {}

    // Blacklist access token for the remainder of its lifespan
    if (token) {
      try {
        await this.redisService.set(`blacklist:${token}`, 'true', 3600);
      } catch {}
    }

    return { success: true, message: 'Logged out successfully' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate reset token
    const resetToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      { expiresIn: '1h' },
    );

    // Store reset token
    await this.redisService.set(
      `reset:${user.id}`,
      resetToken,
      3600, // 1 hour
    );

    // Send reset email
    await this.mailService.sendPasswordResetEmail(user.email, user.firstName, resetToken);

    return {
      success: true,
      message: 'Password reset email sent successfully',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    try {
      // Verify token
      const payload = this.jwtService.verify(token);

      // Check if token exists in Redis
      const storedToken = await this.redisService.get(`reset:${payload.id}`);
      if (!storedToken || storedToken !== token) {
        throw new BadRequestException('Invalid or expired reset token');
      }

      // Find user
      const user = await this.userModel.findById(payload.id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      // Delete reset token
      await this.redisService.del(`reset:${payload.id}`);

      return {
        success: true,
        message: 'Password reset successfully',
      };
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      const user = await this.userModel.findById(payload.id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.isVerified) {
        throw new BadRequestException('Email already verified');
      }

      user.isVerified = true;
      await user.save();

      // Delete verification token
      await this.redisService.del(`verify:${user.id}`);

      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      throw new BadRequestException('Invalid or expired verification token');
    }
  }

  async resendVerificationEmail(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Generate new verification token
    const verificationToken = this.jwtService.sign(
      { id: user.id, email: user.email },
      { expiresIn: '24h' },
    );

    // Store verification token
    await this.redisService.set(
      `verify:${user.id}`,
      verificationToken,
      86400, // 24 hours
    );

    // Send verification email
    await this.mailService.sendVerificationEmail(user.email, user.firstName, verificationToken);

    return {
      success: true,
      message: 'Verification email sent successfully',
    };
  }

  async getProfile(userId: string) {
    let user: any;
    try {
      user = await this.userModel
        .findById(userId)
        .populate('department')
        .populate('manager', 'firstName lastName email profilePhoto position employeeId')
        .populate('assignedManager', 'firstName lastName email profilePhoto position employeeId')
        .populate('assignedHr', 'firstName lastName email profilePhoto position employeeId');
    } catch {
      user = await this.userModel.findById(userId);
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userData = user.toObject ? user.toObject() : user;
    if (userData) {
      if (!userData.assignedManager && userData.manager) {
        userData.assignedManager = userData.manager;
      }
    }
    if (userData.password) {
      delete userData.password;
    }

    return {
      success: true,
      data: userData,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).select('+password');
    if (user && (await user.comparePassword(password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  private generateRefreshToken(userId: string): string {
    return this.jwtService.sign(
      { id: userId },
      {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn', '30d'),
      },
    );
  }

  private async generateEmployeeId(): Promise<string> {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `EMP${timestamp}${random}`;
  }

  async sendLoginOtp(email: string) {
    if (!email || !email.includes('@')) {
      throw new BadRequestException('Valid email address is required');
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check email-level cooldown to prevent spam / flooding
    const existingMemory = this.otpMemoryMap.get(cleanEmail);
    if (existingMemory && existingMemory.expiresAt > Date.now()) {
      const timeSinceSent = 10 * 60 * 1000 - (existingMemory.expiresAt - Date.now());
      if (timeSinceSent < 60000) {
        const remainingWait = Math.ceil((60000 - timeSinceSent) / 1000);
        throw new BadRequestException(`Please wait ${remainingWait} seconds before requesting another code`);
      }
    }

    // Cryptographically secure 6-digit OTP
    const otpCode = crypto.randomInt(100000, 1000000).toString();

    // Store in memory map as fallback with attempt tracking
    this.otpMemoryMap.set(cleanEmail, {
      code: otpCode,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
    });

    // Store in Redis if available
    try {
      await this.redisService.set(`otp:${cleanEmail}`, otpCode, 600); // 10 minutes
      await this.redisService.set(`otp_attempts:${cleanEmail}`, '0', 600);
    } catch (e) {
      this.logger.warn('Redis unavailable, using in-memory OTP store.');
    }

    // Do NOT log plaintext OTP in application logs
    const maskedEmail = cleanEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3');
    this.logger.log(`OTP generated and sent to ${maskedEmail}`);

    try {
      await this.mailService.sendOtpEmail(email, otpCode);
    } catch (err) {
      this.logger.error(`Mail dispatch exception for ${maskedEmail}:`, err);
    }

    return {
      success: true,
      message: `A 6-digit OTP has been sent to ${email}`,
    };
  }

  async verifyLoginOtp(email: string, code: string) {
    if (!email || !code) {
      throw new BadRequestException('Email and verification code are required');
    }

    const cleanEmail = email.toLowerCase().trim();
    const inputCode = code.trim();

    let storedOtp = await this.redisService.get(`otp:${cleanEmail}`);
    let memoryData = this.otpMemoryMap.get(cleanEmail);

    if (!storedOtp && memoryData && memoryData.expiresAt > Date.now()) {
      storedOtp = memoryData.code;
    }

    if (!storedOtp) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    // Check brute force attempts
    let attempts = 0;
    try {
      const redisAttempts = await this.redisService.get(`otp_attempts:${cleanEmail}`);
      attempts = redisAttempts ? parseInt(redisAttempts, 10) : (memoryData?.attempts || 0);
    } catch {
      attempts = memoryData?.attempts || 0;
    }

    if (attempts >= 5) {
      this.otpMemoryMap.delete(cleanEmail);
      try {
        await this.redisService.del(`otp:${cleanEmail}`);
        await this.redisService.del(`otp_attempts:${cleanEmail}`);
      } catch {}
      throw new BadRequestException('Too many failed verification attempts. Please request a new OTP.');
    }

    // Constant-time comparison to prevent timing attacks
    const isValid =
      inputCode.length === storedOtp.length &&
      crypto.timingSafeEqual(Buffer.from(inputCode), Buffer.from(storedOtp));

    if (!isValid) {
      const newAttempts = attempts + 1;
      if (memoryData) memoryData.attempts = newAttempts;
      try {
        await this.redisService.set(`otp_attempts:${cleanEmail}`, newAttempts.toString(), 600);
      } catch {}

      if (newAttempts >= 5) {
        this.otpMemoryMap.delete(cleanEmail);
        try {
          await this.redisService.del(`otp:${cleanEmail}`);
          await this.redisService.del(`otp_attempts:${cleanEmail}`);
        } catch {}
        throw new BadRequestException('Too many failed verification attempts. Please request a new OTP.');
      }
      throw new BadRequestException('Invalid or expired verification code');
    }

    // Clean up used OTP
    this.otpMemoryMap.delete(cleanEmail);
    try {
      await this.redisService.del(`otp:${cleanEmail}`);
      await this.redisService.del(`otp_attempts:${cleanEmail}`);
    } catch (e) { /* ignore */ }

    let user = await this.userModel.findOne({ email: cleanEmail });
    if (!user) {
      // Auto-register user with cryptographically secure random password
      const nameParts = cleanEmail.split('@')[0].split('.');
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts[1] || 'Intern';
      user = new this.userModel({
        email: cleanEmail,
        employeeId: await this.generateEmployeeId(),
        password: crypto.randomBytes(32).toString('hex'),
        firstName,
        lastName,
        role: UserRole.STUDENT,
        accessLevel: 'BASIC',
        internStatus: 'FREE',
        isActive: true,
        isVerified: true,
      });
      await user.save();
    } else {
      user.isVerified = true;
      user.lastLogin = new Date();
      await user.save();
    }

    const userIdStr = user._id ? user._id.toString() : user.id;
    const payload = { id: userIdStr, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.generateRefreshToken(userIdStr);

    try {
      await this.redisService.set(`refresh:${userIdStr}`, refreshToken, 30 * 24 * 60 * 60);
    } catch {}

    const userData = user.toObject();
    delete userData.password;

    return {
      user: userData,
      accessToken,
      refreshToken,
      expiresIn: this.configService.get('jwt.expiresIn', '1h'),
    };
  }

  async googleAuth(dto: GoogleAuthDto) {
    if (!dto?.idToken || typeof dto.idToken !== 'string') {
      throw new BadRequestException('A valid Google ID token is required');
    }

    const configuredClientId = this.configService.get<string>('GOOGLE_CLIENT_ID') || process.env.GOOGLE_CLIENT_ID;
    const configuredFirebaseId = this.configService.get<string>('FIREBASE_PROJECT_ID') || process.env.FIREBASE_PROJECT_ID;

    // Fail safe: If neither client ID nor Firebase project ID is configured, reject
    if (!configuredClientId && !configuredFirebaseId) {
      this.logger.error('Google Sign-In rejected: No OAuth client ID or Firebase project ID configured.');
      throw new BadRequestException('Google authentication is not configured on this server');
    }

    // Cryptographic verification via Google's tokeninfo service
    let tokenInfo: any;
    try {
      const resp = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(dto.idToken.trim())}`,
        { timeout: 8000 },
      );
      tokenInfo = resp.data;
    } catch (err: any) {
      this.logger.warn(`Google token verification failed: ${err.response?.data?.error_description || err.message}`);
      throw new UnauthorizedException('Invalid, expired, or untrusted Google ID token');
    }

    if (!tokenInfo || !tokenInfo.email || !tokenInfo.sub) {
      throw new UnauthorizedException('Incomplete Google identity token payload');
    }

    // Verify token issuer
    const validIssuers = ['https://accounts.google.com', 'accounts.google.com'];
    if (!validIssuers.includes(tokenInfo.iss)) {
      throw new UnauthorizedException('Untrusted token issuer');
    }

    // Verify token expiration
    const exp = Number(tokenInfo.exp);
    if (!exp || exp <= Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Google ID token has expired');
    }

    // Strictly verify audience matches configured Google OAuth Client ID or Firebase Project ID
    const validAudiences = [configuredClientId, configuredFirebaseId].filter(Boolean);
    if (!validAudiences.includes(tokenInfo.aud)) {
      throw new UnauthorizedException('Google token audience does not match configured application');
    }

    // Strictly enforce verified email from Google
    const isEmailVerified = tokenInfo.email_verified === true || tokenInfo.email_verified === 'true';
    if (!isEmailVerified) {
      throw new UnauthorizedException('Google account email has not been verified by Google');
    }

    const cleanEmail = tokenInfo.email.toLowerCase().trim();
    const googleSubjectId = tokenInfo.sub;

    try {
      let user = await this.userModel.findOne({ email: cleanEmail });

      if (!user) {
        // Safe user creation with verified Google identity
        const nameParts = (tokenInfo.name || cleanEmail.split('@')[0]).split(' ');
        const firstName = nameParts[0] || 'Google';
        const lastName = nameParts.slice(1).join(' ') || 'User';
        const empId = await this.generateEmployeeId();

        user = new this.userModel({
          email: cleanEmail,
          googleId: googleSubjectId,
          employeeId: empId,
          password: crypto.randomBytes(32).toString('hex'),
          firstName,
          lastName,
          profilePhoto: tokenInfo.picture,
          role: UserRole.STUDENT,
          accessLevel: 'BASIC',
          internStatus: 'FREE',
          isActive: true,
          isVerified: true,
        });
        await user.save();
      } else {
        // Prevent account takeover: verify existing account's linked Google identity
        if (user.googleId && user.googleId !== googleSubjectId) {
          throw new UnauthorizedException('This email is already associated with a different Google account');
        }

        if (!user.googleId) {
          user.googleId = googleSubjectId;
        }

        if (tokenInfo.picture && !user.profilePhoto) {
          user.profilePhoto = tokenInfo.picture;
        }
        user.isVerified = true;
        user.lastLogin = new Date();
        await user.save();
      }

      const userIdStr = user._id ? user._id.toString() : user.id;
      const payload = { id: userIdStr, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.generateRefreshToken(userIdStr);

      try {
        await this.redisService.set(`refresh:${userIdStr}`, refreshToken, 30 * 24 * 60 * 60);
      } catch (rErr) {
        // ignore redis fallback
      }

      const userData = user.toObject();
      delete userData.password;

      return {
        user: userData,
        accessToken,
        refreshToken,
        expiresIn: this.configService.get('jwt.expiresIn', '1h'),
      };
    } catch (error: any) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Google Auth exception:', error);
      throw new BadRequestException('Google authentication processing failed');
    }
  }
}