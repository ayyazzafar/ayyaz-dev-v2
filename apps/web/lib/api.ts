// API client for ayyaz.dev public website
// Types are imported from the shared @ayyaz-dev/api-client package

import type {
  ProjectDto,
  ProjectListResponseDto,
  SkillDto,
  ExperienceDto,
  TechnologyDto,
} from "@ayyaz-dev/api-client";

// Re-export types for convenience
export type { ProjectDto, SkillDto, ExperienceDto, TechnologyDto };

// Type alias for grouped skills (API returns { [category]: SkillDto[] })
export type GroupedSkills = Record<string, SkillDto[]>;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// API fetch functions
async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    next: { revalidate: 60 }, // Cache for 1 minute
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// Projects
export async function getProjects(): Promise<ProjectDto[]> {
  const result = await fetchAPI<ProjectListResponseDto>("/projects");
  // Filter to only show ACTIVE and COMPLETED projects
  return result.data.filter(
    (p) => p.status === "ACTIVE" || p.status === "COMPLETED"
  );
}

export async function getFeaturedProjects(): Promise<ProjectDto[]> {
  return fetchAPI<ProjectDto[]>("/projects/featured");
}

export async function getProjectBySlug(slug: string): Promise<ProjectDto> {
  return fetchAPI<ProjectDto>(`/projects/${slug}`);
}

// Skills
export async function getSkillsGrouped(): Promise<GroupedSkills> {
  return fetchAPI<GroupedSkills>("/skills/grouped");
}

// Experience
export async function getExperience(): Promise<ExperienceDto[]> {
  return fetchAPI<ExperienceDto[]>("/experience");
}

// Technologies
export async function getTechnologies(): Promise<TechnologyDto[]> {
  const result = await fetchAPI<{ data: TechnologyDto[]; meta: { total: number } }>(
    "/technologies"
  );
  return result.data;
}
