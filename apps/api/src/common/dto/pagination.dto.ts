import { ApiProperty } from '@nestjs/swagger';

/**
 * PaginationMeta - Shared pagination metadata for list responses
 *
 * Used across all paginated endpoints to provide consistent pagination info.
 *
 * @example
 * // In your module's list response DTO:
 * import { PaginationMeta } from '../../../common/dto';
 *
 * export class ProjectListResponseDto {
 *   @ApiProperty({ type: [ProjectDto] })
 *   data: ProjectDto[];
 *
 *   @ApiProperty({ type: PaginationMeta })
 *   meta: PaginationMeta;
 * }
 */
export class PaginationMeta {
  @ApiProperty({ description: 'Total number of items' })
  total: number;

  @ApiProperty({ description: 'Number of items skipped' })
  skip: number;

  @ApiProperty({ description: 'Number of items per page' })
  take: number;

  @ApiProperty({ description: 'Whether there are more items' })
  hasMore: boolean;
}
