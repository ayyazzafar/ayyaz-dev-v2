import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkillDto, UpdateSkillDto, SkillCategory } from './dto';

/**
 * SkillsService - Manages skill entries for portfolio
 *
 * Skills show expertise areas grouped by category.
 */
@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new skill
   */
  async create(createSkillDto: CreateSkillDto) {
    return this.prisma.skill.create({
      data: {
        name: createSkillDto.name,
        category: createSkillDto.category as SkillCategory,
        level: createSkillDto.level ?? 80,
        order: createSkillDto.order ?? 0,
      },
    });
  }

  /**
   * Get all skills, optionally filtered by category
   */
  async findAll(category?: SkillCategory) {
    const where = category ? { category } : {};

    return this.prisma.skill.findMany({
      where,
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    });
  }

  /**
   * Get skills grouped by category (for frontend display)
   */
  async findGrouped() {
    const skills = await this.prisma.skill.findMany({
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });

    // Group by category
    const grouped: Record<string, typeof skills> = {};
    for (const skill of skills) {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    }

    return grouped;
  }

  /**
   * Get a single skill by ID
   */
  async findOne(id: string) {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
    });

    if (!skill) {
      throw new NotFoundException(`Skill with ID "${id}" not found`);
    }

    return skill;
  }

  /**
   * Update a skill
   */
  async update(id: string, updateSkillDto: UpdateSkillDto) {
    await this.findOne(id); // Check exists

    return this.prisma.skill.update({
      where: { id },
      data: updateSkillDto,
    });
  }

  /**
   * Delete a skill
   */
  async remove(id: string) {
    await this.findOne(id); // Check exists

    return this.prisma.skill.delete({
      where: { id },
    });
  }
}
