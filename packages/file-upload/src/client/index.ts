/**
 * @ayyaz-dev/file-upload/client
 *
 * React components and hooks for file uploads with presigned URLs.
 *
 * @example
 * ```tsx
 * import { FileUploader, useFileUpload } from '@ayyaz-dev/file-upload/client';
 *
 * function MyForm() {
 *   const { files, upload, remove, isUploading, uploadedFiles } = useFileUpload({
 *     presignedUrlEndpoint: '/api/upload/presigned-url',
 *   });
 *
 *   return (
 *     <FileUploader
 *       files={files}
 *       onUpload={upload}
 *       onRemove={remove}
 *       isUploading={isUploading}
 *       multiple
 *     />
 *   );
 * }
 * ```
 */

export { FileUploader } from './file-uploader.js';
export type { FileUploaderProps } from './file-uploader.js';

export { FileCard } from './file-card.js';
export type { FileCardProps } from './file-card.js';

export { useFileUpload } from './use-file-upload.js';
export type { UseFileUploadOptions, UseFileUploadReturn } from './use-file-upload.js';

// Re-export shared types for convenience
export * from '../shared/types.js';
