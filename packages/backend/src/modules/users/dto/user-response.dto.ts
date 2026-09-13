import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus, Gender, EmploymentType } from '@interhive/shared';

export class UserResponseDto {
  @ApiProperty({
    example: '65a1b2c3d4e5f6g7h8i9j0k1',
    description: 'User ID',
  })
  id: string;

  @ApiProperty({
    example: 'EMP0001',
    description: 'Employee ID',
  })
  employeeId: string;

  @ApiProperty({
    example: 'John',
    description: 'First name',
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name',
  })
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address',
  })
  email: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.INTERN,
    description: 'User role',
  })
  role: UserRole;

  @ApiProperty({
    example: 'Software Engineer',
    description: 'Position',
    required: false,
  })
  position?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    example: '123 Main St, New York, NY 10001',
    description: 'Address',
    required: false,
  })
  address?: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Date of birth',
    required: false,
  })
  dateOfBirth?: Date;

  @ApiProperty({
    enum: Gender,
    example: Gender.MALE,
    description: 'Gender',
    required: false,
  })
  gender?: Gender;

  @ApiProperty({
    enum: EmploymentType,
    example: EmploymentType.FULL_TIME,
    description: 'Employment type',
  })
  employmentType: EmploymentType;

  @ApiProperty({
    example: '65a1b2c3d4e5f6g7h8i9j0k3',
    description: 'Department ID',
    required: false,
  })
  department?: string;

  @ApiProperty({
    example: '65a1b2c3d4e5f6g7h8i9j0k4',
    description: 'Manager ID',
    required: false,
  })
  manager?: string;

  @ApiProperty({
    example: true,
    description: 'Is user active',
  })
  isActive: boolean;

  @ApiProperty({
    example: true,
    description: 'Is user verified',
  })
  isVerified: boolean;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Last login timestamp',
  })
  lastLogin: Date;

  @ApiProperty({
    type: [String],
    example: ['JavaScript', 'React', 'Node.js'],
    description: 'Skills',
  })
  skills: string[];

  @ApiProperty({
    example: 'https://example.com/photo.jpg',
    description: 'Profile photo URL or base64 data URL',
    required: false,
  })
  profilePhoto?: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Created at timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Updated at timestamp',
  })
  updatedAt: Date;

  constructor(user: any) {
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
}