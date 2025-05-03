import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    USERS_TABLE_NAME: process.env.USERS_TABLE_NAME,
    PRESETS_TABLE_NAME: process.env.PRESETS_TABLE_NAME,
    GENERATE_SHORTS_JOBS_TABLE_NAME: process.env.GENERATE_SHORTS_JOBS_TABLE_NAME,
  },
};

export default nextConfig;
