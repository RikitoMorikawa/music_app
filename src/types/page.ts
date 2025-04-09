// src/types/index.ts

import { CollaborationStatus, SoundProductCategory, UserPlan } from "@/app/enum/page";

// ユーザー関連の型定義
export interface User {
  id: string;
  clerkId: string;
  username: string;
  name: string | null;
  email: string;
  bio: string | null;
  imageUrl: string | null;
  skills: string[];
  genres: string[];
  experienceYears?: number;
  location?: string;
  isRemote?: boolean;
  plan: UserPlan;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

// トラック関連の型定義
export interface Track {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  coverArt: string | null;
  genre: string | null;
  isPublic: boolean;
  plays: number;
  authorId: string;
  author?: User;
  collaborations?: Collaboration[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

// コラボレーション関連の型定義
export interface Collaboration {
  id: string;
  trackId: string;
  track?: Track;
  userId: string;
  user?: User;
  status: CollaborationStatus;
  createdAt: Date;
  updatedAt: Date;
}

// コメント関連の型定義
export interface Comment {
  id: string;
  content: string;
  trackId: string;
  track?: Track;
  authorId: string;
  author?: User;
  createdAt: Date;
  updatedAt: Date;
}

// マッチング関連の型定義
export interface Musician {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  primaryRole: string;
  skills: string[];
  genres: string[];
  bio: string;
  matchScore: number;
  isPremium: boolean;
  recentWork?: string;
}

export interface Project {
  id: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  description: string;
  needs: string[];
  genres: string[];
  deadline: string;
  remote: boolean;
  location?: string;
  isPremium: boolean;
  matchScore: number;
}

// マーケットプレイス関連の型定義
export interface SkillMarketplace {
  id: string;
  title: string;
  description: string;
  skills: string[];
  genres: string[];
  experienceYears: number;
  isRemote: boolean;
  rate?: string;
  projectType: string;
  userId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

// サウンドマーケットプレイス関連の型定義
export interface SoundProduct {
  id: string;
  title: string;
  description: string;
  previewUrl: string;
  fileUrl: string;
  price: number;
  category: SoundProductCategory;
  tags: string[];
  authorId: string;
  author?: User;
  purchases: number;
  createdAt: Date;
  updatedAt: Date;
}

// イベント関連の型定義
export interface IndustryEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  thumbnail: string;
  description: string;
  price: number;
  premiumDiscount: boolean;
  spots: number;
  spotsLeft: number;
  organizerId: string;
  organizer?: User;
  createdAt: Date;
  updatedAt: Date;
}

