"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SearchIcon, PlayCircle, PauseCircle } from "lucide-react";
import { Track } from "@/types/explore/page";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { initializeFirebaseApp } from "@/lib/firebase";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Firebaseアプリの初期化
  useEffect(() => {
    initializeFirebaseApp();
  }, []);

  useEffect(() => {
    // Fetch tracks from your API
    const fetchTracks = async () => {
      try {
        const res = await fetch("/api/explore");
        if (!res.ok) {
          throw new Error("トラックの取得に失敗しました");
        }
        const data: Track[] = await res.json();

        // Firebase Storageからダウンロード可能なURLを取得
        const storage = getStorage();
        const tracksWithUrls = await Promise.all(
          data.map(async (track) => {
            try {
              const audioRef = ref(storage, track.audioUrl);
              const downloadUrl = await getDownloadURL(audioRef);
              return { ...track, audioUrl: downloadUrl };
            } catch (urlError) {
              console.error(`URLの取得に失敗: ${track.audioUrl}`, urlError);
              return track;
            }
          })
        );

        setTracks(tracksWithUrls);
      } catch (error) {
        console.error("トラック取得エラー:", error);
      }
    };

    fetchTracks();
  }, []);

  // 以下のコードは以前と同じ
  const togglePlay = (track: Track) => {
    if (currentTrack === track.audioUrl) {
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track.audioUrl);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (currentTrack) {
      // 既存のオーディオを停止
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // 新しいオーディオ要素を作成
      audioRef.current = new Audio(currentTrack);
      audioRef.current.play().catch((error) => {
        console.error("再生エラー:", error);
      });

      const audioElement = audioRef.current;
      const endedHandler = () => {
        setIsPlaying(false);
      };

      audioElement.addEventListener("ended", endedHandler);

      return () => {
        audioElement.removeEventListener("ended", endedHandler);
        audioElement.pause();
      };
    }
  }, [currentTrack]);

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Input placeholder="トラックを検索..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-72" />
            <Button>
              <SearchIcon className="h-4 w-4 mr-2" />
              検索
            </Button>
          </div>
          <Button variant="outline">フィルター</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tracks.map((track, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">{track.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{track.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center p-6">
                <span className="text-sm text-muted-foreground">{track.userId.slice(0, 5)}</span>
                <Button variant="ghost" size="sm" onClick={() => togglePlay(track)}>
                  {currentTrack === track.audioUrl && isPlaying ? <PauseCircle className="h-4 w-4 mr-2" /> : <PlayCircle className="h-4 w-4 mr-2" />}
                  {currentTrack === track.audioUrl && isPlaying ? "一時停止" : "再生"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
