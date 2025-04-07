"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    // Handle upload logic here
    setTimeout(() => setUploading(false), 2000);
  };

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>新しいトラックをアップロード</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">トラックタイトル</label>
              <Input placeholder="トラックのタイトルを入力" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">ジャンル</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="ジャンルを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="techno">Techno</SelectItem>
                  <SelectItem value="hiphop">Hip Hop</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">説明</label>
              <Textarea placeholder="トラックの説明を入力" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">オーディオファイル</label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <UploadCloud className="h-8 w-8 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">ドラッグ＆ドロップまたはクリックしてファイルを選択</p>
                <Input type="file" accept="audio/*" className="hidden" id="audio-upload" />
                <Button variant="outline" onClick={() => document.getElementById("audio-upload")?.click()}>
                  ファイルを選択
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={uploading}>
              {uploading ? "アップロード中..." : "アップロード"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
