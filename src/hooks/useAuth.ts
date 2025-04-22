// src/hooks/useAuth.ts
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { fetchAuth } from "@/lib/auth/getClientAuth";
import type { AuthUser } from "@/lib/auth/getServerAuth";

export function useAuth() {
  const { isSignedIn: clerkIsSignedIn, isLoaded: clerkIsLoaded } = useUser();
  const [userData, setUserData] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (clerkIsLoaded) {
      if (clerkIsSignedIn) {
        setIsLoading(true);
        fetchAuth()
          .then((userData) => {
            setUserData(userData);
          })
          .catch((error) => {
            console.error("Failed to fetch user data:", error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setUserData(null);
        setIsLoading(false);
      }
    }
  }, [clerkIsSignedIn, clerkIsLoaded]);

  return {
    userData,
    isLoading,
    isSignedIn: !!setUserData,
  };
}
