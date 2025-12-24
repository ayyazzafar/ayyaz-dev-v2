import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * JwtAuthGuard - Protects routes requiring authentication
 *
 * When applied to a route, it:
 * 1. Extracts JWT from Authorization header
 * 2. Verifies the token signature
 * 3. Calls JwtStrategy.validate() with decoded payload
 * 4. Attaches user to req.user
 * 5. If invalid/expired, throws UnauthorizedException (401)
 *
 * Usage:
 * @UseGuards(JwtAuthGuard)
 * @Get('profile')
 * getProfile(@Request() req) {
 *   return req.user;
 * }
 *
 * Or apply globally in main.ts:
 * app.useGlobalGuards(new JwtAuthGuard());
 *
 * PUBLIC ROUTES:
 * Use @Public() decorator to skip authentication for specific routes.
 * This is useful when guard is applied globally.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Check if route should be authenticated
   *
   * This override allows routes to be marked as public using @Public() decorator.
   * If route is public, skip authentication.
   */
  canActivate(context: ExecutionContext) {
    // Check if @Public() decorator is present
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If public, allow access without authentication
    if (isPublic) {
      return true;
    }

    // Otherwise, run the normal JWT authentication
    return super.canActivate(context);
  }
}
