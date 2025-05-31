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
import { createClient } from "@/lib/supabase/client"; // Adjust the import path as needed

const formSchema = z.object({
  title: z
    .string()
    .max(50, {
      message: "Title must be at most 50 characters.",
    })
    .min(5, {
      message: "Title must be at least 5 characters.",
    }),
  description: z
    .string()
    .max(300, {
      message: "Description must be at most 300 characters.",
    })
    .min(20, {
      message: "Description must be at least 20 characters.",
    }),
  images: z.array(z.instanceof(File)).max(3, {
    message: "You can upload a maximum of 3 images.",
  }),
  streetName: z
    .string()
    .max(50, {
      message: "Street name must be at most 50 characters.",
    })
    .min(2, {
      message: "Street name must be at least 2 characters.",
    }),
  streetNumber: z
    .string()
    .max(10, {
      message: "Street number must be at most 10 characters.",
    })
    .min(1, {
      message: "Street number must be at least 1 character.",
    }),
  city: z
    .string()
    .max(50, {
      message: "City must be at most 50 characters.",
    })
    .min(2, {
      message: "City must be at least 2 characters.",
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
      message: "Postal code must be at most 20 characters.",
    })
    .min(2, {
      message: "Postal code must be at least 2 characters.",
    }),
  phoneNumber: z
    .string()
    .max(10, {
      message: "Phone number must be at most 10 characters.",
    })
    .min(10, {
      message: "Phone number must be at least 10 characters.",
    })
    .optional(),
  isHaveWhatsApp: z.boolean().optional(),
  email: z
    .string()
    .email({
      message: "Invalid email address.",
    })
    .optional(),
});

export default function PostItemForm({
  translation,
}: {
  translation: {
    title: string;
    description: string;
    uploadImages?: string; // Optional, if you want to add image upload later
    streetName: string;
    streetNumber: string;
    city: string;
    country: string;
    postalCode: string;
    phoneNumber: string;
    isHaveWhatsApp: string;
    email: string;
    submit: string;
    cancel: string;
    required: string; // Optional, if you want to show required field messages
    reset: string; // Optional, if you want to add a reset button later
    countries: {
      israel: string;
      usa: string;
    };
  };
}) {
  const supabase = createClient();
  const [openModal, setOpenModal] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      streetName: "",
      streetNumber: "",
      city: "",
      country: translation.countries.israel, // Default
      postalCode: "",
      phoneNumber: "",
      isHaveWhatsApp: false,
      email: "", // Assuming you might want to handle email later
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    const files: File[] = values.images || [];
    if (!files.length) {
      alert("No images selected");
      return;
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const filePath = `images/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from("share-food-images")
        .upload(filePath, file);

      if (error) {
        console.error("Upload error:", error.message);
      } else {
        const { data: publicUrl } = supabase.storage
          .from("share-food-images")
          .getPublicUrl(filePath);

        if (publicUrl?.publicUrl) {
          uploadedUrls.push(publicUrl.publicUrl);
        }
      }
    }

    console.log("Uploaded image URLs:", uploadedUrls);
  }

  return (
    <>
      <PostItemButton onClick={() => setOpenModal(true)} />
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <DialogContent className='sm:max-w-[525px] h-[80vh] overflow-y-auto flex flex-col gap-8'>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Post an food item for to share with others.
                </DialogDescription>
              </DialogHeader>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translation.title}</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter item title' {...field} />
                    </FormControl>
                    <FormDescription>
                      The title of the item you want to post.
                    </FormDescription>
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
                      <Input placeholder='Enter item description' {...field} />
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
                    <FormLabel>Upload Images</FormLabel>
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

                    {/* תצוגה מקדימה */}
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
              <FormField
                control={form.control}
                name='streetName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translation.streetName}</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter street name' {...field} />
                    </FormControl>
                    <FormDescription>
                      The street name of the item&apos;s location.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='streetNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translation.streetNumber}</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter street number' {...field} />
                    </FormControl>
                    <FormDescription>
                      The street number of the item&apos;s location.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='city'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translation.city}</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter city' {...field} />
                    </FormControl>
                    <FormDescription>
                      The city where the item is located.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                disabled
                name='country'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translation.country}</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter country' {...field} />
                    </FormControl>
                    <FormDescription>
                      The country where the item is located.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='postalCode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translation.postalCode}</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter postal code' {...field} />
                    </FormControl>
                    <FormDescription>
                      The postal code of the item&apos;s location.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translation.phoneNumber}</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter phone number' {...field} />
                    </FormControl>
                    <FormDescription>
                      Your contact phone number.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='isHaveWhatsApp'
                render={({ field }) => (
                  <FormItem className='flex space-x-3'>
                    <FormControl>
                      <Input
                        type='checkbox'
                        className='h-5 w-5'
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <div className=' flex flex-col gap-2'>
                      <FormLabel>{translation.isHaveWhatsApp}</FormLabel>
                      <FormDescription className=' text-xs'>
                        Check if you can be contacted via WhatsApp.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translation.email}</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter email' {...field} />
                    </FormControl>
                    <FormDescription>
                      Your contact email address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='outline'>Cancel</Button>
                </DialogClose>
                <Button type='submit'>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Form>
      </Dialog>
    </>
  );
}
