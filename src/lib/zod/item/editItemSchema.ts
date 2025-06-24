import { z } from "zod";
import itemSchema from "./itemSchema";
import { FormTranslationType } from "@/types/formTranslation";

export function editItemImagesSchema(translation: FormTranslationType) {
  return z.object({
    images: z
      .array(
        z.object({
          id: z.string().optional(),
          url: z.string().optional(),
          file: z.instanceof(File).optional(),
          hash: z.string().optional(),
        })
      )
      .min(
        1,
        translation.uploadImagesError || "Please upload at least one image."
      )
      .max(
        3,
        translation.uploadImagesError || "You can upload up to 3 images."
      ),
  });
}

export default function editItemSchema(translation: FormTranslationType) {
  return z.intersection(
    itemSchema(translation),
    editItemImagesSchema(translation)
  );
}

export type EditItemFormSchema = z.infer<ReturnType<typeof editItemSchema>>;
