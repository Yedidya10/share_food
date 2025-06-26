import { env } from './zod/env'

type Env = 'development' | 'preview' | 'production'

// Get the current environment based on environment variables
const getCurrentEnv = (): Env => {
  if (env.NEXT_PUBLIC_ENV) return env.NEXT_PUBLIC_ENV
  if (env.VERCEL_ENV === 'preview') return 'preview'
  if (env.NODE_ENV === 'production') return 'production'
  return 'development'
}

export const currentEnv: Env = getCurrentEnv()
export const isDev = currentEnv === 'development'
export const isPreview = currentEnv === 'preview'
export const isProd = currentEnv === 'production'

// Base URL for server-side code
export const serverBaseUrl = (() => {
  if (env.NEXT_PUBLIC_BASE_URL) return env.NEXT_PUBLIC_BASE_URL
  if (typeof window === 'undefined' && process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
})()

// Base URL for client-side code
export const clientBaseUrl =
  typeof window !== 'undefined' ? (env.NEXT_PUBLIC_BASE_URL ?? '') : undefined

// ✅ Site URL based on environment
export const siteUrl = (() => {
  let url: string | null = null

  if (isProd) {
    if (!env.NEXT_PUBLIC_VERCEL_URL && !env.NEXT_PUBLIC_BASE_URL) {
      throw new Error(
        'Missing: NEXT_PUBLIC_VERCEL_URL or NEXT_PUBLIC_BASE_URL (production deployment URL)',
      )
    }
    url = `https://${env.NEXT_PUBLIC_VERCEL_URL || env.NEXT_PUBLIC_BASE_URL}`
  }

  if (isPreview) {
    if (!env.NEXT_PUBLIC_VERCEL_URL) {
      throw new Error(
        'Missing: NEXT_PUBLIC_VERCEL_URL (preview deployment URL)',
      )
    }
    url = `https://${env.NEXT_PUBLIC_VERCEL_URL}`
  }

  if (isDev) {
    url = env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  }

  if (!url) {
    throw new Error(
      'Unable to determine site URL. Check environment variables.',
    )
  }

  if (url.startsWith('http://')) {
    url = url.replace('http://', 'https://')
  }

  return url
})()

// Supabase
export const supabaseConfig = {
  url: env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY, // שרת בלבד
}

export const googleConfig = {
  clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  mapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
}

export const smtpConfig = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  user: env.SMTP_USER,
  password: env.SMTP_PASSWORD,
  fromEmail: env.SMTP_FROM_EMAIL,
}

// שירותים חיצוניים
export const externalServices = {
  vapid: {
    publicKey: env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    privateKey: env.VAPID_PRIVATE_KEY, // שרת בלבד
  },
  posthog: {
    apiKey: env.POSTHOG_API_KEY, // שרת בלבד
  },
}
