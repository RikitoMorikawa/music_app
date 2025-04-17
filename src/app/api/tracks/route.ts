// src/app/api/tracks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { mkdir } from "fs/promises";

export async function POST(request: NextRequest) {
  try {
    // ユーザー認証チェック
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // フォームデータを取得
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || "";
    const audioFile = formData.get("audioFile") as File;

    // バリデーション
    if (!title || !audioFile) {
      return NextResponse.json({ error: "タイトルとオーディオファイルは必須です" }, { status: 400 });
    }

    // Clerkユーザーに関連付けられたMongoDBユーザーを検索
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }

    // ファイル名を生成（一意のIDを付与）
    const fileExtension = audioFile.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    // ディレクトリが存在しない場合は作成
    const uploadDir = join(process.cwd(), "public", "uploads", "audio");
    try {
      await mkdir(uploadDir, { recursive: true });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log("ディレクトリは既に存在します");
    }

    const filePath = join(uploadDir, fileName);

    // バイナリデータを取得
    const audioBuffer = await audioFile.arrayBuffer();

    // ファイルを書き込み
    await writeFile(filePath, Buffer.from(audioBuffer));

    // 相対パスを生成（publicディレクトリからの相対パス）
    const audioUrl = `/uploads/audio/${fileName}`;

    // データベースにトラック情報を保存
    // genreフィールドを削除してエラーを回避
    const track = await prisma.track.create({
      data: {
        title,
        description,
        // genre: genreValue, // この行をいったん削除
        audioUrl,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, track }, { status: 201 });
  } catch (error) {
    console.error("トラックアップロードエラー:", error);
    return NextResponse.json({ error: "トラックのアップロードに失敗しました" }, { status: 500 });
  }
}
