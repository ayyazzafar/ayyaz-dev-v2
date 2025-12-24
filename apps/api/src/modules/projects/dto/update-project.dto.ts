import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsUrl, IsArray, ValidateNested, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProjectDto } from './create-project.dto';

/**
 * ProjectImageDto - Represents an image in the images array
 */
export class ProjectImageDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  url: string;

  @IsOptional()
  @IsString()
  alt?: string;

  @IsNumber()
  order: number;
}

/**
 * UpdateProjectDto - For PATCH requests
 *
 * PartialType makes all fields optional while keeping validation.
 * Only send the fields you want to update.
 *
 * Example: To just update the title:
 * PATCH /api/projects/spendnest
 * { "title": "New Title" }
 */
export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  /**
   * Image URL to set as the project's cover image (legacy single image)
   * This will replace any existing images
   * @example "https://pub-xxx.r2.dev/projects/image.jpg"
   */
  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;

  /**
   * Array of images for the project
   * This will replace all existing images with the new set
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectImageDto)
  images?: ProjectImageDto[];
}
