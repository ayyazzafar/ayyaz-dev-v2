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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';

/**
 * UsersController - HTTP endpoint handlers for user management
 *
 * KEY NESTJS CONCEPTS:
 *
 * 1. @Controller('users'):
 *    - Base route = /api/users (with our global /api prefix)
 *    - All methods in this class are relative to this base
 *
 * 2. HTTP Method Decorators:
 *    - @Get() → GET /api/users
 *    - @Post() → POST /api/users
 *    - @Get(':id') → GET /api/users/:id
 *    - @Patch(':id') → PATCH /api/users/:id
 *    - @Delete(':id') → DELETE /api/users/:id
 *
 * 3. Parameter Decorators:
 *    - @Body() → request body (automatically validated by DTO)
 *    - @Param('id') → URL parameter
 *
 * 4. Dependency Injection:
 *    - UsersService is injected via constructor
 *    - NestJS automatically creates and injects it
 */
@Controller('users')
export class UsersController {
  /**
   * Constructor Injection
   *
   * NestJS sees `private readonly usersService: UsersService`
   * and automatically:
   * 1. Creates an instance of UsersService (or uses existing singleton)
   * 2. Passes it to this constructor
   *
   * This is called "Dependency Injection" (DI)
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /api/users - Create a new user
   *
   * Request body is automatically validated against CreateUserDto
   * If validation fails, NestJS returns 400 Bad Request
   *
   * @example
   * POST /api/users
   * Body: { "email": "test@test.com", "password": "password123", "name": "Test" }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // Returns 201 instead of default 200
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /api/users - Get all users
   *
   * Returns array of users (without passwords)
   *
   * @example
   * GET /api/users
   * Response: [{ id: "...", email: "...", name: "...", role: "ADMIN" }]
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * GET /api/users/:id - Get a single user by ID
   *
   * @Param('id') extracts the :id from the URL
   *
   * @example
   * GET /api/users/clx123abc
   * Response: { id: "clx123abc", email: "...", name: "..." }
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /api/users/:id - Update a user
   *
   * PATCH = partial update (only send fields you want to change)
   * PUT = full replacement (must send all fields)
   *
   * We use PATCH because it's more practical for updates
   *
   * @example
   * PATCH /api/users/clx123abc
   * Body: { "name": "New Name" }
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * DELETE /api/users/:id - Delete a user
   *
   * Returns the deleted user data
   *
   * @example
   * DELETE /api/users/clx123abc
   * Response: { id: "clx123abc", email: "...", ... }
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
