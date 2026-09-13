import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsObject, IsNumber, IsLatitude, IsLongitude } from 'class-validator';

class LocationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;
}

export class CheckOutDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  location?: LocationDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ip?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  deviceInfo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  screenshot?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}