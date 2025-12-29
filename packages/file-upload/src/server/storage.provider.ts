import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import type {
  FileUploadConfig,
  PresignedUrlRequest,
  PresignedUrlResponse,
} from '../shared/types.js';
import {
  DEFAULT_PRESIGNED_URL_EXPIRATION,
  DEFAULT_ALLOWED_MIME_TYPES,
  DEFAULT_MAX_FILE_SIZE,
} from '../shared/types.js';

/**
 * Storage provider for generating presigned URLs
 * Supports both Cloudflare R2 and AWS S3
 */
export class StorageProvider {
  private client: S3Client;
  private config: Required<
    Pick<
      FileUploadConfig,
      | 'bucket'
      | 'publicUrl'
      | 'defaultFolder'
      | 'presignedUrlExpiration'
      | 'allowedMimeTypes'
      | 'maxFileSize'
    >
  > &
    FileUploadConfig;

  constructor(config: FileUploadConfig) {
    // Build endpoint URL
    const endpoint =
      config.endpoint ??
      (config.provider === 'r2'
        ? `https://${config.accountIdOrRegion}.r2.cloudflarestorage.com`
        : undefined);

    // Initialize S3 client
    this.client = new S3Client({
      endpoint,
      region: config.provider === 'r2' ? 'auto' : config.accountIdOrRegion,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });

    // Store config with defaults
    this.config = {
      ...config,
      defaultFolder: config.defaultFolder ?? 'uploads',
      presignedUrlExpiration:
        config.presignedUrlExpiration ?? DEFAULT_PRESIGNED_URL_EXPIRATION,
      allowedMimeTypes: config.allowedMimeTypes ?? DEFAULT_ALLOWED_MIME_TYPES,
      maxFileSize: config.maxFileSize ?? DEFAULT_MAX_FILE_SIZE,
    };
  }

  /**
   * Validate file before generating presigned URL
   */
  validateFile(request: PresignedUrlRequest): void {
    // Check MIME type
    if (!this.config.allowedMimeTypes.includes(request.contentType)) {
      throw new Error(
        `File type '${request.contentType}' is not allowed. Allowed types: ${this.config.allowedMimeTypes.join(', ')}`
      );
    }

    // Check file size
    if (request.size > this.config.maxFileSize) {
      const maxSizeMB = Math.round(this.config.maxFileSize / (1024 * 1024));
      throw new Error(`File size exceeds maximum of ${maxSizeMB}MB`);
    }
  }

  /**
   * Generate a unique key for the file
   */
  generateKey(request: PresignedUrlRequest): string {
    const folder = request.folder ?? this.config.defaultFolder;
    const extension = request.filename.split('.').pop() ?? '';
    const uniqueId = randomUUID();
    return `${folder}/${uniqueId}.${extension}`;
  }

  /**
   * Generate a presigned URL for uploading a file
   */
  async getPresignedUrl(
    request: PresignedUrlRequest
  ): Promise<PresignedUrlResponse> {
    // Validate the file
    this.validateFile(request);

    // Generate unique key
    const key = this.generateKey(request);

    // Create the put command
    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
      ContentType: request.contentType,
      ContentLength: request.size,
    });

    // Generate presigned URL
    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: this.config.presignedUrlExpiration,
    });

    // Calculate expiration timestamp
    const expiresAt =
      Date.now() + this.config.presignedUrlExpiration * 1000;

    // Build public URL
    const publicUrl = `${this.config.publicUrl.replace(/\/$/, '')}/${key}`;

    return {
      uploadUrl,
      key,
      publicUrl,
      expiresAt,
    };
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    });

    await this.client.send(command);
  }

  /**
   * Get the public URL for a key
   */
  getPublicUrl(key: string): string {
    return `${this.config.publicUrl.replace(/\/$/, '')}/${key}`;
  }

  /**
   * Get the current configuration
   */
  getConfig() {
    return {
      allowedMimeTypes: this.config.allowedMimeTypes,
      maxFileSize: this.config.maxFileSize,
    };
  }
}
