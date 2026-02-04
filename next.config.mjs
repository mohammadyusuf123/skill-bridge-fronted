/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
 async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://skill-bridge-backend-production-27ac.up.railway.app/api/:path*',
      },
    ];
  },
};




export default nextConfig;

