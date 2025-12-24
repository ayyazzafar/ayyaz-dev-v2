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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { CreateSkillDto, UpdateSkillDto, SkillCategory } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { Public } from '../auth/decorators';

/**
 * SkillsController - HTTP endpoints for skill management
 *
 * Public:
 * - GET /skills - List all skills
 * - GET /skills/grouped - Skills grouped by category
 *
 * Protected:
 * - POST/PATCH/DELETE - Admin only
 */
@ApiTags('skills')
@Controller('skills')
@UseGuards(JwtAuthGuard)
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new skill' })
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all skills' })
  @ApiQuery({ name: 'category', enum: SkillCategory, required: false })
  findAll(@Query('category') category?: SkillCategory) {
    return this.skillsService.findAll(category);
  }

  @Public()
  @Get('grouped')
  @ApiOperation({ summary: 'Get skills grouped by category' })
  findGrouped() {
    return this.skillsService.findGrouped();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a skill by ID' })
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a skill' })
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a skill' })
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }
}
