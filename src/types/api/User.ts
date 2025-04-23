// DBから取得したユーザーデータをミュージシャンデータに変換
export type APIUser = {
  id?: string;
  _id?: string;
  username?: string;
  imageUrl?: string;
  clerkId: string;
  bio?: string;
  location?: string;
  primaryInstrument?: string;
  secondaryInstruments?: string[];
  primaryGenre?: string;
  otherGenres?: string[];
  experienceLevel?: string;
  influences?: string;
  lookingFor?: string;
};
