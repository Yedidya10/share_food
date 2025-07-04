import { useMutation, useQueryClient } from '@tanstack/react-query'
import updateProfileField from '@/lib/supabase/actions/updateProfileField'

export function useUpdateProfileField() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfileField,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      })
    },
  })
}
