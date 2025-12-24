import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService - Database connection management for NestJS
 *
 * KEY NESTJS CONCEPTS:
 *
 * 1. Why not just import PrismaClient directly?
 *    - NestJS uses dependency injection for testability
 *    - Lifecycle hooks handle connection management
 *    - Can be mocked easily in tests
 *
 * 2. OnModuleInit:
 *    - Called when NestJS module is initialized
 *    - Perfect place to connect to database
 *
 * 3. OnModuleDestroy:
 *    - Called when application shuts down
 *    - Properly disconnects to avoid connection leaks
 *
 * 4. extends PrismaClient:
 *    - Inherits all Prisma methods (user, project, etc.)
 *    - Adds NestJS lifecycle management
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Pass configuration to PrismaClient
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
  }

  /**
   * Called when the module is initialized
   * Connects to the database
   */
  async onModuleInit() {
    await this.$connect();
    console.log('📦 Database connected');
  }

  /**
   * Called when the application shuts down
   * Properly closes database connections
   */
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('📦 Database disconnected');
  }
}
