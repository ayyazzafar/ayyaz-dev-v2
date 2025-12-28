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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, QueryProjectDto, ProjectDto, ProjectListResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { Public } from '../auth/decorators';

/**
 * ProjectsController - HTTP endpoints for project management
 */
@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * Create a new project
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  create(@Body() createProjectDto: CreateProjectDto): Promise<ProjectDto> {
    return this.projectsService.create(createProjectDto);
  }

  /**
   * List all projects with optional filters
   */
  @Public()
  @Get()
  findAll(@Query() query: QueryProjectDto): Promise<ProjectListResponseDto> {
    return this.projectsService.findAll(query);
  }

  /**
   * Get featured projects for homepage
   */
  @Public()
  @Get('featured')
  findFeatured(): Promise<ProjectDto[]> {
    return this.projectsService.findFeatured();
  }

  /**
   * Get a project by ID or slug
   */
  @Public()
  @Get(':idOrSlug')
  async findOne(@Param('idOrSlug') idOrSlug: string): Promise<ProjectDto> {
    try {
      return await this.projectsService.findBySlug(idOrSlug);
    } catch {
      return this.projectsService.findOne(idOrSlug);
    }
  }

  /**
   * Update a project
   */
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto): Promise<ProjectDto> {
    return this.projectsService.update(id, updateProjectDto);
  }

  /**
   * Delete a project
   */
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id') id: string): Promise<ProjectDto> {
    return this.projectsService.remove(id);
  }
}
