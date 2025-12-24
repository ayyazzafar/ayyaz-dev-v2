import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';

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
export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
