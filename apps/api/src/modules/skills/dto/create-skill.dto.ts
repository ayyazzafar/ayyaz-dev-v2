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
  /**
   * Skill name
   * @example "React"
   */
  @IsString()
  @MinLength(1)
  name: string;

  /**
   * Skill category for grouping
   * @example "FRONTEND"
   */
  @IsEnum(SkillCategory, {
    message: `Category must be one of: ${Object.values(SkillCategory).join(', ')}`,
  })
  category: SkillCategory;

  /**
   * Proficiency level (0-100)
   * @example 90
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  level?: number = 80;

  /**
   * Display order (lower = first)
   * @example 1
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number = 0;
}
