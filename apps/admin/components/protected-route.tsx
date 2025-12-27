"use client";

import { useAuthCheck } from "@/hooks/use-auth-check";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isChecking, isAuthenticated } = useAuthCheck();

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
