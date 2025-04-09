"use client";

import { useState } from "react";
import { Music2Icon, UsersIcon, Filter, Star, ArrowRightIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import Image from "next/image";
import { Musician, Project } from "@/types/page";

export default function MatchingPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedTab, setSelectedTab] = useState("musicians");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [matchingCredits, setMatchingCredits] = useState(5);
  const [matchThreshold, setMatchThreshold] = useState([70]);
  const [skillFilter, setSkillFilter] = useState<string[]>([]);
  const [genreFilter, setGenreFilter] = useState<string[]>([]);

  // デモ用のミュージシャンデータ
  const musicianMatches: Musician[] = [
    {
      id: "user1",
      name: "田中 誠",
      username: "makoto_music",
      avatarUrl: "/placeholder-avatar.jpg",
      primaryRole: "ボーカリスト",
      skills: ["ボーカル", "作詞", "ピアノ"],
      genres: ["J-Pop", "R&B"],
      bio: "東京を拠点に活動する情熱的なシンガーソングライター。心に響くメロディと詩を追求しています。",
      matchScore: 95,
      isPremium: true,
      recentWork: "「星空のメロディ」シングルリリース",
    },
    {
      id: "user2",
      name: "佐藤 健太",
      username: "kenta_guitar",
      avatarUrl: "/placeholder-avatar.jpg",
      primaryRole: "ギタリスト",
      skills: ["ギター", "作曲", "編曲"],
      genres: ["ロック", "フュージョン"],
      bio: "10年以上のギター演奏経験。バンド活動と並行してセッションミュージシャンとしても活動中。",
      matchScore: 87,
      isPremium: false,
      recentWork: "インディーバンド「Blue Horizon」のギターレコーディング",
    },
    {
      id: "user3",
      name: "山本 美咲",
      username: "misaki_beats",
      avatarUrl: "/placeholder-avatar.jpg",
      primaryRole: "ビートメーカー",
      skills: ["ビートメイキング", "DTM", "ミキシング"],
      genres: ["ヒップホップ", "エレクトロニック"],
      bio: "独自のサウンドスケープを創り出すことに情熱を持つプロデューサー。様々なアーティストとコラボ中。",
      matchScore: 82,
      isPremium: true,
      recentWork: "楽曲「Urban Nights」プロデュース",
    },
    {
      id: "user4",
      name: "鈴木 拓也",
      username: "takuya_drums",
      avatarUrl: "/placeholder-avatar.jpg",
      primaryRole: "ドラマー",
      skills: ["ドラム", "パーカッション", "リズムプログラミング"],
      genres: ["ジャズ", "ファンク", "フュージョン"],
      bio: "グルーヴ感あふれるプレイが特徴のドラマー。様々なジャンルに対応できる柔軟性が強み。",
      matchScore: 78,
      isPremium: false,
      recentWork: "ジャズトリオでのライブパフォーマンス",
    },
    {
      id: "user5",
      name: "伊藤 明日香",
      username: "asuka_violin",
      avatarUrl: "/placeholder-avatar.jpg",
      primaryRole: "バイオリニスト",
      skills: ["バイオリン", "弦楽アレンジ", "作曲"],
      genres: ["クラシック", "ポップ", "映画音楽"],
      bio: "クラシックの訓練を受けつつ、様々なジャンルの音楽にクロスオーバーする多才なバイオリニスト。",
      matchScore: 73,
      isPremium: false,
      recentWork: "インディーアーティスト楽曲への弦楽セクション提供",
    },
    {
      id: "user6",
      name: "小林 直人",
      username: "naoto_bass",
      avatarUrl: "/placeholder-avatar.jpg",
      primaryRole: "ベーシスト",
      skills: ["ベース", "編曲", "音楽理論"],
      genres: ["ファンク", "ジャズ", "R&B"],
      bio: "しっかりとしたグルーヴと音楽理論の知識を併せ持つベーシスト。バンド活動の他、レコーディングにも参加。",
      matchScore: 68,
      isPremium: true,
      recentWork: "スタジオミュージシャンとしてアルバム参加",
    },
  ];

  // デモ用のプロジェクトデータ
  const projectMatches: Project[] = [
    {
      id: "proj1",
      title: "J-Popシングルのボーカリスト募集",
      creator: "Cosmic Productions",
      creatorAvatar: "/placeholder-avatar.jpg",
      description: "夏リリース予定のアップテンポなJ-Popシングル曲のメインボーカリストを探しています。明るく伸びのある声質の方を希望。曲のデモ音源あり。",
      needs: ["ボーカル", "メロディアレンジ"],
      genres: ["J-Pop"],
      deadline: "2025年5月末",
      remote: true,
      isPremium: true,
      matchScore: 92,
    },
    {
      id: "proj2",
      title: "インディーロックバンド メンバー募集",
      creator: "Taro Yamada",
      creatorAvatar: "/placeholder-avatar.jpg",
      description:
        "オリジナル曲を中心に活動するインディーロックバンドの立ち上げメンバーを募集。具体的にはドラマーとキーボード奏者を探しています。定期的なリハーサルと月1回程度のライブ活動を予定。",
      needs: ["ドラム", "キーボード"],
      genres: ["インディーロック", "オルタナティブ"],
      deadline: "募集中",
      remote: false,
      location: "東京",
      isPremium: false,
      matchScore: 85,
    },
    {
      id: "proj3",
      title: "ヒップホップトラック用ビートメイカー",
      creator: "MC Akira",
      creatorAvatar: "/placeholder-avatar.jpg",
      description:
        "次回アルバム用のオリジナルビート制作パートナーを探しています。90年代のオールドスクールヒップホップからインスピレーションを得たサウンドを希望。",
      needs: ["ビートメイキング", "サンプリング", "ミキシング"],
      genres: ["ヒップホップ", "ローファイ"],
      deadline: "2025年6月",
      remote: true,
      isPremium: true,
      matchScore: 88,
    },
    {
      id: "proj4",
      title: "アコースティックアルバムの弦楽器奏者募集",
      creator: "Hana Music Collective",
      creatorAvatar: "/placeholder-avatar.jpg",
      description: "フォークミュージックをベースにしたアコースティックアルバムのレコーディング参加者を募集。特にバイオリン、チェロ、ビオラ奏者を探しています。",
      needs: ["バイオリン", "チェロ", "弦楽器"],
      genres: ["フォーク", "アコースティック"],
      deadline: "2025年4月",
      remote: true,
      isPremium: false,
      matchScore: 81,
    },
    {
      id: "proj5",
      title: "ビデオゲーム用サウンドトラック制作",
      creator: "Pixel Dreams Studio",
      creatorAvatar: "/placeholder-avatar.jpg",
      description: "開発中のインディーゲーム用のサウンドトラック制作者を探しています。8bitやchiptune要素を含む現代的な電子音楽スタイルを希望。",
      needs: ["作曲", "サウンドデザイン", "ゲーム音楽"],
      genres: ["エレクトロニック", "チップチューン"],
      deadline: "2025年7月",
      remote: true,
      isPremium: true,
      matchScore: 77,
    },
  ];

  // スキルオプション（デモ用）
  const skillOptions = [
    "ボーカル",
    "ギター",
    "ベース",
    "ドラム",
    "キーボード",
    "ピアノ",
    "バイオリン",
    "作曲",
    "編曲",
    "作詞",
    "DTM",
    "ミキシング",
    "マスタリング",
    "ビートメイキング",
    "DJ",
    "サウンドデザイン",
  ];

  // ジャンルオプション（デモ用）
  const genreOptions = [
    "J-Pop",
    "ロック",
    "ヒップホップ",
    "R&B",
    "エレクトロニック",
    "ジャズ",
    "クラシック",
    "フォーク",
    "メタル",
    "インディー",
    "アンビエント",
    "ブルース",
  ];

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
    // クレジット購入ページへのリダイレクト
    window.location.href = "/credits/purchase";
  };

  return (
    <div className="flex flex-col items-center">
      {/* ヘッダーセクション */}
      <section className="w-full py-12 bg-gradient-to-b from-primary/10 to-background">
        <div className="container px-4 md:px-6">
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
        <div className="container px-4 md:px-6">
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
                    <label className="text-sm mb-1 block">キーワード検索</label>
                    <div className="relative">
                      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="名前、スキルなどで検索" className="pl-8" />
                    </div>
                  </div>

                  {/* マッチングスコアスライダー */}
                  <div>
                    <label className="text-sm mb-1 block">マッチングスコア: {matchThreshold}%以上</label>
                    <Slider value={matchThreshold} min={0} max={100} step={5} onValueChange={setMatchThreshold} className="py-4" />
                  </div>

                  {/* スキルフィルター */}
                  <div>
                    <label className="text-sm mb-2 block">スキル</label>
                    <div className="flex flex-wrap gap-1">
                      {skillOptions.slice(0, 10).map((skill) => (
                        <Badge
                          key={skill}
                          variant={skillFilter.includes(skill) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleSkillFilter(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="cursor-pointer">
                        その他...
                      </Badge>
                    </div>
                  </div>

                  {/* ジャンルフィルター */}
                  <div>
                    <label className="text-sm mb-2 block">ジャンル</label>
                    <div className="flex flex-wrap gap-1">
                      {genreOptions.slice(0, 8).map((genre) => (
                        <Badge
                          key={genre}
                          variant={genreFilter.includes(genre) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleGenreFilter(genre)}
                        >
                          {genre}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="cursor-pointer">
                        その他...
                      </Badge>
                    </div>
                  </div>

                  {/* リモート/オンサイトフィルター */}
                  <div>
                    <label className="text-sm mb-2 block">活動タイプ</label>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="cursor-pointer">
                        リモート可
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer">
                        対面のみ
                      </Badge>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full mt-2">
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

            {/* マッチングリストエリア */}
            <div className="w-full lg:w-3/4">
              <Tabs defaultValue="musicians" className="w-full" onValueChange={setSelectedTab}>
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="musicians" className="w-1/2">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    ミュージシャン
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="w-1/2">
                    <Music2Icon className="h-4 w-4 mr-2" />
                    プロジェクト
                  </TabsTrigger>
                </TabsList>

                {/* ミュージシャンタブコンテンツ */}
                <TabsContent value="musicians" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {musicianMatches.map((match, index) => (
                      <Card key={match.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0 relative">
                              <Image
                                src={match.avatarUrl}
                                alt={`${match.name}のプロフィール画像`}
                                fill
                                sizes="64px"
                                className="object-cover"
                                priority={index < 2} // 最初の2つの画像のみpriorityを設定
                              />
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
                                  {match.skills.slice(0, 3).map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {match.genres.slice(0, 2).map((genre) => (
                                    <Badge key={genre} variant="outline" className="text-xs">
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
                            <Button size="sm" className="flex-1">
                              コンタクト {matchingCredits > 0 ? "(1クレジット)" : "(クレジット不足)"}
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <Button variant="outline">
                      もっと見る <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                {/* プロジェクトタブコンテンツ */}
                <TabsContent value="projects" className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    {projectMatches.map((project) => (
                      <Card key={project.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="md:w-2/3">
                              <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-lg">{project.title}</h3>
                                <div className="flex items-center">
                                  <Badge className={`${project.matchScore >= 85 ? "bg-green-600" : project.matchScore >= 70 ? "bg-amber-500" : "bg-muted"}`}>
                                    {project.matchScore}% マッチ
                                  </Badge>
                                  {project.isPremium && (
                                    <Badge variant="outline" className="ml-1 border-amber-500 text-amber-500">
                                      <Star className="h-3 w-3 mr-1 fill-amber-500" />
                                      Premium
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center mt-2">
                                <div className="w-6 h-6 rounded-full overflow-hidden bg-muted flex-shrink-0 mr-2 relative">
                                  <Image src={project.creatorAvatar} alt={project.creator} fill sizes="24px" className="object-cover" />
                                </div>
                                <span className="text-sm">{project.creator}</span>
                              </div>

                              <p className="text-sm mt-3">{project.description}</p>
                            </div>

                            <div className="md:w-1/3 flex flex-col justify-between space-y-3">
                              <div>
                                <h4 className="text-sm font-medium mb-1">求めているスキル</h4>
                                <div className="flex flex-wrap gap-1">
                                  {project.needs.map((need) => (
                                    <Badge key={need} variant="secondary" className="text-xs">
                                      {need}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium mb-1">ジャンル</h4>
                                <div className="flex flex-wrap gap-1">
                                  {project.genres.map((genre) => (
                                    <Badge key={genre} variant="outline" className="text-xs">
                                      {genre}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex flex-col gap-1">
                                <div className="flex items-center text-sm">
                                  <span className="text-muted-foreground mr-2">期限:</span>
                                  {project.deadline}
                                </div>
                                <div className="flex items-center text-sm">
                                  <span className="text-muted-foreground mr-2">場所:</span>
                                  {project.remote ? "リモート可" : project.location}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="bg-muted/20 p-3">
                          <div className="w-full flex justify-between gap-2">
                            <Button variant="outline" size="sm" asChild className="flex-1">
                              <Link href={`/projects/${project.id}`}>詳細を見る</Link>
                            </Button>
                            <Button size="sm" className="flex-1">
                              応募する {matchingCredits > 0 ? "(1クレジット)" : "(クレジット不足)"}
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <Button variant="outline">
                      もっと見る <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* 下部のCTAセクション */}
      <section className="w-full py-12 bg-primary/5 mt-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-2xl font-bold">最適な音楽パートナーが見つからない？</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground">
              プロフィールを充実させると、あなたにぴったりのマッチング精度が向上します。 また、プロジェクトを作成して人材を募集することもできます。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Button asChild>
                <Link href="/profile/edit">プロフィールを編集</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/projects/create">プロジェクトを作成</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
