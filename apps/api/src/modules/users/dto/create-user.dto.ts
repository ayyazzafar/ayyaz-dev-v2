import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

/**
 * Role enum - matches Prisma schema
 */
export enum Role {
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
}

/**
 * CreateUserDto - Validates incoming data for user creation
 */
export class CreateUserDto {
  @ApiProperty({
    example: 'ayyaz@example.com',
    description: 'User email address (used for login)',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'User password (min 8 characters, will be hashed)',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiPropertyOptional({
    example: 'Ayyaz Zafar',
    description: 'User display name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'ADMIN',
    description: 'User role (defaults to ADMIN)',
    enum: Role,
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Role must be either ADMIN or VIEWER' })
  role?: Role;
}
