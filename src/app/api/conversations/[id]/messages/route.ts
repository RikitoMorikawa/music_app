import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuth } from "@/lib/auth/getServerAuth";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 認証確認
    const currentUser = await getServerAuth();

    if (!currentUser) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const conversationId = params.id;
    console.log("conversationId", conversationId);

    // 入力検証 - 無効なIDフォーマットを処理
    if (!conversationId || typeof conversationId !== "string") {
      return NextResponse.json({ error: "無効な会話ID" }, { status: 400 });
    }

    // 会話の存在と権限確認
    try {
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          participantIds: {
            has: currentUser.id,
          },
        },
      });

      if (!conversation) {
        return NextResponse.json({ error: "会話が見つからないか、アクセス権がありません" }, { status: 404 });
      }



const messages = await prisma.message.findMany({
  where: {
    conversationId,
  },
  orderBy: {
    createdAt: "asc",
  },
  select: {
    id: true,
    conversationId: true,
    senderId: true,
    content: true,
    createdAt: true,
    sender: {
      select: {
        id: true,
        username: true,
        name: true,
        imageUrl: true,
      },
    },
  },
});

      if (!messages || messages.length === 0) {
        return NextResponse.json({ error: "メッセージが見つかりません" }, { status: 404 });
      }

      return NextResponse.json(messages);
    } catch (dbError) {
      console.error("データベースエラー:", dbError);
      return NextResponse.json({ error: "メッセージの取得に失敗しました" }, { status: 500 });
    }
  } catch (error) {
    console.error("メッセージ取得エラー:", error);
    return NextResponse.json({ error: "メッセージの取得に失敗しました" }, { status: 500 });
  }
}

// POST関数は問題ないのでそのまま残します
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 認証確認
    const currentUser = await getServerAuth();

    if (!currentUser) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const conversationId = params.id;
    const { content } = await request.json();

    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "メッセージ内容は必須です" }, { status: 400 });
    }

    // 会話の存在と権限確認
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participantIds: {
          has: currentUser.id,
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "会話が見つからないか、アクセス権がありません" }, { status: 404 });
    }

    // メッセージを作成
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: currentUser.id,
        content,
      },
    });

    // 会話の最終更新日時を更新
    await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        updatedAt: new Date(),
        lastMessageAt: new Date(),
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("メッセージ送信エラー:", error);
    return NextResponse.json({ error: "メッセージの送信に失敗しました" }, { status: 500 });
  }
}
