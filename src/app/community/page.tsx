"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquare } from "lucide-react";

export default function CommunityPage() {
  // Mock data
  const communities = [
    {
      id: 1,
      name: "House Music Producers",
      members: 1234,
      posts: 567,
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=300&fit=crop",
    },
    // Add more communities...
  ];

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">コミュニティ</h1>
          <Input placeholder="コミュニティを検索..." className="max-w-sm" />
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">すべて</TabsTrigger>
            <TabsTrigger value="my">参加中</TabsTrigger>
            <TabsTrigger value="recommended">おすすめ</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map((community) => (
                <Card key={community.id}>
                  <CardHeader>
                    <img src={community.image} alt={community.name} className="w-full h-48 object-cover rounded-md" />
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="mb-4">{community.name}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {community.members} メンバー
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {community.posts} 投稿
                      </div>
                    </div>
                    <Button className="w-full">参加する</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
