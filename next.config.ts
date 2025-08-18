// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co', // For Spotify album art
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'media.gettyimages.com', // For your curated shelf
        port: '',
        pathname: '**',
      },
       {
        protocol: 'https',
        hostname: 's1.ticketm.net', // For Ticketmaster images
        port: '',
        pathname: '**',
      },
    ],
  },
};
export default nextConfig;