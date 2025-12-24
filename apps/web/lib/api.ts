// API client for ayyaz.dev public website

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Types - matching actual API response
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  longDescription: string | null;
  url: string | null;
  github: string | null;
  status: "ACTIVE" | "COMPLETED" | "PAUSED" | "ARCHIVED";
  type: "PRODUCT" | "CLIENT" | "EXPERIMENT" | "LEARNING";
  featured: boolean;
  order: number;
  technologies: Technology[];
  images: { id: string; url: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Technology {
  id: string;
  name: string;
  icon: string | null;
}

export interface Skill {
  id: string;
  name: string;
  category: "FRONTEND" | "BACKEND" | "DATABASE" | "DEVOPS" | "TOOLS" | "AI";
  level: number;
  order: number;
}

export interface GroupedSkills {
  [category: string]: Skill[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  order: number;
}

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
export async function getProjects() {
  const result = await fetchAPI<{ data: Project[]; meta: { total: number } }>(
    "/projects"
  );
  // Filter to only show ACTIVE and COMPLETED projects
  return result.data.filter(
    (p) => p.status === "ACTIVE" || p.status === "COMPLETED"
  );
}

export async function getFeaturedProjects() {
  const result = await fetchAPI<Project[]>("/projects/featured");
  return result;
}

export async function getProjectBySlug(slug: string) {
  const result = await fetchAPI<Project>(`/projects/slug/${slug}`);
  return result;
}

// Skills
export async function getSkillsGrouped() {
  const result = await fetchAPI<GroupedSkills>("/skills/grouped");
  return result;
}

// Experience
export async function getExperience() {
  const result = await fetchAPI<Experience[]>("/experience");
  return result;
}

// Technologies
export async function getTechnologies() {
  const result = await fetchAPI<{ data: Technology[]; meta: { total: number } }>(
    "/technologies"
  );
  return result.data;
}
