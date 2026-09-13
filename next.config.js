/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    domains: ['images.unsplash.com', 'tailwindui.com'],
  },
}

module.exports = nextConfig
