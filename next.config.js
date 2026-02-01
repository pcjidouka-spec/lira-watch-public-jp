/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel deployment (no static export needed)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ws-fe.amazon-adsystem.com',
      },
      {
        protocol: 'https',
        hostname: 'images-fe.ssl-images-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
    ],
  },
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
