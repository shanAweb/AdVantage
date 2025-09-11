/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed output: 'export' to enable dynamic routing for user-generated content
  // Static export is not suitable for apps with authentication, database feeds, and real-time features
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  },
  // Enable server-side features for dynamic content
  experimental: {
    esmExternals: false,
  },
  // Configure for cPanel deployment
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
}

module.exports = nextConfig