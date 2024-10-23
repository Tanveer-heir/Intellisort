/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  basePath: isProd ? '/Intellisort' : '',
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig
