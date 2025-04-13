import { Button } from "@/components/ui/button";
import { Music2Icon, UsersIcon, MessageSquareIcon, LayersIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  // ログインユーザーの取得
  const user = await currentUser();

  // ログイン済みの場合はダッシュボードにリダイレクト
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center">
      {/* ヒーローセクション */}
      <section className="flex items-center justify-center w-full py-24 bg-gradient-to-b from-primary/10 to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">つながる。創る。協力する。</h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              音楽クリエイターのコミュニティに参加しましょう。共同制作者を見つけ、あなたのトラックを共有し、一緒に成長しましょう。
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild size="lg">
                <Link href="/sign-up">はじめる</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/explore">楽曲を探す</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="flex items-center justify-center w-full py-12 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <Music2Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">楽曲を共有</h3>
              <p className="text-sm text-muted-foreground">あなたの音楽をコミュニティと共有できます</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <UsersIcon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">共同制作者を見つける</h3>
              <p className="text-sm text-muted-foreground">他のミュージシャンやクリエイターとつながる</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <MessageSquareIcon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">リアルタイムチャット</h3>
              <p className="text-sm text-muted-foreground">共同制作者とシームレスにコミュニケーションできます</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <LayersIcon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">コミュニティに参加</h3>
              <p className="text-sm text-muted-foreground">ジャンル別の音楽コミュニティの一員になりましょう</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
