import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, QueryProjectDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { Public } from '../auth/decorators';

/**
 * NEW SWAGGER IMPORTS EXPLAINED:
 *
 * @ApiTags('projects'):
 *   - Groups endpoints under "projects" section in Swagger UI
 *   - Makes docs organized and navigable
 *
 * @ApiBearerAuth('JWT-auth'):
 *   - Marks endpoint as requiring JWT authentication
 *   - 'JWT-auth' must match the name in DocumentBuilder.addBearerAuth()
 *   - Shows a lock icon in Swagger UI
 *
 * @ApiOperation({ summary: '...' }):
 *   - Short description shown next to endpoint
 *   - More visible than JSDoc comments in the UI
 */

/**
 * ProjectsController - HTTP endpoints for project management
 *
 * ROUTE DESIGN:
 *
 * Public (no auth required):
 * - GET /projects - List projects (with filtering)
 * - GET /projects/featured - Featured projects only
 * - GET /projects/:idOrSlug - Get single project
 *
 * Protected (JWT required):
 * - POST /projects - Create project
 * - PATCH /projects/:id - Update project
 * - DELETE /projects/:id - Delete project
 *
 * WHY BOTH ID AND SLUG?
 * - Slug: User-friendly URLs (/projects/spendnest)
 * - ID: Reliable for admin operations (slugs can change)
 */
@ApiTags('projects')                    // Group in Swagger UI
@Controller('projects')
@UseGuards(JwtAuthGuard)                // All routes require auth by default
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * POST /api/projects - Create a new project
   *
   * Requires authentication.
   * Request body validated against CreateProjectDto.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')  // Shows lock icon, requires auth
  @ApiOperation({ summary: 'Create a new project' })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  /**
   * GET /api/projects - List all projects with filtering
   *
   * Public endpoint (no auth required).
   * Supports query params for filtering and pagination.
   *
   * @example GET /api/projects?status=ACTIVE&type=PRODUCT&take=5
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'List all projects with optional filters' })
  findAll(@Query() query: QueryProjectDto) {
    return this.projectsService.findAll(query);
  }

  /**
   * GET /api/projects/featured - Get featured projects
   *
   * Public endpoint for homepage display.
   * Returns only projects where featured=true.
   */
  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Get featured projects for homepage' })
  findFeatured() {
    return this.projectsService.findFeatured();
  }

  /**
   * GET /api/projects/:idOrSlug - Get a single project
   *
   * Public endpoint.
   * Accepts either ID or slug:
   * - /api/projects/clx123abc (ID)
   * - /api/projects/spendnest (slug)
   *
   * Tries slug first (more common in public), falls back to ID.
   */
  @Public()
  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get a project by ID or slug' })
  async findOne(@Param('idOrSlug') idOrSlug: string) {
    // Try slug first (more common for public access)
    try {
      return await this.projectsService.findBySlug(idOrSlug);
    } catch {
      // If not found by slug, try ID
      return this.projectsService.findOne(idOrSlug);
    }
  }

  /**
   * PATCH /api/projects/:id - Update a project
   *
   * Requires authentication.
   * Uses ID (not slug) for reliable updates.
   */
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a project' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  /**
   * DELETE /api/projects/:id - Delete a project
   *
   * Requires authentication.
   * Cascade deletes related records (technologies, images).
   */
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a project' })
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
