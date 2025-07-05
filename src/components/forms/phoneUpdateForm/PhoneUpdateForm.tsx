'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useLocale } from 'next-intl'
import { Loader, RotateCcw } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import phoneUpdateFormSchema from '@/lib/zod/phoneUpdateFormSchema/phoneUpdateFormSchema'
import { PhoneFieldTranslationFull } from '@/types/formTranslation'
import PhoneInputField from '../phoneInputField/PhoneInputField'
import { useUpdateProfileField } from '@/hooks/db/useUpdateProfileField'

export default function AddressUpdateForm({
  openModal,
  initialValues,
  setOpenModal,
  onSubmitSuccess,
  translation,
}: {
  openModal: boolean
  initialValues: {
    phoneNumber?: string
    isHaveWhatsApp?: boolean
  }
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  onSubmitSuccess: React.Dispatch<React.SetStateAction<boolean | null>>
  translation: PhoneFieldTranslationFull
}) {
  const locale = useLocale()

  // Define your form schema using Zod
  const formSchema = phoneUpdateFormSchema(translation)
  type PhoneUpdateFormSchema = z.infer<typeof formSchema>

  // Define default values for the form
  const defaultValues = {
    phoneNumber: initialValues.phoneNumber || '',
    isHaveWhatsApp: initialValues.isHaveWhatsApp || false,
  }

  // Define your form
  const phoneUpdateForm = useForm<PhoneUpdateFormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'firstError',
    defaultValues: defaultValues,
  })

  // Use the custom hook to update the address
  const { mutateAsync: updateProfileField, isPending } = useUpdateProfileField()

  // Handle form submission
  const onSubmit = async (values: PhoneUpdateFormSchema) => {
    try {
      const updatePhoneResponse = await updateProfileField({
        field: 'phone_number',
        value: values.phoneNumber,
      })

      const updateWhatsAppResponse = await updateProfileField({
        field: 'is_have_whatsapp',
        value: values.isHaveWhatsApp,
      })

      if (updatePhoneResponse && updateWhatsAppResponse) {
        onSubmitSuccess(true)
        setOpenModal(false)
        phoneUpdateForm.reset()
      } else {
        onSubmitSuccess(false)
        setOpenModal(false)
      }
    } catch (error) {
      console.error('Error in onSubmit:', error)
    }
  }

  // Check if form can be submitted
  const canSubmit =
    phoneUpdateForm.formState.isValid &&
    !phoneUpdateForm.formState.isSubmitting &&
    phoneUpdateForm.formState.isDirty &&
    !isPending

  return (
    <Dialog
      open={openModal}
      onOpenChange={setOpenModal}
    >
      <DialogContent className="sm:max-w-[725px] overflow-y-auto flex flex-col gap-8">
        <DialogHeader className="m-auto">
          <DialogTitle
            className="text-center text-2xl font-semibold"
            dir={locale === 'he' ? 'rtl' : 'ltr'}
          >
            {translation.formTitle}
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            {translation.formDescription}
          </DialogDescription>
        </DialogHeader>
        <Form {...phoneUpdateForm}>
          <form
            onSubmit={phoneUpdateForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <PhoneInputField
              form={phoneUpdateForm}
              translation={translation}
            />
            <div className="gap-2 flex justify-between items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => phoneUpdateForm.reset()}
                      className="min-w-[120px]"
                      disabled={!phoneUpdateForm.formState.isDirty}
                    >
                      <RotateCcw />
                      {translation.reset}
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {phoneUpdateForm.formState.isDirty
                    ? 'לחץ כדי לאפס את הטופס לערכים המקוריים'
                    : 'לא בוצעו שינויים בטופס'}
                </TooltipContent>
              </Tooltip>
              <div className="flex  gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpenModal(false)}
                      >
                        {translation.cancel}
                      </Button>
                    </DialogClose>
                  </TooltipTrigger>
                  <TooltipContent>
                    לחץ כדי לבטל את השינויים ולחזור לעמוד הקודם
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-block">
                      <Button
                        type="submit"
                        disabled={!canSubmit}
                      >
                        {isPending || phoneUpdateForm.formState.isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <Loader className="animate-spin mr-2 h-4 w-4" />
                            <span className="sr-only">
                              {translation.submitButtonProcessing}
                            </span>
                          </div>
                        ) : (
                          translation.submitButton
                        )}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!canSubmit
                      ? 'יש למלא את כל השדות הנדרשים כדי לשלוח את הטופס'
                      : 'לחץ כדי לשלוח את הטופס'}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
