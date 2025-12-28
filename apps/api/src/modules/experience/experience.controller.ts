import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto, UpdateExperienceDto, ExperienceDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { Public } from '../auth/decorators';

/**
 * ExperienceController - HTTP endpoints for work experience
 */
@ApiTags('experience')
@Controller('experience')
@UseGuards(JwtAuthGuard)
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  /**
   * Create a new experience entry
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  create(@Body() createExperienceDto: CreateExperienceDto): Promise<ExperienceDto> {
    return this.experienceService.create(createExperienceDto);
  }

  /**
   * List all work experience
   */
  @Public()
  @Get()
  findAll(): Promise<ExperienceDto[]> {
    return this.experienceService.findAll();
  }

  /**
   * Get an experience entry by ID
   */
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ExperienceDto> {
    return this.experienceService.findOne(id);
  }

  /**
   * Update an experience entry
   */
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  update(
    @Param('id') id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ): Promise<ExperienceDto> {
    return this.experienceService.update(id, updateExperienceDto);
  }

  /**
   * Delete an experience entry
   */
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id') id: string): Promise<ExperienceDto> {
    return this.experienceService.remove(id);
  }
}
