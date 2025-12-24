import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto, UpdateExperienceDto } from './dto';

/**
 * ExperienceService - Manages work experience entries
 */
@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new experience entry
   */
  async create(createExperienceDto: CreateExperienceDto) {
    return this.prisma.experience.create({
      data: {
        company: createExperienceDto.company,
        role: createExperienceDto.role,
        description: createExperienceDto.description,
        startDate: new Date(createExperienceDto.startDate),
        endDate: createExperienceDto.endDate
          ? new Date(createExperienceDto.endDate)
          : null,
        current: createExperienceDto.current ?? false,
        order: createExperienceDto.order ?? 0,
      },
    });
  }

  /**
   * Get all experience entries (ordered by date, most recent first)
   */
  async findAll() {
    return this.prisma.experience.findMany({
      orderBy: [{ order: 'asc' }, { startDate: 'desc' }],
    });
  }

  /**
   * Get a single experience by ID
   */
  async findOne(id: string) {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      throw new NotFoundException(`Experience with ID "${id}" not found`);
    }

    return experience;
  }

  /**
   * Update an experience entry
   */
  async update(id: string, updateExperienceDto: UpdateExperienceDto) {
    await this.findOne(id); // Check exists

    const data: any = { ...updateExperienceDto };

    // Convert date strings to Date objects
    if (updateExperienceDto.startDate) {
      data.startDate = new Date(updateExperienceDto.startDate);
    }
    if (updateExperienceDto.endDate !== undefined) {
      data.endDate = updateExperienceDto.endDate
        ? new Date(updateExperienceDto.endDate)
        : null;
    }

    return this.prisma.experience.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete an experience entry
   */
  async remove(id: string) {
    await this.findOne(id); // Check exists

    return this.prisma.experience.delete({
      where: { id },
    });
  }
}
