import {
  IsOptional,
  IsEnum,
  IsIn,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ProjectStatus, ProjectType } from './create-project.dto';

/**
 * QueryProjectDto - Query parameters for listing projects
 *
 * Used to filter, sort, and paginate project listings.
 *
 * KEY CONCEPTS:
 *
 * 1. @Transform() + @Type():
 *    - Query params come as strings
 *    - We need to transform them to proper types
 *    - @Type(() => Number) converts "10" to 10
 *    - @Transform() for custom transformations (boolean)
 *
 * 2. Pagination:
 *    - skip: number of records to skip
 *    - take: number of records to return (limit)
 *
 * Example requests:
 * GET /api/projects?status=ACTIVE&featured=true
 * GET /api/projects?type=PRODUCT&skip=10&take=5
 */
export class QueryProjectDto {
  /**
   * Filter by project status
   * @example "ACTIVE"
   */
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  /**
   * Filter by project type
   * @example "PRODUCT"
   */
  @IsOptional()
  @IsEnum(ProjectType)
  type?: ProjectType;

  /**
   * Filter featured projects only
   *
   * WORKAROUND: Query params come as strings. With enableImplicitConversion,
   * the string "false" becomes true (Boolean("false") === true in JS).
   * Solution: Keep as optional string, convert in the service layer.
   *
   * Valid values: "true", "false", "1", "0"
   * @example "true"
   */
  @IsOptional()
  @IsIn(['true', 'false', '1', '0'])
  featured?: string;

  /**
   * Number of records to skip (for pagination)
   * @example 0
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  /**
   * Number of records to return (limit)
   * @example 10
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number;
}
