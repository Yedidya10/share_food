import { useMutation, useQueryClient } from '@tanstack/react-query'
import updateUserAddress from '@/lib/supabase/actions/updateUserAddress'

export function useUpdateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      })
    },
  })
}
