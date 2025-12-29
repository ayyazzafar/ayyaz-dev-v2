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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TechnologiesService } from './technologies.service';
import { CreateTechnologyDto, UpdateTechnologyDto, TechnologyDto, TechnologyListResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { Public } from '../auth/decorators';

/**
 * TechnologiesController - HTTP endpoints for technology management
 *
 * Public:
 * - GET /technologies - List all (for displaying on frontend)
 *
 * Protected:
 * - POST/PATCH/DELETE - Admin only
 */
@ApiTags('technologies')
@Controller('technologies')
@UseGuards(JwtAuthGuard)
export class TechnologiesController {
  constructor(private readonly technologiesService: TechnologiesService) { }

  /**
   * Create a new technology
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  create(@Body() createTechnologyDto: CreateTechnologyDto): Promise<TechnologyDto> {
    return this.technologiesService.create(createTechnologyDto);
  }

  /**
   * List all technologies
   */
  @Public()
  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ): Promise<TechnologyListResponseDto> {
    return this.technologiesService.findAll({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });
  }

  /**
   * Get a technology by ID
   */
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<TechnologyDto> {
    return this.technologiesService.findOne(id);
  }

  /**
   * Update a technology
   */
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  update(
    @Param('id') id: string,
    @Body() updateTechnologyDto: UpdateTechnologyDto,
  ): Promise<TechnologyDto> {
    return this.technologiesService.update(id, updateTechnologyDto);
  }

  /**
   * Delete a technology
   */
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id') id: string): Promise<TechnologyDto> {
    return this.technologiesService.remove(id);
  }
}
