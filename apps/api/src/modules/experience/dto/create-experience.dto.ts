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
  /**
   * Company name
   * @example "Tech Corp"
   */
  @IsString()
  @MinLength(1)
  company: string;

  /**
   * Job role/title
   * @example "Senior Full Stack Developer"
   */
  @IsString()
  @MinLength(1)
  role: string;

  /**
   * Role description (optional, can include achievements)
   * @example "Led development of microservices architecture..."
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Start date
   * @example "2020-01-15"
   */
  @IsDateString()
  startDate: string;

  /**
   * End date (null if current position)
   * @example "2023-06-30"
   */
  @IsOptional()
  @IsDateString()
  endDate?: string;

  /**
   * Is this the current position?
   * @example true
   */
  @IsOptional()
  @IsBoolean()
  current?: boolean = false;

  /**
   * Display order (lower = first, typically most recent)
   * @example 0
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number = 0;
}
