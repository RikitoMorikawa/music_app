// src/lib/auth/getServerAuth.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export type AuthUser = {
  id: string;
  clerkId: string;
  username: string;
  name?: string;
  imageUrl?: string;
  emailAddress?: string;
  isSignedIn: boolean;
};

// サーバーサイドで使用する認証関数
// src/lib/auth/getServerAuth.ts
export async function getServerAuth(): Promise<AuthUser | null> {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return null;
    }

    // Clerkから完全なユーザー情報を取得
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    // MongoDBからユーザー情報を取得
    try {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: userId },
      });

      // MongoDBにユーザーが存在しない場合は作成
      if (!dbUser) {
        // タイムスタンプを含めた一意のユーザー名を生成
        const timestamp = Date.now().toString().slice(-6);
        const uniqueUsername = clerkUser.username || 
          `user_${userId.substring(0, 6)}_${timestamp}`;
        
        const newUser = await prisma.user.create({
          data: {
            clerkId: userId,
            username: uniqueUsername, // 一意性を確保するための修正
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || null,
            imageUrl: clerkUser.imageUrl || null,
            emailAddress: clerkUser.emailAddresses?.[0]?.emailAddress || null,
          },
        });

        return {
          id: newUser.id,
          clerkId: newUser.clerkId,
          username: newUser.username,
          name: newUser.name || undefined,
          imageUrl: newUser.imageUrl || undefined,
          emailAddress: newUser.emailAddress || undefined,
          isSignedIn: true,
        };
      }

      return {
        id: dbUser.id,
        clerkId: dbUser.clerkId,
        username: dbUser.username,
        name: dbUser.name || undefined,
        imageUrl: dbUser.imageUrl || undefined,
        emailAddress: dbUser.emailAddress || undefined,
        isSignedIn: true,
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (dbError: any) {
      console.error("データベース操作中にエラー発生:", dbError);
      // ユーザー名の重複エラーの場合は再試行
      if (dbError.code === 'P2002' && dbError.meta?.target?.includes('username')) {
        // タイムスタンプを使った再試行
        const timestamp = Date.now().toString();
        const retryUsername = `user_${userId.substring(0, 6)}_${timestamp}`;
        
        const newUser = await prisma.user.create({
          data: {
            clerkId: userId,
            username: retryUsername,
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || null,
            imageUrl: clerkUser.imageUrl || null,
            emailAddress: clerkUser.emailAddresses?.[0]?.emailAddress || null,
          },
        });

        return {
          id: newUser.id,
          clerkId: newUser.clerkId,
          username: newUser.username,
          name: newUser.name || undefined,
          imageUrl: newUser.imageUrl || undefined,
          emailAddress: newUser.emailAddress || undefined,
          isSignedIn: true,
        };
      }
      throw dbError;
    }
  } catch (error) {
    console.error("getServerAuth関数でエラー発生:", error);
    throw error;
  }
}