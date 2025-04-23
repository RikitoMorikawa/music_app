import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "img.clerk.com",
      "images.clerk.dev",
      // 他の必要なドメインがあれば追加
    ],
  },
};

export default nextConfig;
