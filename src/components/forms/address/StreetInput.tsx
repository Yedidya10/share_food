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
import { useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { useStreets } from "@/hooks/db/useStreets";
import { UseFormReturn } from "react-hook-form";
import { FormTranslationType } from "@/types/formTranslation";
import useCityValidation from "../useCityValidation";
import type { EditItemFormSchema } from "@/lib/zod/item/editItemSchema";
type Props = {
  form: UseFormReturn<EditItemFormSchema>;
  translation: FormTranslationType;
};

export default function StreetInput({ form, translation }: Props) {
  // State and refs for search input and popover
  const [search, setSearch] = useState("");
  const debouncedSetSearch = useRef(debounce(setSearch, 300)).current;
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [width, setWidth] = useState<number>();

  const city = form.watch("city");
  const isCityValid = useCityValidation(city);

  const { data: streetOpts = [], isFetching: isLoading } = useStreets(
    search,
    city
  );

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
      name={"streetName"}
      render={({ field }) => (
        <FormItem className='w-full'>
          <FormLabel htmlFor='streetName'>
            {translation.streetName}
            <span className='text-xs text-muted-foreground'>
              {" "}
              ({translation.required})
            </span>
          </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Input
                  id='streetName'
                  className='text-right'
                  disabled={!isCityValid}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    debouncedSetSearch(e.target.value);
                    setOpen(true);
                  }}
                  placeholder={translation.streetNamePlaceholder}
                  ref={inputRef}
                />
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='p-0' style={{ width }}>
              <Command>
                <CommandInput
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    debouncedSetSearch(val);
                  }}
                  placeholder={translation.streetNamePlaceholder}
                />
                <CommandEmpty>
                  {isLoading ? "טוען..." : "לא נמצאו תוצאות"}
                </CommandEmpty>
                <CommandGroup>
                  {streetOpts.map((s) => (
                    <CommandItem
                      key={s}
                      value={s}
                      onSelect={(val) => {
                        field.onChange(val);
                        setOpen(false);
                      }}
                    >
                      {s}
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
