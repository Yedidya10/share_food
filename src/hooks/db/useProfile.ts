import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export default function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const supabase = createClient()
      const { data: dataUser, error: errorUser } = await supabase.auth.getUser()

      if (errorUser) throw new Error(errorUser.message)

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', dataUser?.user?.id)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError.message)
        return null
      }

      return profileData || null
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
