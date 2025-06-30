'use client'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormTranslationType } from '@/types/formTranslation'

type ItemBaseFormFieldsProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  translation: FormTranslationType
}

export default function ItemBaseFormFields<
  T extends { title: string; description: string } & FieldValues,
>({ form, translation }: ItemBaseFormFieldsProps<T>) {
  const {
    control,
    formState: { errors },
    trigger,
  } = form

  return (
    <>
      <FormField
        control={control}
        name={'title' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {translation.title}
              <span className="text-xs text-muted-foreground">
                ({translation.required})
              </span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder={translation.titlePlaceholder}
                // override onChange to handle validation on change
                onChange={(e) => {
                  field.onChange(e)
                  if (errors.title && e.target.value.length > 0) {
                    trigger('title' as Path<T>)
                  }
                }}
                inputMode="text"
                autoComplete="off"
              />
            </FormControl>
            <FormDescription className="text-xs text-muted-foreground">
              מומלץ לכתוב שם ברור ומדויק שיתאר את הפריט בצורה הטובה ביותר.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={'description' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {translation.description}
              <span className="text-xs text-muted-foreground">
                ({translation.required})
              </span>
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className="resize-none"
                placeholder={translation.descriptionPlaceholder}
                // override onChange to handle validation on change
                onChange={(e) => {
                  field.onChange(e)
                  if (errors.description && e.target.value.length > 0) {
                    trigger('description' as Path<T>)
                  }
                }}
                rows={2}
                inputMode="text"
                autoComplete="off"
              />
            </FormControl>
            <FormDescription className="text-xs text-muted-foreground">
              מומלץ לכתוב תיאור מפורט כמו מצב הפריט, תאריך תפוגה (אם רלוונטי)
              וכל פרט נוסף שיכול לעזור למי שמעוניין בו. (עד 300 תווים)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
