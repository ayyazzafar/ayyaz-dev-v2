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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new technology' })
  @ApiCreatedResponse({ type: TechnologyDto, description: 'Technology created' })
  create(@Body() createTechnologyDto: CreateTechnologyDto): Promise<TechnologyDto> {
    return this.technologiesService.create(createTechnologyDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all technologies' })
  @ApiOkResponse({ type: TechnologyListResponseDto, description: 'Paginated list of technologies' })
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ): Promise<TechnologyListResponseDto> {
    return this.technologiesService.findAll({ skip: Number(skip), take: Number(take) });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a technology by ID' })
  @ApiOkResponse({ type: TechnologyDto, description: 'Technology details' })
  findOne(@Param('id') id: string): Promise<TechnologyDto> {
    return this.technologiesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a technology' })
  @ApiOkResponse({ type: TechnologyDto, description: 'Technology updated' })
  update(
    @Param('id') id: string,
    @Body() updateTechnologyDto: UpdateTechnologyDto,
  ): Promise<TechnologyDto> {
    return this.technologiesService.update(id, updateTechnologyDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a technology' })
  @ApiOkResponse({ type: TechnologyDto, description: 'Technology deleted' })
  remove(@Param('id') id: string): Promise<TechnologyDto> {
    return this.technologiesService.remove(id);
  }
}
