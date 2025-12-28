import { ApiProperty } from '@nestjs/swagger';
import { ProjectDto } from './project.dto';
import { PaginationMeta } from '../../../common/dto';

/**
 * ProjectListResponseDto - Response DTO for paginated project list
 */
export class ProjectListResponseDto {
  @ApiProperty({ type: [ProjectDto], description: 'List of projects' })
  data: ProjectDto[];

  @ApiProperty({ type: PaginationMeta, description: 'Pagination metadata' })
  meta: PaginationMeta;
}
