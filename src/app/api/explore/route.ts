import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("トラック取得処理を開始します");

    // データベース接続の確認
    try {
      await prisma.$connect();
      console.log("データベース接続成功");
    } catch (connectionError) {
      console.error("データベース接続エラー:", connectionError);
      return NextResponse.json({ error: "データベース接続に失敗しました", details: connectionError }, { status: 500 });
    }

    // トラックを取得
    let tracks;
    try {
      tracks = await prisma.track.findMany({
        take: 50,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          audioUrl: true,
          userId: true,
          createdAt: true,
        },
      });
      console.log("取得したトラック数:", tracks.length);
    } catch (findError) {
      console.error("トラック検索エラー:", findError);
      return NextResponse.json(
        {
          error: "トラックの取得に失敗しました",
          details: findError instanceof Error ? findError.message : findError,
        },
        { status: 500 }
      );
    }

    // トラックが存在しない場合の処理
    if (tracks.length === 0) {
      console.warn("トラックが見つかりませんでした");
      return NextResponse.json([], { status: 204 }); // No Content
    }

    return NextResponse.json(tracks);
  } catch (error) {
    console.error("予期せぬエラー:", error);
    return NextResponse.json(
      {
        error: "トラックの取得中に予期せぬエラーが発生しました",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  } finally {
    // データベース接続を閉じる
    await prisma.$disconnect();
  }
}
