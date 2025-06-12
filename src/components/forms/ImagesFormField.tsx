"use client";

import { useCallback, useEffect, useState } from "react";
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
import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { TranslationType } from "@/types/translation";
import imageCompression from "browser-image-compression";

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  translation: TranslationType;
  state: {
    previewUrls: string[];
    setPreviewUrls: (urls: string[]) => void;
    selectedFiles: File[];
    setSelectedFiles: (files: File[]) => void;
  };
};

// מחזיר hash של קובץ מסוג File
async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function ImagesFormField<T extends FieldValues>({
  form,
  translation,
  state: { previewUrls, setPreviewUrls, selectedFiles, setSelectedFiles },
}: Props<T>) {
  const [imageHashes, setImageHashes] = useState<string[]>([]); // נשמר מחוץ לטופס

  useEffect(() => {
    form.register("imageHashes" as Path<T>);
  }, [form]);

  const onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const newFiles = Array.from(files).slice(0, 3 - selectedFiles.length);
      const compressedFiles: File[] = [];
      const newHashes: string[] = [];
      const newPreviews: string[] = [];

      for (const file of newFiles) {
        try {
          const hash = await hashFile(file); // חישוב hash לפני דחיסה
          const compressedBlob = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
            maxIteration: 5,
            initialQuality: 0.8,
          });
          const compressedFile = new File([compressedBlob], file.name, {
            type: compressedBlob.type,
          });
          compressedFiles.push(compressedFile);
          newHashes.push(hash);
          newPreviews.push(URL.createObjectURL(compressedFile));
        } catch (err) {
          console.warn("Compression failed, using original", err);
          const hash = await hashFile(file);
          compressedFiles.push(file);
          newHashes.push(hash);
          newPreviews.push(URL.createObjectURL(file));
        }
      }

      const updatedFiles = [...selectedFiles, ...compressedFiles];
      const updatedHashes = [...imageHashes, ...newHashes];
      const updatedPreviews = [...previewUrls, ...newPreviews];

      setSelectedFiles(updatedFiles);
      setImageHashes(updatedHashes);
      setPreviewUrls(updatedPreviews);

      form.setValue("images" as Path<T>, updatedFiles as T[Path<T>], {
        shouldValidate: true,
      });
      form.setValue(
        "imageHashes" as Path<T>,
        updatedHashes as unknown as T[Path<T>],
        { shouldValidate: true }
      );
    },
    [
      selectedFiles,
      previewUrls,
      imageHashes,
      form,
      setPreviewUrls,
      setSelectedFiles,
    ]
  );

  const removeImage = (idx: number) => {
    const pf = [...previewUrls];
    const sf = [...selectedFiles];
    const hashes = [...imageHashes];

    URL.revokeObjectURL(pf[idx]);
    pf.splice(idx, 1);
    sf.splice(idx, 1);
    hashes.splice(idx, 1);

    setImageHashes(hashes);
    form.setValue("imageHashes" as Path<T>, hashes as unknown as T[Path<T>], {
      shouldValidate: true,
    });

    setPreviewUrls(pf);
    setSelectedFiles(sf);
    setImageHashes(hashes);

    form.setValue("images" as Path<T>, sf as T[Path<T>], {
      shouldValidate: true,
    });
  };

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
                  ) as HTMLInputElement | null
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
          {previewUrls.length > 0 && (
            <div className='grid grid-cols-3 gap-2 mt-4'>
              {previewUrls.map((url, idx) => (
                <div key={idx} className='relative group'>
                  <Image
                    src={url}
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
