import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ユーザー情報を取得するGETエンドポイント
export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "未認証" }, { status: 401 });
    }

    // Clerkユーザーに紐づくDBユーザーを検索
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    // ユーザーが存在しない場合は空のオブジェクトを返す
    if (!user) {
      return NextResponse.json({});
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("プロフィール取得エラー:", error);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}

// ユーザー情報を更新するPUTエンドポイント
export async function PUT(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "未認証" }, { status: 401 });
    }

    const data = await request.json();

    // 既存ユーザーを検索
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }

    // ユーザー情報を更新
    const updatedUser = await prisma.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        username: data.username,
        bio: data.bio,
        location: data.location,
        website: data.website,
        primaryInstrument: data.primaryInstrument,
        secondaryInstruments: data.secondaryInstruments || [],
        primaryGenre: data.primaryGenre,
        otherGenres: data.otherGenres || [],
        experienceLevel: data.experienceLevel,
        influences: data.influences,
        lookingFor: data.lookingFor,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("プロフィール更新エラー:", error);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}

// 新規ユーザー作成用のPOSTエンドポイント
export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "未認証" }, { status: 401 });
    }

    const data = await request.json();

    // 既存ユーザーがあるか確認
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "ユーザーは既に存在します" }, { status: 400 });
    }

    // 必須項目のバリデーション
    if (!data.username) {
      return NextResponse.json({ error: "ユーザー名は必須です" }, { status: 400 });
    }

    // 新規ユーザーを作成
    const newUser = await prisma.user.create({
      data: {
        clerkId: userId,
        username: data.username,
        bio: data.bio || "",
        location: data.location || "",
        website: data.website || "",
        primaryInstrument: data.primaryInstrument || "",
        secondaryInstruments: data.secondaryInstruments || [],
        primaryGenre: data.primaryGenre || "",
        otherGenres: data.otherGenres || [],
        experienceLevel: data.experienceLevel || "",
        influences: data.influences || "",
        lookingFor: data.lookingFor || "",
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("ユーザー作成エラー:", error);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
