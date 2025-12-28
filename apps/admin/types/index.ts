import type { components } from "./api";
import type { Technology as PrismaTechnology } from "@ayyaz-dev/database";

// ============ Technology ============
export type CreateTechnologyDto = components["schemas"]["CreateTechnologyDto"];
export type UpdateTechnologyDto = Partial<CreateTechnologyDto>;
export type Technology = Omit<PrismaTechnology, "projects">;

// ============ Skill ============
export type CreateSkillDto = components["schemas"]["CreateSkillDto"];
export type UpdateSkillDto = components["schemas"]["UpdateSkillDto"];

// ============ Experience ============
export type CreateExperienceDto = components["schemas"]["CreateExperienceDto"];
export type UpdateExperienceDto = components["schemas"]["UpdateExperienceDto"];

// ============ Project ============
export type CreateProjectDto = components["schemas"]["CreateProjectDto"];
export type UpdateProjectDto = components["schemas"]["UpdateProjectDto"];

// ============ Auth ============
export type LoginDto = components["schemas"]["LoginDto"];
