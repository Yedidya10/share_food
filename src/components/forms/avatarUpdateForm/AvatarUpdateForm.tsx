import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useUpdateProfileField } from '@/hooks/db/useUpdateProfileField'
import { FormField } from '@/components/ui/form'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export default function AvatarUpdateForm({
  openModal,
  setOpenModal,
  onSubmitSuccess,
  translation,
  avatarUrl,
  userId,
}: {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  onSubmitSuccess: React.Dispatch<React.SetStateAction<boolean | null>>
  translation: { avatarUpdated: string; avatarUpdateFailed: string }
  avatarUrl?: string
  userId?: string
}) {
  // const locale = useLocale()

  // Define your form schema using Zod
  const formSchema = z.object({
    avatarUrl: z.string().url(),
    userId: z.string().min(1),
  })

  type AvatarUpdateFormSchema = z.infer<typeof formSchema>

  // Define default values for the form
  const defaultValues = {
    avatarUrl: avatarUrl || '',
    userId: userId || '',
  }

  // Define your form
  const avatarUpdateForm = useForm<AvatarUpdateFormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
    defaultValues,
  })

  // Use the custom hook to update the avatar
  const { mutateAsync: updateProfileField, isPending } = useUpdateProfileField()

  // Handle form submission
  const onSubmit = async (values: AvatarUpdateFormSchema) => {
    try {
      const response = await updateProfileField({
        field: 'avatar_url',
        value: values.avatarUrl,
      })

      if (response?.success) {
        onSubmitSuccess(true)
        setOpenModal(false)
        avatarUpdateForm.reset()
      } else {
        onSubmitSuccess(false)
      }
    } catch (error) {
      console.error('Error updating avatar:', error)
      toast.error(translation.avatarUpdateFailed)
      onSubmitSuccess(false)
    }
  }

  return (
    <Dialog
      open={openModal}
      onOpenChange={setOpenModal}
    >
      <DialogContent>
        <h2 className="text-lg font-semibold mb-4">
          {translation.avatarUpdated}
        </h2>
        <form onSubmit={avatarUpdateForm.handleSubmit(onSubmit)}>
          <FormField
            control={avatarUpdateForm.control}
            name="avatarUrl"
            render={({ field }) => (
              <input
                type="url"
                placeholder="Enter new avatar URL"
                {...field}
                className="w-full p-2 border rounded"
              />
            )}
          />
          <FormField
            control={avatarUpdateForm.control}
            name="userId"
            render={({ field }) => (
              <input
                type="text"
                placeholder="User ID"
                {...field}
                className="w-full p-2 border rounded"
              />
            )}
          />
          <button
            type="submit"
            disabled={isPending || !avatarUpdateForm.formState.isValid}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Updating...' : 'Update Avatar'}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpenModal(false)
              avatarUpdateForm.reset()
            }}
            className="w-full p-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
