"use client";

import { useCallback, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UseFormReturn, FieldValues, Path, PathValue } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormTranslationType } from "@/types/formTranslation";
import imageCompression from "browser-image-compression";
import { UnifiedImage } from "@/types/item/unifiedImage";

type Props<T extends FieldValues & { images: UnifiedImage[] }> = {
  form: UseFormReturn<T>;
  translation: FormTranslationType;
  state: {
    images: UnifiedImage[];
    setImages: React.Dispatch<React.SetStateAction<UnifiedImage[]>>;
  };
};

async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function ImagesFormField<
  T extends FieldValues & { images: UnifiedImage[] },
>({ form, translation, state: { images, setImages } }: Props<T>) {
  useEffect(() => {
    form.register("images" as Path<T>);
  }, [form]);

  useEffect(() => {
    form.setValue("images" as Path<T>, images as PathValue<T, Path<T>>, {
      shouldValidate: true,
    });
  }, [images, form]);

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      const allowed = Array.from(files).slice(0, 3 - images.length);
      const added: UnifiedImage[] = [];

      for (const file of allowed) {
        const hash = await hashFile(file);
        // אם כבר קיים hash כזה, דלג
        if (images.some((img) => img.hash === hash)) continue;

        let compressedFile: File;
        try {
          const blob = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
          });
          compressedFile = new File([blob], file.name, { type: blob.type });
        } catch {
          compressedFile = file;
        }

        const url = URL.createObjectURL(compressedFile);

        added.push({
          id: `new-${images.length + added.length}`,
          url,
          file: compressedFile,
          hash,
        });
      }

      setImages([...images, ...added]);
      e.target.value = ""; // נקה הקלט
    },
    [images, setImages]
  );

  const removeImage = useCallback(
    (idx: number) => {
      setImages((prev: UnifiedImage[]) => {
        const next: UnifiedImage[] = [...prev];
        const removed: UnifiedImage = next.splice(idx, 1)[0];
        // שחרור URL רק לתמונות חדשות
        if (removed.file) URL.revokeObjectURL(removed.url || "");
        return next;
      });
    },
    [setImages]
  );

  return (
    <FormField
      control={form.control}
      name={"images" as Path<T>}
      render={() => (
        <FormItem>
          <FormLabel>
            <Button
              type='button'
              variant='outline'
              className='w-full h-10'
              onClick={() =>
                (
                  document.querySelector(
                    'input[type="file"]'
                  ) as HTMLInputElement
                )?.click()
              }
            >
              {translation.uploadImages}
            </Button>
          </FormLabel>
          <FormControl>
            <Input
              type='file'
              accept='image/*'
              multiple
              className='hidden'
              onChange={onFileChange}
            />
          </FormControl>
          <FormDescription>
            יש להעלות לפחות תמונה אחת. עד 3 תמונות.
          </FormDescription>
          <FormMessage />
          {images.length > 0 && (
            <div className='grid grid-cols-3 gap-2 mt-4'>
              {images.map((img, idx) => (
                <div key={idx} className='relative group'>
                  <Image
                    src={img.url || ""}
                    alt={`preview-${idx}`}
                    width={100}
                    height={100}
                    className='rounded-md object-cover h-24 w-full'
                  />
                  <button
                    type='button'
                    onClick={() => removeImage(idx)}
                    className='absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition'
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </FormItem>
      )}
    />
  );
}
