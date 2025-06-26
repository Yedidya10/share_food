import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getUser()

      if (error) throw new Error(error.message)
      return data?.user ?? null
    },
    staleTime: 1000 * 60 * 5,
  })
}
