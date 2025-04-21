// app/api/users/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // すべてのユーザーを取得
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc", // 最新のユーザーから順に取得
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("ユーザーデータの取得に失敗しました:", error);
    return NextResponse.json({ error: "ユーザーデータの取得に失敗しました" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
