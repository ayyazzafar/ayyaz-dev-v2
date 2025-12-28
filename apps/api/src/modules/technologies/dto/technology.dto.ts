import { ApiProperty } from '@nestjs/swagger';

export class TechnologyDto {
  @ApiProperty({ description: 'Technology ID' })
  id: string;

  @ApiProperty({ description: 'Technology name' })
  name: string;

  @ApiProperty({ description: 'Icon identifier', nullable: true })
  icon: string | null;
}
