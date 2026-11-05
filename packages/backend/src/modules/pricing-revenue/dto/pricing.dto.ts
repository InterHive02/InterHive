import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsArray, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProgramPricingDto {
  @IsString()
  @IsNotEmpty()
  programKey: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  originalPrice: number;

  @IsNumber()
  @Min(0)
  promotionalPrice: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  taxPercentage?: number;

  @IsBoolean()
  @IsOptional()
  taxIncluded?: boolean;

  @IsArray()
  @IsOptional()
  features?: string[];

  @IsString()
  @IsOptional()
  eligibilityBatch?: string;

  @IsArray()
  @IsOptional()
  paymentPlans?: any[];
}

export class UpdateProgramPricingDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  originalPrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  promotionalPrice?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  taxPercentage?: number;

  @IsBoolean()
  @IsOptional()
  taxIncluded?: boolean;

  @IsArray()
  @IsOptional()
  features?: string[];

  @IsString()
  @IsOptional()
  eligibilityBatch?: string;

  @IsArray()
  @IsOptional()
  paymentPlans?: any[];

  @IsString()
  @IsOptional()
  changeReason?: string;
}
