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
import { Separator } from '@/components/ui/separator'
import { useLocale } from 'next-intl'
import postItemSchema from '@/lib/zod/item/postItemSchema'
import { postItemDefaultFormValues } from '@/components/forms/utils/item/itemDefaultFormValues'
import ContactFormFields from '@/components/forms/ContactFormFields'
import AddressFormFields from '@/components/forms/address/AddressFormFields'
import ImagesFormField from '@/components/forms/ImagesFormField'
import ItemBaseFormFields from '@/components/forms/ItemBaseFormFields'
import { FormTranslationType } from '@/types/formTranslation'
import { useInsertItem } from '@/hooks/useInsertItem'
import { Loader, RotateCcw } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import SaveAddress from '../address/SaveAddress'
import { insertAddressToProfile } from '@/lib/supabase/actions/insertAddress'
import { insertPhoneToProfile } from '@/lib/supabase/actions/insertPhoneToProfile'

export default function PostItemForm({
  openModal,
  setOpenModal,
  setIsSubmitSuccess,
  setIsPhoneSaved,
  translation,
}: {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  setIsSubmitSuccess: React.Dispatch<React.SetStateAction<boolean | null>>
  setIsPhoneSaved: React.Dispatch<React.SetStateAction<boolean | null>>
  translation: FormTranslationType
}) {
  const locale = useLocale()
  // const supabase = createClient();

  // Define your form schema using Zod
  const formSchema = postItemSchema(translation)
  type PostItemFormSchema = z.infer<typeof formSchema>

  // Define default values for the form
  const defaultValues = postItemDefaultFormValues(translation)

  // Define your form
  const postItemForm = useForm<PostItemFormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    criteriaMode: 'firstError',
    defaultValues: defaultValues,
  })

  const { mutateAsync: insertItem, isPending } = useInsertItem()

  // Handle form submission
  const onSubmit = async (values: PostItemFormSchema) => {
    try {
      // Log the form values for debugging
      console.log('Form submitted with values:', values)

      // Save the address to profile if it is new
      if (values.saveAddress) {
        const { streetName, streetNumber, city, country, postalCode } = values

        const insertAddressResponse = await insertAddressToProfile({
          streetName,
          streetNumber,
          city,
          country,
          postalCode: postalCode ?? '',
        })

        if (insertAddressResponse?.success) {
          console.log('Address saved to profile successfully')
        } else {
          console.error(
            'Error saving address to profile:',
            insertAddressResponse?.message,
          )
        }
      }

      if (values.savePhone && values.phoneNumber) {
        // Save the phone number to profile if the user opted in
        const { phoneNumber, isHaveWhatsApp } = values

        const savePhoneResponse = await insertPhoneToProfile({
          phoneNumber,
          isHaveWhatsApp: isHaveWhatsApp ?? false,
        })
        if (savePhoneResponse?.success) {
          console.log('Phone number saved to profile successfully')
          setIsPhoneSaved(true)
        } else {
          console.error(
            'Error saving phone number to profile:',
            savePhoneResponse?.message,
          )
          setIsPhoneSaved(false)
        }
      }

      // Call the insertItem function with the form values
      const insertItemResponse = await insertItem(values)

      if (insertItemResponse?.success) {
        setIsSubmitSuccess(true)
        setOpenModal(false)
        postItemForm.reset()
      } else {
        setIsSubmitSuccess(false)
        setOpenModal(false)
        console.error('Error inserting item:', insertItemResponse?.message)
      }
    } catch (error) {
      console.error('Error in onSubmit:', error)
    }
  }

  // Check if form can be submitted
  const canSubmit =
    postItemForm.formState.isValid &&
    !postItemForm.formState.isSubmitting &&
    postItemForm.formState.isDirty &&
    !isPending

  return (
    <Dialog
      open={openModal}
      onOpenChange={setOpenModal}
    >
      <DialogContent className="sm:max-w-[725px] h-[80vh] overflow-y-auto flex flex-col gap-8">
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
        <Form {...postItemForm}>
          <form
            onSubmit={postItemForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <ItemBaseFormFields
              form={postItemForm}
              translation={translation}
            />
            <ImagesFormField
              form={postItemForm}
              translation={translation}
            />
            <Separator />
            <h3 className="text-lg font-semibold">
              {translation.addressDetails}
            </h3>
            <AddressFormFields form={postItemForm} />
            <SaveAddress form={postItemForm} />
            <Separator />
            <ContactFormFields
              form={postItemForm}
              translation={translation}
            />

            <div className="gap-2 flex justify-between items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => postItemForm.reset()}
                      className="min-w-[120px]"
                      disabled={!postItemForm.formState.isDirty}
                    >
                      <RotateCcw />
                      {translation.reset}
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {postItemForm.formState.isDirty
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
                        {isPending || postItemForm.formState.isSubmitting ? (
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
