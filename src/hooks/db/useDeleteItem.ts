import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export function useDeleteItem() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const cancelDelete = async (id: string): Promise<void> => {
    const toastId = toast.loading('מבצע ביטול מחיקה…', { duration: Infinity })

    const { error } = await supabase
      .from('items')
      .update({ deleted_at: null })
      .eq('id', id)

    if (error) {
      toast.error('שגיאה בביטול מחיקה', {
        id: toastId,
        duration: 4000,
        description: 'לשחזור פריט, נא ליצור קשר עם התמיכה',
      })
      throw new Error('ביטול נכשל') // חשוב
    }

    toast.success('ביטול מחיקה הצליח', {
      id: toastId,
      duration: 4000,
    })

    // רענון יזום
    await queryClient.invalidateQueries({ queryKey: ['items'] })
  }

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData.user) throw new Error('משתמש לא מאומת')

      const { error: itemError } = await supabase
        .from('items')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', authData.user.id)

      if (itemError) throw new Error(itemError.message)
      return id
    },
    onMutate: (id) => {
      const toastId = toast.loading('מוחק פריט…', { duration: Infinity })
      return { toastId, id }
    },
    onSuccess: (id, _, context) => {
      toast.success('הפריט נמחק בהצלחה', {
        id: context?.toastId,
        duration: 10000,
        cancel: {
          label: 'ביטול',
          onClick: async () => {
            try {
              await cancelDelete(id)
            } catch (error) {
              console.error(error)
              // השגיאה כבר טופלה ב־cancelDelete עם toast
            }
          },
        },
      })
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
    onError: (_, __, context) => {
      toast.error('שגיאה במחיקת הפריט', {
        id: context?.toastId,
        duration: 5000,
        description: 'אנא נסה שוב מאוחר יותר.',
      })
    },
  })

  return mutation
}
