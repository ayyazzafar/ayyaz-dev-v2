"use client";

import type { AuthProvider } from "@refinedev/core";
import Cookies from "js-cookie";

const API_URL = "http://localhost:4000/api";
export const authProviderClient: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: {
            name: "LoginError",
            message: error.message || "Invalid email or password",
          },
        };
      }

      const data = await response.json();

      // Store token and user in cookies
      Cookies.set("token", data.access_token, {
        expires: 7, // 7 days
        path: "/",
      });
      Cookies.set("user", JSON.stringify(data.user), {
        expires: 7,
        path: "/",
      });

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "An error occurred during login",
        },
      };
    }
  },
  logout: async () => {
    Cookies.remove("token", { path: "/" });
    Cookies.remove("user", { path: "/" });
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = Cookies.get("token");
    if (!token) {
      return {
        authenticated: false,
        logout: true,
        redirectTo: "/login",
      };
    }

    // Optionally verify token is still valid by calling /me
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token is invalid or expired
        Cookies.remove("token", { path: "/" });
        Cookies.remove("user", { path: "/" });
        return {
          authenticated: false,
          logout: true,
          redirectTo: "/login",
        };
      }

      return {
        authenticated: true,
      };
    } catch {
      return {
        authenticated: false,
        logout: true,
        redirectTo: "/login",
      };
    }
  },
  getPermissions: async () => {
    const user = Cookies.get("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.role;
    }
    return null;
  },
  getIdentity: async () => {
    const user = Cookies.get("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      return {
        id: parsedUser.id,
        name: parsedUser.name || parsedUser.email,
        email: parsedUser.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(parsedUser.name || parsedUser.email)}`,
      };
    }
    return null;
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }
    return { error };
  },
};
