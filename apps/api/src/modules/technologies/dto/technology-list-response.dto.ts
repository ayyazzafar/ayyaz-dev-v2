import { TechnologyDto } from './technology.dto';
import { PaginationMeta } from '../../../common/dto';

/**
 * TechnologyListResponseDto - Response DTO for paginated technology list
 */
export class TechnologyListResponseDto {
  /** List of technologies */
  data: TechnologyDto[];

  /** Pagination metadata */
  meta: PaginationMeta;
}
