import { createBrowserClient } from '@supabase/ssr'
import { supabaseConfig } from '@/lib/envConfig'

export function createClient() {
  return createBrowserClient(supabaseConfig.url, supabaseConfig.anonKey)
}
