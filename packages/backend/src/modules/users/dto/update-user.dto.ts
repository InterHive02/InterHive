import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole, Gender, EmploymentType } from '@interhive/shared';

export class UpdateUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  lastName?: string;

  @ApiProperty({
    example: 'EMP0001',
    description: 'Employee ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiProperty({
    example: 'NewSecurePass123!',
    description: 'New password (min 8 characters)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(50, { message: 'Password cannot exceed 50 characters' })
  password?: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.INTERN,
    description: 'User role',
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid role' })
  role?: UserRole;

  @ApiProperty({
    example: 'Senior Software Engineer',
    description: 'Position',
    required: false,
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: '123 Main St, New York, NY 10001',
    description: 'Address',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Date of birth',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @ApiProperty({
    enum: Gender,
    example: Gender.MALE,
    description: 'Gender',
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender, { message: 'Invalid gender' })
  gender?: Gender;

  @ApiProperty({
    enum: EmploymentType,
    example: EmploymentType.FULL_TIME,
    description: 'Employment type',
    required: false,
  })
  @IsOptional()
  @IsEnum(EmploymentType, { message: 'Invalid employment type' })
  employmentType?: EmploymentType;

  @ApiProperty({
    example: '65a1b2c3d4e5f6g7h8i9j0k1',
    description: 'Department ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({
    example: '65a1b2c3d4e5f6g7h8i9j0k2',
    description: 'Manager ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  manager?: string;

  @ApiProperty({
    example: true,
    description: 'Is user active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: true,
    description: 'Is user verified',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({
    type: [String],
    example: ['JavaScript', 'React', 'Node.js'],
    description: 'Skills',
    required: false,
  })
  @IsOptional()
  skills?: string[];
}