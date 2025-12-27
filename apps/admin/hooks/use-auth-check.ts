"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredToken } from "./use-auth";

export function useAuthCheck() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getStoredToken();

    if (!token) {
      router.replace("/");
      return;
    }

    setIsAuthenticated(true);
    setIsChecking(false);
  }, [router]);

  return { isChecking, isAuthenticated };
}
