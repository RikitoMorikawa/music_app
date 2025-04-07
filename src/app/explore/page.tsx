import { Button } from "@/components/ui/button";

export default async function ExplorePage() {
  return (
    <div className="container px-4 py-8 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Explore Tracks</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* トラックのサンプル表示（実際にはデータベースから取得） */}
        <div className="rounded-lg border p-4">
          <div className="aspect-square bg-muted mb-4 rounded-md"></div>
          <h3 className="font-semibold">Sample Track Title</h3>
          <p className="text-sm text-muted-foreground mb-2">Artist Name</p>
          <Button variant="outline" size="sm" className="w-full">
            Play
          </Button>
        </div>
      </div>
    </div>
  );
}
