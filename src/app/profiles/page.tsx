// src/app/profiles/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Camera, Save, User } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// 型定義
interface UserProfile {
  id?: string;
  clerkId?: string;
  username?: string;
  imageUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  primaryInstrument?: string;
  secondaryInstruments?: string[];
  primaryGenre?: string;
  otherGenres?: string[];
  experienceLevel?: string;
  influences?: string;
  lookingFor?: string;
}

// 楽器選択用オプション
const instruments = [
  "ギター",
  "ベース",
  "ドラム",
  "キーボード",
  "ボーカル",
  "サックス",
  "トランペット",
  "バイオリン",
  "チェロ",
  "フルート",
  "DJ/プロデューサー",
  "その他",
];

// ジャンル選択用オプション
const genres = [
  "ロック",
  "ポップ",
  "ジャズ",
  "クラシック",
  "ヒップホップ",
  "R&B",
  "エレクトロニック",
  "メタル",
  "フォーク",
  "カントリー",
  "ブルース",
  "パンク",
  "レゲエ",
  "ソウル",
  "ファンク",
  "その他",
];

// 経験レベル選択用オプション
const experienceLevels = ["初心者", "中級者", "上級者", "プロ"];

export default function ProfilePage() {
  const { user: clerkUser, isLoaded: clerkIsLoaded } = useUser();
  console.log("###Clerk", clerkUser);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // プロフィール情報の状態
  const [profileData, setProfileData] = useState<UserProfile>({
    username: "",
    bio: "",
    location: "",
    website: "",
    primaryInstrument: "",
    secondaryInstruments: [],
    primaryGenre: "",
    otherGenres: [],
    experienceLevel: "",
    influences: "",
    lookingFor: "",
  });

  // ユーザーデータの取得
  useEffect(() => {
    const fetchUserData = async () => {
      if (!clerkIsLoaded || !clerkUser) {
        setDataLoading(false);
        return;
      }

      setDataLoading(true);
      try {
        // MongoDB データの取得
        const response = await fetch(`/api/profiles`);
        if (!response.ok) {
          throw new Error("ユーザーデータの取得に失敗しました");
        }

        const userData = await response.json();

        // プロフィールデータをセット
        setProfileData({
          username: userData?.username || clerkUser.username || "",
          imageUrl: userData?.imageUrl || clerkUser.imageUrl || "",
          bio: userData?.bio || "",
          location: userData?.location || "",
          website: userData?.website || "",
          primaryInstrument: userData?.primaryInstrument || "",
          secondaryInstruments: userData?.secondaryInstruments || [],
          primaryGenre: userData?.primaryGenre || "",
          otherGenres: userData?.otherGenres || [],
          experienceLevel: userData?.experienceLevel || "",
          influences: userData?.influences || "",
          lookingFor: userData?.lookingFor || "",
        });
      } catch (err) {
        console.error("データ取得エラー:", err);
        setError("ユーザー情報の取得に失敗しました");
      } finally {
        setDataLoading(false);
      }
    };

    fetchUserData();
  }, [clerkUser, clerkIsLoaded]);

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // DBのユーザープロフィールを更新
      const response = await fetch("/api/profiles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...profileData,
          imageUrl: clerkUser?.imageUrl, // Clerkの画像URLを同期
        }),
      });

      if (!response.ok) {
        throw new Error("プロフィールの更新に失敗しました");
      }

      setSuccess("プロフィールが正常に更新されました！");
    } catch (err) {
      console.error("プロフィール更新エラー:", err);
      setError("プロフィールの更新中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  // 入力フィールドの変更を処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // セレクト要素の変更を処理
  const handleSelectChange = (name: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Clerkのプロフィール写真更新を促す
  const openClerkUserProfile = () => {
    if (window.Clerk) {
      window.Clerk.openUserProfile();
    } else {
      alert("Clerkのユーザープロフィールを開けません。");
    }
  };

  // 読み込み中表示
  if (dataLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 text-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  // 未ログイン時の表示
  if (!clerkUser && clerkIsLoaded) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 text-center">
        <p>ログインが必要です。</p>
        <Button onClick={() => router.push("/sign-in")} className="mt-4">
          ログイン
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full py-8 bg-gradient-to-b from-primary/20 via-primary/5 to-background">
      <div className="container mx-auto py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">マイプロフィール</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-600">成功</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="basic">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">基本情報</TabsTrigger>
            <TabsTrigger value="music">音楽プロフィール</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>基本プロフィール</CardTitle>
                  <CardDescription>アカウントの基本情報を編集します。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-2 border-border">
                        <AvatarImage src={clerkUser?.imageUrl} alt={clerkUser?.username || "ユーザー"} className="object-cover" />
                        <AvatarFallback>
                          <User className="h-12 w-12 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute -bottom-2 -right-2 rounded-full bg-background border-primary"
                        onClick={openClerkUserProfile}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 flex-1">
                      <p className="text-sm text-muted-foreground">
                        プロフィール写真はClerkアカウントと連携しています。 「カメラ」アイコンをクリックして更新してください。
                      </p>
                      <Button variant="outline" type="button" onClick={openClerkUserProfile}>
                        プロフィール写真を更新
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">ユーザーネーム</Label>
                      <Input id="username" name="username" placeholder="ユーザーネーム" value={profileData.username ?? ""} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">自己紹介</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="あなた自身について簡単に紹介してください"
                        rows={4}
                        value={profileData.bio ?? ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">活動拠点</Label>
                        <Input id="location" name="location" placeholder="例: 東京都渋谷区" value={profileData.location} onChange={handleChange} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">ウェブサイト/SNS</Label>
                        <Input id="website" name="website" placeholder="例: https://twitter.com/username" value={profileData.website} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="music">
              <Card>
                <CardHeader>
                  <CardTitle>音楽プロフィール</CardTitle>
                  <CardDescription>あなたの音楽的特徴や経験を編集します。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryInstrument">メイン楽器</Label>
                      <Select value={profileData.primaryInstrument} onValueChange={(value) => handleSelectChange("primaryInstrument", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="メイン楽器を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {instruments.map((instrument) => (
                            <SelectItem key={instrument} value={instrument}>
                              {instrument}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="primaryGenre">メインジャンル</Label>
                      <Select value={profileData.primaryGenre} onValueChange={(value) => handleSelectChange("primaryGenre", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="メインジャンルを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {genres.map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experienceLevel">経験レベル</Label>
                      <Select value={profileData.experienceLevel} onValueChange={(value) => handleSelectChange("experienceLevel", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="経験レベルを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="influences">影響を受けたアーティスト</Label>
                      <Textarea
                        id="influences"
                        name="influences"
                        placeholder="例: ザ・ビートルズ、坂本龍一、リンキン・パーク..."
                        rows={2}
                        value={profileData.influences}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lookingFor">こんな人と音楽を作りたい！</Label>
                      <Textarea
                        id="lookingFor"
                        name="lookingFor"
                        placeholder="例: ボーカルを募集中です。ロック/オルタナティブが好きな方！"
                        rows={3}
                        value={profileData.lookingFor}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="mt-6 flex justify-end">
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading ? (
                  "保存中..."
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    プロフィールを保存
                  </>
                )}
              </Button>
            </div>
          </form>
        </Tabs>
      </div>
    </div>
  );
}
