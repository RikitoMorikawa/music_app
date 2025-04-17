// api/explore/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tracks = await prisma.track.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tracks);
  } catch (error) {
    console.error("トラック取得エラー:", error);
    return NextResponse.json({ error: "トラックの取得に失敗しました" }, { status: 500 });
  }
}
