import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthDto {
  @ApiProperty({
    description: 'Cryptographically signed Google OAuth2 or Firebase ID token',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...',
  })
  @IsNotEmpty({ message: 'Google ID token is required' })
  @IsString({ message: 'Google ID token must be a string' })
  idToken: string;
}
