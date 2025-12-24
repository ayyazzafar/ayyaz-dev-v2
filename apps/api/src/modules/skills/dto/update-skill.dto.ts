import { PartialType } from '@nestjs/swagger';
import { CreateSkillDto } from './create-skill.dto';

/**
 * UpdateSkillDto - Partial update for skills
 *
 * All fields optional - only send what you want to change.
 */
export class UpdateSkillDto extends PartialType(CreateSkillDto) {}
