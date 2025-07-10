import { useMutation, useQueryClient } from '@tanstack/react-query'
import updateUserAddress from '@/app/actions/updateUserAddress'

export function useUpdateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      streetName,
      streetNumber,
      city,
      country,
      postalCode,
    }: {
      streetName: string
      streetNumber: string
      city: string
      country: string
      postalCode: string
    }) => {
      const response = await updateUserAddress({
        streetName,
        streetNumber,
        city,
        country,
        postalCode,
      })
      if (!response) throw new Error('Failed to update address')
      if (!response.success) {
        throw new Error(response.message || 'Failed to update address')
      }
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      })
    },
  })
}
