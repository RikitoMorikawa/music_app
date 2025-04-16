// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { getServerAuth } from "@/lib/auth/getServerAuth";

export async function GET() {
  try {
    const user = await getServerAuth();

    if (!user) {
      return NextResponse.json(null, { status: 401 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in auth API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
