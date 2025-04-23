// src/app/profiles/[id]/page.tsx
import { redirect } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import TrackList from "@/components/track/TrackList";
import { getServerAuth } from "@/lib/auth/getServerAuth";
import { prisma } from "@/lib/prisma";

interface ProfilePageProps {
  params: {
    id: string;
  };
}

async function getUser(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        tracks: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) return null;
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export default async function ProfilePage(props: ProfilePageProps) {
  // params全体を扱う
  const params = await Promise.resolve(props.params);
  const id = params.id;

  // 認証情報を取得
  const currentUser = await getServerAuth();

  if (!currentUser) {
    // 未認証の場合はログインページにリダイレクト
    redirect("/sign-in");
  }

  const user = await getUser(id);

  if (!user) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">ユーザーが見つかりません</h2>
        <p>指定されたIDのユーザーは存在しないか、削除された可能性があります。</p>
      </div>
    );
  }

  return (
    <div className="w-full py-8 bg-gradient-to-b from-primary/20 via-primary/5 to-background">
      <div className="container mx-auto py-8 max-w-4xl">
        <ProfileHeader user={user} />

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">トラック</h2>
          {user.tracks.length > 0 ? <TrackList tracks={user.tracks} /> : <p className="text-gray-500">トラックはまだ投稿されていません</p>}
        </div>
      </div>
    </div>
  );
}
