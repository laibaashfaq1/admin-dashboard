import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"cdn.sanity.io",
      }
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // Not recommended for production; consider fixing errors instead
  },
};

export default nextConfig;
