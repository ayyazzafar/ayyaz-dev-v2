'use client';

import * as React from 'react';
import { FileCard } from './file-card.js';
import type { UploadProgress, UploadedFile } from '../shared/types.js';
import { DEFAULT_ALLOWED_MIME_TYPES, DEFAULT_MAX_FILE_SIZE } from '../shared/types.js';

export interface FileUploaderProps {
  /** Current files being uploaded */
  files: UploadProgress[];

  /** Called when files are dropped or selected */
  onUpload: (files: File[]) => void;

  /** Called when a file is removed */
  onRemove: (file: File) => void;

  /** Whether uploading is in progress */
  isUploading?: boolean;

  /** Allowed MIME types */
  allowedMimeTypes?: string[];

  /** Maximum file size in bytes */
  maxFileSize?: number;

  /** Maximum number of files */
  maxFiles?: number;

  /** Whether multiple files are allowed */
  multiple?: boolean;

  /** Whether the uploader is disabled */
  disabled?: boolean;

  /** Custom class name for the container */
  className?: string;

  /** Custom class name for the dropzone */
  dropzoneClassName?: string;

  /** Custom placeholder text */
  placeholder?: string;

  /** Custom helper text */
  helperText?: string;
}

/**
 * Default styles (Tailwind CSS classes)
 */
const defaultStyles = {
  container: 'w-full space-y-4',
  dropzone: `
    relative flex flex-col items-center justify-center
    w-full min-h-[150px] p-6
    border-2 border-dashed rounded-lg
    transition-colors duration-200 cursor-pointer
    hover:border-primary/50 hover:bg-muted/50
  `,
  dropzoneActive: 'border-primary bg-primary/10',
  dropzoneDisabled: 'opacity-50 cursor-not-allowed hover:border-border hover:bg-transparent',
  icon: 'h-10 w-10 text-muted-foreground mb-3',
  text: 'text-sm text-muted-foreground text-center',
  textPrimary: 'font-medium text-foreground',
  helper: 'text-xs text-muted-foreground mt-2',
  fileList: 'space-y-2',
  input: 'absolute inset-0 w-full h-full opacity-0 pointer-events-none',
};

/**
 * FileUploader component with drag-and-drop support
 *
 * @example
 * ```tsx
 * const { files, upload, remove, isUploading } = useFileUpload({
 *   presignedUrlEndpoint: '/api/upload/presigned-url',
 * });
 *
 * <FileUploader
 *   files={files}
 *   onUpload={upload}
 *   onRemove={remove}
 *   isUploading={isUploading}
 *   multiple
 * />
 * ```
 */
export function FileUploader({
  files,
  onUpload,
  onRemove,
  isUploading = false,
  allowedMimeTypes = DEFAULT_ALLOWED_MIME_TYPES,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  maxFiles = 10,
  multiple = true,
  disabled = false,
  className = '',
  dropzoneClassName = '',
  placeholder,
  helperText,
}: FileUploaderProps) {
  const [isDragActive, setIsDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isDisabled = disabled || isUploading;
  const canAddMore = !maxFiles || files.length < maxFiles;

  // Format accepted types for input
  const acceptTypes = allowedMimeTypes.join(',');

  // Format helper text
  const defaultHelperText = React.useMemo(() => {
    const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
    const types = allowedMimeTypes
      .map((t) => t.split('/')[1]?.toUpperCase())
      .filter(Boolean)
      .join(', ');
    return `${types} up to ${maxSizeMB}MB${maxFiles ? `, max ${maxFiles} files` : ''}`;
  }, [allowedMimeTypes, maxFileSize, maxFiles]);

  /**
   * Handle file selection
   */
  const handleFiles = React.useCallback(
    (fileList: FileList | null) => {
      if (!fileList || !canAddMore) return;

      const newFiles = Array.from(fileList).slice(0, maxFiles - files.length);
      if (newFiles.length > 0) {
        onUpload(newFiles);
      }
    },
    [canAddMore, maxFiles, files.length, onUpload]
  );

  /**
   * Handle drag events
   */
  const handleDragEnter = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (isDisabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [isDisabled, handleFiles]
  );

  /**
   * Handle input change
   */
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      // Reset input so same file can be selected again
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [handleFiles]
  );

  /**
   * Handle click on dropzone
   */
  const handleClick = React.useCallback(() => {
    if (!isDisabled && inputRef.current) {
      inputRef.current.click();
    }
  }, [isDisabled]);

  return (
    <div className={`${defaultStyles.container} ${className}`}>
      {/* Dropzone */}
      {canAddMore && (
        <div
          className={`
            ${defaultStyles.dropzone}
            ${isDragActive ? defaultStyles.dropzoneActive : ''}
            ${isDisabled ? defaultStyles.dropzoneDisabled : ''}
            ${dropzoneClassName}
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          aria-disabled={isDisabled}
        >
          <input
            ref={inputRef}
            type="file"
            className={defaultStyles.input}
            accept={acceptTypes}
            multiple={multiple}
            disabled={isDisabled}
            onChange={handleInputChange}
            aria-label="File upload"
          />

          <UploadIcon className={defaultStyles.icon} />

          <p className={defaultStyles.text}>
            <span className={defaultStyles.textPrimary}>
              {placeholder || 'Click to upload'}
            </span>
            {' '}or drag and drop
          </p>

          <p className={defaultStyles.helper}>
            {helperText || defaultHelperText}
          </p>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className={defaultStyles.fileList}>
          {files.map((file, index) => (
            <FileCard
              key={`${file.file.name}-${index}`}
              file={file}
              onRemove={() => onRemove(file.file)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Upload icon SVG
function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
