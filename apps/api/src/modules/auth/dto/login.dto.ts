import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * LoginDto - Validates login request body
 *
 * Same validation as CreateUserDto for email/password
 * This ensures users can only login with valid credentials format
 */
export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
