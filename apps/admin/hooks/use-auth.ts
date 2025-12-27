import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LoginRequest, LoginResponse, User } from "@/types/auth";

const TOKEN_KEY = "admin_token";

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

async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  return api<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

async function getMeApi(token: string): Promise<User> {
  return api<User>("/auth/me", { token });
}

export function useLogin() {
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setStoredToken(data.access_token);
    },
  });
}

export function useGetMe() {
  return useMutation({
    mutationFn: () => {
      const token = getStoredToken();
      if (!token) throw new Error("No token");
      return getMeApi(token);
    },
  });
}

export function useLogout() {
  return () => {
    removeStoredToken();
    window.location.href = "/";
  };
}
