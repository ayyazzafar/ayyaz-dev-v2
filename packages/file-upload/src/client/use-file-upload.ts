'use client';

import { useState, useCallback } from 'react';
import type {
  UploaderConfig,
  UploadProgress,
  UploadedFile,
  PresignedUrlResponse,
} from '../shared/types.js';
import {
  DEFAULT_ALLOWED_MIME_TYPES,
  DEFAULT_MAX_FILE_SIZE,
} from '../shared/types.js';

export interface UseFileUploadOptions extends Partial<UploaderConfig> {
  /** API endpoint to get presigned URLs (required) */
  presignedUrlEndpoint: string;

  /** Folder/prefix for uploaded files (e.g., 'projects', 'skills') */
  folder?: string;

  /** Callback when upload completes */
  onUploadComplete?: (file: UploadedFile) => void;

  /** Callback when upload fails */
  onUploadError?: (file: File, error: string) => void;
}

export interface UseFileUploadReturn {
  /** Current upload progress for all files */
  files: UploadProgress[];

  /** Upload one or more files */
  upload: (files: File | File[] | FileList) => Promise<UploadedFile[]>;

  /** Remove a file from the list */
  remove: (file: File) => void;

  /** Clear all files */
  clear: () => void;

  /** Whether any files are currently uploading */
  isUploading: boolean;

  /** Get all successfully uploaded files */
  uploadedFiles: UploadedFile[];
}

/**
 * React hook for file uploads with presigned URLs
 *
 * @example
 * ```tsx
 * const { files, upload, remove, isUploading, uploadedFiles } = useFileUpload({
 *   presignedUrlEndpoint: '/api/upload/presigned-url',
 *   onUploadComplete: (file) => console.log('Uploaded:', file),
 * });
 *
 * const handleDrop = (acceptedFiles: File[]) => {
 *   upload(acceptedFiles);
 * };
 * ```
 */
export function useFileUpload(
  options: UseFileUploadOptions
): UseFileUploadReturn {
  const {
    presignedUrlEndpoint,
    folder,
    headers = {},
    allowedMimeTypes = DEFAULT_ALLOWED_MIME_TYPES,
    maxFileSize = DEFAULT_MAX_FILE_SIZE,
    onUploadComplete,
    onUploadError,
  } = options;

  const [files, setFiles] = useState<UploadProgress[]>([]);

  /**
   * Validate a file before upload
   */
  const validateFile = useCallback(
    (file: File): string | null => {
      if (!allowedMimeTypes.includes(file.type)) {
        return `File type '${file.type}' is not allowed`;
      }
      if (file.size > maxFileSize) {
        const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
        return `File size exceeds ${maxSizeMB}MB limit`;
      }
      return null;
    },
    [allowedMimeTypes, maxFileSize]
  );

  /**
   * Update progress for a specific file
   */
  const updateFileProgress = useCallback(
    (file: File, updates: Partial<UploadProgress>) => {
      setFiles((prev) =>
        prev.map((f) => (f.file === file ? { ...f, ...updates } : f))
      );
    },
    []
  );

  /**
   * Get presigned URL from the server
   */
  const getPresignedUrl = useCallback(
    async (file: File, folder?: string): Promise<PresignedUrlResponse> => {
      const response = await fetch(presignedUrlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          size: file.size,
          folder,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to get upload URL');
      }

      return response.json();
    },
    [presignedUrlEndpoint, headers]
  );

  /**
   * Upload a single file using presigned URL
   */
  const uploadSingleFile = useCallback(
    async (file: File): Promise<UploadedFile | null> => {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        updateFileProgress(file, { status: 'error', error: validationError });
        onUploadError?.(file, validationError);
        return null;
      }

      try {
        // Get presigned URL
        updateFileProgress(file, { status: 'uploading', progress: 10 });
        const presigned = await getPresignedUrl(file, folder);

        // Upload to storage
        updateFileProgress(file, { progress: 30 });

        const uploadResponse = await fetch(presigned.uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file to storage');
        }

        // Create result
        const result: UploadedFile = {
          key: presigned.key,
          url: presigned.publicUrl,
          filename: file.name,
          contentType: file.type,
          size: file.size,
        };

        updateFileProgress(file, {
          status: 'complete',
          progress: 100,
          result,
        });

        onUploadComplete?.(result);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed';
        updateFileProgress(file, { status: 'error', error: errorMessage });
        onUploadError?.(file, errorMessage);
        return null;
      }
    },
    [validateFile, getPresignedUrl, updateFileProgress, folder, onUploadComplete, onUploadError]
  );

  /**
   * Upload one or more files
   */
  const upload = useCallback(
    async (input: File | File[] | FileList): Promise<UploadedFile[]> => {
      // Normalize input to array
      const fileArray = input instanceof FileList
        ? Array.from(input)
        : Array.isArray(input)
          ? input
          : [input];

      // Add files to state with pending status
      const newFiles: UploadProgress[] = fileArray.map((file) => ({
        file,
        progress: 0,
        status: 'pending' as const,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Upload all files
      const results = await Promise.all(fileArray.map(uploadSingleFile));

      // Filter out nulls (failed uploads)
      return results.filter((r): r is UploadedFile => r !== null);
    },
    [uploadSingleFile]
  );

  /**
   * Remove a file from the list
   */
  const remove = useCallback((file: File) => {
    setFiles((prev) => prev.filter((f) => f.file !== file));
  }, []);

  /**
   * Clear all files
   */
  const clear = useCallback(() => {
    setFiles([]);
  }, []);

  // Computed values
  const isUploading = files.some((f) => f.status === 'uploading');
  const uploadedFiles = files
    .filter((f) => f.status === 'complete' && f.result)
    .map((f) => f.result!);

  return {
    files,
    upload,
    remove,
    clear,
    isUploading,
    uploadedFiles,
  };
}
