import { create } from "zustand";

interface Track {
  id: string;
  title: string;
  audioUrl: string;
  imageUrl?: string;
}

interface TrackStore {
  tracks: Track[];
  currentTrack: Track | null;
  setTracks: (tracks: Track[]) => void;
  setCurrentTrack: (track: Track) => void;
}

export const useTrackStore = create<TrackStore>((set) => ({
  tracks: [],
  currentTrack: null,
  setTracks: (tracks) => set({ tracks }),
  setCurrentTrack: (track) => set({ currentTrack: track }),
}));
