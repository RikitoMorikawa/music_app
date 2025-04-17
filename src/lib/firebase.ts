import { initializeApp, FirebaseApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebaseアプリの初期化関数
export function initializeFirebaseApp(): FirebaseApp | undefined {
  if (!firebaseConfig.apiKey) {
    console.warn("Firebase設定が見つかりません");
    return undefined;
  }

  return initializeApp(firebaseConfig);
}

// Firebaseアプリのインスタンス
export const app = initializeFirebaseApp();

// Storageの取得
export const storage = app ? getStorage(app) : undefined;
