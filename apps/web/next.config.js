/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@nate/ui', '@nate/macro-tracker'],
};

module.exports = nextConfig;
