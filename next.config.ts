import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // This stops the double-loading that confuses Supabase!
};

export default nextConfig;