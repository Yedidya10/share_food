"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import EditItemButton from "@/components/editItemButton/EditItemButton";
import { createClient } from "@/lib/supabase/client";
import { Separator } from "../ui/separator";
import editItemSchema from "@/lib/zod/item/editItemSchema";
import ItemBaseFormFields from "../forms/ItemBaseFormFields";
import LocationFormFields from "../forms/LocationFormFields";
import ContactFormFields from "../forms/ContactFormFields";
import ImagesFormField from "../forms/ImagesFormField";
import { isValidPhoneNumber } from "react-phone-number-input";
import { editItemDefaultFormValues } from "../forms/utils/item/itemDefaultFormValues";
import { InitialValues } from "@/types/forms/item/item";
import { TranslationType } from "@/types/translation";

export default function EditItemForm({
  itemId,
  initialValues,
  translation,
}: {
  itemId: string;
  initialValues: InitialValues;
  translation: TranslationType;
}) {
  const supabase = createClient();
  const [openModal, setOpenModal] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    // Clear preview URLs when the modal opens
    if (openModal) {
      setPreviewUrls(initialValues.images as string[]);

      setSelectedFiles([] as File[]);
    }
  }, [openModal, initialValues.images]);

  useEffect(() => {
    // Clear preview URLs when the modal closes
    if (!openModal) {
      setPreviewUrls([]);
      setSelectedFiles([]);
    }
  }, [openModal]);

  // Define your form schema using Zod
  const formSchema = editItemSchema({ translation, isValidPhoneNumber });
  type EditItemFormSchema = z.infer<typeof formSchema>;

  // Define default values for the form
  const defaultValues = editItemDefaultFormValues({
    translation,
    initialValues,
  });

  // 1. Define your form.
  const editItemForm = useForm<EditItemFormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: defaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { data: userData, error: userError } = await supabase.auth.getUser();

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

    const files: File[] = selectedFiles;
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

    const { error: insertError } = await supabase.from("items").upsert([
      {
        id: itemId,
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
      //TODO: Handle successful submission
      // אפשר לנקות את הטופס או להעביר דף
      // form.reset();
      // setPreviewUrls([]); // Clear preview URLs after successful submission
    }
  }

  return (
    <>
      <EditItemButton onClick={() => setOpenModal(true)} />
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className='sm:max-w-[725px] h-[80vh] overflow-y-auto flex flex-col gap-8'>
          <DialogHeader>
            <DialogTitle>{translation.formTitle}</DialogTitle>
            <DialogDescription>{translation.formDescription}</DialogDescription>
          </DialogHeader>
          <Form {...editItemForm}>
            <form
              onSubmit={editItemForm.handleSubmit(onSubmit)}
              className='space-y-8'
            >
              <ItemBaseFormFields
                form={editItemForm}
                translation={translation}
              />
              <ImagesFormField
                form={editItemForm}
                translation={translation}
                state={{
                  previewUrls,
                  setPreviewUrls,
                  selectedFiles,
                  setSelectedFiles,
                }}
              />
              <Separator />
              <LocationFormFields
                form={editItemForm}
                translation={translation}
              />
              <Separator />
              <ContactFormFields
                form={editItemForm}
                translation={translation}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type='button' variant='outline'>
                    {translation.cancel}
                  </Button>
                </DialogClose>
                <Button
                  type='submit'
                  disabled={
                    !editItemForm.formState.isValid ||
                    editItemForm.formState.isSubmitting ||
                    editItemForm.formState.disabled
                  }
                >
                  {translation.submitButton}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
