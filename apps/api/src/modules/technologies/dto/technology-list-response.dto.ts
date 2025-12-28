import { ApiProperty } from '@nestjs/swagger';
import { TechnologyDto } from './technology.dto';
import { PaginationMeta } from '../../../common/dto';

/**
 * TechnologyListResponseDto - Response DTO for paginated technology list
 */
export class TechnologyListResponseDto {
  @ApiProperty({ type: [TechnologyDto], description: 'List of technologies' })
  data: TechnologyDto[];

  @ApiProperty({ type: PaginationMeta, description: 'Pagination metadata' })
  meta: PaginationMeta;
}
