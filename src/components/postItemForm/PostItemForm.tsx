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
import { useState } from "react";
import PostItemButton from "@/components/postItemButton/PostItemButton";
import { Separator } from "@/components/ui/separator";
import { useLocale } from "next-intl";
import postItemSchema from "@/lib/zod/item/postItemSchema";
import { postItemDefaultFormValues } from "@/components/forms/utils/item/itemDefaultFormValues";
import ContactFormFields from "@/components/forms/ContactFormFields";
import LocationFormFields from "@/components/forms/LocationFormFields";
import ImagesFormField from "@/components/forms/ImagesFormField";
import ItemBaseFormFields from "@/components/forms/ItemBaseFormFields";
import { TranslationType } from "@/types/translation";
import onSubmit from "@/components/forms/utils/item/onSubmit";

export default function PostItemForm({
  translation,
}: {
  translation: TranslationType;
}) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const locale = useLocale();
  // const supabase = createClient();
  const [openModal, setOpenModal] = useState(false);

  // Define your form schema using Zod
  const formSchema = postItemSchema(translation);
  type PostItemFormSchema = z.infer<typeof formSchema>;

  // Define default values for the form
  const defaultValues = postItemDefaultFormValues(translation);

  // useEffect(() => {
  //   const result = formSchema.safeParse(defaultValues);
  //   if (!result.success) {
  //     console.error("❌ defaultValues לא תואמים לסכמה:", result.error.format());
  //   }
  // }, [formSchema, defaultValues]);

  // Define your form
  const postItemForm = useForm<PostItemFormSchema>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: defaultValues,
  });

  return (
    <>
      <PostItemButton onClick={() => setOpenModal(true)} />
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className='sm:max-w-[725px] h-[80vh] overflow-y-auto flex flex-col gap-8'>
          <DialogHeader className='m-auto'>
            <DialogTitle
              className='text-center text-2xl font-semibold'
              dir={locale === "he" ? "rtl" : "ltr"}
            >
              {translation.formTitle}
            </DialogTitle>
            <DialogDescription className='text-center text-sm text-muted-foreground'>
              {translation.formDescription}
            </DialogDescription>
          </DialogHeader>
          <Form {...postItemForm}>
            <form
              onSubmit={postItemForm.handleSubmit(onSubmit)}
              className='space-y-8'
            >
              <ItemBaseFormFields
                form={postItemForm}
                translation={translation}
              />
              <ImagesFormField
                form={postItemForm}
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
                form={postItemForm}
                translation={translation}
              />
              <Separator />
              <ContactFormFields
                form={postItemForm}
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
                    !postItemForm.formState.isValid ||
                    postItemForm.formState.disabled ||
                    postItemForm.formState.isSubmitting
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
