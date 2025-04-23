// src/app/api/conversations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuth } from "@/lib/auth/getServerAuth";

export async function POST(request: NextRequest) {
  try {
    // 認証確認
    const currentUser = await getServerAuth();

    if (!currentUser) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // リクエストからデータを取得
    const { targetUserId } = await request.json();

    if (!targetUserId) {
      return NextResponse.json({ error: "ターゲットユーザーIDが必要です" }, { status: 400 });
    }

    // ユーザーの存在確認
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "ターゲットユーザーが見つかりません" }, { status: 404 });
    }

    // 既存の会話を確認（重複防止）
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [currentUser.id, targetUserId],
        },
      },
    });

    if (existingConversation) {
      return NextResponse.json(
        {
          message: "既に会話が存在します",
          conversation: existingConversation,
        },
        { status: 200 }
      );
    }

    // 新しい会話を作成
    const newConversation = await prisma.conversation.create({
      data: {
        participantIds: [currentUser.id, targetUserId],
        creditUsed: true, // クレジットを使用済みにマーク
      },
    });

    // 最初のシステムメッセージを追加（オプション）
    await prisma.message.create({
      data: {
        conversationId: newConversation.id,
        senderId: currentUser.id, // もしくはシステムユーザーIDを使用
        content: "コンタクトが開始されました。メッセージを送信してください。",
      },
    });

    return NextResponse.json(
      {
        message: "会話が作成されました",
        conversation: newConversation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("会話作成エラー:", error);
    return NextResponse.json({ error: "会話の作成に失敗しました" }, { status: 500 });
  }


}

// src/app/api/conversations/route.ts
export async function GET() {
  try {
    // 認証確認
    const currentUser = await getServerAuth();

    if (!currentUser) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // ユーザーの会話一覧を取得
    const conversations = await prisma.conversation.findMany({
      where: {
        participantIds: {
          has: currentUser.id,
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1, // 最新のメッセージのみ
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // 会話ごとに参加者情報を取得
    const conversationsWithUsers = await Promise.all(
      conversations.map(async (conversation) => {
        // 現在のユーザー以外の参加者を取得
        const otherParticipantIds = conversation.participantIds.filter(
          id => id !== currentUser.id
        );
        
        const participants = await prisma.user.findMany({
          where: {
            id: { in: otherParticipantIds },
          },
          select: {
            id: true,
            username: true,
            name: true,
            imageUrl: true,
          },
        });
        
        return {
          ...conversation,
          participants,
        };
      })
    );
    
    return NextResponse.json(conversationsWithUsers);
  } catch (error) {
    console.error("会話一覧取得エラー:", error);
    return NextResponse.json({ error: "会話一覧の取得に失敗しました" }, { status: 500 });
  }
}