import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
  IsUrl,
  IsArray,
  IsDateString,
  MinLength,
  Min,
  Matches,
} from 'class-validator';

/**
 * Enums matching Prisma schema
 */
export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED',
}

export enum ProjectType {
  PRODUCT = 'PRODUCT',
  CLIENT = 'CLIENT',
  EXPERIMENT = 'EXPERIMENT',
  LEARNING = 'LEARNING',
}

/**
 * CreateProjectDto - Validates incoming project creation data
 *
 * KEY CONCEPTS:
 *
 * 1. Slug validation:
 *    - URL-friendly identifier (e.g., "spendnest", "ayyaztech")
 *    - Only lowercase letters, numbers, hyphens
 *    - Used for public URLs: /projects/spendnest
 *
 * 2. Technology handling:
 *    - Accept array of technology IDs
 *    - Service will create ProjectTechnology relations
 *
 * 3. Enums:
 *    - Must match Prisma enum values exactly
 *    - @IsEnum validates against allowed values
 */
export class CreateProjectDto {
  /**
   * URL-friendly identifier for the project
   * @example "spendnest"
   */
  @IsString()
  @MinLength(2)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;

  /**
   * Display title
   * @example "SpendNest - Expense Tracker"
   */
  @IsString()
  @MinLength(2)
  title: string;

  /**
   * Short description (for cards/listings)
   * @example "Personal expense tracking application"
   */
  @IsString()
  @MinLength(10)
  description: string;

  /**
   * Full description with details (optional)
   * @example "SpendNest is a comprehensive expense tracking app..."
   */
  @IsOptional()
  @IsString()
  longDescription?: string;

  /**
   * Project status
   * @example "ACTIVE"
   */
  @IsEnum(ProjectStatus, {
    message: 'Status must be one of: ACTIVE, COMPLETED, PAUSED, ARCHIVED',
  })
  status: ProjectStatus;

  /**
   * Project type/category
   * @example "PRODUCT"
   */
  @IsEnum(ProjectType, {
    message: 'Type must be one of: PRODUCT, CLIENT, EXPERIMENT, LEARNING',
  })
  type: ProjectType;

  /**
   * Live project URL (optional)
   * @example "https://spendnest.app"
   */
  @IsOptional()
  @IsUrl({}, { message: 'URL must be a valid URL' })
  url?: string;

  /**
   * GitHub repository URL (optional)
   * @example "https://github.com/ayyaz/spendnest"
   */
  @IsOptional()
  @IsUrl({}, { message: 'GitHub URL must be a valid URL' })
  github?: string;

  /**
   * Featured on homepage?
   * @example true
   */
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  /**
   * Display order (lower = first)
   * @example 1
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  /**
   * When project was started
   * @example "2024-01-15"
   */
  @IsOptional()
  @IsDateString()
  startedAt?: string;

  /**
   * When project was completed (if applicable)
   * @example "2024-06-30"
   */
  @IsOptional()
  @IsDateString()
  completedAt?: string;

  /**
   * Array of technology IDs to associate with this project
   * @example ["tech-id-1", "tech-id-2"]
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologyIds?: string[];
}
