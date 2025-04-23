// src/components/profile/ProfileHeader.tsx
import { User } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin, Music } from "lucide-react";

interface ProfileHeaderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: User & { tracks: any[] };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            {user.imageUrl ? (
              // 一時的な回避策として、Image コンポーネントの代わりに img タグを使用
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={user.imageUrl} 
                alt={user.name || user.username} 
                width={120} 
                height={120} 
                className="rounded-full object-cover w-[120px] h-[120px]" 
              />
            ) : (
              <div className="w-[120px] h-[120px] bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">{user.username.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>

          <div className="flex-grow">
            <h1 className="text-3xl font-bold">{user.name || user.username}</h1>
            <p className="text-gray-500">@{user.username}</p>

            {user.bio && <p className="mt-3">{user.bio}</p>}

            <div className="mt-4 flex flex-wrap gap-2">
              {user.location && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
              <a
                href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                  <ExternalLink size={16} />
                  <span>ウェブサイト</span>
                </a>
              )}
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {user.primaryInstrument && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Music size={14} />
                    <span>{user.primaryInstrument}</span>
                  </Badge>
                )}

                {user.secondaryInstruments?.map((instrument, i) => (
                  <Badge key={i} variant="outline">
                    {instrument}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {user.primaryGenre && <Badge>{user.primaryGenre}</Badge>}

                {user.otherGenres?.map((genre, i) => (
                  <Badge key={i} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            {user.experienceLevel && (
              <div className="mt-3">
                <span className="text-sm font-medium">経験レベル: </span>
                <span>{user.experienceLevel}</span>
              </div>
            )}

            {user.influences && (
              <div className="mt-2">
                <span className="text-sm font-medium">影響を受けたアーティスト: </span>
                <span>{user.influences}</span>
              </div>
            )}

            {user.lookingFor && (
              <div className="mt-2">
                <span className="text-sm font-medium">探しているもの: </span>
                <span>{user.lookingFor}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}