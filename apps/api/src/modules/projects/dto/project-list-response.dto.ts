import { ProjectDto } from './project.dto';
import { PaginationMeta } from '../../../common/dto';

/**
 * ProjectListResponseDto - Response DTO for paginated project list
 */
export class ProjectListResponseDto {
  /** List of projects */
  data: ProjectDto[];

  /** Pagination metadata */
  meta: PaginationMeta;
}
