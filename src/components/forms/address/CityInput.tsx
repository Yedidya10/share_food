"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { useRef, useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { useCities } from "@/hooks/db/useCities";
import { UseFormReturn } from "react-hook-form";
import type { EditItemFormSchema } from "@/lib/zod/item/editItemSchema";
import { FormTranslationType } from "@/types/formTranslation";

type Props = {
  form: UseFormReturn<EditItemFormSchema>;
  translation: FormTranslationType;
};

export default function CityInput({ form, translation }: Props) {
  const [search, setSearch] = useState("");
  const debouncedSetSearch = useRef(debounce(setSearch, 300)).current;
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [width, setWidth] = useState<number>();

  const { data: cityOpts = [], isFetching: isLoading } = useCities(search);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const updateWidth = () => setWidth(el.offsetWidth);
    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <FormField
      control={form.control}
      name={"city"}
      render={({ field }) => (
        <FormItem className='w-full'>
          <FormLabel htmlFor='city'>
            {translation.city}
            <span className='text-xs text-muted-foreground'>
              ({translation.required})
            </span>
          </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Input
                  className='text-right'
                  id='city'
                  placeholder={translation.cityPlaceholder}
                  value={field.value as string}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    debouncedSetSearch(e.target.value);
                    setOpen(true);
                  }}
                  ref={inputRef}
                />
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='p-0' style={{ width }}>
              <Command>
                <CommandInput
                  value={field.value as string}
                  onValueChange={(val) => {
                    field.onChange(val);
                    debouncedSetSearch(val);
                  }}
                  placeholder={translation.cityPlaceholder}
                />
                <CommandEmpty>
                  {isLoading ? "טוען..." : "לא נמצאו תוצאות"}
                </CommandEmpty>
                <CommandGroup>
                  {cityOpts.map((c) => (
                    <CommandItem
                      key={c}
                      value={c}
                      onSelect={(val) => {
                        field.onChange(val);
                        setOpen(false);
                      }}
                    >
                      {c}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage className='text-xs text-red-500' />
        </FormItem>
      )}
    />
  );
}
