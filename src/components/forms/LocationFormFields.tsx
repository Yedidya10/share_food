'use client'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Path, UseFormReturn } from 'react-hook-form'
import CityInputWrapper from './address/CityInputWrapper'
import StreetInputWrapper from './address/StreetInputWrapper'
import { useTranslations } from 'next-intl'

type LocationFormFieldsProps<
  T extends {
    city: string
    streetName: string
    streetNumber: string
    country: string
  },
> = {
  form: UseFormReturn<T>
}

export default function LocationFormFields<
  T extends {
    city: string
    streetName: string
    streetNumber: string
    country: string
  },
>({ form }: LocationFormFieldsProps<T>) {
  const tAddress = useTranslations('form.address')
  const tGeneric = useTranslations('form.generic')

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-lg font-semibold">{tAddress('location')}</h3>

      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <CityInputWrapper form={form} />
        <StreetInputWrapper form={form} />
        <FormField
          control={form.control}
          name={'streetNumber' as Path<T>}
          render={({ field }) => (
            <FormItem className="w-full md:w-[60%]">
              <FormLabel htmlFor="streetNumber">
                {tAddress('street_number')}
                <span className="text-xs text-muted-foreground">
                  ({tGeneric('required')})
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  id="streetNumber"
                  required
                  placeholder={tAddress('street_number_placeholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
