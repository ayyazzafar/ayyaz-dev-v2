import { SetMetadata } from '@nestjs/common';

/**
 * Key used to store metadata for public routes
 * This is checked by JwtAuthGuard
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * @Public() - Mark a route as publicly accessible
 *
 * Use this decorator to skip JWT authentication on specific routes
 * when JwtAuthGuard is applied globally.
 *
 * Example:
 * @Public()
 * @Get('health')
 * healthCheck() {
 *   return { status: 'ok' };
 * }
 *
 * Without @Public(), this route would require JWT authentication.
 * With @Public(), anyone can access it.
 *
 * Common use cases:
 * - Health check endpoints
 * - Login/register endpoints
 * - Public API endpoints
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
