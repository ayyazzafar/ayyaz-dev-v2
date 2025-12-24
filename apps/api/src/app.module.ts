import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TechnologiesModule } from './modules/technologies/technologies.module';
import { SkillsModule } from './modules/skills/skills.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { MediaModule } from './modules/media/media.module';

/**
 * AppModule - The root module of the application
 *
 * This is the entry point where all other modules are imported.
 * Think of it like Laravel's app/Providers/AppServiceProvider.php
 *
 * Module Import Order:
 * 1. ConfigModule - Environment variables (needed by everything)
 * 2. PrismaModule - Database (marked @Global, available everywhere)
 * 3. AuthModule - Authentication (depends on UsersModule)
 * 4. Feature modules (UsersModule, etc.)
 */
@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot({
      isGlobal: true, // Makes config available everywhere without re-importing
    }),

    // Database - @Global makes PrismaService available everywhere
    PrismaModule,

    // Feature modules
    UsersModule,
    AuthModule,
    ProjectsModule,
    TechnologiesModule,
    SkillsModule,
    ExperienceModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
