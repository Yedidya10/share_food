"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import editItemSchema from "@/lib/zod/item/editItemSchema";
import ItemBaseFormFields from "@/components/forms/ItemBaseFormFields";
import ContactFormFields from "@/components/forms/ContactFormFields";
import LocationFormFields from "@/components/forms/LocationFormFields";
import ImagesFormField from "@/components/forms/ImagesFormField";
import { editItemDefaultFormValues } from "@/components/forms/utils/item/itemDefaultFormValues";
import type { EditItemFormValues } from "@/types/item/item";
import type { UnifiedImage } from "@/types/item/unifiedImage";
import { useLocale } from "next-intl";
import { useUpdateItem } from "@/hooks/useUpdateItem";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DirectionProvider } from "@radix-ui/react-direction";
import { FormTranslationType } from "@/types/formTranslation";

interface EditItemFormProps {
  itemId: string;
  itemStatus: string;
  initialValues: EditItemFormValues;
  translation: FormTranslationType;
}

export default function EditItemForm({
  itemStatus,
  itemId,
  initialValues,
  translation,
}: EditItemFormProps) {
  const locale = useLocale();
  const { mutateAsync: updateItem, isPending } = useUpdateItem();

  // Initialize images from initialValues
  const [images, setImages] = useState<UnifiedImage[]>(() =>
    (initialValues.images || []).map((url, i) => ({
      id: `existing-${i}`,
      url,
    }))
  );

  // Define form schema and type
  const formSchema = editItemSchema(translation);
  type EditItemFormSchema = z.infer<typeof formSchema>;

  // Define default values
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

  // Reset form and images when initialValues change
  useEffect(() => {
    const newImages = (initialValues.images || []).map((url, i) => ({
      id: `existing-${i}`,
      url,
    }));
    setImages(newImages);

    // Reset form with new default values
    const newDefaultValues = editItemDefaultFormValues({
      translation,
      initialValues,
    });
    editItemForm.reset(newDefaultValues);
  }, [initialValues, translation, editItemForm]);

  // Handle form submission with better error handling
  const onSubmit = async (values: EditItemFormSchema) => {
    try {
      const response = await updateItem({
        values: { ...values, images },
        itemId,
        itemStatus,
      });

      if (response?.success) {
        toast.success("הפריט עודכן בהצלחה");
      } else {
        toast.error(response?.message || "שגיאה בעדכון הפריט");
        console.error("Error updating item:", response?.message);
      }
    } catch (error) {
      toast.error("שגיאה בעדכון הפריט");
      console.error("Error in onSubmit:", error);
    }
  };

  // Check if form can be submitted
  const canSubmit =
    editItemForm.formState.isValid &&
    !editItemForm.formState.isSubmitting &&
    editItemForm.formState.isDirty &&
    !isPending;

  return (
    <DirectionProvider dir={locale === "he" ? "rtl" : "ltr"}>
      <div className='sm:max-w-[725px] overflow-y-auto flex flex-col gap-8'>
        <h1 className='text-center text-2xl font-semibold'>
          {translation.formTitle}
        </h1>
        <p className='text-center text-sm text-muted-foreground'>
          {translation.formDescription}
        </p>
        <Form {...editItemForm}>
          <form
            onSubmit={editItemForm.handleSubmit(onSubmit)}
            className='space-y-8'
          >
            <ItemBaseFormFields form={editItemForm} translation={translation} />
            <ImagesFormField
              form={editItemForm}
              translation={translation}
              state={{
                images,
                setImages,
              }}
            />
            <Separator />
            <LocationFormFields form={editItemForm} translation={translation} />
            <Separator />
            <ContactFormFields form={editItemForm} translation={translation} />
            <div className='gap-2'>
              <Button
                type='submit'
                disabled={!canSubmit}
                className='min-w-[120px]'
              >
                {isPending ? (
                  <>
                    <Loader2 className='animate-spin h-4 w-4 mr-2' />
                    {"מעדכן..."}
                  </>
                ) : (
                  "עדכן פריט"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DirectionProvider>
  );
}
