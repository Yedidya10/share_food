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

export default function SaveAddress<T extends FieldValues>({ form }: Props<T>) {
  return (
    <FormField
      control={form.control}
      name={'saveAddress' as Path<T>}
      render={({ field }) => (
        <FormItem className="flex items-start gap-3">
          <FormControl>
            <Checkbox
              {...field}
              checked={field.value}
              onCheckedChange={field.onChange}
              className="h-5 w-5"
              id="saveAddress"
            />
          </FormControl>
          <div>
            <FormLabel
              className="font-medium"
              htmlFor="saveAddress"
            >
              שמירת כתובת בפרופיל לשימוש עתידי
              <span className="text-xs text-muted-foreground">(אופציונלי)</span>
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  )
}
