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
import { Checkbox } from '@/components/ui/checkbox'
import PhoneInput from '@/components/forms/phoneInput/PhoneInput'
import { useLocale } from 'next-intl'
import { PhoneFieldTranslationFull } from '@/types/formTranslation'

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>
  translation: PhoneFieldTranslationFull
}

export default function ContactFormFields<T extends FieldValues>({
  form,
  translation,
}: Props<T>) {
  const locale = useLocale()

  return (
    <>
      <FormField
        control={form.control}
        disabled={!form.watch('contactByPhone' as Path<T>)}
        name={'phoneNumber' as Path<T>}
        render={({ field }) => (
          <FormItem
            dir="ltr"
            className="w-full max-w-xs"
          >
            <FormLabel
              className="sr-only"
              htmlFor="phoneNumber"
              dir={locale === 'he' ? 'rtl' : 'ltr'}
            >
              {translation.phoneNumber}
            </FormLabel>
            <FormControl>
              <PhoneInput
                {...field}
                id="phoneNumber"
                placeholder={translation.phoneNumberPlaceholder}
                international={false}
                defaultCountry={'IL'}
                inputMode="tel"
                autoComplete="tel"
                onChange={(value) => field.onChange(value)}
              />
            </FormControl>
            <FormMessage dir={locale === 'he' ? 'rtl' : 'ltr'} />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={'isHaveWhatsApp' as Path<T>}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <FormControl>
                <Checkbox
                  className="h-5 w-5"
                  id="isHaveWhatsApp"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <FormLabel
                className="m-0 font-medium"
                htmlFor="isHaveWhatsApp"
              >
                {translation.isHaveWhatsApp}
              </FormLabel>
            </div>
            <FormDescription className="text-xs text-muted-foreground mr-8">
              {translation.isHaveWhatsAppTip}
            </FormDescription>
          </FormItem>
        )}
      />
    </>
  )
}
