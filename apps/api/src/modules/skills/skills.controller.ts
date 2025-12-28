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
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { CreateSkillDto, UpdateSkillDto, SkillCategory, SkillDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { Public } from '../auth/decorators';

/**
 * SkillsController - HTTP endpoints for skill management
 */
@ApiTags('skills')
@Controller('skills')
@UseGuards(JwtAuthGuard)
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  /**
   * Create a new skill
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  create(@Body() createSkillDto: CreateSkillDto): Promise<SkillDto> {
    return this.skillsService.create(createSkillDto);
  }

  /**
   * List all skills
   */
  @Public()
  @Get()
  @ApiQuery({ name: 'category', enum: SkillCategory, required: false })
  findAll(@Query('category') category?: SkillCategory): Promise<SkillDto[]> {
    return this.skillsService.findAll(category);
  }

  /**
   * Get skills grouped by category
   */
  @Public()
  @Get('grouped')
  findGrouped(): Promise<Record<string, SkillDto[]>> {
    return this.skillsService.findGrouped();
  }

  /**
   * Get a skill by ID
   */
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<SkillDto> {
    return this.skillsService.findOne(id);
  }

  /**
   * Update a skill
   */
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto): Promise<SkillDto> {
    return this.skillsService.update(id, updateSkillDto);
  }

  /**
   * Delete a skill
   */
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id') id: string): Promise<SkillDto> {
    return this.skillsService.remove(id);
  }
}
