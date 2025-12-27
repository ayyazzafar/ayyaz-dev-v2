export type Role = "ADMIN" | "VIEWER";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
