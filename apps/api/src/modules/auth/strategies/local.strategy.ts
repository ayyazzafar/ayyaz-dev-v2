import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

/**
 * LocalStrategy - Validates username/password login
 *
 * This strategy is used for the login endpoint.
 * It receives email + password and validates them.
 *
 * KEY CONCEPT:
 * Unlike JWT strategy (which validates existing tokens),
 * Local strategy CREATES authentication by checking credentials.
 *
 * By default, passport-local expects "username" and "password" fields.
 * We override to use "email" instead of "username".
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      // Use "email" field instead of default "username"
      usernameField: 'email',
      // "password" is already the default, but being explicit
      passwordField: 'password',
    });
  }

  /**
   * Validate credentials
   *
   * Called by passport when LocalAuthGuard is used.
   * Must return user object or throw exception.
   *
   * @param email - From request body (usernameField)
   * @param password - From request body (passwordField)
   * @returns User object (without password)
   * @throws UnauthorizedException if credentials invalid
   */
  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }
}
