import { ApiProperty } from '@nestjs/swagger';
import { ProjectDto } from './project.dto';

/**
 * PaginationMeta - Pagination metadata for list responses
 */
class PaginationMeta {
  @ApiProperty({ description: 'Total number of items' })
  total: number;

  @ApiProperty({ description: 'Number of items skipped' })
  skip: number;

  @ApiProperty({ description: 'Number of items per page' })
  take: number;

  @ApiProperty({ description: 'Whether there are more items' })
  hasMore: boolean;
}

/**
 * ProjectListResponseDto - Response DTO for paginated project list
 */
export class ProjectListResponseDto {
  @ApiProperty({ type: [ProjectDto], description: 'List of projects' })
  data: ProjectDto[];

  @ApiProperty({ type: PaginationMeta, description: 'Pagination metadata' })
  meta: PaginationMeta;
}
