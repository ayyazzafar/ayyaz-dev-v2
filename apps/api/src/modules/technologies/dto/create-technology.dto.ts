import { IsString, IsOptional, MinLength } from 'class-validator';

/**
 * CreateTechnologyDto - For creating technology entries
 *
 * Technologies are used to tag projects with the tech stack.
 * Example: React, Next.js, PostgreSQL, etc.
 */
export class CreateTechnologyDto {
  /**
   * Technology name (unique)
   * @example "Next.js"
   */
  @IsString()
  @MinLength(1)
  name: string;

  /**
   * Icon identifier or URL (optional)
   * Could be a simple icon name or full URL
   * @example "nextjs" or "https://cdn.example.com/icons/nextjs.svg"
   */
  @IsOptional()
  @IsString()
  icon?: string;
}
