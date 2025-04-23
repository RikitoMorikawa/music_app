"use client";
// src / app / explore / page.tsx;

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, PlayCircle, PauseCircle, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

// 型定義を既存のAPIレスポンスに合わせて調整
type Track = {
  id: string;
  title: string;
  description: string | null;
  audioUrl: string;
  userId: string;
  createdAt: string;
};

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalDurations, setTotalDurations] = useState<Record<string, number>>({});
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const progressBarRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // 再生時間を表示用のフォーマットに変換
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // オーディオファイルの実際の長さを取得
  const getAudioDuration = async (track: Track) => {
    return new Promise<void>((resolve) => {
      const audio = new Audio(track.audioUrl);

      audio.addEventListener("loadedmetadata", () => {
        setTotalDurations((prev) => ({
          ...prev,
          [track.id]: audio.duration,
        }));

        resolve();
      });

      audio.addEventListener("error", () => {
        setTotalDurations((prev) => ({
          ...prev,
          [track.id]: 0,
        }));

        resolve();
      });
    });
  };

  // 進捗率の計算
  const calculateProgress = () => {
    if (currentTrackId && totalDurations[currentTrackId] > 0) {
      const percentage = (currentTime / totalDurations[currentTrackId]) * 100;
      setProgressPercentage(Math.min(percentage, 100));
    } else {
      setProgressPercentage(0);
    }
  };

  // タイマーの開始
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    }, 100);
  };

  // タイマーの停止
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // シーク機能 - プログレスバークリック時に再生位置を変更
  const handleSeek = (trackId: string, event: React.MouseEvent<HTMLDivElement>) => {
    if (trackId !== currentTrackId) return;

    const progressBar = progressBarRefs.current[trackId];
    if (!progressBar || !audioRef.current) return;

    const rect = progressBar.getBoundingClientRect();
    const clickPosition = event.clientX - rect.left;
    const percentageClicked = clickPosition / rect.width;

    const newTime = percentageClicked * totalDurations[trackId];

    // オーディオの再生位置を設定
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // 現在の再生時間が変わるたびに進捗率を更新
  useEffect(() => {
    calculateProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime, currentTrackId]);

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/explore");

        if (!res.ok) {
          const errorText = await res.text();
          console.error("サーバーレスポンスエラー:", res.status, errorText);

          if (res.status === 404) {
            toast.error("エンドポイントが見つかりません");
          } else if (res.status === 500) {
            toast.error("サーバー内部エラーが発生しました");
          } else {
            toast.error(`トラックの取得に失敗しました (${res.status})`);
          }

          throw new Error(`サーバーエラー: ${res.status}`);
        }

        // 204の場合は空配列を設定
        if (res.status === 204) {
          setTracks([]);
          return;
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("無効なデータ形式");
        }

        console.log("取得したトラック:", data);
        setTracks(data);

        // 各トラックの再生時間を取得
        for (const track of data) {
          getAudioDuration(track);
        }
      } catch (error) {
        console.error("トラック取得エラー:", error);
        toast.error("トラックの読み込みに失敗しました");
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();

    // コンポーネントのアンマウント時にタイマーをクリア
    return () => {
      stopTimer();
    };
  }, []);

  const togglePlay = (track: Track, event?: React.MouseEvent) => {
    // シークバーのクリックイベントが親要素に伝播しないように防止
    if (event) {
      event.stopPropagation();
    }

    if (currentTrack === track.audioUrl) {
      if (isPlaying) {
        audioRef.current?.pause();
        stopTimer();
      } else {
        audioRef.current?.play();
        startTimer();
      }
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track.audioUrl);
      setCurrentTrackId(track.id);
      setCurrentTime(0);
      setProgressPercentage(0);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (currentTrack) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      audioRef.current = new Audio(currentTrack);
      audioRef.current.play().catch((error) => {
        console.error("再生エラー:", error);
        toast.error("音声の再生に失敗しました");
        setIsPlaying(false);
        stopTimer();
      });

      startTimer();

      const audioElement = audioRef.current;

      const endedHandler = () => {
        setIsPlaying(false);
        stopTimer();
        setCurrentTime(0);
        setProgressPercentage(0);
      };

      const timeUpdateHandler = () => {
        setCurrentTime(audioElement.currentTime);
      };

      audioElement.addEventListener("ended", endedHandler);
      audioElement.addEventListener("timeupdate", timeUpdateHandler);

      return () => {
        audioElement.removeEventListener("ended", endedHandler);
        audioElement.removeEventListener("timeupdate", timeUpdateHandler);
        audioElement.pause();
        stopTimer();
      };
    }
  }, [currentTrack]);

  // 検索フィルター
  const filteredTracks = tracks.filter(
    (track) => track.title.toLowerCase().includes(search.toLowerCase()) || (track.description && track.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full py-8 bg-gradient-to-b from-primary/20 via-primary/5 to-background">
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Input placeholder="サンプルを検索..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-72" />
              <Button>
                <SearchIcon className="h-4 w-4 mr-2" />
                検索
              </Button>
            </div>
            <Button variant="outline">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              並び替え
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <div className="bg-card rounded-md shadow">
              {filteredTracks.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 w-8"></th>
                      <th className="text-left p-3">ファイル名</th>
                      <th className="text-right p-3">時間</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTracks.map((track) => (
                      <tr key={track.id} className="border-b hover:bg-muted/50 cursor-pointer transition-colors" onClick={(e) => togglePlay(track, e)}>
                        <td className="p-3">
                          <button
                            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-primary/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlay(track);
                            }}
                          >
                            {currentTrack === track.audioUrl && isPlaying ? <PauseCircle className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
                          </button>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-col space-y-2">
                            <p className="font-medium">{track.title}</p>

                            {/* プログレスバー（シークバー機能付き） */}
                            <div
                              ref={(el) => {
                                progressBarRefs.current[track.id] = el;
                              }}
                              className="h-1.5 w-full bg-muted rounded-full overflow-hidden cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSeek(track.id, e);
                              }}
                            >
                              {currentTrackId === track.id && (
                                <div className="h-full bg-primary transition-all duration-100" style={{ width: `${progressPercentage}%` }} />
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-right text-muted-foreground">
                          {currentTrackId === track.id && isPlaying ? formatTime(currentTime) : formatTime(totalDurations[track.id] || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center text-muted-foreground">{search ? "検索結果が見つかりませんでした" : "トラックがありません"}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
