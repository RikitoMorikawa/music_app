import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="w-full border-b">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center mr-4">
          <h2 className="text-2xl font-bold">MusicCollab</h2>
        </Link>
        <div className="flex-1 flex justify-end items-center">
          <nav className="flex mr-2">
            <SignedIn>
              <Link href="/upload" className="text-sm font-medium hover:underline mr-4">
                アップロード
              </Link>
              <Link href="/match" className="text-sm font-medium hover:underline mr-4">
                マッチング
              </Link>
              <Link href="/community" className="text-sm font-medium hover:underline mr-4">
                コミュニティ
              </Link>
              <Link href="/messages" className="text-sm font-medium hover:underline mr-4">
                メッセージ
              </Link>
            </SignedIn>
            <Link href="/explore" className="text-sm font-medium hover:underline mr-4">
              楽曲を探す
            </Link>
          </nav>
          <div className="flex items-center">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Button asChild variant="outline" size="sm" className="mr-2">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}
