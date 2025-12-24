"use client";

import { Refine, AuthProvider as RefineAuthProvider } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import dataProvider from "@refinedev/simple-rest";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { AuthProvider, useAuth } from "@/contexts/auth-context";

// API URL - our NestJS backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Create a custom fetch that adds the JWT token
function createAuthenticatedFetch(token: string | null) {
  return async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };
}

// Wrap the simple-rest data provider to use our authenticated fetch
function createAuthenticatedDataProvider(token: string | null) {
  const customFetch = createAuthenticatedFetch(token);

  // Create the base data provider
  const baseProvider = dataProvider(API_URL);

  // Override methods to use our custom fetch
  return {
    ...baseProvider,
    custom: async ({ url, method, payload, headers }: any) => {
      const response = await customFetch(url, {
        method,
        body: payload ? JSON.stringify(payload) : undefined,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });
      const data = await response.json();
      return { data };
    },
    getList: async (params: any) => {
      const { resource, pagination, sorters, filters } = params;
      const url = new URL(`${API_URL}/${resource}`);

      // Add pagination
      if (pagination) {
        url.searchParams.set("skip", String((pagination.current - 1) * pagination.pageSize));
        url.searchParams.set("take", String(pagination.pageSize));
      }

      const response = await customFetch(url.toString());
      const result = await response.json();

      // Handle both array and paginated response formats
      // Our API returns: { data: [...], meta: { total } }
      if (Array.isArray(result)) {
        return { data: result, total: result.length };
      }

      const items = result.data || result;
      const total = result.meta?.total || result.total || (Array.isArray(items) ? items.length : 0);

      return { data: items, total };
    },
    getOne: async (params: any) => {
      const { resource, id } = params;
      const response = await customFetch(`${API_URL}/${resource}/${id}`);
      const data = await response.json();
      return { data };
    },
    create: async (params: any) => {
      const { resource, variables } = params;
      const response = await customFetch(`${API_URL}/${resource}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(variables),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Create failed");
      }

      const data = await response.json();
      return { data };
    },
    update: async (params: any) => {
      const { resource, id, variables } = params;
      const response = await customFetch(`${API_URL}/${resource}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(variables),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Update failed");
      }

      const data = await response.json();
      return { data };
    },
    deleteOne: async (params: any) => {
      const { resource, id } = params;
      const response = await customFetch(`${API_URL}/${resource}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Delete failed");
      }

      const data = await response.json();
      return { data };
    },
  };
}

// Inner component that has access to auth context
function RefineWithAuth({ children }: { children: React.ReactNode }) {
  const { token, user, isAuthenticated, isLoading, login, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Create memoized data provider with current token
  const authenticatedDataProvider = useMemo(
    () => createAuthenticatedDataProvider(token),
    [token]
  );

  // Refine auth provider
  const authProvider: RefineAuthProvider = useMemo(
    () => ({
      login: async ({ email, password }) => {
        try {
          await login(email, password);
          return { success: true, redirectTo: "/" };
        } catch (error) {
          return {
            success: false,
            error: {
              name: "Login Error",
              message: error instanceof Error ? error.message : "Invalid credentials",
            },
          };
        }
      },
      logout: async () => {
        logout();
        return { success: true, redirectTo: "/login" };
      },
      check: async () => {
        if (token) {
          return { authenticated: true };
        }
        return {
          authenticated: false,
          redirectTo: "/login",
        };
      },
      getIdentity: async () => {
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        }
        return null;
      },
      onError: async (error) => {
        if (error.statusCode === 401) {
          logout();
          return { redirectTo: "/login" };
        }
        return { error };
      },
    }),
    [token, user, login, logout]
  );

  // Redirect to login if not authenticated (except on login page)
  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show login page without layout
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={authenticatedDataProvider}
      authProvider={authProvider}
      resources={[
        {
          name: "projects",
          list: "/projects",
          create: "/projects/create",
          edit: "/projects/edit/:id",
          show: "/projects/show/:id",
          meta: {
            canDelete: true,
          },
        },
        {
          name: "technologies",
          list: "/technologies",
          create: "/technologies/create",
          edit: "/technologies/edit/:id",
          meta: {
            canDelete: true,
          },
        },
        {
          name: "skills",
          list: "/skills",
          create: "/skills/create",
          edit: "/skills/edit/:id",
          meta: {
            canDelete: true,
          },
        },
        {
          name: "experience",
          list: "/experience",
          create: "/experience/create",
          edit: "/experience/edit/:id",
          meta: {
            canDelete: true,
          },
        },
      ]}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
      }}
    >
      <AdminLayout>{children}</AdminLayout>
    </Refine>
  );
}

// Main provider component
export function RefineProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RefineWithAuth>{children}</RefineWithAuth>
    </AuthProvider>
  );
}
