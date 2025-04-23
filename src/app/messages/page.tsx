"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SendHorizontal, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

// 型定義
interface Participant {
  id: string;
  username: string;
  name?: string;
  imageUrl?: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  readAt?: string;
  sender?: Participant;
}

interface Conversation {
  id: string;
  participantIds: string[];
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
  status: string;
  creditUsed: boolean;
  messages: Message[];
  participants: Participant[];
}

export default function MessagesPage() {
  const { userData, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 認証チェック
  useEffect(() => {
    if (!authLoading && !userData) {
      router.push("/sign-in");
    }
  }, [userData, authLoading, router]);

  // 会話一覧を取得
  useEffect(() => {
    const fetchConversations = async () => {
      if (!userData) return;

      try {
        setConversationsLoading(true);
        setError(null);

        const response = await fetch("/api/conversations");

        if (!response.ok) {
          if (response.status === 401) {
            // 認証エラーの場合はログインページにリダイレクト
            router.push("/sign-in");
            return;
          }

          throw new Error("会話の取得に失敗しました");
        }

        const data = await response.json();
        setConversations(data);

        // 最初の会話を選択
        if (data.length > 0 && !currentConversation) {
          setCurrentConversation(data[0]);
        }
      } catch (error) {
        console.error("会話取得エラー:", error);
        // エラーメッセージを表示するが、致命的ではないのでLoadingはfalseに
      } finally {
        setConversationsLoading(false);
        setLoading(false);
      }
    };

    if (userData) {
      fetchConversations();
    }
  }, [userData, currentConversation, router]);

  // 現在の会話のメッセージを取得
  useEffect(() => {

    const fetchMessages = async () => {
      if (!currentConversation || !userData) return;

      setMessagesLoading(true);

      try {
        const response = await fetch(`/api/conversations/${currentConversation.id}/messages`);

        if (!response.ok) {
          // エラー処理（前と同じ）
          if (response.status === 404) {
            setMessages([]);
            return;
          }

          if (response.status === 401) {
            router.push("/sign-in");
            return;
          }

          console.error(`API エラー: ${response.status} ${response.statusText}`);
          setMessages([]);
          return;
        }

        const data = await response.json();
        console.log("API response data:", data); // ここにログを追加

        // 受信したデータが配列であることを確認
        if (Array.isArray(data)) {
          setMessages(data);
          console.log("Updated messages state:", data); // ここにログを追加
        } else if (data && Array.isArray(data.messages)) {
          // 以前の形式の場合のフォールバック
          setMessages(data.messages);
          console.log("Updated messages state:", data.messages); // ここにログを追加
        } else {
          // データ形式が不正な場合は空の配列を設定
          console.error("不正なデータ形式:", data);
          setMessages([]);
        }
      } catch (error) {
        console.error("メッセージ取得エラー:", error);
        setMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    };

    if (currentConversation) {
      fetchMessages();
    }
  }, [currentConversation, userData, router]);

  // メッセージが更新されたときに自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 会話を選択
  const selectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
  };

  // メッセージを送信
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !currentConversation || !userData) return;

    // 送信前にUIにメッセージを追加（楽観的更新）
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      conversationId: currentConversation.id,
      senderId: userData.id,
      content: message,
      createdAt: new Date().toISOString(),
      sender: {
        id: userData.id,
        username: userData.username,
        name: userData.name,
        imageUrl: userData.imageUrl,
      },
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    // 入力フィールドをクリア
    setMessage("");

    try {
      setSending(true);
      const response = await fetch(`/api/conversations/${currentConversation.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: message }),
      });

      if (!response.ok) {
        throw new Error("メッセージの送信に失敗しました");
      }

      // 送信成功 - メッセージ一覧を再取得
      const newMessagesResponse = await fetch(`/api/conversations/${currentConversation.id}/messages`);

      if (newMessagesResponse.ok) {
        const data = await newMessagesResponse.json();
        console.log("API response data:", data);
        setMessages(data);
      }
    } catch (error) {
      console.error("メッセージ送信エラー:", error);
      setError("メッセージの送信に失敗しました。もう一度お試しください。");
      // 楽観的更新を元に戻す
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id));
    } finally {
      setSending(false);
    }
  };

  // メッセージの送信者がログインユーザーかどうか判定
  const isCurrentUser = (senderId: string) => {
    return userData?.id === senderId;
  };

  // 日時を整形
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // 再試行ボタン
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    setError(null);
    // 会話がある場合はメッセージを再取得
    if (currentConversation) {
      setLoading(true);
    } else {
      // 会話一覧を再取得
      setConversationsLoading(true);
    }
  };

  if (authLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/20 via-primary/5 to-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="w-full min-h-screen py-8 pb-16 bg-gradient-to-b from-primary/20 via-primary/5 to-background">
      <div className="container max-w-6xl mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button variant="outline" size="sm" className="ml-2" onClick={handleRetry}>
                再試行
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-16rem)]">
          {/* Conversations list */}
          <Card className="col-span-12 md:col-span-4">
            <CardHeader>
              <CardTitle>メッセージ</CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="検索..." className="mb-4" />
              <ScrollArea className="h-[calc(100vh-20rem)]">
                {conversationsLoading ? (
                  <div className="flex justify-center items-center h-20">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="text-center text-muted-foreground p-4">
                    会話がありません
                    <div className="mt-4">
                      <Button variant="outline" onClick={() => router.push("/match")}>
                        マッチングページへ
                      </Button>
                    </div>
                  </div>
                ) : (
                  conversations.map((conv) => {
                    // 相手のユーザー情報を取得
                    const otherUser = conv.participants?.[0] || {
                      username: "不明なユーザー",
                      imageUrl: undefined,
                    };

                    // 最新のメッセージ
                    const lastMessage = conv.messages?.[0]?.content || "メッセージはまだありません";

                    return (
                      <div
                        key={conv.id}
                        className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer ${
                          currentConversation?.id === conv.id ? "bg-accent" : "hover:bg-accent/50"
                        }`}
                        onClick={() => selectConversation(conv)}
                      >
                        <Avatar>
                          <AvatarImage src={otherUser.imageUrl} />
                          <AvatarFallback>{otherUser.username?.[0]?.toUpperCase() || "?"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold">{otherUser.name || otherUser.username}</h4>
                          <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat area */}
          <Card className="col-span-12 md:col-span-8">
            {currentConversation ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center space-x-4">
                    {currentConversation.participants && currentConversation.participants.length > 0 && (
                      <>
                        <Avatar>
                          <AvatarImage src={currentConversation.participants[0].imageUrl} />
                          <AvatarFallback>{currentConversation.participants[0].username?.[0]?.toUpperCase() || "?"}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{currentConversation.participants[0].name || currentConversation.participants[0].username}</CardTitle>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[calc(100vh-28rem)] p-4">
                    {messagesLoading ? (
                      <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : !messages || messages.length === 0 ? (
                      <div className="flex justify-center items-center h-full text-muted-foreground">
                        メッセージはまだありません。最初のメッセージを送信しましょう！
                      </div>
                    ) : (
                      <>
                        {messages.map((msg) => (
                          <div key={msg.id} className={`flex mb-4 ${isCurrentUser(msg.senderId) ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[70%] p-3 rounded-lg ${isCurrentUser(msg.senderId) ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                              <p>{msg.content}</p>
                              <span className="text-xs opacity-70">{formatTime(msg.createdAt)}</span>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <form onSubmit={sendMessage} className="flex space-x-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="メッセージを入力..."
                        disabled={sending || messagesLoading}
                      />
                      <Button type="submit" disabled={sending || messagesLoading || !message.trim()}>
                        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="flex justify-center items-center h-full p-6 text-center text-muted-foreground">
                {loading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <div>
                    <p className="mb-2">会話を選択するか、新しいコンタクトを開始してください</p>
                    <Button variant="outline" onClick={() => router.push("/match")} className="mt-2">
                      マッチングページへ
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
