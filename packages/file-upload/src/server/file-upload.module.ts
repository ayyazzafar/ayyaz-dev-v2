import { DynamicModule, Module } from '@nestjs/common';
import type { FileUploadConfig } from '../shared/types.js';
import { FileUploadController } from './file-upload.controller.js';
import { FILE_UPLOAD_CONFIG, FileUploadService } from './file-upload.service.js';

export interface FileUploadModuleOptions extends FileUploadConfig {
  /**
   * Whether to make the module global
   * @default false
   */
  isGlobal?: boolean;

  /**
   * Whether to register the controller
   * Set to false if you want to create your own controller
   * @default true
   */
  registerController?: boolean;
}

/**
 * NestJS module for file uploads with presigned URLs
 *
 * @example Basic usage
 * ```typescript
 * import { FileUploadModule } from '@ayyaz-dev/file-upload/server';
 *
 * @Module({
 *   imports: [
 *     FileUploadModule.forRoot({
 *       provider: 'r2',
 *       bucket: process.env.R2_BUCKET_NAME,
 *       publicUrl: process.env.R2_PUBLIC_URL,
 *       accountIdOrRegion: process.env.R2_ACCOUNT_ID,
 *       accessKeyId: process.env.R2_ACCESS_KEY_ID,
 *       secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * @example With custom route prefix
 * ```typescript
 * FileUploadModule.forRoot({
 *   // ...config
 *   routePrefix: 'api/media',
 * })
 * ```
 *
 * @example Service-only (no controller)
 * ```typescript
 * FileUploadModule.forRoot({
 *   // ...config
 *   registerController: false,
 * })
 * ```
 */
@Module({})
export class FileUploadModule {
  static forRoot(options: FileUploadModuleOptions): DynamicModule {
    const {
      isGlobal = false,
      registerController = true,
      ...config
    } = options;

    const providers = [
      {
        provide: FILE_UPLOAD_CONFIG,
        useValue: config,
      },
      FileUploadService,
    ];

    const controllers = registerController ? [FileUploadController] : [];

    const module: DynamicModule = {
      module: FileUploadModule,
      providers,
      controllers,
      exports: [FileUploadService],
    };

    if (isGlobal) {
      module.global = true;
    }

    return module;
  }

  /**
   * Async configuration with factory
   *
   * @example
   * ```typescript
   * FileUploadModule.forRootAsync({
   *   imports: [ConfigModule],
   *   useFactory: (configService: ConfigService) => ({
   *     provider: 'r2',
   *     bucket: configService.get('R2_BUCKET_NAME'),
   *     // ...
   *   }),
   *   inject: [ConfigService],
   * })
   * ```
   */
  static forRootAsync(options: {
    imports?: any[];
    useFactory: (
      ...args: any[]
    ) => Promise<FileUploadModuleOptions> | FileUploadModuleOptions;
    inject?: any[];
    isGlobal?: boolean;
  }): DynamicModule {
    const { imports = [], useFactory, inject = [], isGlobal = false } = options;

    const providers = [
      {
        provide: FILE_UPLOAD_CONFIG,
        useFactory: async (...args: any[]) => {
          const config = await useFactory(...args);
          const { registerController = true, isGlobal: _, ...rest } = config;
          return rest;
        },
        inject,
      },
      FileUploadService,
    ];

    const module: DynamicModule = {
      module: FileUploadModule,
      imports,
      providers,
      controllers: [FileUploadController],
      exports: [FileUploadService],
    };

    if (isGlobal) {
      module.global = true;
    }

    return module;
  }
}
