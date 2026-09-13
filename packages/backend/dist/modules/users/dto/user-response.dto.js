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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const shared_1 = require("@interhive/shared");
class UserResponseDto {
    constructor(user) {
        this.id = user._id || user.id;
        this.employeeId = user.employeeId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.role = user.role;
        this.position = user.position;
        this.phone = user.phone;
        this.address = user.address;
        this.profilePhoto = user.profilePhoto;
        this.dateOfBirth = user.dateOfBirth;
        this.gender = user.gender;
        this.employmentType = user.employmentType;
        this.department = user.department?._id || user.department;
        this.manager = user.manager?._id || user.manager;
        this.isActive = user.isActive;
        this.isVerified = user.isVerified;
        this.lastLogin = user.lastLogin;
        this.skills = user.skills || [];
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, employeeId: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, email: { required: true, type: () => String }, role: { required: true, enum: require("../../../../../shared/dist/types/index").UserRole }, position: { required: false, type: () => String }, phone: { required: false, type: () => String }, address: { required: false, type: () => String }, dateOfBirth: { required: false, type: () => Date }, gender: { required: false, enum: require("../../../../../shared/dist/types/index").Gender }, employmentType: { required: true, enum: require("../../../../../shared/dist/types/index").EmploymentType }, department: { required: false, type: () => String }, manager: { required: false, type: () => String }, isActive: { required: true, type: () => Boolean }, isVerified: { required: true, type: () => Boolean }, lastLogin: { required: true, type: () => Date }, skills: { required: true, type: () => [String] }, profilePhoto: { required: false, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.UserResponseDto = UserResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '65a1b2c3d4e5f6g7h8i9j0k1',
        description: 'User ID',
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'EMP0001',
        description: 'Employee ID',
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'John',
        description: 'First name',
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Doe',
        description: 'Last name',
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'john.doe@example.com',
        description: 'Email address',
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: shared_1.UserRole,
        example: shared_1.UserRole.INTERN,
        description: 'User role',
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Software Engineer',
        description: 'Position',
        required: false,
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+1234567890',
        description: 'Phone number',
        required: false,
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '123 Main St, New York, NY 10001',
        description: 'Address',
        required: false,
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1990-01-01',
        description: 'Date of birth',
        required: false,
    }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: shared_1.Gender,
        example: shared_1.Gender.MALE,
        description: 'Gender',
        required: false,
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: shared_1.EmploymentType,
        example: shared_1.EmploymentType.FULL_TIME,
        description: 'Employment type',
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "employmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '65a1b2c3d4e5f6g7h8i9j0k3',
        description: 'Department ID',
        required: false,
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '65a1b2c3d4e5f6g7h8i9j0k4',
        description: 'Manager ID',
        required: false,
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "manager", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Is user active',
    }),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Is user verified',
    }),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "isVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Last login timestamp',
    }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "lastLogin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: ['JavaScript', 'React', 'Node.js'],
        description: 'Skills',
    }),
    __metadata("design:type", Array)
], UserResponseDto.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/photo.jpg',
        description: 'Profile photo URL or base64 data URL',
        required: false,
    }),
    __metadata("design:type", String)
], UserResponseDto.prototype, "profilePhoto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Created at timestamp',
    }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Updated at timestamp',
    }),
    __metadata("design:type", Date)
], UserResponseDto.prototype, "updatedAt", void 0);
