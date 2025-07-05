import { useMutation, useQueryClient } from '@tanstack/react-query'
import updateUserAddress from '@/app/actions/updateUserAddress'

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
