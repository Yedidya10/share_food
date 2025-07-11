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
import AddressFormFields from '@/components/forms/address/AddressFormFields'
import { useUpdateAddress } from '@/hooks/db/useUpdateAddress'
import { Loader, RotateCcw } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import addressUpdateFormSchema from '@/lib/zod/updateUserAddressSchema/updateUserAddress'
import { AddressFormTranslationFull } from '@/types/formTranslation'

export default function AddressUpdateForm({
  initialValues,
  openModal,
  setOpenModal,
  onSubmitSuccess,
  translation,
}: {
  initialValues: {
    streetName: string
    streetNumber: string
    city: string
    country: string
    postalCode: string
  }
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  onSubmitSuccess: React.Dispatch<React.SetStateAction<boolean | null>>
  translation: AddressFormTranslationFull
}) {
  const locale = useLocale()
  const { mutateAsync: updateAddress, isPending } = useUpdateAddress()

  // Define your form schema using Zod
  const formSchema = addressUpdateFormSchema(translation)
  type AddressUpdateFormSchema = z.infer<typeof formSchema>

  // Define your form
  const addressUpdateForm = useForm<AddressUpdateFormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    criteriaMode: 'firstError',
    defaultValues: initialValues,
  })

  // Handle form submission
  const onSubmit = async (values: AddressUpdateFormSchema) => {
    try {
      // Call the insertItem function with the form values
      const insertItemResponse = await updateAddress(values)

      if (insertItemResponse?.success) {
        onSubmitSuccess(true)
        setOpenModal(false)
        addressUpdateForm.reset()
      } else {
        onSubmitSuccess(false)
        setOpenModal(false)
        console.error('Error inserting item:', insertItemResponse?.message)
      }
    } catch (error) {
      console.error('Error in onSubmit:', error)
    }
  }

  // Check if form can be submitted
  const canSubmit =
    addressUpdateForm.formState.isValid &&
    !addressUpdateForm.formState.isSubmitting &&
    addressUpdateForm.formState.isDirty &&
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
        <Form {...addressUpdateForm}>
          <form
            onSubmit={addressUpdateForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <AddressFormFields form={addressUpdateForm} />
            <div className="gap-2 flex justify-between items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addressUpdateForm.reset()}
                      className="min-w-[120px]"
                      disabled={!addressUpdateForm.formState.isDirty}
                    >
                      <RotateCcw />
                      {translation.reset}
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {addressUpdateForm.formState.isDirty
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
                        {isPending ||
                        addressUpdateForm.formState.isSubmitting ? (
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
