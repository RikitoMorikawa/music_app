"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendHorizontal } from "lucide-react";

export default function MessagesPage() {
  const [message, setMessage] = useState("");

  // Mock data
  const conversations = [
    {
      id: 1,
      user: {
        name: "DJ Cool",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      },
      messages: [
        { id: 1, text: "こんにちは！", sent: false, time: "14:30" },
        { id: 2, text: "新しいトラックについて話したいです", sent: false, time: "14:31" },
        { id: 3, text: "はい、どうぞ！", sent: true, time: "14:32" },
      ],
    },
    // Add more conversations...
  ];

  return (
    <div className="w-full min-h-screen py-8 pb-16 bg-gradient-to-b from-primary/20 via-primary/5 to-background">
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-16rem)]">
          {/* Conversations list */}
          <Card className="col-span-12 md:col-span-4">
            <CardHeader>
              <CardTitle>メッセージ</CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="検索..." className="mb-4" />
              <ScrollArea className="h-[calc(100vh-20rem)]">
                {conversations.map((conv) => (
                  <div key={conv.id} className="flex items-center space-x-4 p-4 hover:bg-accent rounded-lg cursor-pointer">
                    <Avatar>
                      <AvatarImage src={conv.user.avatar} />
                      <AvatarFallback>{conv.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{conv.user.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">{conv.messages[conv.messages.length - 1].text}</p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat area */}
          <Card className="col-span-12 md:col-span-8">
            <CardHeader className="border-b">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={conversations[0].user.avatar} />
                  <AvatarFallback>{conversations[0].user.name[0]}</AvatarFallback>
                </Avatar>
                <CardTitle>{conversations[0].user.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-28rem)] p-4">
                {conversations[0].messages.map((msg) => (
                  <div key={msg.id} className={`flex mb-4 ${msg.sent ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] p-3 rounded-lg ${msg.sent ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <p>{msg.text}</p>
                      <span className="text-xs opacity-70">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setMessage("");
                  }}
                  className="flex space-x-2"
                >
                  <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="メッセージを入力..." />
                  <Button type="submit">
                    <SendHorizontal className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
