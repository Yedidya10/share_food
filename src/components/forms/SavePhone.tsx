import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>
}

export default function SavePhone<T extends FieldValues>({ form }: Props<T>) {
  return (
    <FormField
      control={form.control}
      name={'savePhone' as Path<T>}
      render={({ field }) => (
        <FormItem className="flex items-start gap-3">
          <FormControl>
            <Checkbox
              {...field}
              className="h-5 w-5"
              id="savePhone"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div>
            <FormLabel
              className="font-medium"
              htmlFor="savePhone"
            >
              שמירת טלפון לשימוש עתידי
              <span className="text-xs text-muted-foreground">(רשות)</span>
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  )
}
