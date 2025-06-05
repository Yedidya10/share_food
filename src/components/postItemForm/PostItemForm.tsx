"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import PostItemButton from "../postItemButton/PostItemButton";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Separator } from "../ui/separator";
import PhoneInput from "@/components/phoneInput/PhoneInput";
import { useLocale } from "next-intl";
import { Checkbox } from "../ui/checkbox";

export default function PostItemForm({
  translation,
}: {
  translation: {
    formTitle: string;
    formDescription: string;
    title: string;
    titlePlaceholder: string;
    titleError: string;
    description: string;
    descriptionPlaceholder: string;
    descriptionError: string;
    uploadImages: string;
    addressDetails: string;
    streetName: string;
    streetNamePlaceholder: string;
    streetNameError: string;
    streetNumber: string;
    streetNumberPlaceholder: string;
    streetNumberError: string;
    city: string;
    cityPlaceholder: string;
    cityError: string;
    country: string;
    postalCode: string;
    postalCodePlaceholder: string;
    postalCodeError: string;
    contactDetails: string;
    contactViaSite: string;
    phoneNumber: string;
    phoneNumberPlaceholder: string;
    phoneNumberError: string;
    isHaveWhatsApp: string;
    isHaveWhatsAppTip: string;
    email: string;
    emailPlaceholder: string;
    emailError: string;
    submitButton: string;
    cancel: string;
    required: string;
    reset: string;
    countries: {
      israel: string;
      usa: string;
    };
  };
}) {
  const locale = useLocale();
  const supabase = createClient();
  const [openModal, setOpenModal] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const formSchema = z.object({
    title: z
      .string()
      .min(5, {
        message: translation.titleError,
      })
      .max(50, {
        message: translation.titleError,
      }),
    description: z
      .string()
      .max(300, {
        message: translation.descriptionError,
      })
      .min(20, {
        message: translation.descriptionError,
      }),
    images: z.array(z.instanceof(File)).max(3, {
      message: "You can upload a maximum of 3 images.",
    }),
    streetName: z
      .string()
      .max(50, {
        message: translation.streetNameError,
      })
      .min(2, {
        message: translation.streetNameError,
      }),
    streetNumber: z
      .string()
      .max(10, {
        message: translation.streetNumberError,
      })
      .min(1, {
        message: translation.streetNumberError,
      }),
    city: z
      .string()
      .max(10, {
        message: translation.cityError,
      })
      .min(2, {
        message: translation.cityError,
      }),
    country: z
      .string()
      .max(50, {
        message: "Country must be at most 50 characters.",
      })
      .min(2, {
        message: "Country must be at least 2 characters.",
      }),
    postalCode: z
      .string()
      .max(20, {
        message: translation.postalCodeError,
      })
      .min(2, {
        message: translation.postalCodeError,
      }),
    contactByPhone: z.boolean().optional(),
    contactByEmail: z.boolean().optional(),
    phoneNumber: z
      .string()
      .max(13, {
        message: translation.phoneNumberError,
      })
      .min(13, {
        message: translation.phoneNumberError,
      })
      .superRefine((val: string, ctx) => {
        // @ts-expect-error parent is not typed in Zod context
        const contactByPhone = ctx.parent?.contactByPhone;
        if (contactByPhone && !val) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: translation.phoneNumberError,
          });
        }
      }),
    isHaveWhatsApp: z.boolean().optional(),
    email: z
      .string()
      .email({
        message: translation.emailError,
      })
      .superRefine((val: string, ctx) => {
        // @ts-expect-error parent is not typed in Zod context
        const contactByEmail = ctx.parent?.contactByEmail;
        if (contactByEmail && !val) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: translation.emailError,
          });
        }
      }),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      images: [],
      streetName: "",
      streetNumber: "",
      city: "",
      country: translation.countries.israel, // Default
      postalCode: "",
      contactByPhone: false,
      contactByEmail: false,
      phoneNumber: "",
      isHaveWhatsApp: false,
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    console.log("values data:", values);

    if (userError) {
      console.error("Session error:", JSON.stringify(userError, null, 2));
      return;
    }

    const userId = userData?.user?.id;

    function sanitizeFileName(fileName: string) {
      return fileName
        .replace(/[\u200B-\u200F\u202A-\u202E]/g, "")
        .replace(/\s+/g, "_");
    }

    const files: File[] = values.images || [];
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const cleanName = sanitizeFileName(file.name);
      const filePath = `public/${cleanName}`;

      const { data, error } = await supabase.storage
        .from("share-food-images")
        .upload(filePath, file);

      if (error) {
        console.error("Upload error:", error.message);
      } else {
        console.log("File uploaded successfully:", data);
        const { data: publicUrl } = supabase.storage
          .from("share-food-images")
          .getPublicUrl(filePath);

        console.log("Public URL:", publicUrl);

        if (publicUrl?.publicUrl) {
          uploadedUrls.push(publicUrl.publicUrl);
        }
      }
    }

    const { error: insertError } = await supabase.from("items").insert([
      {
        title: values.title,
        description: values.description,
        images: uploadedUrls, // assuming the column is type: text[] (array of strings)
        street_name: values.streetName,
        street_number: values.streetNumber,
        city: values.city,
        country: values.country,
        postal_code: values.postalCode,
        full_name: userData?.user?.user_metadata?.full_name || null,
        phone_number: values.phoneNumber || null,
        is_have_whatsapp: values.isHaveWhatsApp ?? false,
        email: values.email || null,
        status: "pending", // Default status
        user_id: userId,
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError.message);
    } else {
      // אפשר לנקות את הטופס או להעביר דף
      // form.reset();
      // setPreviewUrls([]); // Clear preview URLs after successful submission
    }
  }

  return (
    <>
      <PostItemButton onClick={() => setOpenModal(true)} />
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className='sm:max-w-[725px] h-[80vh] overflow-y-auto flex flex-col gap-8'>
          <DialogHeader>
            <DialogTitle>{translation.formTitle}</DialogTitle>
            <DialogDescription>{translation.formDescription}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translation.title}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translation.titlePlaceholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translation.description}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translation.descriptionPlaceholder}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of the item.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='images'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translation.uploadImages}</FormLabel>
                    <FormControl>
                      <Input
                        type='file'
                        accept='image/*'
                        multiple
                        onChange={(e) => {
                          const files = e.target.files;
                          if (!files) return;

                          const fileArray = Array.from(files);
                          field.onChange(fileArray);
                          setPreviewUrls(
                            fileArray.map((file) => URL.createObjectURL(file))
                          );
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Select one or more images to upload.
                    </FormDescription>
                    <FormMessage />
                    {previewUrls.length > 0 && (
                      <div className='grid grid-cols-3 gap-2 mt-4'>
                        {previewUrls.map((url, idx) => (
                          <Image
                            key={idx}
                            src={url}
                            alt={`preview-${idx}`}
                            width={100}
                            height={100}
                            className='rounded-md object-cover h-24 w-full'
                          />
                        ))}
                      </div>
                    )}
                  </FormItem>
                )}
              />
              <Separator />
              <div className='flex flex-col space-y-4'>
                <h3 className='text-lg font-semibold'>
                  {translation.addressDetails}
                </h3>
                <div className='flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0'>
                  <FormField
                    control={form.control}
                    name='streetName'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel>{translation.streetName}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={translation.streetNamePlaceholder}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='streetNumber'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel>{translation.streetNumber}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={translation.streetNumberPlaceholder}
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
                    name='city'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel>{translation.city}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={translation.cityPlaceholder}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='country'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel>{translation.country}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={translation.countries.israel}
                            {...field}
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='postalCode'
                    render={({ field }) => (
                      <FormItem className='w-full'>
                        <FormLabel>{translation.postalCode}</FormLabel>
                        <FormControl>
                          <Input
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
              <Separator />
              <div className='flex flex-col space-y-6'>
                <h3 className='text-xl font-semibold'>
                  {translation.contactDetails}
                </h3>
                <p className='text-sm text-muted-foreground'>
                  בחר איך ניתן ליצור איתך קשר. אפשר לבחור יותר מאפשרות אחת.
                </p>
                <div className='rounded-lg border px-4 py-3 bg-muted/50 flex items-start gap-3'>
                  <Checkbox
                    defaultChecked
                    disabled
                    className='mt-1 h-5 w-5'
                    id='contactViaSite'
                  />
                  <div>
                    <FormLabel className='font-medium' htmlFor='contactViaSite'>
                      {translation.contactViaSite}
                    </FormLabel>
                    <p className='text-xs text-muted-foreground'>
                      האפשרות הזו תמיד זמינה באתר.
                    </p>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name='contactByPhone'
                  render={({ field }) => (
                    <div className='rounded-lg border px-4 py-3 space-y-3'>
                      <div className='flex items-center gap-3'>
                        <Checkbox
                          className='h-5 w-5'
                          checked={field.value}
                          id='contactByPhone'
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                        <FormLabel
                          className='m-0 font-medium'
                          htmlFor='contactByPhone'
                        >
                          {translation.phoneNumber}
                        </FormLabel>
                      </div>
                      {field.value && (
                        <FormField
                          control={form.control}
                          name='phoneNumber'
                          render={({ field }) => (
                            <FormItem dir='ltr' className='w-full max-w-xs'>
                              <FormLabel dir={locale === "he" ? "rtl" : "ltr"}>
                                {translation.phoneNumber}
                              </FormLabel>
                              <FormControl>
                                <PhoneInput
                                  value={field.value}
                                  placeholder={
                                    translation.phoneNumberPlaceholder
                                  }
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage
                                dir={locale === "he" ? "rtl" : "ltr"}
                              />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name='contactByEmail'
                  render={({ field }) => (
                    <div className='rounded-lg border px-4 py-3 space-y-3'>
                      <div className='flex items-center gap-3'>
                        <Checkbox
                          className='h-5 w-5'
                          checked={field.value}
                          id='contactByEmail'
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                        <FormLabel
                          className='m-0 font-medium'
                          htmlFor='contactByEmail'
                        >
                          {translation.email}
                        </FormLabel>
                      </div>
                      {field.value && (
                        <FormField
                          control={form.control}
                          name='email'
                          render={({ field }) => (
                            <FormItem className='w-full max-w-xs'>
                              <FormLabel>{translation.email}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={translation.emailPlaceholder}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type='button' variant='outline'>
                    {translation.cancel}
                  </Button>
                </DialogClose>
                <Button type='submit'>{translation.submitButton}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
