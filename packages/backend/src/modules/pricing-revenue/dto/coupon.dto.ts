import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsArray, IsEnum, Min, IsDateString } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['PERCENTAGE', 'FIXED'])
  discountType: 'PERCENTAGE' | 'FIXED';

  @IsNumber()
  @Min(0)
  discountValue: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  maxDiscountAmount?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  minOrderValue?: number;

  @IsArray()
  @IsOptional()
  applicablePrograms?: string[];

  @IsDateString()
  startDate: string;

  @IsDateString()
  expiryDate: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  totalUsageLimit?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  perUserLimit?: number;

  @IsBoolean()
  @IsOptional()
  firstTimeOnly?: boolean;

  @IsBoolean()
  @IsOptional()
  allowStacking?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateCouponDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['PERCENTAGE', 'FIXED'])
  @IsOptional()
  discountType?: 'PERCENTAGE' | 'FIXED';

  @IsNumber()
  @IsOptional()
  @Min(0)
  discountValue?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  maxDiscountAmount?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  minOrderValue?: number;

  @IsArray()
  @IsOptional()
  applicablePrograms?: string[];

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @IsNumber()
  @IsOptional()
  totalUsageLimit?: number;

  @IsNumber()
  @IsOptional()
  perUserLimit?: number;

  @IsBoolean()
  @IsOptional()
  firstTimeOnly?: boolean;

  @IsBoolean()
  @IsOptional()
  allowStacking?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isPaused?: boolean;
}

export class ValidateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  programKey: string;

  @IsNumber()
  @Min(0)
  orderAmount: number;

  @IsString()
  @IsOptional()
  studentId?: string;
}
