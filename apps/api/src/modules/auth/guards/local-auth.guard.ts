import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * LocalAuthGuard - Triggers local (email/password) authentication
 *
 * Used on the login endpoint.
 * When applied to a route, it:
 * 1. Calls LocalStrategy.validate() with email/password from request body
 * 2. If valid, attaches user to req.user
 * 3. If invalid, throws UnauthorizedException (401)
 *
 * Usage:
 * @UseGuards(LocalAuthGuard)
 * @Post('login')
 * login(@Request() req) {
 *   return this.authService.login(req.user);
 * }
 *
 * The string 'local' matches the second argument in:
 * PassportStrategy(Strategy, 'local') in LocalStrategy
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
