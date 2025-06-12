"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { TranslationType } from "@/types/translation";

type LocationFormFieldsProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  translation: TranslationType;
};

export default function LocationFormFields<
  T extends {
    streetName: string;
    streetNumber: string;
    city: string;
    country: string;
    postalCode?: string;
  } & FieldValues,
>({ form, translation }: LocationFormFieldsProps<T>) {
  return (
    <div className='flex flex-col space-y-4'>
      <h3 className='text-lg font-semibold'>{translation.addressDetails}</h3>
      <div className='flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0'>
        <FormField
          control={form.control}
          name={"streetName" as Path<T>}
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel htmlFor='streetName'>
                {translation.streetName}
                <span className='text-xs text-muted-foreground'>
                  ({translation.required})
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  id='streetName'
                  required
                  placeholder={translation.streetNamePlaceholder}
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-xs text-red-500' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"streetNumber" as Path<T>}
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel htmlFor='streetNumber'>
                {translation.streetNumber}
                <span className='text-xs text-muted-foreground'>
                  ({translation.required})
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  id='streetNumber'
                  required
                  placeholder={translation.streetNumberPlaceholder}
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-xs text-red-500' />
            </FormItem>
          )}
        />
      </div>
      <div className='flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0'>
        <FormField
          control={form.control}
          name={"city" as Path<T>}
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel htmlFor='city'>
                {translation.city}
                <span className='text-xs text-muted-foreground'>
                  ({translation.required})
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  id='city'
                  required
                  placeholder={translation.cityPlaceholder}
                  {...field}
                />
              </FormControl>
              <FormMessage className='text-xs text-red-500' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"country" as Path<T>}
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel htmlFor='country'>{translation.country}</FormLabel>
              <FormControl>
                <Input
                  id='country'
                  placeholder={translation.countries.israel}
                  {...field}
                  value={field.value || translation.countries.israel}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"postalCode" as Path<T>}
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel htmlFor='postalCode'>
                {translation.postalCode}
              </FormLabel>
              <FormControl>
                <Input
                  id='postalCode'
                  placeholder={translation.postalCodePlaceholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
