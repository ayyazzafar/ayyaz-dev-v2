import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

/**
 * JWT Token Payload Interface
 *
 * This is what we store INSIDE the JWT token.
 * Keep it minimal - tokens are sent with every request!
 *
 * sub = "subject" (standard JWT claim for user ID)
 * email = for convenience in logging/debugging
 * role = for authorization checks
 */
export interface JwtPayload {
  sub: string;    // User ID
  email: string;
  role: string;
}

/**
 * JwtStrategy - Validates JWT tokens on incoming requests
 *
 * KEY PASSPORT CONCEPTS:
 *
 * 1. PassportStrategy(Strategy, 'jwt'):
 *    - First arg: The passport-jwt Strategy class
 *    - Second arg: Name to reference this strategy (used in guards)
 *
 * 2. super() options:
 *    - jwtFromRequest: WHERE to find the token (Authorization header)
 *    - ignoreExpiration: false = reject expired tokens
 *    - secretOrKey: The secret used to verify token signature
 *
 * 3. validate() method:
 *    - Called AFTER token is verified
 *    - Receives the decoded payload
 *    - Return value becomes req.user
 *    - Throw exception to reject authentication
 *
 * FLOW:
 * Request → Extract JWT → Verify Signature → validate() → req.user
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    // Get JWT secret with a fallback (throws error in production if not set)
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      // Extract JWT from "Authorization: Bearer <token>" header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Reject expired tokens
      ignoreExpiration: false,

      // Use the same secret that signed the token
      secretOrKey: jwtSecret,
    });
  }

  /**
   * Validate the decoded JWT payload
   *
   * This is called AFTER the token signature is verified.
   * The payload contains what we put in when signing the token.
   *
   * We look up the user in the database to:
   * 1. Ensure the user still exists (wasn't deleted)
   * 2. Get fresh user data (role might have changed)
   *
   * @returns The user object (becomes req.user)
   * @throws UnauthorizedException if user not found
   */
  async validate(payload: JwtPayload) {
    // Look up the user by ID from the token payload
    const user = await this.usersService.findOne(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // This becomes req.user
    return user;
  }
}
