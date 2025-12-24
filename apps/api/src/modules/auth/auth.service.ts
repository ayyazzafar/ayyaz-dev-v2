import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './strategies/jwt.strategy';

/**
 * AuthService - Core authentication logic
 *
 * Responsibilities:
 * 1. Validate user credentials (for login)
 * 2. Generate JWT tokens
 * 3. Refresh tokens (if needed later)
 *
 * KEY CONCEPT: Separation of Concerns
 * - AuthService handles AUTHENTICATION (who are you?)
 * - UsersService handles USER DATA (CRUD operations)
 * - Guards handle AUTHORIZATION (are you allowed?)
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validate user credentials
   *
   * Used by LocalStrategy during login.
   * Returns user WITHOUT password if valid, null otherwise.
   *
   * @param email - User's email
   * @param password - Plain text password to check
   * @returns User without password, or null if invalid
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    // Find user by email (includes password hash)
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    // Check password using bcrypt
    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Generate JWT token for authenticated user
   *
   * Called after successful login validation.
   * Creates a signed JWT containing user identification.
   *
   * @param user - Authenticated user object
   * @returns Object with access_token
   */
  async login(user: Omit<User, 'password'>) {
    // Create the payload that goes INSIDE the token
    const payload: JwtPayload = {
      sub: user.id,         // Standard JWT claim for subject (user ID)
      email: user.email,
      role: user.role,
    };

    // Sign the token with our secret
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * Get current user from token payload
   *
   * Used when you have a valid token and need fresh user data.
   * Useful for "me" endpoint to get current user profile.
   */
  async getMe(userId: string) {
    return this.usersService.findOne(userId);
  }
}
