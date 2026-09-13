import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean, IsObject, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationCategory, NotificationPriority } from '@interhive/shared';

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty({
    enum: [
      'system',
      'assessment',
      'training',
      'project',
      'matching',
      'interview',
      'hiring',
      'message',
      'reminder',
    ],
  })
  @IsEnum([
    'system',
    'assessment',
    'training',
    'project',
    'matching',
    'interview',
    'hiring',
    'message',
    'reminder',
  ])
  type: NotificationCategory;

  @ApiProperty({ enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'urgent'])
  priority?: NotificationPriority;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  data?: {
    icon?: string;
    action?: string;
    metadata?: any;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recipients?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  delivery?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiresAt?: Date;
}