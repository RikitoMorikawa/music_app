"use client";

import { useUser, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        console.log("ユーザーがログインしました:", user);
      } else {
        console.log("ユーザーがログアウトしました");
      }
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="container flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </span>
          <h2 className="text-xl font-bold tracking-tighter sm:text-2xl">MusicCollab</h2>
        </Link>
        <div className="flex items-center space-x-2 md:space-x-4">
          <nav className="hidden md:flex space-x-4">
            <SignedIn>
              <Link href="/upload" className="text-sm font-medium hover:underline">
                アップロード
              </Link>
              <Link href="/match" className="text-sm font-medium hover:underline">
                マッチング
              </Link>
              <Link href="/community" className="text-sm font-medium hover:underline">
                コミュニティ
              </Link>
              <Link href="/messages" className="text-sm font-medium hover:underline">
                メッセージ
              </Link>
            </SignedIn>
            <Link href="/explore" className="text-sm font-medium hover:underline">
              楽曲を探す
            </Link>
          </nav>
          <SignedOut>
            <div className="hidden md:flex items-center space-x-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="border-t border-border px-6 py-4 md:hidden">
          <nav className="flex flex-col space-y-2 text-center">
            <SignedIn>
              <Link href="/upload" className="text-sm font-medium hover:underline">
                アップロード
              </Link>
              <Link href="/match" className="text-sm font-medium hover:underline">
                マッチング
              </Link>
              <Link href="/community" className="text-sm font-medium hover:underline">
                コミュニティ
              </Link>
              <Link href="/messages" className="text-sm font-medium hover:underline">
                メッセージ
              </Link>
            </SignedIn>
            <Link href="/explore" className="text-sm font-medium hover:underline">
              楽曲を探す
            </Link>
            <SignedOut>
              <div className="flex flex-col space-y-2">
                <Link href="/sign-in" className="text-sm underline">
                  Sign In
                </Link>
                <Link href="/sign-up" className="text-sm underline">
                  Sign Up
                </Link>
              </div>
            </SignedOut>
          </nav>
        </div>
      )}
    </header>
  );
}
