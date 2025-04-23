import { Track } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

interface TrackListProps {
  tracks: Track[];
}

export default function TrackList({ tracks }: TrackListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tracks.map((track) => (
        <Card key={track.id} className="h-full hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <div className="h-[50px] w-[50px] bg-gray-200 rounded-md flex items-center justify-center mr-3">
                <Music size={24} className="text-gray-400" />
              </div>
              <div>
                <h3 className="font-bold truncate">{track.title}</h3>
                {track.genre && <span className="text-sm text-gray-500">{track.genre}</span>}
              </div>
            </div>

            <audio controls className="w-full mb-3">
              <source src={track.audioUrl} type="audio/mpeg" />
              お使いのブラウザはオーディオ要素をサポートしていません。
            </audio>

            {track.description && <p className="text-gray-600 text-sm line-clamp-2 mb-3">{track.description}</p>}

            <div className="flex flex-wrap gap-2 text-xs">
              {track.bpm && <span className="bg-gray-100 px-2 py-1 rounded-full">{track.bpm} BPM</span>}
              {track.key && <span className="bg-gray-100 px-2 py-1 rounded-full">{track.key}</span>}
              {track.mood && <span className="bg-gray-100 px-2 py-1 rounded-full">{track.mood}</span>}
            </div>

            <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
              <div className="flex items-center">
                <Calendar size={12} className="mr-1" />
                <span>
                  {formatDistanceToNow(new Date(track.createdAt), {
                    addSuffix: true,
                    locale: ja,
                  })}
                </span>
              </div>

              {track.recordLabel && <span>{track.recordLabel}</span>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
