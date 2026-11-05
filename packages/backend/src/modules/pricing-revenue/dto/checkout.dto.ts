import { IsString, IsNotEmpty, IsOptional, IsEnum, IsEmail } from 'class-validator';

export class CheckoutPreviewDto {
  @IsString()
  @IsNotEmpty()
  programKey: string;

  @IsEnum(['FULL', 'ANNUAL', 'INSTALLMENT'])
  @IsOptional()
  paymentPlan?: 'FULL' | 'ANNUAL' | 'INSTALLMENT';

  @IsString()
  @IsOptional()
  couponCode?: string;

  @IsString()
  @IsOptional()
  referralCode?: string;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  programKey: string;

  @IsString()
  @IsNotEmpty()
  studentName: string;

  @IsEmail()
  @IsNotEmpty()
  studentEmail: string;

  @IsString()
  @IsOptional()
  studentPhone?: string;

  @IsEnum(['FULL', 'ANNUAL', 'INSTALLMENT'])
  @IsOptional()
  paymentPlan?: 'FULL' | 'ANNUAL' | 'INSTALLMENT';

  @IsString()
  @IsOptional()
  couponCode?: string;

  @IsString()
  @IsOptional()
  referralCode?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
