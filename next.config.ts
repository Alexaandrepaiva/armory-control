import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "p345cdotr9.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
