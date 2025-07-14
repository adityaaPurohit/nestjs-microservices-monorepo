import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    type: String,
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    type: String,
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    type: String,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    type: String,
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'User role (optional)',
    example: 'VIEWER',
    type: String,
    required: false,
    enum: ['VIEWER', 'EDITOR', 'ADMIN'],
  })
  @IsOptional()
  @IsString()
  role?: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token for getting new access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  @IsString()
  refreshToken: string;
}

// Response DTOs
export class LoginResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Login successful',
  })
  message: string;

  @ApiProperty({
    description: 'Login response data',
    type: 'object',
    properties: {
      accessToken: {
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
      refreshToken: {
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
      user: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
          email: { type: 'string', example: 'user@example.com' },
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Doe' },
          role: { type: 'string', example: 'VIEWER' },
        },
      },
    },
  })
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  };
}

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'User created successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Registration response data',
    type: 'object',
    properties: {
      accessToken: {
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
      refreshToken: {
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
      user: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
          email: { type: 'string', example: 'user@example.com' },
          firstName: { type: 'string', example: 'John' },
          lastName: { type: 'string', example: 'Doe' },
          role: { type: 'string', example: 'VIEWER' },
        },
      },
    },
  })
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  };
}
