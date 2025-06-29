import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from '@/lib/envConfig'

export const supabaseAdmin = createClient(
  supabaseConfig.url,
  supabaseConfig.serviceRoleKey,
)
