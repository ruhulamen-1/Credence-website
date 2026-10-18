import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// `npm run dev` blocks scripts when the page is opened through a network address (e.g. http://192.168.1.5:3000) instead of
// localhost — the page then looks frozen and /admin stays blank. Allow this computer's own network addresses (+ DEV_ORIGINS=a,b).
const lanAddresses = Object.values(os.networkInterfaces()).flat().filter((i) => i && i.family === 'IPv4' && !i.internal).map((i) => i!.address)
const extraOrigins = (process.env.DEV_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean)

const nextConfig: NextConfig = {
  allowedDevOrigins: [...lanAddresses, ...extraOrigins],
  // The shared-hosting export builds into its own folder so it never disturbs the normal `.next` build.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
