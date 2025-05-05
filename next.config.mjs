// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // optimizeFontsを削除し、正しいオプションを使用
  // Next.js 15.3.0に対応
  images: {
    domains: ["firebasestorage.googleapis.com", "img.clerk.com"],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
};

export default nextConfig;
