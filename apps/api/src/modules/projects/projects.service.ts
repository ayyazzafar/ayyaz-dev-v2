import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { FileUploadService } from '@ayyaz-dev/file-upload/server';
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
  private readonly logger = new Logger(ProjectsService.name);
  private readonly r2PublicUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly fileUploadService: FileUploadService,
    private readonly configService: ConfigService,
  ) {
    this.r2PublicUrl = this.configService.getOrThrow<string>('R2_PUBLIC_URL');
  }

  /**
   * Extract R2 storage key from a public URL
   *
   * @example
   * // publicUrl: https://media.ayyaz.dev
   * // imageUrl: https://media.ayyaz.dev/uploads/abc123.jpg
   * // returns: uploads/abc123.jpg
   */
  private extractKeyFromUrl(imageUrl: string): string | null {
    if (!imageUrl.startsWith(this.r2PublicUrl)) {
      return null; // Not an R2 URL, skip
    }
    // Remove the public URL prefix and leading slash
    const key = imageUrl.replace(this.r2PublicUrl, '').replace(/^\//, '');
    return key || null;
  }

  /**
   * Delete multiple files from R2 storage
   * Logs errors but doesn't throw (cleanup shouldn't block the main operation)
   */
  private async deleteFilesFromStorage(urls: string[]): Promise<void> {
    const deletePromises = urls.map(async (url) => {
      const key = this.extractKeyFromUrl(url);
      if (key) {
        try {
          await this.fileUploadService.deleteFile(key);
          this.logger.log(`Deleted file from R2: ${key}`);
        } catch (error) {
          // Log but don't throw - cleanup failure shouldn't block the operation
          this.logger.warn(`Failed to delete file from R2: ${key}`, error);
        }
      }
    });

    await Promise.all(deletePromises);
  }

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
    const { technologyIds, images, ...projectData } = createProjectDto;

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
        // Create images if provided
        images: images?.length
          ? {
              create: images.map((img, index) => ({
                url: img.url,
                alt: img.alt || null,
                order: img.order ?? index,
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
   *
   * For images:
   * - If imageUrl is provided, replaces all existing images
   */
  async update(id: string, updateProjectDto: UpdateProjectDto) {
    // Check if project exists
    await this.findOne(id);

    const { technologyIds, images, ...projectData } = updateProjectDto;

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

    // If images array is provided, replace all existing images
    if (images !== undefined) {
      // Get existing images to clean up from R2
      const existingImages = await this.prisma.projectImage.findMany({
        where: { projectId: id },
        select: { url: true },
      });

      // Find images that are being removed (not in the new array)
      const newImageUrls = new Set(images.map((img) => img.url));
      const urlsToDelete = existingImages
        .map((img) => img.url)
        .filter((url) => !newImageUrls.has(url));

      // Delete removed images from R2 storage (non-blocking)
      if (urlsToDelete.length > 0) {
        this.deleteFilesFromStorage(urlsToDelete).catch((err) =>
          this.logger.warn('R2 cleanup failed during project update', err),
        );
      }

      // Delete existing images from database
      await this.prisma.projectImage.deleteMany({
        where: { projectId: id },
      });

      // Create new images if array has items
      if (images.length > 0) {
        await this.prisma.projectImage.createMany({
          data: images.map((img, index) => ({
            url: img.url,
            alt: img.alt || null,
            order: img.order ?? index,
            projectId: id,
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
   *
   * Also cleans up images from R2 storage
   */
  async remove(id: string) {
    // Check if project exists and get images for R2 cleanup
    const existingProject = await this.prisma.project.findUnique({
      where: { id },
      include: { images: { select: { url: true } } },
    });

    if (!existingProject) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    // Delete project (cascade deletes images from database)
    const project = await this.prisma.project.delete({
      where: { id },
      include: this.defaultInclude,
    });

    // Cleanup R2 storage (non-blocking)
    if (existingProject.images.length > 0) {
      const urlsToDelete = existingProject.images.map((img) => img.url);
      this.deleteFilesFromStorage(urlsToDelete).catch((err) =>
        this.logger.warn('R2 cleanup failed during project deletion', err),
      );
    }

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
