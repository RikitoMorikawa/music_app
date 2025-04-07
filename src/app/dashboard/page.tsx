import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <Button asChild>
          <Link href="/upload">Upload New Track</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <div className="aspect-square bg-muted mb-4 rounded-md"></div>
          <h3 className="font-semibold">Your Track</h3>
          <p className="text-sm text-muted-foreground mb-2">Uploaded recently</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              Edit
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
