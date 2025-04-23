"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [bpm, setBpm] = useState("");
  const [key, setKey] = useState("");
  const [mood, setMood] = useState("");
  const [instrumentalType, setInstrumentalType] = useState("");
  const [recordLabel, setRecordLabel] = useState("");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!title) {
      toast.error("タイトルを入力してください");
      return;
    }

    if (!selectedFile) {
      toast.error("オーディオファイルを選択してください");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // FormDataを作成
      const formData = new FormData();
      formData.append("title", title);
      formData.append("genre", genre);
      formData.append("description", description);
      formData.append("audioFile", selectedFile);
      formData.append("bpm", bpm);
      formData.append("key", key);
      formData.append("mood", mood);
      formData.append("instrumentalType", instrumentalType);
      formData.append("recordLabel", recordLabel);
      
      // サーバー側APIを呼び出し
      const response = await fetch("/api/tracks", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("サーバーエラー:", errorText);
        throw new Error(`サーバーエラー (${response.status}): ${errorText.substring(0, 100)}...`);
      }

      const { track, uploadPath } = await response.json();
      console.log("トラック保存成功:", track);
      console.log("アップロードパス:", uploadPath);

      // Firebase Storageにアップロード
      const storageRef = ref(storage, uploadPath);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      // アップロード進捗の監視
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Firebaseアップロードエラー:", error);
          setUploadStatus("error");
          setUploading(false);
          toast.error("ファイルのアップロードに失敗しました");
        },
        async () => {
          try {
            // アップロード完了、ダウンロードURLの取得
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("ファイルURL:", downloadURL);

            // トラックURLを更新
            const updateResponse = await fetch(`/api/tracks/${track.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ audioUrl: downloadURL }),
            });

            if (!updateResponse.ok) {
              throw new Error("トラック情報の更新に失敗しました");
            }

            setUploadStatus("success");
            toast.success("トラックが正常にアップロードされました");

            setTimeout(() => {
              router.push("/explore");
            }, 2000);
          } catch (err) {
            console.error("トラック更新エラー:", err);
            setUploadStatus("error");
            toast.error("トラック情報の更新に失敗しました");
            setUploading(false);
          }
        }
      );
    } catch (error) {
      console.error("エラー:", error);
      setUploadStatus("error");
      setUploading(false);
      toast.error(error instanceof Error ? error.message : "アップロードに失敗しました");
    }
  };

  // レンダリング部分は変更なし（省略）
  return (
    <div className="w-full py-8 bg-gradient-to-b from-primary/20 via-primary/5 to-background">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto border border-border rounded-xl overflow-hidden transition-all">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-2xl font-bold">新しいトラックをアップロード</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleUpload} className="space-y-6">
              {/* フォーム内容は変更なし */}
              <div className="space-y-2">
                <label htmlFor="track-title" className="text-sm font-medium block">
                  トラックタイトル<span className="text-red-500">*</span>
                </label>
                <Input
                  id="track-title"
                  placeholder="トラックのタイトルを入力"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={uploading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium block">ジャンル</label>
                <Select value={genre} onValueChange={setGenre} disabled={uploading}>
                  <SelectTrigger>
                    <SelectValue placeholder="ジャンルを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="techno">Techno</SelectItem>
                    <SelectItem value="hiphop">Hip Hop</SelectItem>
                    <SelectItem value="rock">Rock</SelectItem>
                    <SelectItem value="pop">Pop</SelectItem>
                    <SelectItem value="jazz">Jazz</SelectItem>
                    <SelectItem value="classical">Classical</SelectItem>
                    <SelectItem value="ambient">Ambient</SelectItem>
                    <SelectItem value="other">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="track-description" className="text-sm font-medium block">
                  説明
                </label>
                <Textarea
                  id="track-description"
                  placeholder="トラックの説明を入力"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={uploading}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium block">BPM</label>
                  <Input type="number" placeholder="トラックのテンポ" value={bpm} onChange={(e) => setBpm(e.target.value)} disabled={uploading} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium block">キー</label>
                  <Select value={key} onValueChange={setKey} disabled={uploading}>
                    <SelectTrigger>
                      <SelectValue placeholder="音階を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"].map((key) => (
                        <SelectItem key={key} value={key}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium block">ムード</label>
                  <Select value={mood} onValueChange={setMood} disabled={uploading}>
                    <SelectTrigger>
                      <SelectValue placeholder="トラックの雰囲気" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Happy", "Sad", "Energetic", "Calm", "Melancholic", "Romantic", "Dark", "Uplifting"].map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium block">インストゥルメント</label>
                  <Select value={instrumentalType} onValueChange={setInstrumentalType} disabled={uploading}>
                    <SelectTrigger>
                      <SelectValue placeholder="トラックのタイプ" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Full Band", "Solo Instrument", "Electronic", "Acapella", "Remix", "Instrumental"].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium block">レコードレーベル</label>
                  <Input placeholder="レーベル名" value={recordLabel} onChange={(e) => setRecordLabel(e.target.value)} disabled={uploading} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium block">
                  オーディオファイル<span className="text-red-500">*</span>
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    selectedFile ? "bg-primary/5 border-primary" : "hover:bg-muted/50 hover:border-muted-foreground"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={triggerFileInput}
                >
                  {selectedFile ? (
                    <div className="space-y-2">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        disabled={uploading}
                      >
                        変更
                      </Button>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="h-8 w-8 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">ドラッグ＆ドロップまたはクリックしてファイルを選択</p>
                      <p className="text-xs text-muted-foreground mb-4">サポートフォーマット: MP3, WAV, AAC (最大 20MB)</p>
                      <Button type="button" variant="outline" size="sm" disabled={uploading}>
                        ファイルを選択
                      </Button>
                    </>
                  )}
                  <Input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
                </div>
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="text-sm flex justify-between">
                    <span>アップロード中...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${uploadStatus === "error" ? "bg-destructive" : "bg-primary"}`}
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  {uploadStatus === "success" && (
                    <div className="flex items-center text-primary">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>アップロード完了! ダッシュボードに移動します...</span>
                    </div>
                  )}
                  {uploadStatus === "error" && (
                    <div className="flex items-center text-destructive">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>エラーが発生しました。もう一度お試しください。</span>
                    </div>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full font-semibold bg-primary hover:bg-primary/90" disabled={uploading || !selectedFile || !title}>
                {uploading ? "アップロード中..." : "アップロード"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
