// src/types/explore/page.ts

export type Track = {
  _id: string;
  title: string;
  description: string;
  audioUrl: string;
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
  userId: string;
};
