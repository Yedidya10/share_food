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
import { Separator } from "@/components/ui/separator";
import editItemSchema from "@/lib/zod/item/editItemSchema";
import ItemBaseFormFields from "@/components/forms/ItemBaseFormFields";
import LocationFormFields from "@/components/forms/LocationFormFields";
import ContactFormFields from "@/components/forms/ContactFormFields";
import ImagesFormField from "@/components/forms/ImagesFormField";
import { editItemDefaultFormValues } from "@/components/forms/utils/item/itemDefaultFormValues";
import { InitialValues } from "@/types/forms/item/item";
import { TranslationType } from "@/types/translation";
import onEditItemFormSubmit from "@/components/forms/editItemForm/onEditItemFormSubmit";
import { UnifiedImage } from "@/types/forms/item/unifiedImage";

export default function EditItemForm({
  open,
  onClose,
  itemId,
  initialValues,
  translation,
}: {
  open: boolean;
  onClose: () => void;
  itemId: string;
  initialValues: InitialValues;
  translation: TranslationType;
}) {
  const [images, setImages] = useState<UnifiedImage[]>(() =>
    (initialValues.images || []).map((url, i) => ({
      id: `existing-${i}`,
      url,
    }))
  );

  useEffect(() => {
    console.log("EditItemForm:", images);
  }, [images]);

  // Define your form schema using Zod
  const formSchema = editItemSchema(translation);
  type EditItemFormSchema = z.infer<typeof formSchema>;

  // Define default values for the form
  const defaultValues = editItemDefaultFormValues({
    translation,
    initialValues,
  });

  const editItemForm = useForm<EditItemFormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: defaultValues,
  });

  // useEffect(() => {
  //   editItemForm.setValue("images", images, {
  //     shouldValidate: true,
  //   });
  // }, [images, editItemForm]);

  useEffect(() => {
    // Clear preview URLs when the modal closes
    if (!open) {
      setImages([]);
    }
  }, [open]);

  const onSubmit = editItemForm.handleSubmit(async (values) => {
    await onEditItemFormSubmit({ ...values, images }, itemId);
  });

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            onClose();
            setImages([]);
            editItemForm.reset(defaultValues);
          }
        }}
      >
        <DialogContent className='sm:max-w-[725px] h-[80vh] overflow-y-auto flex flex-col gap-8'>
          <DialogHeader>
            <DialogTitle>{translation.formTitle}</DialogTitle>
            <DialogDescription>{translation.formDescription}</DialogDescription>
          </DialogHeader>
          <Form {...editItemForm}>
            <form onSubmit={onSubmit} className='space-y-8'>
              <ItemBaseFormFields
                form={editItemForm}
                translation={translation}
              />
              <ImagesFormField
                form={editItemForm}
                translation={translation}
                state={{
                  images,
                  setImages,
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
                    editItemForm.formState.disabled ||
                    !editItemForm.formState.isDirty // Disable if form is not dirty
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
