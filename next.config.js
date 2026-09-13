const { createHash } = require('node:crypto')
const { readFileSync } = require('node:fs')
const path = require('node:path')

const keystaticPatchHash = createHash('sha256')
  .update(readFileSync(path.join(__dirname, 'patches/@keystatic__core@0.6.9.patch')))
  .digest('hex')

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  webpack(config) {
    // Webpack treats node_modules as immutable at a given package version.
    // A pnpm patch can change that code without changing the package version.
    if (config.cache && config.cache.type === 'filesystem') {
      config.cache.version = `${config.cache.version}:keystatic-${keystaticPatchHash}`
    }
    return config
  },
  images: {
    domains: ['images.unsplash.com', 'tailwindui.com'],
  },
}

module.exports = nextConfig
