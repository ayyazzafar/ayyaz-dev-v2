import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTechnologyDto, UpdateTechnologyDto } from './dto';

/**
 * TechnologiesService - Manages technology entries
 *
 * Technologies are used to tag projects with their tech stack.
 * Simpler CRUD compared to projects (no complex relations).
 */
@Injectable()
export class TechnologiesService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Create a new technology
   */
  async create(createTechnologyDto: CreateTechnologyDto) {
    // Check if name already exists (unique constraint)
    const existing = await this.prisma.technology.findUnique({
      where: { name: createTechnologyDto.name },
    });

    if (existing) {
      throw new ConflictException(
        `Technology "${createTechnologyDto.name}" already exists`,
      );
    }

    return this.prisma.technology.create({
      data: createTechnologyDto,
    });
  }

  /**
   * Get all technologies
   */
  async findAll(query: { skip?: number, take?: number } = {}) {
    const { skip = 0, take = 100 } = query;
    const [technologies, total] = await Promise.all([
      this.prisma.technology.findMany({
        orderBy: { name: 'asc' },
        skip,
        take,
      }),
      this.prisma.technology.count(),
    ]);

    return {
      data: technologies,
      meta: {
        total,
        skip,
        take,
        hasMore: total > skip + take,
      },
    };
  }

  /**
   * Get a single technology by ID
   */
  async findOne(id: string) {
    const technology = await this.prisma.technology.findUnique({
      where: { id },
    });

    if (!technology) {
      throw new NotFoundException(`Technology with ID "${id}" not found`);
    }

    return technology;
  }

  /**
   * Update a technology
   */
  async update(id: string, updateTechnologyDto: UpdateTechnologyDto) {
    // Check if exists
    await this.findOne(id);

    // Check for name conflicts if name is being changed
    if (updateTechnologyDto.name) {
      const existing = await this.prisma.technology.findFirst({
        where: {
          name: updateTechnologyDto.name,
          id: { not: id },
        },
      });

      if (existing) {
        throw new ConflictException(
          `Technology "${updateTechnologyDto.name}" already exists`,
        );
      }
    }

    return this.prisma.technology.update({
      where: { id },
      data: updateTechnologyDto,
    });
  }

  /**
   * Delete a technology
   *
   * Note: Cascade delete will remove ProjectTechnology connections
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.technology.delete({
      where: { id },
    });
  }
}
