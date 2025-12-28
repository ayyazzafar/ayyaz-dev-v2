import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus, ProjectType } from './create-project.dto';
import { ProjectImageDto } from './update-project.dto';

/**
 * ProjectTechnologyDto - Response DTO for project technologies
 */
export class ProjectTechnologyDto {
  @ApiProperty({ description: 'Technology ID' })
  id: string;

  @ApiProperty({ description: 'Technology name' })
  name: string;

  @ApiProperty({ description: 'Icon identifier', nullable: true })
  icon: string | null;
}

/**
 * ProjectDto - Response DTO for a single project
 */
export class ProjectDto {
  @ApiProperty({ description: 'Project ID' })
  id: string;

  @ApiProperty({ description: 'URL-friendly slug' })
  slug: string;

  @ApiProperty({ description: 'Display title' })
  title: string;

  @ApiProperty({ description: 'Short description', nullable: true })
  description: string | null;

  @ApiProperty({ description: 'Full description', nullable: true })
  longDescription: string | null;

  @ApiProperty({ enum: ProjectStatus, description: 'Project status' })
  status: ProjectStatus;

  @ApiProperty({ enum: ProjectType, description: 'Project type' })
  type: ProjectType;

  @ApiProperty({ description: 'Live project URL', nullable: true })
  url: string | null;

  @ApiProperty({ description: 'GitHub repository URL', nullable: true })
  github: string | null;

  @ApiProperty({ description: 'Featured on homepage' })
  featured: boolean;

  @ApiProperty({ description: 'Display order' })
  order: number;

  @ApiProperty({ description: 'When project was started', nullable: true })
  startedAt: Date | null;

  @ApiProperty({ description: 'When project was completed', nullable: true })
  completedAt: Date | null;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;

  @ApiProperty({ type: [ProjectTechnologyDto], description: 'Associated technologies' })
  technologies?: ProjectTechnologyDto[];

  @ApiProperty({ type: [ProjectImageDto], description: 'Project images' })
  images?: ProjectImageDto[];
}
