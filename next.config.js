/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true, remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  experimental: { serverActions: { bodySizeLimit: '15mb' } },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
}
module.exports = nextConfig
