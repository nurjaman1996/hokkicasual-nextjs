/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.dummyjson.com",
      },
    ],
    minimumCacheTTL: 1500000,
    // unoptimized: true,
  },
};

module.exports = nextConfig;
