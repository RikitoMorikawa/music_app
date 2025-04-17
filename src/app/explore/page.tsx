"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { SearchIcon, PlayCircle, Heart } from "lucide-react";

export default function ExplorePage() {
  const [search, setSearch] = useState("");

  // Mock data - In a real app, this would come from your database
  const tracks = [
    {
      id: 1,
      title: "Summer Vibes",
      artist: "DJ Cool",
      genre: "House",
      plays: 1234,
      likes: 89,
      coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    },
    // Add more mock tracks...
  ];

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center space-x-4">
          <Input placeholder="トラックを検索..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
          <Button>
            <SearchIcon className="h-4 w-4 mr-2" />
            検索
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <Card key={track.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {track.title}
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{track.artist}</span>
                  <span className="text-sm text-muted-foreground">{track.genre}</span>
                </div>
                <Slider defaultValue={[0]} max={100} step={1} className="mt-4" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  再生
                </Button>
                <div className="text-sm text-muted-foreground">
                  {track.plays} plays • {track.likes} likes
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
