import { isDev, externalServices } from '@/lib/envConfig'
import posthog from 'posthog-js'

const toDebug = false

posthog.init(externalServices.posthog.apiKey, {
  api_host: 'https://us.posthog.com',
  ui_host: 'https://us.posthog.com',
  capture_pageview: 'history_change',
  capture_pageleave: true,
  capture_exceptions: true,
  autocapture: true,
  debug: isDev && toDebug,
})
