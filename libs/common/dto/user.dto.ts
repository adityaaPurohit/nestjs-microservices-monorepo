import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '@common/enums/user-roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    type: String,
  })
  @IsEmail()
  email: string;

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
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    type: String,
    minLength: 6,
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'User role (optional, defaults to VIEWER)',
    example: 'VIEWER',
    type: String,
    required: false,
    enum: ['VIEWER', 'EDITOR', 'ADMIN'],
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'User email address (optional)',
    example: 'user@example.com',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'User first name (optional)',
    example: 'John',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'User last name (optional)',
    example: 'Doe',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'User password (optional, minimum 6 characters)',
    example: 'newpassword123',
    type: String,
    required: false,
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  password?: string;
}

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'New user role',
    example: 'EDITOR',
    type: String,
    enum: ['VIEWER', 'EDITOR', 'ADMIN'],
  })
  @IsEnum(UserRole)
  role: UserRole;
}
