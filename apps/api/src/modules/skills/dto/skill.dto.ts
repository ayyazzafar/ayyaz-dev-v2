/**
 * SkillDto - Response DTO for a single skill
 */
export class SkillDto {
  /** Skill ID */
  id: string;

  /** Skill name */
  name: string;

  /** Skill category for grouping */
  category: string;

  /** Proficiency level (0-100) */
  level: number;

  /** Display order (lower = first) */
  order: number;
}
