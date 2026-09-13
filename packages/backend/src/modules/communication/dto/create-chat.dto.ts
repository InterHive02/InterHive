import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum, IsBoolean } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ enum: ['direct', 'group', 'team', 'announcement'], default: 'direct' })
  @IsOptional()
  @IsEnum(['direct', 'group', 'team', 'announcement'])
  type?: 'direct' | 'group' | 'team' | 'announcement';

  @ApiProperty({ type: [String] })
  @IsArray()
  participants: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  teamId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isGroupChat?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatar?: string;
}
