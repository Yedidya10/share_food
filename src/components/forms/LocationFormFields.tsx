"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormTranslationType } from "@/types/formTranslation";
import type { EditItemFormSchema } from "@/lib/zod/item/editItemSchema";
import CityInputWrapper from "./address/CityInputWrapper";
import StreetInputWrapper from "./address/StreetInputWrapper";

type Props = {
  form: UseFormReturn<EditItemFormSchema>;
  translation: FormTranslationType;
};

export default function LocationFormFields({ form, translation }: Props) {
  return (
    <div className='flex flex-col space-y-4'>
      <h3 className='text-lg font-semibold'>{translation.addressDetails}</h3>

      <div className='flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0'>
        <CityInputWrapper form={form} translation={translation} />
        <StreetInputWrapper form={form} translation={translation} />
        <FormField
          control={form.control}
          name={"streetNumber"}
          render={({ field }) => (
            <FormItem className='w-full md:w-[60%]'>
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
    </div>
  );
}
