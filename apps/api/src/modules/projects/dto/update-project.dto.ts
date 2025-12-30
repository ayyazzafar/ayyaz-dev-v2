import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsArray, ValidateNested, IsString, IsNumber, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProjectDto } from './create-project.dto';

/**
 * ProjectImageDto - Represents an image in the images array (with optional id for updates)
 */
export class ProjectImageDto {
  @ApiPropertyOptional({
    example: 'image-id-123',
    description: 'Image ID (for existing images)',
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({
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

  @ApiPropertyOptional({
    example: 0,
    description: 'Display order (lower = first)',
  })
  @IsNumber()
  order: number;
}

/**
 * UpdateProjectDto - For PATCH requests
 *
 * PartialType makes all fields optional while keeping validation.
 * Only send the fields you want to update.
 */
export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiPropertyOptional({
    description: 'Array of images for the project (replaces all existing images)',
    type: [ProjectImageDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectImageDto)
  images?: ProjectImageDto[];
}
