/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
    reactStrictMode: true,
  },
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.dummyjson.com",
      },
      {
        protocol: "https",
        hostname: "irppapercup.com",
      },
    ],
    minimumCacheTTL: 1500000,
    // unoptimized: true,
  },
};

module.exports = nextConfig;
