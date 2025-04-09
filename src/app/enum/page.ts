// エナム型定義
export enum UserPlan {
  FREE = "free",
  CREATOR = "creator",
  PRO = "pro",
  STUDIO = "studio",
}

export enum CollaborationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export enum SoundProductCategory {
  SAMPLE_PACK = "sample_pack",
  PRESET = "preset",
  LOOP = "loop",
  STEM = "stem",
  TEMPLATE = "template",
}

// フィルター関連の型定義
export interface MatchFilter {
  skill: string[];
  genre: string[];
  experience: string;
  isRemote?: boolean;
  location?: string;
  matchThreshold: number[];
  keyword?: string;
}
