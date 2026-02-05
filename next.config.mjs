/** @type {import('next').NextConfig} */
const nextConfig = {
  // Option 1: Use rewrites to proxy all API calls (RECOMMENDED)
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`,
          basePath: false,
        },
      ],
    };
  },

  // Option 2: If rewrites don't work, use redirects
  async redirects() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/:path*`,
        permanent: false,
      },
    ];
  },

  // Disable image optimization if not needed
  images: {
    unoptimized: true,
  },

  // Enable CORS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Or your specific domain
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
        ],
      },
    ];
  },
};

export default nextConfig;

