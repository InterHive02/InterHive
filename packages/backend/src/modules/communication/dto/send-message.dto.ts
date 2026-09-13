import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

export class SendMessageDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ enum: ['text', 'image', 'file', 'audio', 'video'], default: 'text' })
  @IsOptional()
  @IsEnum(['text', 'image', 'file', 'audio', 'video'])
  type?: 'text' | 'image' | 'file' | 'audio' | 'video';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  replyTo?: string;
}