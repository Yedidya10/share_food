'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import editItemSchema from '@/lib/zod/item/editItemSchema'
import ItemBaseFormFields from '@/components/forms/ItemBaseFormFields'
import ContactFormFields from '@/components/forms/ContactFormFields'
import AddressFormFields from '@/components/forms/address/AddressFormFields'
import ImagesFormField from '@/components/forms/ImagesFormField'
import { editItemDefaultFormValues } from '@/components/forms/utils/item/itemDefaultFormValues'
import type { EditItemFormValues } from '@/types/item/item'
import { useLocale } from 'next-intl'
import { useUpdateItem } from '@/hooks/useUpdateItem'
import { Check, Loader2, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { DirectionProvider } from '@radix-ui/react-direction'
import { FormTranslationType } from '@/types/formTranslation'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useRouter } from '@/i18n/navigation'

interface EditItemFormProps {
  itemId: string
  itemStatus: string
  initialValues: EditItemFormValues
  translation: FormTranslationType
}

export default function EditItemForm({
  itemStatus,
  itemId,
  initialValues,
  translation,
}: EditItemFormProps) {
  const locale = useLocale()
  const router = useRouter()
  const { mutateAsync: updateItem, isPending } = useUpdateItem()

  // Define form schema and type
  const formSchema = editItemSchema(translation)
  type EditItemFormSchema = z.infer<typeof formSchema>

  // Define default values
  const defaultValues = editItemDefaultFormValues({
    translation,
    initialValues,
  })

  const editItemForm = useForm<EditItemFormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: defaultValues,
  })

  // Reset form and images when initialValues change
  // useEffect(() => {
  //   const newImages = (initialValues.images || []).map((url, i) => ({
  //     id: `existing-${i}`,
  //     url,
  //   }));
  //   setImages(newImages);

  //   // Reset form with new default values
  //   const newDefaultValues = editItemDefaultFormValues({
  //     translation,
  //     initialValues,
  //   });
  //   editItemForm.reset(newDefaultValues);
  // }, [initialValues, translation, editItemForm]);

  // Handle form submission with better error handling
  const onSubmit = async (values: EditItemFormSchema) => {
    try {
      const response = await updateItem({
        values: { ...values },
        itemId,
        itemStatus,
      })

      if (response?.success) {
        toast.success('הפריט עודכן בהצלחה', {
          description: 'הינך מועבר חזרה לעמוד הקודם',
          onAutoClose: () => {
            router.back()
          },
          onDismiss: () => {
            router.back()
          },
        })
      } else {
        toast.error('שגיאה בעדכון הפריט')
        console.error('Error updating item:', response?.message)
      }
    } catch (error) {
      toast.error('שגיאה בעדכון הפריט')
      console.error('Error in onSubmit:', error)
    }
  }

  // Check if form can be submitted
  const canSubmit =
    editItemForm.formState.isValid &&
    !editItemForm.formState.isSubmitting &&
    editItemForm.formState.isDirty &&
    !isPending

  return (
    <DirectionProvider dir={locale === 'he' ? 'rtl' : 'ltr'}>
      <div className="sm:max-w-[725px] flex flex-col gap-8 mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-center text-2xl font-semibold">
            {translation.formTitle}
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            {translation.formDescription}
          </p>
        </div>
        <Form {...editItemForm}>
          <form
            onSubmit={editItemForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <ItemBaseFormFields
              form={editItemForm}
              translation={translation}
            />
            <ImagesFormField
              form={editItemForm}
              translation={translation}
              initialImages={initialValues.images || []}
            />
            <Separator />
            <h3 className="text-lg font-semibold">
              {translation.addressDetails}
            </h3>
            <AddressFormFields form={editItemForm} />
            <Separator />
            <ContactFormFields
              form={editItemForm}
              translation={translation}
              fieldNames={{
                contactViaSite: 'contactViaSite',
                contactByPhone: 'contactByPhone',
                phoneNumber: 'phoneNumber',
                isHaveWhatsApp: 'isHaveWhatsApp',
                contactByEmail: 'contactByEmail',
                email: 'email',
              }}
            />
            <div className="gap-2 flex justify-between items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => editItemForm.reset(defaultValues)}
                      className="min-w-[120px]"
                      disabled={!editItemForm.formState.isDirty}
                    >
                      <RotateCcw />
                      {translation.reset}
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {editItemForm.formState.isDirty
                    ? 'לחץ כדי לאפס את הטופס לערכים המקוריים'
                    : 'לא בוצעו שינויים בטופס'}
                </TooltipContent>
              </Tooltip>
              <div className="flex gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="min-w-[120px]"
                    >
                      {translation.cancel}
                    </Button>
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
                        {isPending ? (
                          <div className="flex items-center gap-2 align-middle">
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            <span className="hidden md:inline">
                              {translation.submitButtonProcessing}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 align-middle">
                            <Check />
                            <span>{translation.submitButton}</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {canSubmit
                      ? 'לחץ כדי לשמור את השינויים'
                      : 'יש למלא את כל השדות הנדרשים'}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </DirectionProvider>
  )
}
