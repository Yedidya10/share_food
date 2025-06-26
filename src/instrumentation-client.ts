import posthog from 'posthog-js'
import { externalServices } from '@/lib/envConfig'

posthog.init(externalServices.posthog.apiKey, {
  api_host: 'https://us.posthog.com',
  ui_host: 'https://us.posthog.com',
  capture_pageview: 'history_change',
  capture_pageleave: true,
  capture_exceptions: true,
  autocapture: true,
  // debug: isDev,
  fetch_options: {
    cache: 'force-cache', // Use Next.js cache
    next_options: {
      // Passed to the `next` option for `fetch`
      revalidate: 60, // Cache for 60 seconds
      tags: ['posthog'], // Can be used with Next.js `revalidateTag` function
    },
  },
})
