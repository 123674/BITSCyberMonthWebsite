import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Allow the dev server to be opened through the ngrok tunnel
  allowedDevOrigins: ["footless-carport-posing.ngrok-free.dev"],
  experimental: {
    turbopackFileSystemCacheForDev: true
  },
  images: {

    remotePatterns: [
      {
        protocol: "https",
        hostname: 'ik.imagekit.io'
      }
    ],
  }
};

export default nextConfig;
