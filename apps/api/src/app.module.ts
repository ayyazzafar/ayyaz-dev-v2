import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { FileUploadModule } from '@ayyaz-dev/file-upload/server';

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

    // File uploads with presigned URLs (Cloudflare R2)
    // Provides: POST /upload/presigned-url, DELETE /upload/:key, GET /upload/config
    // isGlobal: true - FileUploadService available everywhere (for cleanup in services)
    FileUploadModule.forRootAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        provider: 'r2' as const,
        bucket: configService.getOrThrow<string>('R2_BUCKET_NAME'),
        publicUrl: configService.getOrThrow<string>('R2_PUBLIC_URL'),
        accountIdOrRegion: configService.getOrThrow<string>('R2_ACCOUNT_ID'),
        accessKeyId: configService.getOrThrow<string>('R2_ACCESS_KEY_ID'),
        secretAccessKey: configService.getOrThrow<string>('R2_SECRET_ACCESS_KEY'),
      }),
      inject: [ConfigService],
    }),

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
export class AppModule { }
