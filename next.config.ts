import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // อนุญาตทุก hostname (สะดวกสำหรับ development)
      },
    ],
  },
};

export default nextConfig;
