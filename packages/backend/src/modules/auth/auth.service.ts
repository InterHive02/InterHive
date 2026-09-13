import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { User, UserDocument } from '../users/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from '../../common/mail/mail.service';
import { RedisService } from '../../common/redis/redis.service';
import { UserRole } from '@interhive/shared';

@Injectable()
export class AuthService {
  private otpMemoryMap = new Map<string, { code: string; expiresAt: number }>();

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private redisService: RedisService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, employeeId, password, firstName, lastName, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { employeeId }],
    });

    if (existingUser) {
      throw new ConflictException('User already exists with this email or employee ID');
    }

    // Create new user
    const user = new this.userModel({
      email,
      employeeId: employeeId || await this.generateEmployeeId(),
      password,
      firstName,
      lastName,
      role: role || UserRole.INTERN,
      isActive: true,
      isVerified: false,
    });

    await user.save();

    // Generate verification token
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

    // Remove sensitive data
    const userData = user.toObject();
    delete userData.password;

    return {
      success: true,
      message: 'User registered successfully. Please verify your email.',
      data: userData,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

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
          expiresIn: this.configService.get('jwt.expiresIn', '7d'),
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    // Remove refresh token
    await this.redisService.del(`refresh:${userId}`);
    
    // Blacklist access token (optional)
    // await this.redisService.set(`blacklist:${token}`, 'true', 7 * 24 * 60 * 60);

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
        .populate('manager');
    } catch {
      user = await this.userModel.findById(userId);
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userData = user.toObject ? user.toObject() : user;
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
    // Use timestamp + random to avoid race conditions
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `EMP${timestamp}${random}`;
  }

  async sendLoginOtp(email: string) {
    if (!email || !email.includes('@')) {
      throw new BadRequestException('Valid email address is required');
    }

    const cleanEmail = email.toLowerCase().trim();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in memory map as fallback
    this.otpMemoryMap.set(cleanEmail, {
      code: otpCode,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Store in Redis if available
    try {
      await this.redisService.set(`otp:${cleanEmail}`, otpCode, 600); // 10 minutes
    } catch (e) {
      console.warn('Redis unavailable, using in-memory OTP store.');
    }

    console.log(`\n=================================================`);
    console.log(`🔑 INTERHIVE GMAIL OTP FOR [${email}]: ${otpCode}`);
    console.log(`=================================================\n`);

    try {
      await this.mailService.sendOtpEmail(email, otpCode);
    } catch (err) {
      console.error(`Mail dispatch exception for ${email}:`, err);
    }

    return {
      success: true,
      message: `A 6-digit OTP has been sent to ${email}`,
    };
  }

  async verifyLoginOtp(email: string, code: string) {
    const cleanEmail = email.toLowerCase().trim();
    let storedOtp = await this.redisService.get(`otp:${cleanEmail}`);

    // Fallback to memory map if Redis didn't return a code
    if (!storedOtp) {
      const memoryData = this.otpMemoryMap.get(cleanEmail);
      if (memoryData && memoryData.expiresAt > Date.now()) {
        storedOtp = memoryData.code;
      }
    }

    if (!storedOtp || storedOtp !== code.trim()) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    // Clean up
    this.otpMemoryMap.delete(cleanEmail);
    try {
      await this.redisService.del(`otp:${cleanEmail}`);
    } catch (e) { /* ignore */ }

    let user = await this.userModel.findOne({ email: cleanEmail });
    if (!user) {
      // Auto-register user with OTP
      const nameParts = cleanEmail.split('@')[0].split('.');
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts[1] || 'Intern';
      user = new this.userModel({
        email: cleanEmail,
        employeeId: await this.generateEmployeeId(),
        password: Math.random().toString(36) + Date.now().toString(),
        firstName,
        lastName,
        role: UserRole.INTERN,
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

    await this.redisService.set(`refresh:${userIdStr}`, refreshToken, 30 * 24 * 60 * 60);

    const userData = user.toObject();
    delete userData.password;

    return {
      user: userData,
      accessToken,
      refreshToken,
      expiresIn: this.configService.get('jwt.expiresIn', '7d'),
    };
  }

  async googleAuth(googleData: { email: string; name?: string; googleId?: string; picture?: string }) {
    if (!googleData?.email) {
      throw new BadRequestException('Email is required for Google login');
    }
    const cleanEmail = googleData.email.toLowerCase().trim();

    try {
      let user = await this.userModel.findOne({ email: cleanEmail });

      if (!user) {
        const nameParts = (googleData.name || cleanEmail.split('@')[0]).split(' ');
        const firstName = nameParts[0] || 'Google';
        const lastName = nameParts.slice(1).join(' ') || 'User';

        try {
          const empId = await this.generateEmployeeId();
          user = new this.userModel({
            email: cleanEmail,
            employeeId: empId,
            password: Math.random().toString(36) + Date.now().toString(),
            firstName,
            lastName,
            profilePhoto: googleData.picture,
            role: UserRole.INTERN,
            isActive: true,
            isVerified: true,
          });
          await user.save();
        } catch (saveError: any) {
          if (saveError?.code === 11000) {
            user = await this.userModel.findOne({ email: cleanEmail });
            if (!user) throw saveError;
          } else {
            console.error('Error saving new Google user:', saveError);
            throw saveError;
          }
        }
      } else {
        if (googleData.picture && !user.profilePhoto) {
          user.profilePhoto = googleData.picture;
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
        expiresIn: '7d',
      };
    } catch (error: any) {
      console.error('Google Auth exception:', error);
      throw new BadRequestException(error?.message || 'Google authentication failed');
    }
  }
}