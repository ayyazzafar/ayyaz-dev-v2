/**
 * PaginationMeta - Shared pagination metadata for list responses
 *
 * Used across all paginated endpoints to provide consistent pagination info.
 */
export class PaginationMeta {
  /** Total number of items */
  total: number;

  /** Number of items skipped */
  skip: number;

  /** Number of items per page */
  take: number;

  /** Whether there are more items */
  hasMore: boolean;
}
