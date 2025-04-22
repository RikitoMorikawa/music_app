"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Clerk } from "@clerk/types";
import { useAuth } from "@/hooks/useAuth";
// グローバルウィンドウに Clerk を宣言
declare global {
  interface Window {
    Clerk?: Clerk;
  }
}

export function CustomUserButton() {
  console.log("Clerk");
  const { user } = useUser();
  console.log("MongoDB");
  const { userData } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          <Avatar className="h-10 w-10 border-2 border-border hover:border-primary transition-colors">
            <AvatarImage src={user?.imageUrl || ""} alt={userData?.username || "ユーザープロフィール"} className="object-cover" />
            <AvatarFallback>{userData?.username?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{userData?.username}</p>
            <p className="text-xs text-muted-foreground truncate">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* プロフィール設定へのリンク */}
        <DropdownMenuItem onClick={() => router.push("/profiles")}>
          <UserPlus className="mr-2 h-4 w-4" />
          <span>プロフィール設定</span>
        </DropdownMenuItem>

        {/* 既存のClerkメニュー項目を維持 */}
        <DropdownMenuItem onClick={() => window.Clerk?.openUserProfile()}>
          <Settings className="mr-2 h-4 w-4" />
          <span>アカウント設定</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            signOut({ redirectUrl: "/" })
              .then(() => router.push("/"))
              .catch((err) => console.error("ログアウトエラー:", err));
          }}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>ログアウト</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
