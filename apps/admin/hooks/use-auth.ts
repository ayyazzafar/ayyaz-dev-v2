/**
 * Authentication hooks and utilities
 *
 * This module provides:
 * - Token storage utilities (localStorage)
 * - Re-exports of Orval-generated auth hooks
 * - Logout functionality
 */

// Re-export Orval-generated hooks and types
export {
  useAuthControllerLogin,
  useAuthControllerGetMe,
  authControllerLogin,
  authControllerGetMe,
} from "@/lib/api/generated/auth/auth";

export type {
  LoginDto,
  LoginResponseDto,
  UserResponseDto
} from "@/lib/api/schemas";

const TOKEN_KEY = "admin_token";

// Token storage utilities
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// Logout utility
export function useLogout() {
  return () => {
    removeStoredToken();
    window.location.href = "/";
  };
}
