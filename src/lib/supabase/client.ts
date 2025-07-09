import { createBrowserClient } from '@supabase/ssr'
import { supabaseConfig } from '@/lib/envConfig'
import type { Database } from '@/types/supabase-fixed'

export function createClient() {
  return createBrowserClient<Database>(
    supabaseConfig.url,
    supabaseConfig.anonKey,
  )
}
