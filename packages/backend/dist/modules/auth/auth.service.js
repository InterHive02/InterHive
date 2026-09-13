"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const cache_manager_1 = require("@nestjs/cache-manager");
const user_schema_1 = require("../users/schemas/user.schema");
const mail_service_1 = require("../../common/mail/mail.service");
const redis_service_1 = require("../../common/redis/redis.service");
const shared_1 = require("@interhive/shared");
let AuthService = class AuthService {
    constructor(userModel, jwtService, configService, mailService, redisService, cacheManager) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.configService = configService;
        this.mailService = mailService;
        this.redisService = redisService;
        this.cacheManager = cacheManager;
        this.logger = new common_1.Logger('AuthService');
        this.otpMemoryMap = new Map();
    }
    async register(registerDto) {
        throw new common_1.ForbiddenException('Public registration is disabled. InterHive accounts are created exclusively by the HR/Admin team upon candidate selection.');
    }
    async firstLoginPasswordChange(userId, newPassword) {
        if (!newPassword || newPassword.length < 8) {
            throw new common_1.BadRequestException('Password must be at least 8 characters long');
        }
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.password = newPassword;
        user.mustChangePassword = false;
        await user.save();
        return {
            success: true,
            message: 'Password changed successfully. You now have full access to your account.',
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const normalizedEmail = (email || '').toLowerCase().trim();
        this.logger.log(`🔑 Login attempt received for: "${normalizedEmail}"`);
        const user = await this.userModel.findOne({ email: normalizedEmail }).select('+password');
        if (!user) {
            this.logger.warn(`❌ Login rejected: User "${normalizedEmail}" not found in database`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            this.logger.warn(`❌ Login rejected: Account "${normalizedEmail}" is deactivated`);
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            this.logger.warn(`❌ Login rejected: Incorrect password provided for "${normalizedEmail}"`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        this.logger.log(`✅ Login successful for: "${normalizedEmail}" (Role: ${user.role})`);
        user.lastLogin = new Date();
        await user.save();
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
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('jwt.refreshSecret'),
            });
            const storedToken = await this.redisService.get(`refresh:${payload.id}`);
            if (!storedToken || storedToken !== refreshToken) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const user = await this.userModel.findById(payload.id);
            if (!user || !user.isActive) {
                throw new common_1.UnauthorizedException('User not found or inactive');
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
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async logout(userId) {
        await this.redisService.del(`refresh:${userId}`);
        return { success: true, message: 'Logged out successfully' };
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const resetToken = this.jwtService.sign({ id: user.id, email: user.email }, { expiresIn: '1h' });
        await this.redisService.set(`reset:${user.id}`, resetToken, 3600);
        await this.mailService.sendPasswordResetEmail(user.email, user.firstName, resetToken);
        return {
            success: true,
            message: 'Password reset email sent successfully',
        };
    }
    async resetPassword(resetPasswordDto) {
        const { token, newPassword } = resetPasswordDto;
        try {
            const payload = this.jwtService.verify(token);
            const storedToken = await this.redisService.get(`reset:${payload.id}`);
            if (!storedToken || storedToken !== token) {
                throw new common_1.BadRequestException('Invalid or expired reset token');
            }
            const user = await this.userModel.findById(payload.id);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            user.password = newPassword;
            await user.save();
            await this.redisService.del(`reset:${payload.id}`);
            return {
                success: true,
                message: 'Password reset successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
    }
    async verifyEmail(token) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userModel.findById(payload.id);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            if (user.isVerified) {
                throw new common_1.BadRequestException('Email already verified');
            }
            user.isVerified = true;
            await user.save();
            await this.redisService.del(`verify:${user.id}`);
            return {
                success: true,
                message: 'Email verified successfully',
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid or expired verification token');
        }
    }
    async resendVerificationEmail(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.isVerified) {
            throw new common_1.BadRequestException('Email already verified');
        }
        const verificationToken = this.jwtService.sign({ id: user.id, email: user.email }, { expiresIn: '24h' });
        await this.redisService.set(`verify:${user.id}`, verificationToken, 86400);
        await this.mailService.sendVerificationEmail(user.email, user.firstName, verificationToken);
        return {
            success: true,
            message: 'Verification email sent successfully',
        };
    }
    async getProfile(userId) {
        let user;
        try {
            user = await this.userModel
                .findById(userId)
                .populate('department')
                .populate('manager');
        }
        catch {
            user = await this.userModel.findById(userId);
        }
        if (!user) {
            throw new common_1.NotFoundException('User not found');
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
    async validateUser(email, password) {
        const user = await this.userModel.findOne({ email }).select('+password');
        if (user && (await user.comparePassword(password))) {
            const { password, ...result } = user.toObject();
            return result;
        }
        return null;
    }
    generateRefreshToken(userId) {
        return this.jwtService.sign({ id: userId }, {
            secret: this.configService.get('jwt.refreshSecret'),
            expiresIn: this.configService.get('jwt.refreshExpiresIn', '30d'),
        });
    }
    async generateEmployeeId() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `EMP${timestamp}${random}`;
    }
    async sendLoginOtp(email) {
        if (!email || !email.includes('@')) {
            throw new common_1.BadRequestException('Valid email address is required');
        }
        const cleanEmail = email.toLowerCase().trim();
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        this.otpMemoryMap.set(cleanEmail, {
            code: otpCode,
            expiresAt: Date.now() + 10 * 60 * 1000,
        });
        try {
            await this.redisService.set(`otp:${cleanEmail}`, otpCode, 600);
        }
        catch (e) {
            console.warn('Redis unavailable, using in-memory OTP store.');
        }
        console.log(`\n=================================================`);
        console.log(`🔑 INTERHIVE GMAIL OTP FOR [${email}]: ${otpCode}`);
        console.log(`=================================================\n`);
        try {
            await this.mailService.sendOtpEmail(email, otpCode);
        }
        catch (err) {
            console.error(`Mail dispatch exception for ${email}:`, err);
        }
        return {
            success: true,
            message: `A 6-digit OTP has been sent to ${email}`,
        };
    }
    async verifyLoginOtp(email, code) {
        const cleanEmail = email.toLowerCase().trim();
        let storedOtp = await this.redisService.get(`otp:${cleanEmail}`);
        if (!storedOtp) {
            const memoryData = this.otpMemoryMap.get(cleanEmail);
            if (memoryData && memoryData.expiresAt > Date.now()) {
                storedOtp = memoryData.code;
            }
        }
        if (!storedOtp || storedOtp !== code.trim()) {
            throw new common_1.BadRequestException('Invalid or expired verification code');
        }
        this.otpMemoryMap.delete(cleanEmail);
        try {
            await this.redisService.del(`otp:${cleanEmail}`);
        }
        catch (e) { }
        let user = await this.userModel.findOne({ email: cleanEmail });
        if (!user) {
            const nameParts = cleanEmail.split('@')[0].split('.');
            const firstName = nameParts[0] || 'User';
            const lastName = nameParts[1] || 'Intern';
            user = new this.userModel({
                email: cleanEmail,
                employeeId: await this.generateEmployeeId(),
                password: Math.random().toString(36) + Date.now().toString(),
                firstName,
                lastName,
                role: shared_1.UserRole.INTERN,
                isActive: true,
                isVerified: true,
            });
            await user.save();
        }
        else {
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
    async googleAuth(googleData) {
        if (!googleData?.email) {
            throw new common_1.BadRequestException('Email is required for Google login');
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
                        role: shared_1.UserRole.INTERN,
                        isActive: true,
                        isVerified: true,
                    });
                    await user.save();
                }
                catch (saveError) {
                    if (saveError?.code === 11000) {
                        user = await this.userModel.findOne({ email: cleanEmail });
                        if (!user)
                            throw saveError;
                    }
                    else {
                        console.error('Error saving new Google user:', saveError);
                        throw saveError;
                    }
                }
            }
            else {
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
            }
            catch (rErr) {
            }
            const userData = user.toObject();
            delete userData.password;
            return {
                user: userData,
                accessToken,
                refreshToken,
                expiresIn: '7d',
            };
        }
        catch (error) {
            console.error('Google Auth exception:', error);
            throw new common_1.BadRequestException(error?.message || 'Google authentication failed');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __param(5, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        jwt_1.JwtService,
        config_1.ConfigService,
        mail_service_1.MailService,
        redis_service_1.RedisService, Object])
], AuthService);
