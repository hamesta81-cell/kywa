import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" }
    ]
  },
  async redirects() {
    return [
      {
        source: "/contest",
        has: [
          {
            type: "query",
            key: "tab",
            value: "vote",
          },
        ],
        destination: "/challenge",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
