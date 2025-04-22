// Navbar.tsxの修正版
"use client";

import { useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, Music2, Upload, Users, MessageSquare, Compass, Bell, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { CustomUserButton } from "./CustomUserButton";

export function Navbar() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // スクロール検出用のリスナー設定
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ログイン状態の変化を検出
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        console.log("ユーザーがログインしました:", user);
      } else {
        console.log("ユーザーがログアウトしました");
      }
    }
  }, [isLoaded, isSignedIn, user]);

  // メニューを開いたときに背景スクロールを防止
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <header
      className={`sticky top-0 w-full bg-background/80 backdrop-blur-md z-50 transition-all duration-300 ${
        isScrolled ? "shadow-sm border-b border-border" : ""
      }`}
    >
      {/* max-w-7xlを追加してコンテンツの最大幅を設定、mx-autoで中央寄せ */}
      <div className="container max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="text-primary bg-primary/10 p-2 rounded-full transition-colors group-hover:bg-primary/20">
            <Music2 className="h-5 w-5" />
          </span>
          <h2 className="text-xl font-bold tracking-tighter sm:text-2xl group-hover:text-primary transition-colors">MusicCollab</h2>
        </Link>

        <div className="flex items-center space-x-2 md:space-x-4">
          <nav className="hidden md:flex items-center space-x-1">
            <SignedIn>
              {/* デスクトップ用ナビゲーション（ログイン時） */}
              <Link href="/upload" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">
                <Upload className="h-4 w-4 mr-2" />
                アップロード
              </Link>
              <Link href="/match" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">
                <Users className="h-4 w-4 mr-2" />
                マッチング
              </Link>
              <Link href="/messages" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="relative">
                  メッセージ
                  <Badge className="absolute -top-2 -right-6 px-1 py-0 text-[10px] bg-primary">3</Badge>
                </span>
              </Link>
            </SignedIn>

            {/* どちらの状態でも表示されるリンク */}
            <Link href="/explore" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">
              <Compass className="h-4 w-4 mr-2" />
              楽曲を探す
            </Link>
          </nav>

          {/* 未ログイン時のCTAボタン */}
          <SignedOut>
            <div className="hidden md:flex items-center space-x-2">
              <Button asChild variant="outline" size="sm" className="px-4">
                <Link href="/sign-in">ログイン</Link>
              </Button>
              <Button asChild size="sm" className="px-4 bg-primary hover:bg-primary/90">
                <Link href="/sign-up">登録する</Link>
              </Button>
            </div>
          </SignedOut>

          {/* ログイン時のユーザーアイコン */}
          <SignedIn>
            <div className="flex items-center space-x-2">
              <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </button>
              <CustomUserButton />
            </div>
          </SignedIn>

          {/* モバイルメニューボタン */}
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">{isOpen ? "メニューを閉じる" : "メニューを開く"}</span>
          </button>
        </div>
      </div>

      {/* モバイルメニュー - こちらも中央寄せに調整 */}
      {isOpen && (
        <div className="fixed inset-0 top-[56px] bg-background/95 backdrop-blur-sm z-40 md:hidden overflow-y-auto">
          <div className="container max-w-7xl mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              <SignedIn>
                <Link
                  href="/upload"
                  className="flex items-center px-4 py-3 text-lg font-medium rounded-md hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Upload className="h-5 w-5 mr-3" />
                  アップロード
                </Link>
                <Link
                  href="/match"
                  className="flex items-center px-4 py-3 text-lg font-medium rounded-md hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Users className="h-5 w-5 mr-3" />
                  マッチング
                </Link>
                <Link
                  href="/community"
                  className="flex items-center px-4 py-3 text-lg font-medium rounded-md hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Users className="h-5 w-5 mr-3" />
                  コミュニティ
                </Link>
                <Link
                  href="/messages"
                  className="flex items-center px-4 py-3 text-lg font-medium rounded-md hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <MessageSquare className="h-5 w-5 mr-3" />
                  <span className="relative">
                    メッセージ
                    <Badge className="absolute -top-2 -right-6 px-1 py-0 text-[10px] bg-primary">3</Badge>
                  </span>
                </Link>
              </SignedIn>
              <Link
                href="/explore"
                className="flex items-center px-4 py-3 text-lg font-medium rounded-md hover:bg-muted transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Compass className="h-5 w-5 mr-3" />
                楽曲を探す
              </Link>

              <SignedOut>
                <div className="flex flex-col space-y-3 mt-4 pt-4 border-t border-border">
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                      ログイン
                    </Link>
                  </Button>
                  <Button asChild size="lg" className="w-full">
                    <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                      アカウント登録
                    </Link>
                  </Button>
                </div>
              </SignedOut>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
