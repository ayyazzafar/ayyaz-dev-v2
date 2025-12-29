/**
 * @ayyaz-dev/file-upload
 *
 * Full-stack file upload with presigned URLs.
 * Supports Cloudflare R2 and AWS S3.
 *
 * @example Server (NestJS)
 * ```typescript
 * import { FileUploadModule } from '@ayyaz-dev/file-upload/server';
 *
 * @Module({
 *   imports: [
 *     FileUploadModule.forRoot({
 *       provider: 'r2',
 *       bucket: 'my-bucket',
 *       // ...config
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * @example Client (React)
 * ```typescript
 * import { FileUploader, useFileUpload } from '@ayyaz-dev/file-upload/client';
 *
 * function MyComponent() {
 *   const { upload, files } = useFileUpload({
 *     presignedUrlEndpoint: '/api/upload/presigned-url',
 *   });
 *
 *   return <FileUploader onUpload={upload} files={files} />;
 * }
 * ```
 */

export * from './types.js';
