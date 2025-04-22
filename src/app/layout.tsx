// /Users/apple/music_app/music_app/src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { jaJP } from "@clerk/localizations";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// 日本語の基本設定に独自のカスタマイズを追加
const customJaJP = {
  ...jaJP,
  signIn: {
    ...jaJP.signIn,
    start: {
      ...jaJP?.signIn?.start,
      title: "MusicCollabにログイン",
      subtitle: "おかえりなさい！続けるにはログインしてください",
      actionText: "アカウントをお持ちでないですか？",
      actionLink: "登録する",
    },
    password: {
      ...jaJP.signIn?.password,
      forgotPasswordText: "パスワードをお忘れですか？",
    },
  },
  signUp: {
    ...jaJP.signUp,
    start: {
      ...jaJP.signUp?.start,
      title: "MusicCollabに登録",
      subtitle: "アカウントを作成して始めましょう",
      actionText: "すでにアカウントをお持ちですか？",
      actionLink: "ログイン",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ClerkProvider
        localization={customJaJP}
        appearance={{
          layout: {
            unsafe_disableDevelopmentModeWarnings: true,
          },
          elements: {
            formButtonPrimary: "bg-primary hover:bg-primary/90",
            formFieldInput: "border-border focus:border-primary",
            footerAction: "text-primary hover:text-primary/80",
          },
        }}
        // publishableKeyは残す（もし必要なら）
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        <html lang="ja">
          <body className={inter.className}>
            <Navbar />
            <main>{children}</main>
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
