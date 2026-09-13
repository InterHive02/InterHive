import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../modules/users/schemas/user.schema';
import { Encryption } from '../common/utils/encryption';
import { UserRole } from '@interhive/shared';

@Injectable()
export class AdminSeeder {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async seed() {
    this.logger.log('Seeding admin users...');

    const admins = [
      {
        email: 'admin@interhive.in',
        firstName: 'Super',
        lastName: 'Admin',
        role: UserRole.ADMIN,
        isActive: true,
        isVerified: true,
      },
      {
        email: 'hr@interhive.in',
        firstName: 'HR',
        lastName: 'Manager',
        role: UserRole.HR,
        isActive: true,
        isVerified: true,
      },
    ];

    for (const adminData of admins) {
      const existing = await this.userModel.findOne({ email: adminData.email });
      if (!existing) {
        const employeeId = await this.generateEmployeeId();
        const user = new this.userModel({
          ...adminData,
          employeeId,
          password: 'Admin@123456', // Will be hashed by pre-save hook
        });
        await user.save();
        this.logger.log(`Admin created: ${adminData.email}`);
      } else {
        this.logger.log(`Admin already exists: ${adminData.email}`);
      }
    }
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