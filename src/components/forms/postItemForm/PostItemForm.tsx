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

export default function PostItemForm({
  openModal,
  setOpenModal,
  setIsSubmitSuccess,
  translation,
}: {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  setIsSubmitSuccess: React.Dispatch<React.SetStateAction<boolean | null>>
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
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: defaultValues,
  })

  const { mutateAsync: insertItem, isPending } = useInsertItem()

  // Handle form submission
  const onSubmit = async (values: PostItemFormSchema) => {
    try {
      const response = await insertItem(values)

      if (response?.success) {
        setIsSubmitSuccess(true)
        setOpenModal(false)
        postItemForm.reset()
      } else {
        setIsSubmitSuccess(false)
        setOpenModal(false)
        console.error('Error inserting item:', response?.message)
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
