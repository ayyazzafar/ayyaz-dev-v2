import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { FileUploadService } from './file-upload.service.js';
import type { PresignedUrlRequest, PresignedUrlResponse } from '../shared/types.js';

/**
 * DTO for presigned URL request
 */
export class PresignedUrlRequestDto implements PresignedUrlRequest {
  /** Original filename */
  @IsString()
  filename!: string;

  /** MIME type of the file */
  @IsString()
  contentType!: string;

  /** File size in bytes */
  @IsNumber()
  @Min(1)
  size!: number;

  /** Optional folder/prefix for the file key */
  @IsOptional()
  @IsString()
  folder?: string;
}

/**
 * Controller for file upload endpoints
 *
 * Provides:
 * - POST /upload/presigned-url - Get a presigned URL for uploading
 * - DELETE /upload/:key - Delete a file
 * - GET /upload/config - Get upload configuration
 */
@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  /**
   * Get a presigned URL for uploading a file
   *
   * @example
   * POST /upload/presigned-url
   * {
   *   "filename": "photo.jpg",
   *   "contentType": "image/jpeg",
   *   "size": 1024000
   * }
   */
  @Post('presigned-url')
  @HttpCode(HttpStatus.OK)
  async getPresignedUrl(
    @Body() request: PresignedUrlRequestDto
  ): Promise<PresignedUrlResponse> {
    return this.fileUploadService.getPresignedUrl(request);
  }

  /**
   * Delete a file from storage
   *
   * @example
   * DELETE /upload/uploads/abc123.jpg
   */
  @Delete(':key{/*path}')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFile(@Param('key') key: string, @Param('path') path?: string): Promise<void> {
    const fullKey = path ? `${key}/${path}` : key;
    await this.fileUploadService.deleteFile(fullKey);
  }

  /**
   * Get upload configuration
   * Useful for client-side validation
   *
   * @example
   * GET /upload/config
   */
  @Get('config')
  getConfig() {
    return this.fileUploadService.getUploadConfig();
  }
}
