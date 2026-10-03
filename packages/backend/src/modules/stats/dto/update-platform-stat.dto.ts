import { IsNumber, IsString, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePlatformStatDto {
  @ApiPropertyOptional({ description: 'Manual numeric value to display', example: 5000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  manualValue?: number;

  @ApiPropertyOptional({ description: 'Whether to use the manual value instead of live DB count', example: true })
  @IsOptional()
  @IsBoolean()
  useManualValue?: boolean;

  @ApiPropertyOptional({ description: 'Display label override', example: 'Students Trained' })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional({ description: 'Suffix displayed after the number', example: '+' })
  @IsOptional()
  @IsString()
  suffix?: string;
}
