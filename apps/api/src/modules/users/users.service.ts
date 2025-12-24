import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, Role } from './dto';

/**
 * UsersService - Business logic for user management
 *
 * KEY NESTJS CONCEPTS:
 *
 * 1. @Injectable() decorator:
 *    - Marks this class for dependency injection
 *    - NestJS will create ONE instance and share it (singleton)
 *
 * 2. Constructor Injection:
 *    - PrismaService is injected via constructor
 *    - NestJS sees the type hint and provides the instance
 *    - This works because PrismaModule is @Global
 *
 * 3. Why inject instead of import?
 *    - Testability: Can mock PrismaService in tests
 *    - Lifecycle: NestJS manages connection lifecycle
 *    - Consistency: Same pattern throughout the app
 */
@Injectable()
export class UsersService {
  /**
   * SALT_ROUNDS - Security parameter for bcrypt
   * Higher = more secure but slower
   * 10 is the recommended default
   */
  private readonly SALT_ROUNDS = 10;

  /**
   * Constructor Injection
   *
   * NestJS automatically provides PrismaService because:
   * 1. PrismaModule is marked @Global
   * 2. PrismaService is exported from PrismaModule
   * 3. PrismaModule is imported in AppModule
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new user
   *
   * Steps:
   * 1. Check if email already exists (unique constraint)
   * 2. Hash the password (NEVER store plain text!)
   * 3. Create user in database
   * 4. Return user WITHOUT the password hash
   */
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.SALT_ROUNDS,
    );

    // Create the user
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
        role: createUserDto.role as Prisma.EnumRoleFieldUpdateOperationsInput['set'],
      },
    });

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Get all users
   *
   * Returns users WITHOUT their password hashes
   * Uses Prisma's `select` to exclude password from query
   */
  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // password: false (omitted = not selected)
      },
    });
  }

  /**
   * Get a single user by ID
   *
   * Throws NotFoundException (404) if user doesn't exist
   */
  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  /**
   * Find user by email - used by auth service
   *
   * INCLUDES password hash (needed for login verification)
   * This method is exported for AuthService to use
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Update a user
   *
   * - Only updates fields that are provided
   * - If password is provided, it gets hashed
   * - If email changes, check for duplicates
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    // First check if user exists
    await this.findOne(id); // Throws NotFoundException if not found

    // If email is being changed, check for duplicates
    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: updateUserDto.email,
          id: { not: id }, // Exclude current user
        },
      });

      if (existingUser) {
        throw new ConflictException('A user with this email already exists');
      }
    }

    // Prepare update data
    const updateData: Prisma.UserUpdateInput = {
      email: updateUserDto.email,
      name: updateUserDto.name,
      role: updateUserDto.role as Prisma.EnumRoleFieldUpdateOperationsInput['set'],
    };

    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(
        updateUserDto.password,
        this.SALT_ROUNDS,
      );
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Return without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Delete a user
   *
   * Returns the deleted user (without password)
   */
  async remove(id: string): Promise<Omit<User, 'password'>> {
    // First check if user exists
    await this.findOne(id); // Throws NotFoundException if not found

    const user = await this.prisma.user.delete({
      where: { id },
    });

    // Return without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Validate password - used by auth service during login
   *
   * Uses bcrypt.compare() which is timing-attack safe
   */
  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
