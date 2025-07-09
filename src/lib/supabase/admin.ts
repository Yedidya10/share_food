import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from '@/lib/envConfig'
import type { Database } from '@/types/supabase-fixed'

export const supabaseAdmin = createClient<Database>(
  supabaseConfig.url,
  supabaseConfig.serviceRoleKey,
)
