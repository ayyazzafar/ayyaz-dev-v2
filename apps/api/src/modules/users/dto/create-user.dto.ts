import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

/**
 * Role enum - matches Prisma schema
 * We define it here so the DTO doesn't depend on generated Prisma types
 */
export enum Role {
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
}

/**
 * CreateUserDto - Validates incoming data for user creation
 *
 * DTOs serve three purposes in NestJS:
 * 1. TYPE SAFETY - TypeScript knows the shape of incoming data
 * 2. VALIDATION - Decorators validate data before it reaches your service
 * 3. DOCUMENTATION - Swagger can auto-generate docs from DTOs
 *
 * Each decorator is a validation rule:
 * - @IsEmail() - Must be valid email format
 * - @IsString() - Must be a string
 * - @MinLength(8) - Must be at least 8 characters
 * - @IsOptional() - Field can be undefined
 * - @IsEnum(Role) - Must be one of the Role enum values
 */
export class CreateUserDto {
  /**
   * User's email address - used for login
   * @example "ayyaz@example.com"
   */
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  /**
   * User's password - will be hashed before storage
   * @example "securePassword123"
   */
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  /**
   * User's display name (optional)
   * @example "Ayyaz Zafar"
   */
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * User's role - defaults to ADMIN in database if not provided
   * @example "ADMIN"
   */
  @IsOptional()
  @IsEnum(Role, { message: 'Role must be either ADMIN or VIEWER' })
  role?: Role;
}
