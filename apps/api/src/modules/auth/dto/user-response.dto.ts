/**
 * UserResponseDto - Response DTO for user data (excludes password)
 */
export class UserResponseDto {
  /** User ID */
  id: string;

  /** User email */
  email: string;

  /** User name */
  name: string | null;

  /** User role */
  role: 'ADMIN' | 'VIEWER';
}
