"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { TranslationType } from "@/types/translation";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  searchCitiesInHebrew,
  searchStreetsInHebrew,
} from "@/lib/supabase/actions/locations";
import useCityValidation from "@/components/forms/useCityValidation";

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
  const streetInputRef = useRef<HTMLInputElement>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const [streetInputWidth, setStreetInputWidth] = useState<number>();
  const [cityInputWidth, setCityInputWidth] = useState<number>();
  const [cityOpts, setCityOpts] = useState<string[]>([]);
  const [streetOpts, setStreetOpts] = useState<string[]>([]);
  const [openCitiesCommand, setOpenCitiesCommand] = useState(false);
  const [openStreetsCommand, setOpenStreetsCommand] = useState(false);
  const [isCitiesCommandPending, startCitiesCommandTransition] =
    useTransition();
  const [isStreetsCommandPending, startStreetsCommandTransition] =
    useTransition();
  const cityValue = form.watch("city" as Path<T>);
  const isCityValid = useCityValidation(cityValue);

  function handleSearchCity(input: string) {
    if (input.length < 2) {
      setCityOpts([]);
      return;
    }

    startCitiesCommandTransition(() => {
      searchCitiesInHebrew(input).then((results) => setCityOpts(results));
    });
  }

  function handleSearchStreet(input: string, city: string) {
    if (input.length < 2 || !city) {
      setStreetOpts([]);
      return;
    }

    startStreetsCommandTransition(() => {
      searchStreetsInHebrew(input, city).then((results) =>
        setStreetOpts(results)
      );
    });
  }

  useEffect(() => {
    const streetEl = streetInputRef.current;
    const cityEl = cityInputRef.current;

    if (!streetEl || !cityEl) return;

    const updateWidths = () => {
      setStreetInputWidth(streetEl.offsetWidth);
      setCityInputWidth(cityEl.offsetWidth);
    };

    // הרצה ראשונית
    updateWidths();

    const resizeObserver = new ResizeObserver(updateWidths);
    resizeObserver.observe(streetEl);
    resizeObserver.observe(cityEl);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className='flex flex-col space-y-4'>
      <h3 className='text-lg font-semibold'>{translation.addressDetails}</h3>
      <div className='hidden flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0'>
        <FormField
          control={form.control}
          name={"country" as Path<T>}
          render={({ field }) => (
            <FormItem className='w-full hidden'>
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
            <FormItem className='w-full hidden'>
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
              <Popover
                open={openCitiesCommand}
                onOpenChange={setOpenCitiesCommand}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Input
                      className='text-right'
                      id='city'
                      placeholder={translation.cityPlaceholder}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleSearchCity(e.target.value);
                        setOpenCitiesCommand(true);
                      }}
                      ref={cityInputRef}
                    />
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className='p-0'
                  style={{ width: cityInputWidth }}
                >
                  <Command>
                    <CommandInput
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        handleSearchCity(val);
                      }}
                      placeholder={translation.cityPlaceholder}
                    />
                    <CommandEmpty>
                      {isCitiesCommandPending ? "טוען..." : "לא נמצאו תוצאות"}
                    </CommandEmpty>
                    <CommandGroup>
                      {cityOpts.map((c) => (
                        <CommandItem
                          key={c}
                          value={c}
                          onSelect={(val) => {
                            field.onChange(val);
                            setOpenCitiesCommand(false);
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
              <div className='w-full'>
                <Popover
                  open={openStreetsCommand}
                  onOpenChange={setOpenStreetsCommand}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Input
                        id='streetName'
                        required
                        className='text-right'
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleSearchStreet(
                            e.target.value,
                            form.getValues("city" as Path<T>)
                          );
                          setOpenStreetsCommand(true);
                        }}
                        disabled={!isCityValid}
                        placeholder={translation.streetNamePlaceholder}
                        ref={streetInputRef}
                      />
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className='p-0'
                    style={{ width: streetInputWidth }}
                  >
                    <Command>
                      <CommandInput
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          handleSearchStreet(
                            val,
                            form.getValues("city" as Path<T>)
                          );
                        }}
                        placeholder={translation.streetNamePlaceholder}
                      />
                      <CommandEmpty>
                        {isStreetsCommandPending
                          ? "טוען..."
                          : "לא נמצאו תוצאות"}
                      </CommandEmpty>
                      <CommandGroup>
                        {streetOpts.map((c) => (
                          <CommandItem
                            key={c}
                            value={c}
                            onSelect={(val) => {
                              field.onChange(val);
                              setOpenStreetsCommand(false);
                            }}
                          >
                            {c}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage className='text-xs text-red-500' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"streetNumber" as Path<T>}
          render={({ field }) => (
            <FormItem className='w-[60%]'>
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
