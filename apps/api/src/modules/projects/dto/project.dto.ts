import { ProjectStatus, ProjectType } from './create-project.dto';
import { ProjectImageDto } from './update-project.dto';

/**
 * ProjectTechnologyDto - Response DTO for project technologies
 */
export class ProjectTechnologyDto {
  /** Technology ID */
  id: string;

  /** Technology name */
  name: string;

  /** Icon identifier */
  icon: string | null;
}

/**
 * ProjectDto - Response DTO for a single project
 */
export class ProjectDto {
  /** Project ID */
  id: string;

  /** URL-friendly slug */
  slug: string;

  /** Display title */
  title: string;

  /** Short description */
  description: string | null;

  /** Full description */
  longDescription: string | null;

  /** Project status */
  status: ProjectStatus;

  /** Project type */
  type: ProjectType;

  /** Live project URL */
  url: string | null;

  /** GitHub repository URL */
  github: string | null;

  /** Featured on homepage */
  featured: boolean;

  /** Display order */
  order: number;

  /** When project was started */
  startedAt: Date | null;

  /** When project was completed */
  completedAt: Date | null;

  /** Creation timestamp */
  createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;

  /** Associated technologies */
  technologies?: ProjectTechnologyDto[];

  /** Project images */
  images?: ProjectImageDto[];
}
