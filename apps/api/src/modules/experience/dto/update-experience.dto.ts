import { PartialType } from '@nestjs/swagger';
import { CreateExperienceDto } from './create-experience.dto';

/**
 * UpdateExperienceDto - Partial update for experience
 */
export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {}
