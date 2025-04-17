// src/app/api/tracks/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuth } from "@/lib/auth/getServerAuth";

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  try {
    const authUser = await getServerAuth();
    if (!authUser) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { id } = context.params;
    const { audioUrl } = await request.json();

    // トラックが存在し、ユーザーが所有者であることを確認
    const existingTrack = await prisma.track.findFirst({
      where: {
        id,
        userId: authUser.id,
      },
    });

    if (!existingTrack) {
      return NextResponse.json({ error: "トラックが見つからないか、編集権限がありません" }, { status: 404 });
    }

    // トラックを更新
    const updatedTrack = await prisma.track.update({
      where: { id },
      data: { audioUrl },
    });

    return NextResponse.json({ success: true, track: updatedTrack });
  } catch (error) {
    console.error("トラック更新エラー:", error);
    return NextResponse.json({ error: "トラックの更新に失敗しました" }, { status: 500 });
  }
}