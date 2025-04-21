"use client";

import { useState, useEffect } from "react";
import { UsersIcon, Filter, Star, ArrowRightIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import { Musician } from "@/types/page";

export default function MatchingPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [matchingCredits, setMatchingCredits] = useState(5);
  const [matchThreshold, setMatchThreshold] = useState([70]);
  const [skillFilter, setSkillFilter] = useState<string[]>([]);
  const [genreFilter, setGenreFilter] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [musicians, setMusicians] = useState<Musician[]>([]);

  // MongoDB/Prismaからのユーザーデータ取得
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();

        // DBから取得したユーザーデータをミュージシャンデータに変換
        type APIUser = {
          id?: string;
          _id?: string;
          name?: string;
          username?: string;
          imageUrl?: string;
          clerkId: string;
        };

        const mappedMusicians = data.map((user: APIUser) => ({
          id: user.id || user._id, // Prismaはidをそのまま返す可能性がある
          name: user.name || "ユーザー名未設定",
          username: user.username || user.clerkId.substring(0, 10),
          avatarUrl: user.imageUrl || "/placeholder-avatar.jpg",
          primaryRole: "アーティスト", // デフォルト値
          skills: ["DTM", "作曲"], // デフォルト値
          genres: ["J-Pop"], // デフォルト値
          bio: "プロフィール文が未設定です。", // デフォルト値
          matchScore: Math.floor(Math.random() * 30) + 70, // ランダム値
          isPremium: Math.random() > 0.7, // ランダム値
          recentWork: "最近の活動情報なし", // デフォルト値
        }));

        setMusicians(mappedMusicians);
      } catch (error) {
        console.error("ユーザーデータの取得に失敗しました:", error);
        // エラー時は空の配列を設定
        setMusicians([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // スキルオプション
  const skillOptions = ["ボーカル", "ギター", "ベース", "ドラム", "キーボード", "ピアノ", "バイオリン", "作曲", "編曲", "作詞"];

  // ジャンルオプション
  const genreOptions = ["J-Pop", "ロック", "ヒップホップ", "R&B", "エレクトロニック", "ジャズ", "クラシック", "フォーク"];

  const toggleSkillFilter = (skill: string) => {
    if (skillFilter.includes(skill)) {
      setSkillFilter(skillFilter.filter((s) => s !== skill));
    } else {
      setSkillFilter([...skillFilter, skill]);
    }
  };

  const toggleGenreFilter = (genre: string) => {
    if (genreFilter.includes(genre)) {
      setGenreFilter(genreFilter.filter((g) => g !== genre));
    } else {
      setGenreFilter([...genreFilter, genre]);
    }
  };

  const buyCredits = () => {
    window.location.href = "/credits/purchase";
  };

  const loadMoreData = () => {
    setIsLoading(true);
    // 実際のアプリではここでAPI呼び出しをして追加データを取得
    setTimeout(() => {
      setIsLoading(false);
      // 追加データの処理
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center">
      {/* ヘッダーセクション */}
      <section className="w-full py-12 bg-gradient-to-b from-primary/10 to-background">
        <div className="container max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">あなたの理想の音楽パートナーを見つけよう</h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">AIがあなたのスキルや好みに合った最適なコラボレーターを提案します</p>

            <div className="flex items-center gap-2 mt-4">
              <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/5">
                マッチングクレジット残高: <span className="font-bold ml-1">{matchingCredits}</span>
              </Badge>
              <Button variant="outline" size="sm" onClick={buyCredits}>
                クレジット購入
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* メインコンテンツセクション */}
      <section className="w-full py-8 bg-background">
        <div className="container max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* フィルターサイドバー */}
            <div className="w-full lg:w-1/4 space-y-6">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5" />
                  <h3 className="font-semibold">フィルター</h3>
                </div>

                <div className="space-y-4">
                  {/* 検索 */}
                  <div>
                    <label htmlFor="keyword-search" className="text-sm mb-1 block">
                      キーワード検索
                    </label>
                    <div className="relative">
                      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="keyword-search" placeholder="名前、スキルなどで検索" className="pl-8" aria-label="キーワードで検索" />
                    </div>
                  </div>

                  {/* マッチングスコアスライダー */}
                  <div>
                    <label htmlFor="match-threshold" className="text-sm mb-1 block">
                      マッチングスコア: {matchThreshold}%以上
                    </label>
                    <Slider
                      id="match-threshold"
                      value={matchThreshold}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={setMatchThreshold}
                      className="py-4"
                      aria-label="マッチングスコアの閾値"
                    />
                  </div>

                  {/* スキルフィルター */}
                  <div>
                    <label className="text-sm mb-2 block">スキル</label>
                    <div className="flex flex-wrap gap-1">
                      {skillOptions.map((skill) => (
                        <Badge
                          key={skill}
                          variant={skillFilter.includes(skill) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleSkillFilter(skill)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleSkillFilter(skill);
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-pressed={skillFilter.includes(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* ジャンルフィルター */}
                  <div>
                    <label className="text-sm mb-2 block">ジャンル</label>
                    <div className="flex flex-wrap gap-1">
                      {genreOptions.map((genre) => (
                        <Badge
                          key={genre}
                          variant={genreFilter.includes(genre) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleGenreFilter(genre)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleGenreFilter(genre);
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-pressed={genreFilter.includes(genre)}
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* リモート/オンサイトフィルター */}
                  <div>
                    <label className="text-sm mb-2 block">活動タイプ</label>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="cursor-pointer" tabIndex={0} role="button">
                        リモート可
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer" tabIndex={0} role="button">
                        対面のみ
                      </Badge>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => {
                      setSkillFilter([]);
                      setGenreFilter([]);
                      setMatchThreshold([70]);
                    }}
                  >
                    フィルターをリセット
                  </Button>
                </div>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">マッチングを最適化</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  プレミアムユーザーにアップグレードすると、より多くのマッチングと高度なフィルタリングオプションが利用できます。
                </p>
                <Button className="w-full" asChild>
                  <Link href="/pricing">プランを見る</Link>
                </Button>
              </div>
            </div>

            {/* ミュージシャンリストエリア */}
            <div className="w-full lg:w-3/4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <UsersIcon className="h-5 w-5 mr-2" />
                  ミュージシャン一覧
                </h2>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  <p className="text-muted-foreground">読み込み中...</p>
                </div>
              ) : musicians.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {musicians.map((match, index) => (
                    <Card key={index} className="overflow-hidden hover:border-primary/50 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0 relative">
                            <img src={match.avatarUrl} alt={`${match.name}のプロフィール画像`} className="w-full h-full object-cover" />
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{match.name}</h3>
                                <p className="text-sm text-muted-foreground">@{match.username}</p>
                              </div>
                              <div className="flex items-center">
                                <Badge className={`${match.matchScore >= 85 ? "bg-green-600" : match.matchScore >= 70 ? "bg-amber-500" : "bg-muted"}`}>
                                  {match.matchScore}% マッチ
                                </Badge>
                                {match.isPremium && (
                                  <Badge variant="outline" className="ml-1 border-amber-500 text-amber-500">
                                    <Star className="h-3 w-3 mr-1 fill-amber-500" />
                                    Premium
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="mt-2">
                              <p className="text-sm font-medium">{match.primaryRole}</p>
                            </div>

                            <div className="mt-3">
                              <div className="flex flex-wrap gap-1 mb-2">
                                {match.skills.slice(0, 3).map((skill, i) => (
                                  <Badge key={`${match.id}-skill-${i}`} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {match.genres.slice(0, 2).map((genre, i) => (
                                  <Badge key={`${match.id}-genre-${i}`} variant="outline" className="text-xs">
                                    {genre}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <p className="text-sm mt-3 line-clamp-2">{match.bio}</p>

                            <div className="mt-3 text-xs text-muted-foreground">
                              <span>最近の活動:</span> {match.recentWork}
                            </div>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="bg-muted/20 p-3">
                        <div className="w-full flex justify-between gap-2">
                          <Button variant="outline" size="sm" asChild className="flex-1">
                            <Link href={`/profile/${match.username}`}>プロフィール</Link>
                          </Button>
                          <Button size="sm" className="flex-1" disabled={matchingCredits <= 0}>
                            コンタクト {matchingCredits > 0 ? "(1クレジット)" : "(クレジット不足)"}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center p-12 bg-muted/20 rounded-lg">
                  <p className="text-muted-foreground">表示できるミュージシャンがいません。</p>
                </div>
              )}

              {musicians.length > 0 && (
                <div className="flex justify-center mt-6">
                  <Button variant="outline" onClick={loadMoreData} disabled={isLoading}>
                    {isLoading ? "読み込み中..." : "もっと見る"}
                    {!isLoading && <ArrowRightIcon className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
