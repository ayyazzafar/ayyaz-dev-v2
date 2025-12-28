import { ApiProperty } from '@nestjs/swagger';
import { TechnologyDto } from './technology.dto';

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

export class TechnologyListResponseDto {
  @ApiProperty({ type: [TechnologyDto], description: 'List of technologies' })
  data: TechnologyDto[];

  @ApiProperty({ type: PaginationMeta, description: 'Pagination metadata' })
  meta: PaginationMeta;
}
