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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const user_schema_1 = require("./schemas/user.schema");
const user_response_dto_1 = require("./dto/user-response.dto");
const redis_service_1 = require("../../common/redis/redis.service");
const mail_service_1 = require("../../common/mail/mail.service");
let UsersService = class UsersService {
    constructor(userModel, redisService, mailService) {
        this.userModel = userModel;
        this.redisService = redisService;
        this.mailService = mailService;
    }
    async create(createUserDto) {
        const { email, employeeId, password, ...rest } = createUserDto;
        const existingUser = await this.userModel.findOne({
            $or: [{ email }, { employeeId }],
        });
        if (existingUser) {
            throw new common_1.ConflictException('User already exists with this email or employee ID');
        }
        const finalEmployeeId = employeeId || await this.generateEmployeeId();
        const user = new this.userModel({
            email,
            employeeId: finalEmployeeId,
            password,
            ...rest,
            isActive: true,
        });
        await user.save();
        await this.mailService.sendWelcomeEmail(user.email, user.firstName);
        return {
            success: true,
            message: 'User created successfully',
            data: new user_response_dto_1.UserResponseDto(user),
        };
    }
    async findAll(params) {
        const { page, limit, search, role, department, isActive } = params;
        const skip = (page - 1) * limit;
        const query = {};
        if (role)
            query.role = role;
        if (department)
            query.department = department;
        if (isActive !== undefined)
            query.isActive = isActive;
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { employeeId: { $regex: search, $options: 'i' } },
            ];
        }
        const [users, total] = await Promise.all([
            this.userModel
                .find(query)
                .populate('department')
                .populate('manager')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            this.userModel.countDocuments(query),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            success: true,
            data: users.map(user => new user_response_dto_1.UserResponseDto(user)),
            meta: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    }
    async findById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('User not found');
        }
        const user = await this.userModel
            .findById(id)
            .populate('department')
            .populate('manager');
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            success: true,
            data: new user_response_dto_1.UserResponseDto(user),
        };
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email });
    }
    async findByEmployeeId(employeeId) {
        return this.userModel.findOne({ employeeId });
    }
    async update(id, updateUserDto) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingEmail = await this.userModel.findOne({
                email: updateUserDto.email,
                _id: { $ne: id },
            });
            if (existingEmail) {
                throw new common_1.ConflictException('Email already exists');
            }
        }
        if (updateUserDto.employeeId && updateUserDto.employeeId !== user.employeeId) {
            const existingEmployeeId = await this.userModel.findOne({
                employeeId: updateUserDto.employeeId,
                _id: { $ne: id },
            });
            if (existingEmployeeId) {
                throw new common_1.ConflictException('Employee ID already exists');
            }
        }
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        const updatedUser = await this.userModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .populate('department')
            .populate('manager');
        return {
            success: true,
            message: 'User updated successfully',
            data: new user_response_dto_1.UserResponseDto(updatedUser),
        };
    }
    async delete(id) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await user.deleteOne();
        return {
            success: true,
            message: 'User deleted successfully',
        };
    }
    async activate(id) {
        const user = await this.userModel.findByIdAndUpdate(id, { isActive: true }, { new: true });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            success: true,
            message: 'User activated successfully',
            data: new user_response_dto_1.UserResponseDto(user),
        };
    }
    async deactivate(id) {
        const user = await this.userModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            success: true,
            message: 'User deactivated successfully',
            data: new user_response_dto_1.UserResponseDto(user),
        };
    }
    async updateRole(id, role) {
        const user = await this.userModel.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            success: true,
            message: 'Role updated successfully',
            data: new user_response_dto_1.UserResponseDto(user),
        };
    }
    async updateAvatar(userId, file) {
        const user = await this.userModel.findByIdAndUpdate(userId, { profilePhoto: file.path || file.filename }, { new: true });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            success: true,
            message: 'Avatar uploaded successfully',
            data: new user_response_dto_1.UserResponseDto(user),
        };
    }
    async deleteAvatar(userId) {
        const user = await this.userModel.findByIdAndUpdate(userId, { profilePhoto: null }, { new: true });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            success: true,
            message: 'Avatar deleted successfully',
            data: new user_response_dto_1.UserResponseDto(user),
        };
    }
    async findByDepartment(departmentId) {
        const users = await this.userModel
            .find({ department: departmentId })
            .populate('department')
            .populate('manager');
        return {
            success: true,
            data: users.map(user => new user_response_dto_1.UserResponseDto(user)),
        };
    }
    async search(query) {
        const users = await this.userModel
            .find({
            $or: [
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { employeeId: { $regex: query, $options: 'i' } },
            ],
        })
            .populate('department')
            .populate('manager')
            .limit(20);
        return {
            success: true,
            data: users.map(user => new user_response_dto_1.UserResponseDto(user)),
        };
    }
    async getStats() {
        const [totalUsers, activeUsers, byRole, byDepartment, newUsersLast30Days,] = await Promise.all([
            this.userModel.countDocuments(),
            this.userModel.countDocuments({ isActive: true }),
            this.userModel.aggregate([
                { $group: { _id: '$role', count: { $sum: 1 } } },
            ]),
            this.userModel.aggregate([
                { $group: { _id: '$department', count: { $sum: 1 } } },
            ]),
            this.userModel.countDocuments({
                createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            }),
        ]);
        return {
            success: true,
            data: {
                total: totalUsers,
                active: activeUsers,
                inactive: totalUsers - activeUsers,
                byRole,
                byDepartment,
                newUsersLast30Days,
            },
        };
    }
    async generateEmployeeId() {
        const lastUser = await this.userModel
            .findOne()
            .sort({ createdAt: -1 })
            .select('employeeId');
        const count = lastUser ? parseInt(lastUser.employeeId.slice(3)) + 1 : 1;
        return `EMP${String(count).padStart(4, '0')}`;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        redis_service_1.RedisService,
        mail_service_1.MailService])
], UsersService);
