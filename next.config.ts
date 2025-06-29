import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'emvtmcaetscmmdcqhpae.supabase.co',
        port: '',
        pathname: '/storage/v1/object/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/src/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/sparebite-ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/sparebite-ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/sparebite-ingest/decide',
        destination: 'https://us.i.posthog.com/decide',
      },
    ]
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
