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
var AdminSeeder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSeeder = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../modules/users/schemas/user.schema");
const shared_1 = require("@interhive/shared");
let AdminSeeder = AdminSeeder_1 = class AdminSeeder {
    constructor(userModel) {
        this.userModel = userModel;
        this.logger = new common_1.Logger(AdminSeeder_1.name);
    }
    async seed() {
        this.logger.log('Seeding admin users...');
        const admins = [
            {
                email: 'admin@interhive.in',
                firstName: 'Super',
                lastName: 'Admin',
                role: shared_1.UserRole.ADMIN,
                isActive: true,
                isVerified: true,
            },
            {
                email: 'hr@interhive.in',
                firstName: 'HR',
                lastName: 'Manager',
                role: shared_1.UserRole.HR,
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
                    password: 'Admin@123456',
                });
                await user.save();
                this.logger.log(`Admin created: ${adminData.email}`);
            }
            else {
                this.logger.log(`Admin already exists: ${adminData.email}`);
            }
        }
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
exports.AdminSeeder = AdminSeeder;
exports.AdminSeeder = AdminSeeder = AdminSeeder_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AdminSeeder);
