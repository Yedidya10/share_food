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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TranslationType } from "@/types/translation";

type ItemBaseFormFieldsProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  translation: TranslationType;
};

export default function ItemBaseFormFields<
  T extends { title: string; description: string } & FieldValues,
>({ form, translation }: ItemBaseFormFieldsProps<T>) {
  return (
    <>
      <FormField
        control={form.control}
        name={"title" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {translation.title}
              <span className='text-xs text-muted-foreground'>
                ({translation.required})
              </span>
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder={translation.titlePlaceholder}
                inputMode='text'
                autoComplete='off'
              />
            </FormControl>
            <FormDescription className='text-xs text-muted-foreground'>
              מומלץ לכתוב שם ברור ומדויק שיתאר את הפריט בצורה הטובה ביותר.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={"description" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {translation.description}
              <span className='text-xs text-muted-foreground'>
                ({translation.required})
              </span>
            </FormLabel>
            <FormControl>
              <Textarea
                className='resize-none'
                placeholder={translation.descriptionPlaceholder}
                inputMode='text'
                autoComplete='off'
                {...field}
              />
            </FormControl>
            <FormDescription className='text-xs text-muted-foreground'>
              מומלץ לכתוב תיאור מפורט כמו מצב הפריט, תאריך תפוגה (אם רלוונטי)
              וכל פרט נוסף שיכול לעזור למי שמעוניין בו. (עד 300 תווים)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
