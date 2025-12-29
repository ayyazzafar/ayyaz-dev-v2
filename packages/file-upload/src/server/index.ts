/**
 * @ayyaz-dev/file-upload/server
 *
 * NestJS module for file uploads with presigned URLs.
 *
 * @example
 * ```typescript
 * import { FileUploadModule, FileUploadService } from '@ayyaz-dev/file-upload/server';
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
 */

export { FileUploadModule } from './file-upload.module.js';
export type { FileUploadModuleOptions } from './file-upload.module.js';

export { FileUploadService, FILE_UPLOAD_CONFIG } from './file-upload.service.js';

export { FileUploadController, PresignedUrlRequestDto } from './file-upload.controller.js';

export { StorageProvider } from './storage.provider.js';

// Re-export shared types for convenience
export * from '../shared/types.js';
