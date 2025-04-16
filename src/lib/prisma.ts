// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// グローバルスコープでPrismaClientのインスタンスを宣言
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 開発モードでの複数のインスタンス作成を防ぐ
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
