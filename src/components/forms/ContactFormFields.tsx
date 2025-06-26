'use client'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import PhoneInput from '@/components/forms/phoneInput/PhoneInput'
import { useLocale } from 'next-intl'
import { FormTranslationType } from '@/types/formTranslation'
import type { EditItemFormSchema } from '@/lib/zod/item/editItemSchema'

type Props = {
  form: UseFormReturn<EditItemFormSchema>
  translation: FormTranslationType
}

export default function ContactFormFields({ form, translation }: Props) {
  const locale = useLocale()

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-xl font-semibold">{translation.contactDetails}</h3>
      <p className="text-sm text-muted-foreground">
        בחר איך ניתן ליצור איתך קשר. אפשר לבחור יותר מאפשרות אחת.
      </p>
      <FormField
        control={form.control}
        name={'contactViaSite'}
        render={() => (
          <FormItem className="rounded-lg border px-4 py-3 bg-muted/50 flex items-start gap-3">
            <FormControl>
              <Checkbox
                defaultChecked
                disabled
                className="mt-1 h-5 w-5"
                id="contactViaSite"
              />
            </FormControl>
            <div>
              <FormLabel
                className="font-medium"
                htmlFor="contactViaSite"
              >
                {translation.contactViaSite}
              </FormLabel>
              <p className="text-xs text-muted-foreground">
                האפשרות הזאת תמיד זמינה באתר.
              </p>
            </div>
          </FormItem>
        )}
      />
      <div className="rounded-lg border px-4 py-3">
        <FormField
          control={form.control}
          name={'contactByPhone'}
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <Checkbox
                  className="h-5 w-5"
                  checked={field.value}
                  id="contactByPhone"
                  onCheckedChange={(checked) => {
                    field.onChange(checked)
                    form.trigger('phoneNumber')
                  }}
                />
              </FormControl>
              <FormLabel
                className="m-0 font-medium"
                htmlFor="contactByPhone"
              >
                {translation.phoneNumber}
              </FormLabel>
            </FormItem>
          )}
        />
        <div
          className={`flex-col items-start gap-5 mr-8 py-4 ${form.watch('contactByPhone') ? 'flex' : 'hidden'}`}
        >
          <FormField
            control={form.control}
            disabled={!form.watch('contactByPhone')}
            name={'phoneNumber'}
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
            name={'isHaveWhatsApp'}
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
        </div>
      </div>
      <div className="rounded-lg border px-4 py-3">
        <FormField
          control={form.control}
          name={'contactByEmail'}
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <Checkbox
                  className="h-5 w-5"
                  id="contactByEmail"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked)
                    form.trigger('email')
                  }}
                />
              </FormControl>
              <FormLabel
                className="m-0 font-medium"
                htmlFor="contactByEmail"
              >
                {translation.email}
              </FormLabel>
            </FormItem>
          )}
        />
        <div
          className={`flex-col items-start gap-5 py-4 ${form.watch('contactByEmail') ? 'flex' : 'hidden'}`}
        >
          <FormField
            control={form.control}
            disabled={!form.watch('contactByEmail')}
            name={'email'}
            render={({ field }) => (
              <FormItem className="w-full max-w-xs mr-8">
                <FormLabel
                  className="sr-only"
                  htmlFor="email"
                >
                  {translation.email}
                </FormLabel>
                <FormControl>
                  <Input
                    dir={locale === 'he' ? 'rtl' : 'ltr'}
                    {...field}
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={translation.emailPlaceholder}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
