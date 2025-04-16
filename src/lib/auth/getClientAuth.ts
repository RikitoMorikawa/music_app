// src/lib/auth/getClientAuth.ts
"use client";

import { AuthUser } from "./getServerAuth";

export async function fetchAuth(): Promise<AuthUser | null> {
  try {
    const response = await fetch("/api/auth/me");
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching auth:", error);
    return null;
  }
}
