import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { RedisService } from '../../common/redis/redis.service';
import { MailService } from '../../common/mail/mail.service';
import { UserRole } from '@interhive/shared';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private redisService: RedisService,
    private mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, employeeId, password, ...rest } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { employeeId }],
    });

    if (existingUser) {
      throw new ConflictException('User already exists with this email or employee ID');
    }

    // Generate employee ID if not provided
    const finalEmployeeId = employeeId || await this.generateEmployeeId();

    // Create new user
    const user = new this.userModel({
      email,
      employeeId: finalEmployeeId,
      password,
      ...rest,
      isActive: true,
    });

    await user.save();

    // Send welcome email
    await this.mailService.sendWelcomeEmail(user.email, user.firstName);

    return {
      success: true,
      message: 'User created successfully',
      data: new UserResponseDto(user),
    };
  }

  async findAll(params: {
    page: number;
    limit: number;
    search?: string;
    role?: string;
    department?: string;
    isActive?: boolean;
  }) {
    const { page, limit, search, role, department, isActive } = params;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (role) query.role = role;
    if (department) query.department = department;
    if (isActive !== undefined) query.isActive = isActive;

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
      data: users.map(user => new UserResponseDto(user)),
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

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('User not found');
    }

    const user = await this.userModel
      .findById(id)
      .populate('department')
      .populate('manager');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      data: new UserResponseDto(user),
    };
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findByEmployeeId(employeeId: string) {
    return this.userModel.findOne({ employeeId });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check for duplicate email/employeeId if being updated
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.userModel.findOne({
        email: updateUserDto.email,
        _id: { $ne: id },
      });
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
    }

    if (updateUserDto.employeeId && updateUserDto.employeeId !== user.employeeId) {
      const existingEmployeeId = await this.userModel.findOne({
        employeeId: updateUserDto.employeeId,
        _id: { $ne: id },
      });
      if (existingEmployeeId) {
        throw new ConflictException('Employee ID already exists');
      }
    }

    // Handle password update
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
      data: new UserResponseDto(updatedUser),
    };
  }

  async delete(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.deleteOne();

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }

  async activate(id: string) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'User activated successfully',
      data: new UserResponseDto(user),
    };
  }

  async deactivate(id: string) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'User deactivated successfully',
      data: new UserResponseDto(user),
    };
  }

  async updateRole(id: string, role: UserRole) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { role },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'Role updated successfully',
      data: new UserResponseDto(user),
    };
  }

  async updateAvatar(userId: string, file: Express.Multer.File) {
    // This would be implemented with Cloudflare R2 or similar storage
    // For now, we'll just store the file path
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { profilePhoto: file.path || file.filename },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'Avatar uploaded successfully',
      data: new UserResponseDto(user),
    };
  }

  async deleteAvatar(userId: string) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { profilePhoto: null },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      success: true,
      message: 'Avatar deleted successfully',
      data: new UserResponseDto(user),
    };
  }

  async findByDepartment(departmentId: string) {
    const users = await this.userModel
      .find({ department: departmentId })
      .populate('department')
      .populate('manager');

    return {
      success: true,
      data: users.map(user => new UserResponseDto(user)),
    };
  }

  async search(query: string) {
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
      data: users.map(user => new UserResponseDto(user)),
    };
  }

  async getStats() {
    const [
      totalUsers,
      activeUsers,
      byRole,
      byDepartment,
      newUsersLast30Days,
    ] = await Promise.all([
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

  private async generateEmployeeId(): Promise<string> {
    const lastUser = await this.userModel
      .findOne()
      .sort({ createdAt: -1 })
      .select('employeeId');
    
    const count = lastUser ? parseInt(lastUser.employeeId.slice(3)) + 1 : 1;
    return `EMP${String(count).padStart(4, '0')}`;
  }
}