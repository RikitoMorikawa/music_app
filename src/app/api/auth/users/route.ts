// src/app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuth } from "@/lib/auth/getServerAuth";

export async function GET() {
  try {
    // 現在のユーザーを取得
    const currentUser = await getServerAuth();
    const currentUserDbId = currentUser?.id; // MongoDBの_idを使用

    // ユーザー一覧を取得（現在のユーザーを除外）
    const users = await prisma.user.findMany({
      where: {
        // MongoDBの_idでフィルタリング
        id: {
          not: currentUserDbId,
        },
      },
      select: {
        id: true,
        clerkId: true,
        username: true,
        name: true,
        bio: true,
        location: true,
        imageUrl: true,
        primaryInstrument: true,
        secondaryInstruments: true,
        primaryGenre: true,
        otherGenres: true,
        experienceLevel: true,
        influences: true,
        lookingFor: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("ユーザー一覧取得エラー:", error);
    return NextResponse.json({ error: "ユーザー情報の取得に失敗しました" }, { status: 500 });
  }
}
