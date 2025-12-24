import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PrismaModule - Global database module
 *
 * KEY NESTJS CONCEPT: @Global() decorator
 *
 * Without @Global:
 *   - Every module that needs PrismaService must import PrismaModule
 *   - Example: imports: [PrismaModule] in UsersModule
 *
 * With @Global:
 *   - Import PrismaModule ONCE in AppModule
 *   - PrismaService is available EVERYWHERE automatically
 *   - Much cleaner for database access (needed everywhere)
 *
 * This is similar to Laravel's Eloquent being globally available.
 */
@Global() // Makes PrismaService available to all modules without explicit import
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
