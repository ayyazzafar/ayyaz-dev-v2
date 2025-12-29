'use client';

import * as React from 'react';
import type { UploadProgress } from '../shared/types.js';

export interface FileCardProps {
  /** File upload progress data */
  file: UploadProgress;

  /** Called when remove button is clicked */
  onRemove?: () => void;

  /** Custom class name */
  className?: string;
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Default styles (can be overridden with Tailwind classes)
 */
const defaultStyles = {
  card: 'relative flex items-center gap-3 p-3 rounded-lg border bg-background',
  preview: 'h-12 w-12 rounded-md object-cover bg-muted flex items-center justify-center',
  info: 'flex-1 min-w-0',
  filename: 'text-sm font-medium truncate',
  size: 'text-xs text-muted-foreground',
  progress: 'h-1 w-full bg-muted rounded-full overflow-hidden mt-1',
  progressBar: 'h-full bg-primary transition-all duration-300',
  error: 'text-xs text-destructive mt-1',
  removeBtn: 'p-1 rounded-md hover:bg-muted transition-colors',
  statusIcon: 'h-4 w-4',
};

/**
 * FileCard component for displaying file upload progress
 *
 * @example
 * ```tsx
 * <FileCard
 *   file={uploadProgress}
 *   onRemove={() => remove(uploadProgress.file)}
 * />
 * ```
 */
export function FileCard({ file, onRemove, className = '' }: FileCardProps) {
  const { file: fileObj, progress, status, error, result } = file;

  // Generate preview URL for images
  const previewUrl = React.useMemo(() => {
    if (result?.url) return result.url;
    if (fileObj.type.startsWith('image/')) {
      return URL.createObjectURL(fileObj);
    }
    return null;
  }, [fileObj, result]);

  // Cleanup object URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl && !result?.url) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, result?.url]);

  return (
    <div className={`${defaultStyles.card} ${className}`}>
      {/* Preview */}
      <div className={defaultStyles.preview}>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={fileObj.name}
            className="h-full w-full object-cover rounded-md"
          />
        ) : (
          <FileIcon className="h-6 w-6 text-muted-foreground" />
        )}
      </div>

      {/* File Info */}
      <div className={defaultStyles.info}>
        <p className={defaultStyles.filename}>{fileObj.name}</p>
        <p className={defaultStyles.size}>{formatFileSize(fileObj.size)}</p>

        {/* Progress bar */}
        {status === 'uploading' && (
          <div className={defaultStyles.progress}>
            <div
              className={defaultStyles.progressBar}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Error message */}
        {status === 'error' && error && (
          <p className={defaultStyles.error}>{error}</p>
        )}
      </div>

      {/* Status / Remove button */}
      <div className="flex items-center gap-2">
        {status === 'complete' && (
          <CheckIcon className={`${defaultStyles.statusIcon} text-green-500`} />
        )}
        {status === 'error' && (
          <AlertIcon className={`${defaultStyles.statusIcon} text-destructive`} />
        )}
        {status === 'uploading' && (
          <LoadingIcon className={`${defaultStyles.statusIcon} animate-spin`} />
        )}

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className={defaultStyles.removeBtn}
            aria-label="Remove file"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Simple inline SVG icons (no external dependencies)
function FileIcon({ className }: { className?: string }) {
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
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function LoadingIcon({ className }: { className?: string }) {
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
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
