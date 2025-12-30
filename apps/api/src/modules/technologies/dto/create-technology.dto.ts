import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

/**
 * CreateTechnologyDto - For creating technology entries
 *
 * Technologies are used to tag projects with the tech stack.
 * Example: React, Next.js, PostgreSQL, etc.
 */
export class CreateTechnologyDto {
  @ApiProperty({
    example: 'Next.js',
    description: 'Technology name (unique)',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({
    example: 'nextjs',
    description: 'Icon identifier or URL (e.g., "nextjs" or full URL)',
  })
  @IsOptional()
  @IsString()
  icon?: string;
}
