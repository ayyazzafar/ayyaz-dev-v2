import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * UpdateUserDto - For PATCH requests to update a user
 *
 * PartialType is a NestJS utility that:
 * 1. Takes all properties from CreateUserDto
 * 2. Makes them all OPTIONAL
 * 3. Keeps all validation decorators
 *
 * This is perfect for PATCH requests where you only send
 * the fields you want to update.
 *
 * Example: To update just the name, send: { "name": "New Name" }
 * The validation still runs on any field you DO send.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
