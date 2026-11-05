import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsArray, IsEnum, Min, IsDateString } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['EARLY_BIRD', 'LAUNCH', 'COLLEGE_PARTNER', 'GROUP', 'FESTIVAL', 'CUSTOM'])
  campaignType: 'EARLY_BIRD' | 'LAUNCH' | 'COLLEGE_PARTNER' | 'GROUP' | 'FESTIVAL' | 'CUSTOM';

  @IsEnum(['PERCENTAGE', 'FIXED'])
  discountType: 'PERCENTAGE' | 'FIXED';

  @IsNumber()
  @Min(0)
  discountValue: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  maxDiscount?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  minOrderValue?: number;

  @IsArray()
  @IsOptional()
  eligiblePrograms?: string[];

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  budgetCap?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateCampaignDto {
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
  maxDiscount?: number;

  @IsNumber()
  @IsOptional()
  minOrderValue?: number;

  @IsArray()
  @IsOptional()
  eligiblePrograms?: string[];

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @IsOptional()
  budgetCap?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
