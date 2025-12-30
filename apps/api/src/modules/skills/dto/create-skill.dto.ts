import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
  Max,
  MinLength,
} from 'class-validator';

/**
 * Skill categories for grouping
 */
export enum SkillCategory {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  DATABASE = 'DATABASE',
  DEVOPS = 'DEVOPS',
  TOOLS = 'TOOLS',
  AI = 'AI',
}

/**
 * CreateSkillDto - For creating skill entries
 *
 * Skills are displayed on the portfolio to show expertise areas.
 */
export class CreateSkillDto {
  @ApiProperty({
    example: 'React',
    description: 'Skill name',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    example: 'FRONTEND',
    description: 'Skill category for grouping',
    enum: SkillCategory,
  })
  @IsEnum(SkillCategory, {
    message: `Category must be one of: ${Object.values(SkillCategory).join(', ')}`,
  })
  category: SkillCategory;

  @ApiPropertyOptional({
    example: 90,
    description: 'Proficiency level (0-100)',
    minimum: 0,
    maximum: 100,
    default: 80,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  level?: number = 80;

  @ApiPropertyOptional({
    example: 1,
    description: 'Display order (lower = first)',
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number = 0;
}
