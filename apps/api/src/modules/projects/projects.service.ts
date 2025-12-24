import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  QueryProjectDto,
  ProjectStatus,
  ProjectType,
} from './dto';

/**
 * ProjectsService - Business logic for project management
 *
 * KEY PRISMA CONCEPTS:
 *
 * 1. Include (eager loading):
 *    - include: { technologies: { include: { technology: true } } }
 *    - Fetches related records in single query
 *    - Like Laravel's with() or eager loading
 *
 * 2. Many-to-Many relations:
 *    - Prisma uses explicit join tables (ProjectTechnology)
 *    - We create/delete join records, not direct relations
 *    - connect/disconnect for existing records
 *    - create for new records
 *
 * 3. Nested writes:
 *    - Can create related records in same transaction
 *    - technologies: { create: [...] }
 *
 * 4. Transactions:
 *    - this.prisma.$transaction([...])
 *    - Ensures all or nothing
 */
@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Default include for fetching projects with relations
   * Always include technologies when fetching projects
   */
  private readonly defaultInclude = {
    technologies: {
      include: {
        technology: true, // Get the actual Technology record, not just the join
      },
    },
    images: {
      orderBy: { order: 'asc' as const },
    },
  };

  /**
   * Transform project to flatten technologies
   * Converts { technologies: [{ technology: {...} }] } to { technologies: [...] }
   */
  private transformProject(project: any) {
    if (!project) return project;
    return {
      ...project,
      technologies: project.technologies?.map((pt: any) => pt.technology) || [],
    };
  }

  /**
   * Create a new project
   *
   * Handles:
   * 1. Slug uniqueness check
   * 2. Creating project record
   * 3. Connecting technologies via join table
   */
  async create(createProjectDto: CreateProjectDto) {
    const { technologyIds, ...projectData } = createProjectDto;

    // Check if slug already exists
    const existingProject = await this.prisma.project.findUnique({
      where: { slug: createProjectDto.slug },
    });

    if (existingProject) {
      throw new ConflictException(
        `A project with slug "${createProjectDto.slug}" already exists`,
      );
    }

    // Create project with technology connections
    const project = await this.prisma.project.create({
      data: {
        slug: projectData.slug,
        title: projectData.title,
        description: projectData.description,
        longDescription: projectData.longDescription,
        status: projectData.status,
        type: projectData.type,
        url: projectData.url,
        github: projectData.github,
        featured: projectData.featured,
        order: projectData.order,
        startedAt: projectData.startedAt
          ? new Date(projectData.startedAt)
          : undefined,
        completedAt: projectData.completedAt
          ? new Date(projectData.completedAt)
          : undefined,
        // Create technology connections if provided
        technologies: technologyIds?.length
          ? {
              create: technologyIds.map((techId) => ({
                technology: { connect: { id: techId } },
              })),
            }
          : undefined,
      },
      include: this.defaultInclude,
    });

    return this.transformProject(project);
  }

  /**
   * Get all projects with optional filtering
   */
  async findAll(query: QueryProjectDto) {
    const { status, type, featured, skip = 0, take = 20 } = query;

    // Build where clause dynamically
    const where: Prisma.ProjectWhereInput = {};

    if (status) {
      where.status = status as ProjectStatus;
    }
    if (type) {
      where.type = type as ProjectType;
    }
    // Convert string "true"/"false" to boolean (workaround for query param handling)
    if (featured !== undefined) {
      where.featured = featured === 'true' || featured === '1';
    }

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        include: this.defaultInclude,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        skip,
        take,
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data: projects.map(this.transformProject),
      meta: {
        total,
        skip,
        take,
        hasMore: skip + take < total,
      },
    };
  }

  /**
   * Get a single project by ID
   */
  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: this.defaultInclude,
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    return this.transformProject(project);
  }

  /**
   * Get a single project by slug
   * This is the public-facing lookup
   */
  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: this.defaultInclude,
    });

    if (!project) {
      throw new NotFoundException(`Project "${slug}" not found`);
    }

    return this.transformProject(project);
  }

  /**
   * Update a project
   *
   * For technologies:
   * - Deletes all existing connections
   * - Creates new connections based on provided IDs
   * This is simpler than diffing and more predictable
   */
  async update(id: string, updateProjectDto: UpdateProjectDto) {
    // Check if project exists
    await this.findOne(id);

    const { technologyIds, ...projectData } = updateProjectDto;

    // If slug is being changed, check for conflicts
    if (projectData.slug) {
      const existingProject = await this.prisma.project.findFirst({
        where: {
          slug: projectData.slug,
          id: { not: id },
        },
      });

      if (existingProject) {
        throw new ConflictException(
          `A project with slug "${projectData.slug}" already exists`,
        );
      }
    }

    // Build update data
    const updateData: Prisma.ProjectUpdateInput = {
      ...projectData,
      status: projectData.status as Prisma.EnumProjectStatusFieldUpdateOperationsInput['set'],
      type: projectData.type as Prisma.EnumProjectTypeFieldUpdateOperationsInput['set'],
      startedAt: projectData.startedAt
        ? new Date(projectData.startedAt)
        : undefined,
      completedAt: projectData.completedAt
        ? new Date(projectData.completedAt)
        : undefined,
    };

    // If technologies are being updated, replace all connections
    if (technologyIds !== undefined) {
      // First delete all existing connections
      await this.prisma.projectTechnology.deleteMany({
        where: { projectId: id },
      });

      // Then create new ones (if any)
      if (technologyIds.length > 0) {
        await this.prisma.projectTechnology.createMany({
          data: technologyIds.map((techId) => ({
            projectId: id,
            technologyId: techId,
          })),
        });
      }
    }

    // Update the project itself
    const project = await this.prisma.project.update({
      where: { id },
      data: updateData,
      include: this.defaultInclude,
    });

    return this.transformProject(project);
  }

  /**
   * Delete a project
   *
   * Cascade delete handles:
   * - ProjectTechnology connections (defined in schema)
   * - ProjectImage records (defined in schema)
   */
  async remove(id: string) {
    // Check if project exists
    await this.findOne(id);

    const project = await this.prisma.project.delete({
      where: { id },
      include: this.defaultInclude,
    });

    return this.transformProject(project);
  }

  /**
   * Get featured projects (for homepage)
   */
  async findFeatured() {
    const projects = await this.prisma.project.findMany({
      where: { featured: true },
      include: this.defaultInclude,
      orderBy: { order: 'asc' },
    });

    return projects.map(this.transformProject);
  }
}
