import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  IsDateString,
  Min,
  MinLength,
} from 'class-validator';

/**
 * CreateExperienceDto - For creating work experience entries
 *
 * Work experience entries for the resume/portfolio section.
 */
export class CreateExperienceDto {
  @ApiProperty({
    example: 'Tech Corp',
    description: 'Company name',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  company: string;

  @ApiProperty({
    example: 'Senior Full Stack Developer',
    description: 'Job role/title',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  role: string;

  @ApiPropertyOptional({
    example: 'Led development of microservices architecture...',
    description: 'Role description (optional, can include achievements)',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '2020-01-15',
    description: 'Start date (ISO date string)',
  })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    example: '2023-06-30',
    description: 'End date (null if current position)',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Is this the current position?',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  current?: boolean = false;

  @ApiPropertyOptional({
    example: 0,
    description: 'Display order (lower = first, typically most recent)',
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number = 0;
}
