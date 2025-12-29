import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { StorageProvider } from './storage.provider.js';
import type {
  FileUploadConfig,
  PresignedUrlRequest,
  PresignedUrlResponse,
} from '../shared/types.js';

export const FILE_UPLOAD_CONFIG = 'FILE_UPLOAD_CONFIG';

/**
 * NestJS service for file uploads with presigned URLs
 */
@Injectable()
export class FileUploadService {
  private storageProvider: StorageProvider;

  constructor(@Inject(FILE_UPLOAD_CONFIG) config: FileUploadConfig) {
    this.storageProvider = new StorageProvider(config);
  }

  /**
   * Generate a presigned URL for uploading a file
   */
  async getPresignedUrl(
    request: PresignedUrlRequest
  ): Promise<PresignedUrlResponse> {
    try {
      return await this.storageProvider.getPresignedUrl(request);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to generate upload URL'
      );
    }
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(key: string): Promise<void> {
    try {
      await this.storageProvider.deleteFile(key);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to delete file'
      );
    }
  }

  /**
   * Get the public URL for a stored file
   */
  getPublicUrl(key: string): string {
    return this.storageProvider.getPublicUrl(key);
  }

  /**
   * Get upload configuration (useful for client-side validation)
   */
  getUploadConfig() {
    return this.storageProvider.getConfig();
  }
}
