import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @CurrentUser() - Extract current user from request
 *
 * This is a PARAMETER DECORATOR (like @Body(), @Param(), @Query())
 * It extracts data from the request and passes it to the handler.
 *
 * Usage:
 * @Get('profile')
 * getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 *
 * You can also extract a specific field:
 * @Get('profile')
 * getProfile(@CurrentUser('id') userId: string) {
 *   return userId;
 * }
 *
 * HOW IT WORKS:
 * 1. JwtAuthGuard validates token and attaches user to req.user
 * 2. This decorator reads from req.user
 * 3. If 'data' param is provided, returns that specific field
 * 4. Otherwise returns entire user object
 *
 * IMPORTANT:
 * Only works on routes protected by JwtAuthGuard!
 * On unprotected routes, req.user will be undefined.
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    // Get the HTTP request from execution context
    const request = ctx.switchToHttp().getRequest();

    // Get user from request (set by JwtAuthGuard)
    const user = request.user;

    // If a specific field was requested, return just that field
    // Otherwise return the entire user object
    return data ? user?.[data] : user;
  },
);
