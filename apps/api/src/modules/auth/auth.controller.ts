import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { LocalAuthGuard, JwtAuthGuard } from './guards';
import { CurrentUser, Public } from './decorators';
import { LoginDto, LoginResponseDto, UserResponseDto } from './dto';

/**
 * AuthController - Authentication endpoints
 *
 * Endpoints:
 * - POST /api/auth/login - Login with email/password, get JWT
 * - GET /api/auth/me - Get current user from JWT
 *
 * GUARD FLOW:
 *
 * Login (LocalAuthGuard):
 * 1. Request comes in with { email, password }
 * 2. LocalAuthGuard triggers LocalStrategy.validate()
 * 3. LocalStrategy calls AuthService.validateUser()
 * 4. If valid, user is attached to req.user
 * 5. Controller receives request, calls AuthService.login()
 * 6. JWT token is generated and returned
 *
 * Protected routes (JwtAuthGuard):
 * 1. Request comes with Authorization: Bearer <token>
 * 2. JwtAuthGuard triggers JwtStrategy.validate()
 * 3. JwtStrategy verifies token and looks up user
 * 4. User is attached to req.user
 * 5. Controller can access user via @CurrentUser()
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /api/auth/login
   *
   * Login with email and password.
   * Returns JWT access token on success.
   *
   * LocalAuthGuard handles credential validation.
   * By the time we reach this method, req.user is already set.
   *
   * @example
   * POST /api/auth/login
   * Body: { "email": "user@example.com", "password": "password123" }
   * Response: { "access_token": "eyJ...", "user": {...} }
   */
  @Public() // Login doesn't require existing auth
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK) // Return 200, not 201
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })  // Needed because LocalAuthGuard consumes the body
  @ApiOkResponse({ type: LoginResponseDto, description: 'Login successful' })
  async login(@Request() req: { user: Omit<User, 'password'> }): Promise<LoginResponseDto> {
    // req.user is set by LocalAuthGuard after successful validation
    return this.authService.login(req.user);
  }

  /**
   * GET /api/auth/me
   *
   * Get current authenticated user's profile.
   * Requires valid JWT token in Authorization header.
   *
   * @example
   * GET /api/auth/me
   * Headers: { Authorization: "Bearer eyJ..." }
   * Response: { "id": "...", "email": "...", "name": "...", "role": "..." }
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiOkResponse({ type: UserResponseDto, description: 'Current user profile' })
  getMe(@CurrentUser() user: Omit<User, 'password'>): UserResponseDto {
    return user as UserResponseDto;
  }
}
