import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';

/**
 * ProjectsModule - Portfolio projects feature module
 *
 * This module handles CRUD operations for portfolio projects.
 * It uses PrismaService (globally available via PrismaModule).
 *
 * Note: We don't need to import AuthModule because:
 * - JwtAuthGuard uses Reflector which is globally available
 * - JwtStrategy is registered globally via PassportModule
 */
@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService], // Export for potential use in other modules
})
export class ProjectsModule {}
