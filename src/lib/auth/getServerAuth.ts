// src/lib/auth/getServerAuth.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export type AuthUser = {
  id: string;
  clerkId: string;
  username: string;
  name?: string;
  imageUrl?: string;
  isSignedIn: boolean;
};

// サーバーサイドで使用する認証関数
export async function getServerAuth(): Promise<AuthUser | null> {
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
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  // MongoDBにユーザーが存在しない場合は作成
  if (!dbUser) {
    const newUser = await prisma.user.create({
      data: {
        clerkId: userId,
        username: clerkUser.username || `user_${userId.substring(0, 8)}`,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        imageUrl: clerkUser.imageUrl,
      },
    });

    return {
      id: newUser.id,
      clerkId: newUser.clerkId,
      username: newUser.username,
      name: newUser.name || undefined,
      imageUrl: newUser.imageUrl || undefined,
      isSignedIn: true,
    };
  }

  return {
    id: dbUser.id,
    clerkId: dbUser.clerkId,
    username: dbUser.username,
    name: dbUser.name || undefined,
    imageUrl: dbUser.imageUrl || undefined,
    isSignedIn: true,
  };
}
