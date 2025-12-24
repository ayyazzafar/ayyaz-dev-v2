import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

/**
 * UsersModule - Encapsulates all user-related functionality
 *
 * In NestJS, modules are the fundamental unit of organization.
 * Think of them like mini-applications that can be plugged together.
 *
 * This module:
 * - Declares UsersController to handle HTTP requests
 * - Provides UsersService for business logic
 * - Exports UsersService so other modules can use it (e.g., AuthModule)
 */
@Module({
  controllers: [UsersController],  // HTTP endpoint handlers
  providers: [UsersService],       // Services available within this module
  exports: [UsersService],         // Make service available to other modules
})
export class UsersModule {}
