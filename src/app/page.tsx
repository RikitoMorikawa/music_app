import { Button } from "@/components/ui/button";
import { Music2Icon, UsersIcon, MessageSquareIcon, LayersIcon, ArrowRightIcon, PlayIcon, HeadphonesIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { Badge } from "@/components/ui/badge";

export default async function Home() {
  // ログインユーザーの取得
  const user = await currentUser();

  // ログイン済みの場合はダッシュボードにリダイレクト
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* ヒーローセクション - 中央配置、鮮明なコントラスト */}
      <section className="relative w-full py-32 md:py-40 overflow-hidden bg-gradient-to-b from-primary/20 via-primary/5 to-background">
        {/* 背景装飾要素 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-60 -left-20 w-60 h-60 bg-accent/20 rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="container relative mx-auto px-4 md:px-6 z-10">
          <div className="flex flex-col items-center space-y-6 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
              <span className="animate-pulse mr-2">●</span> 音楽クリエイター向けの新しいプラットフォーム
            </div>

            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
              音楽で<span className="text-primary">つながる</span>
              <br />
              才能を<span className="text-primary">共有する</span>
            </h1>

            <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl">
              MusicCollabは音楽制作の未来。あなたのアイデアを形にし、理想の共同制作者を見つけ、 クリエイティブな音楽コミュニティで才能を共有しましょう。
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 w-full max-w-md">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto text-lg font-semibold transition-all hover:scale-105 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/sign-up" className="flex items-center justify-center gap-2">
                  無料ではじめる
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto text-lg border-2">
                <Link href="/explore" className="flex items-center justify-center gap-2">
                  <PlayIcon className="h-4 w-4" />
                  音楽を探す
                </Link>
              </Button>
            </div>

            <div className="pt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>🔒 登録は簡単</span>
              <span>•</span>
              <span>✨ すぐに利用可能</span>
              <span>•</span>
              <span>🎵 1000人以上のクリエイター</span>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション - コントラスト向上 */}
      <section className="w-full py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">あなたの音楽制作を次のレベルへ</h2>
            <p className="text-muted-foreground max-w-[700px]">MusicCollabのパワフルな機能を活用して、音楽制作の可能性を広げましょう</p>
          </div>


          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* カード1 */}
            <div className="group relative bg-card hover:bg-card/80 border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRightIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Music2Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-foreground">作品を共有</h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                あなたの楽曲をアップロードして世界中のクリエイターに届けましょう
              </p>
            </div>

            {/* カード2 */}
            <div className="group relative bg-card hover:bg-card/80 border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRightIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <UsersIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-foreground">コラボレーター</h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                AIマッチングで理想のパートナーを見つけ、一緒に音楽を作りましょう
              </p>
            </div>

            {/* カード3 */}
            <div className="group relative bg-card hover:bg-card/80 border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRightIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <MessageSquareIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-foreground">リアルタイム連携</h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                チャット機能で制作過程をスムーズに共有し、アイデアを交換できます
              </p>
            </div>

            {/* カード4 */}
            <div className="group relative bg-card hover:bg-card/80 border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRightIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <LayersIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-foreground">コミュニティ</h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                様々なジャンルのコミュニティに参加し、フィードバックや応援をもらえます
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* トレンドセクション - コントラスト向上 */}
      <section className="w-full py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">人気の楽曲</h2>
              <p className="text-muted-foreground">コミュニティで話題になっている最新トラック</p>
            </div>
            <Button variant="outline" asChild className="mt-4 md:mt-0 border-2">
              <Link href="/explore" className="flex items-center gap-2">
                すべて見る <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* トラックカード1 */}
            <div className="bg-card border border-border rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="relative h-48 w-full bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="icon" variant="ghost" className="rounded-full bg-background/80 h-12 w-12">
                      <PlayIcon className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1 text-foreground">Summer Vibes</h3>
                <p className="text-sm text-muted-foreground mb-3">by DJ Cool</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <HeadphonesIcon className="h-4 w-4 mr-1" />
                    1.2k 再生
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">House</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* トラックカード2 */}
            <div className="bg-card border border-border rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="relative h-48 w-full bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="icon" variant="ghost" className="rounded-full bg-background/80 h-12 w-12">
                      <PlayIcon className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1 text-foreground">Midnight Dreams</h3>
                <p className="text-sm text-muted-foreground mb-3">by Luna Wave</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <HeadphonesIcon className="h-4 w-4 mr-1" />
                    876 再生
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Chill</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* トラックカード3 */}
            <div className="bg-card border border-border rounded-xl overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="relative h-48 w-full bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="icon" variant="ghost" className="rounded-full bg-background/80 h-12 w-12">
                      <PlayIcon className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1 text-foreground">Urban Rhythm</h3>
                <p className="text-sm text-muted-foreground mb-3">by Beat Master</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <HeadphonesIcon className="h-4 w-4 mr-1" />
                    1.5k 再生
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Hip-Hop</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション - コントラスト向上 */}
      <section className="w-full py-24 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">あなたの音楽の旅を始めましょう</h2>
            <p className="text-muted-foreground text-lg mb-8">
              MusicCollabで才能を発見し、共有し、あなたの音楽キャリアを次のレベルに引き上げましょう。 1000人以上のクリエイターが既に参加しています。
            </p>
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto px-8 text-lg font-semibold transition-all hover:scale-105 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/sign-up">無料でアカウント作成</Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">アカウント作成は30秒で完了します。クレジットカードは必要ありません。</p>
          </div>
        </div>
      </section>
    </div>
  );
}
