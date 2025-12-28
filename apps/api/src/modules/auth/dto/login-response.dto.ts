import { UserResponseDto } from './user-response.dto';

/**
 * LoginResponseDto - Response DTO for successful login
 */
export class LoginResponseDto {
  /** JWT access token */
  access_token: string;

  /** Authenticated user */
  user: UserResponseDto;
}
