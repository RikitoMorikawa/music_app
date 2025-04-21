// src/app/dashboard/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { isSignedIn: clerkIsSignedIn, isLoaded: clerkIsLoaded } = useUser();
  const { user, isLoading } = useAuth();
  console.log("user", user);

  // Clerkの読み込みが終わって、サインインしていない場合はリダイレクト
  if (clerkIsLoaded && !clerkIsSignedIn) {
    redirect("/sign-in");
    return null;
  }

  // データ読み込み中の表示
  if (isLoading || !clerkIsLoaded) {
    return (
      <div className="container px-4 py-8 md:px-6 flex justify-center items-center">
        <div className="animate-pulse">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 bg-gradient-to-b from-primary/20 via-primary/5 to-background">
      <div className="container mx-auto py-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          {user && <p className="text-muted-foreground mt-2">ようこそ、{user.name || user.username}さん</p>}
        </div>
        <Button asChild>
          <Link href="/upload">Upload New Track</Link>
        </Button>
      </div>

      {/* ダッシュボードのコンテンツ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">{/* ここにユーザーのトラックやプロジェクトを表示 */}</div>
    </div>
  );
}
