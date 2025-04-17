// src/app/api/tracks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuth } from "@/lib/auth/getServerAuth";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    // 認証情報を取得
    const authUser = await getServerAuth();
    if (!authUser) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // フォームデータを取得
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const genre = formData.get("genre") as string;
    const description = (formData.get("description") as string) || "";
    const audioFile = formData.get("audioFile") as File;

    // バリデーション
    if (!title || !audioFile) {
      return NextResponse.json({ error: "タイトルとオーディオファイルは必須です" }, { status: 400 });
    }

    // ファイル名を生成（一意のIDを付与）
    const fileExtension = audioFile.name.split(".").pop();
    const fileName = `tracks/${authUser.id}/${uuidv4()}.${fileExtension}`;

    // Firebase用の情報を返す
    const storageFileName = fileName;

    // データベースにトラック情報を保存
    // 初期状態では仮のURLを保存（後でクライアント側で更新）
    const track = await prisma.track.create({
      data: {
        title,
        description,
        audioUrl: "pending", // 仮のURL
        userId: authUser.id,
      },
    });

    return NextResponse.json({
      success: true,
      track,
      uploadPath: storageFileName,
      genre,
    });
  } catch (error) {
    console.error("トラックアップロードエラー:", error);
    return NextResponse.json({ error: "トラックの保存に失敗しました", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
