import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuth } from "@/lib/auth/getServerAuth";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb", // サイズ制限を20MBに引き上げe
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const authUser = await getServerAuth();
    if (!authUser) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // マルチパートフォームデータの解析
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const genre = formData.get("genre") as string;
    const description = formData.get("description") as string;
    const audioFile = formData.get("audioFile") as File;

    // 新しく追加したフィールド
    const bpm = formData.get("bpm") as string;
    const key = formData.get("key") as string;
    const mood = formData.get("mood") as string;
    const instrumentalType = formData.get("instrumentalType") as string;
    const recordLabel = formData.get("recordLabel") as string;
    const releaseDateString = formData.get("releaseDate") as string;

    // バリデーション
    if (!title || !audioFile) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
    }

    // ファイル名を生成（ユーザーIDとタイムスタンプを含める）
    const fileName = `${authUser.id}/${Date.now()}_${audioFile.name}`;

    // トラックをデータベースに保存
    const track = await prisma.track.create({
      data: {
        title,
        genre: genre || null,
        description: description || null,
        userId: authUser.id,
        audioUrl: fileName, // ファイルパスを一時的に保存

        // 新しいフィールドを追加
        bpm: bpm ? parseInt(bpm, 10) : undefined,
        key: key || undefined,
        mood: mood || undefined,
        instrumentalType: instrumentalType || undefined,
        recordLabel: recordLabel || undefined,
        releaseDate: releaseDateString ? new Date(releaseDateString) : undefined,
      },
    });

    return NextResponse.json(
      {
        track,
        uploadPath: fileName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("トラックアップロードエラー:", error);
    return NextResponse.json(
      {
        error: "トラックのアップロードに失敗しました",
      },
      { status: 500 }
    );
  }
}
