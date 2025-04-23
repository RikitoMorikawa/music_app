// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { getServerAuth } from "@/lib/auth/getServerAuth";

// src/app/api/auth/me/route.ts
export async function GET() {
  try {
    console.log("GET /api/auth/me 開始");
    const user = await getServerAuth();

    if (!user) {
      console.log("ユーザー認証失敗: 401 Unauthorized");
      return NextResponse.json(null, { status: 401 });
    }

    console.log("ユーザー認証成功:", user.id);
    return NextResponse.json(user);
  } catch (error) {
    console.error("認証API内でエラー発生:", error);
    // エラーの詳細情報
    const errorDetail = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : String(error);
    
    console.error("エラー詳細:", errorDetail);
    
    return NextResponse.json(
      { error: "認証処理中にエラーが発生しました", details: typeof errorDetail === 'object' ? errorDetail.message : errorDetail }, 
      { status: 500 }
    );
  }
}