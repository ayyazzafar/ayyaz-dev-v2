/**
 * Storage provider types supported by this package
 */
export type StorageProvider = 'r2' | 's3';

/**
 * Configuration for the file upload service
 */
export interface FileUploadConfig {
  /** Storage provider to use */
  provider: StorageProvider;

  /** S3/R2 bucket name */
  bucket: string;

  /** Public URL prefix for accessing files */
  publicUrl: string;

  /** R2: Account ID, S3: Region */
  accountIdOrRegion: string;

  /** Access key ID */
  accessKeyId: string;

  /** Secret access key */
  secretAccessKey: string;

  /** Optional: Custom endpoint URL (auto-generated for R2 if not provided) */
  endpoint?: string;

  /** Optional: Default folder for uploads */
  defaultFolder?: string;

  /** Optional: Presigned URL expiration in seconds (default: 3600) */
  presignedUrlExpiration?: number;

  /** Optional: Allowed MIME types (default: images only) */
  allowedMimeTypes?: string[];

  /** Optional: Max file size in bytes (default: 5MB) */
  maxFileSize?: number;
}

/**
 * Request to get a presigned upload URL
 */
export interface PresignedUrlRequest {
  /** Original filename */
  filename: string;

  /** MIME type of the file */
  contentType: string;

  /** File size in bytes */
  size: number;

  /** Optional: Folder to upload to */
  folder?: string;
}

/**
 * Response with presigned upload URL
 */
export interface PresignedUrlResponse {
  /** Presigned URL to upload the file to */
  uploadUrl: string;

  /** The key (path) where the file will be stored */
  key: string;

  /** Public URL to access the file after upload */
  publicUrl: string;

  /** URL expiration timestamp */
  expiresAt: number;
}

/**
 * Represents an uploaded file
 */
export interface UploadedFile {
  /** Storage key (path) */
  key: string;

  /** Public URL to access the file */
  url: string;

  /** Original filename */
  filename: string;

  /** MIME type */
  contentType: string;

  /** File size in bytes */
  size: number;
}

/**
 * Upload progress information
 */
export interface UploadProgress {
  /** File being uploaded */
  file: File;

  /** Upload progress (0-100) */
  progress: number;

  /** Current status */
  status: 'pending' | 'uploading' | 'complete' | 'error';

  /** Error message if status is 'error' */
  error?: string;

  /** Result if status is 'complete' */
  result?: UploadedFile;
}

/**
 * Configuration for the client-side uploader
 */
export interface UploaderConfig {
  /** API endpoint to get presigned URLs */
  presignedUrlEndpoint: string;

  /** Optional: Headers to include in API requests */
  headers?: Record<string, string>;

  /** Optional: Allowed MIME types */
  allowedMimeTypes?: string[];

  /** Optional: Max file size in bytes */
  maxFileSize?: number;

  /** Optional: Max number of files */
  maxFiles?: number;

  /** Optional: Whether to allow multiple files */
  multiple?: boolean;
}

/**
 * Default allowed image MIME types
 */
export const DEFAULT_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

/**
 * Default max file size (5MB)
 */
export const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Default presigned URL expiration (1 hour)
 */
export const DEFAULT_PRESIGNED_URL_EXPIRATION = 3600;
