import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'preview']).optional(),
  VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional(),

  NEXT_PUBLIC_ENV: z.enum(['development', 'preview', 'production']).optional(),
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_VERCEL_URL: z.string().optional(),

  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().min(1),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1),

  NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string().min(1),
  VAPID_PRIVATE_KEY: z.string().min(1),

  NEXT_PUBLIC_POSTHOG_API_KEY: z.string().min(1),

  // SMTP configuration for sending emails
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535),
  SMTP_USER: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),
  SMTP_FROM_EMAIL: z.string().email(),
})

// אימות כל המשתנים ומייצר אובייקט מוקלד
try {
  envSchema.parse(process.env)
  console.log('✅ All environment variables are valid.')
} catch (err) {
  console.error('❌ Invalid environment variables:')
  if (err instanceof z.ZodError) {
    for (const issue of err.issues) {
      console.error(`- ${issue.path.join('.')}: ${issue.message}`)
    }
  } else {
    console.error(err)
  }
  process.exit(1)
}
