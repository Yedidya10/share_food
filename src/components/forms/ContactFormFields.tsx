"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import PhoneInput from "@/components/phoneInput/PhoneInput";
import { useLocale } from "next-intl";
import { TranslationType } from "@/types/translation";

type ContactFormFieldsProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  translation: TranslationType;
};

export default function ContactFormFields<
  T extends {
    contactViaSite: boolean;
    contactByPhone: boolean;
    phoneNumber?: string;
    isHaveWhatsApp: boolean;
    contactByEmail: boolean;
    email?: string;
  } & FieldValues,
>({ form, translation }: ContactFormFieldsProps<T>) {
  const locale = useLocale();

  return (
    <div className='flex flex-col space-y-4'>
      <h3 className='text-xl font-semibold'>{translation.contactDetails}</h3>
      <p className='text-sm text-muted-foreground'>
        בחר איך ניתן ליצור איתך קשר. אפשר לבחור יותר מאפשרות אחת.
      </p>
      <FormField
        control={form.control}
        name={"contactViaSite" as Path<T>}
        render={() => (
          <FormItem className='rounded-lg border px-4 py-3 bg-muted/50 flex items-start gap-3'>
            <FormControl>
              <Checkbox
                defaultChecked
                disabled
                className='mt-1 h-5 w-5'
                id='contactViaSite'
              />
            </FormControl>
            <div>
              <FormLabel className='font-medium' htmlFor='contactViaSite'>
                {translation.contactViaSite}
              </FormLabel>
              <p className='text-xs text-muted-foreground'>
                האפשרות הזאת תמיד זמינה באתר.
              </p>
            </div>
          </FormItem>
        )}
      />
      <div className='rounded-lg border px-4 py-3'>
        <FormField
          control={form.control}
          name={"contactByPhone" as Path<T>}
          render={({ field }) => (
            <FormItem className='flex items-center gap-3'>
              <FormControl>
                <Checkbox
                  className='h-5 w-5'
                  checked={field.value}
                  id='contactByPhone'
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <FormLabel className='m-0 font-medium' htmlFor='contactByPhone'>
                {translation.phoneNumber}
              </FormLabel>
            </FormItem>
          )}
        />
        <div
          className={`flex-col items-start gap-5 mr-8 py-4 ${form.watch("contactByPhone" as Path<T>) ? "flex" : "hidden"}`}
        >
          <FormField
            control={form.control}
            disabled={!form.watch("contactByPhone" as Path<T>)}
            name={"phoneNumber" as Path<T>}
            render={({ field }) => (
              <FormItem dir='ltr' className='w-full max-w-xs'>
                <FormLabel
                  className='sr-only'
                  htmlFor='phoneNumber'
                  dir={locale === "he" ? "rtl" : "ltr"}
                >
                  {translation.phoneNumber}
                </FormLabel>
                <FormControl>
                  <PhoneInput
                    {...field}
                    id='phoneNumber'
                    placeholder={translation.phoneNumberPlaceholder}
                    international={false}
                    defaultCountry={"IL"}
                    inputMode='tel'
                    autoComplete='tel'
                    onChange={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage dir={locale === "he" ? "rtl" : "ltr"} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"isHaveWhatsApp" as Path<T>}
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <div className='flex items-center gap-3'>
                  <FormControl>
                    <Checkbox
                      className='h-5 w-5'
                      id='isHaveWhatsApp'
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                  <FormLabel
                    className='m-0 font-medium'
                    htmlFor='isHaveWhatsApp'
                  >
                    {translation.isHaveWhatsApp}
                  </FormLabel>
                </div>
                <FormDescription className='text-xs text-muted-foreground mr-8'>
                  {translation.isHaveWhatsAppTip}
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className='rounded-lg border px-4 py-3'>
        <FormField
          control={form.control}
          name={"contactByEmail" as Path<T>}
          render={({ field }) => (
            <FormItem className='flex items-center gap-3'>
              <FormControl>
                <Checkbox
                  className='h-5 w-5'
                  id='contactByEmail'
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <FormLabel className='m-0 font-medium' htmlFor='contactByEmail'>
                {translation.email}
              </FormLabel>
            </FormItem>
          )}
        />
        <div
          className={`flex-col items-start gap-5 py-4 ${form.watch("contactByEmail" as Path<T>) ? "flex" : "hidden"}`}
        >
          <FormField
            control={form.control}
            disabled={!form.watch("contactByEmail" as Path<T>)}
            name={"email" as Path<T>}
            render={({ field }) => (
              <FormItem className='w-full max-w-xs mr-8'>
                <FormLabel className='sr-only' htmlFor='email'>
                  {translation.email}
                </FormLabel>
                <FormControl>
                  <Input
                    dir={locale === "he" ? "rtl" : "ltr"}
                    {...field}
                    id='email'
                    type='email'
                    inputMode='email'
                    autoComplete='email'
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
  );
}
