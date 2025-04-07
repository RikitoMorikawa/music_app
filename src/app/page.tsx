import { Button } from "@/components/ui/button";
import { Music2Icon, UsersIcon, MessageSquareIcon, LayersIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-24 bg-gradient-to-b from-primary/10 to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">Connect. Create. Collaborate.</h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Join the community of music creators. Find collaborators, share your tracks, and grow together.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/explore">Explore Tracks</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <Music2Icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Share Tracks</h3>
              <p className="text-sm text-muted-foreground">Upload and share your music with the community</p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <UsersIcon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Find Collaborators</h3>
              <p className="text-sm text-muted-foreground">Connect with other musicians and creators</p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <MessageSquareIcon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Real-time Chat</h3>
              <p className="text-sm text-muted-foreground">Communicate seamlessly with collaborators</p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <LayersIcon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Join Communities</h3>
              <p className="text-sm text-muted-foreground">Be part of genre-specific music communities</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
