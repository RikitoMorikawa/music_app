// src/app/api/upload-url/route.ts
// Firebase Storageへの直接アップロードではなく、署名付きURLを生成するAPI
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { filename } = await request.json();
    const fileExtension = filename.split(".").pop();
    // 一意のファイル名を生成
    const uniqueFileName = `tracks/${userId}/${uuidv4()}.${fileExtension}`;

    // ここでFirebase Admin SDKを使用して署名付きURLを生成することもできますが、
    // 簡易版として、クライアント側でのアップロード方法を提供します
    return NextResponse.json({
      uploadPath: uniqueFileName,
      userId,
    });
  } catch (error) {
    console.error("URLの生成エラー:", error);
    return NextResponse.json({ error: "アップロードURLの生成に失敗しました" }, { status: 500 });
  }
}
