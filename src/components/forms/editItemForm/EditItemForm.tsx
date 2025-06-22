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
import { UnifiedImage } from "@/types/forms/item/unifiedImage";
import { useLocale } from "next-intl";
import { useUpdateItem } from "@/hooks/useUpdateItem";
import { Loader } from "lucide-react";

export default function EditItemForm({
  open,
  onClose,
  setIsEditItemFormSubmitSuccess,
  itemStatus,
  itemId,
  initialValues,
  translation,
}: {
  open: boolean;
  onClose: () => void;
  itemId: string;
  itemStatus: string;
  setIsEditItemFormSubmitSuccess: React.Dispatch<
    React.SetStateAction<boolean | null>
  >;
  initialValues: InitialValues;
  translation: TranslationType;
}) {
  const locale = useLocale();
  const { mutateAsync: updateItem, isPending } = useUpdateItem();
  const [images, setImages] = useState<UnifiedImage[]>(() =>
    (initialValues.images || []).map((url, i) => ({
      id: `existing-${i}`,
      url,
    }))
  );

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

  useEffect(() => {
    if (!open) {
      setImages([]);
    }
  }, [open]);

  // Handle form submission
  const onSubmit = async (values: EditItemFormSchema) => {
    try {
      const response = await updateItem({
        values: { ...values, images },
        itemId,
        itemStatus,
      });

      if (response?.success) {
        setIsEditItemFormSubmitSuccess(true);
        onClose();
        editItemForm.reset(defaultValues);
        setImages([]);
      } else {
        setIsEditItemFormSubmitSuccess(false);
        onClose();
        console.error("Error inserting item:", response?.message);
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };
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
            <DialogTitle
              className='text-center text-2xl font-semibold'
              dir={locale === "he" ? "rtl" : "ltr"}
            >
              {translation.formTitle}
            </DialogTitle>
            <DialogDescription
              className='text-center text-sm text-muted-foreground'
              dir={locale === "he" ? "rtl" : "ltr"}
            >
              {translation.formDescription}
            </DialogDescription>
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
                    !editItemForm.formState.isDirty ||
                    isPending
                  }
                >
                  {isPending ? (
                    <Loader className='animate-spin h-4 w-4 mr-2' />
                  ) : (
                    <span>עדכן פריט</span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
