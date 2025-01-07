/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Add cookie configuration
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'parent-teacher-dbms.vercel.app']
    }
  }
};

module.exports = nextConfig;