/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for production deployment
  output: 'standalone',
  
  // API proxy to avoid CORS issues in development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/:path*',
      },
    ]
  },
};

export default nextConfig;
