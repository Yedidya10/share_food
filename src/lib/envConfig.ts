type Env = 'development' | 'preview' | 'production'

// Get the current environment based on environment variables
const getCurrentEnv = (): Env => {
  const env = process.env.NEXT_PUBLIC_ENV
  if (env === 'development' || env === 'preview' || env === 'production')
    return env
  if (process.env.VERCEL_ENV === 'preview') return 'preview'
  if (process.env.NODE_ENV === 'production') return 'production'
  return 'development'
}

export const currentEnv: Env = getCurrentEnv()
export const isDev = currentEnv === 'development'
export const isPreview = currentEnv === 'preview'
export const isProd = currentEnv === 'production'

// Base URL for server-side code
export const serverBaseUrl = (() => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL
  if (typeof window === 'undefined' && process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
})()

// Base URL for client-side code
export const clientBaseUrl =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_BASE_URL ?? '')
    : undefined

// ✅ Site URL based on environment
export const siteUrl = (() => {
  let url: string | null = null

  if (isProd) {
    if (
      !process.env.NEXT_PUBLIC_VERCEL_URL &&
      !process.env.NEXT_PUBLIC_BASE_URL
    ) {
      throw new Error(
        'Missing: NEXT_PUBLIC_VERCEL_URL or NEXT_PUBLIC_BASE_URL (production deployment URL)',
      )
    }
    url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL || process.env.NEXT_PUBLIC_BASE_URL}`
  }

  if (isPreview) {
    if (!process.env.NEXT_PUBLIC_VERCEL_URL!) {
      throw new Error(
        'Missing: NEXT_PUBLIC_VERCEL_URL (preview deployment URL)',
      )
    }
    url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL!}`
  }

  if (isDev) {
    url = process.env.NEXT_PUBLIC_BASE_URL!
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
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!, // שרת בלבד
}

// Google
export const googleConfig = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  mapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
}

// Smtp
export const smtpConfig = {
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT!),
  user: process.env.SMTP_USER!,
  password: process.env.SMTP_PASSWORD!,
  fromEmail: process.env.SMTP_FROM_EMAIL!,
}

// שירותים חיצוניים
export const externalServices = {
  vapid: {
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    privateKey: process.env.VAPID_PRIVATE_KEY!, // שרת בלבד
  },
  posthog: {
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_API_KEY!,
  },
}
