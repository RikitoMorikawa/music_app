import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="w-full border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <h2 className="text-2xl font-bold">MusicCollab</h2>
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="/explore" className="text-sm font-medium hover:underline">
            楽曲を探す
          </Link>
          <SignedIn>
            <Link href="/upload" className="text-sm font-medium hover:underline">
              アップロード
            </Link>
            <Link href="/community" className="text-sm font-medium hover:underline">
              コミュニティ
            </Link>
            <Link href="/messages" className="text-sm font-medium hover:underline">
              メッセージ
            </Link>
          </SignedIn>
        </nav>
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Button asChild variant="outline" size="sm">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
