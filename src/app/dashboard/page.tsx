"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    redirect("/sign-in");
    return null;
  }

  const handleUploadClick = () => {
  };

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <Button asChild onClick={handleUploadClick}>
          <Link href="/upload">Upload New Track</Link>
        </Button>
      </div>
    </div>
  );
}
