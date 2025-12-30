import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Min,
  MinLength,
  ValidateNested
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
 * CreateProjectImageDto - Represents an image in the images array
 */
export class CreateProjectImageDto {
  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'Image URL',
  })
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  url: string;

  @ApiPropertyOptional({
    example: 'Dashboard screenshot',
    description: 'Alt text for accessibility',
  })
  @IsOptional()
  @IsString()
  alt?: string;

  @ApiProperty({
    example: 0,
    description: 'Display order (lower = first)',
  })
  @IsNumber()
  order: number;
}

/**
 * CreateProjectDto - Validates incoming project creation data
 */
export class CreateProjectDto {
  @ApiProperty({
    example: 'spendnest',
    description: 'URL-friendly identifier (lowercase letters, numbers, hyphens only)',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @ApiProperty({
    example: 'SpendNest - Expense Tracker',
    description: 'Display title',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  title: string;

  @ApiPropertyOptional({
    example: 'Personal expense tracking application',
    description: 'Short description (for cards/listings)',
    minLength: 10,
  })
  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Description must be at least 10 characters if provided' })
  description?: string;

  @ApiPropertyOptional({
    example: 'SpendNest is a comprehensive expense tracking app...',
    description: 'Full description with details',
  })
  @IsOptional()
  @IsString()
  longDescription?: string;

  @ApiProperty({
    example: 'ACTIVE',
    description: 'Project status',
    enum: ProjectStatus,
  })
  @IsEnum(ProjectStatus, {
    message: 'Status must be one of: ACTIVE, COMPLETED, PAUSED, ARCHIVED',
  })
  status: ProjectStatus;

  @ApiProperty({
    example: 'PRODUCT',
    description: 'Project type/category',
    enum: ProjectType,
  })
  @IsEnum(ProjectType, {
    message: 'Type must be one of: PRODUCT, CLIENT, EXPERIMENT, LEARNING',
  })
  type: ProjectType;

  @ApiPropertyOptional({
    example: 'https://spendnest.app',
    description: 'Live project URL',
  })
  @IsOptional()
  @IsUrl({}, { message: 'URL must be a valid URL' })
  url?: string;

  @ApiPropertyOptional({
    example: 'https://github.com/ayyazzafar/spendnest',
    description: 'GitHub repository URL',
  })
  @IsOptional()
  @IsUrl({}, { message: 'GitHub URL must be a valid URL' })
  github?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Featured on homepage?',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({
    example: 1,
    description: 'Display order (lower = first)',
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({
    example: '2024-01-15',
    description: 'When project was started',
  })
  @IsOptional()
  @IsDateString()
  startedAt?: string;

  @ApiPropertyOptional({
    example: '2024-06-30',
    description: 'When project was completed (if applicable)',
  })
  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @ApiPropertyOptional({
    example: ['tech-id-1', 'tech-id-2'],
    description: 'Array of technology IDs to associate with this project',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologyIds?: string[];

  @ApiPropertyOptional({
    description: 'Array of images for the project',
    type: [CreateProjectImageDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProjectImageDto)
  images?: CreateProjectImageDto[];
}
