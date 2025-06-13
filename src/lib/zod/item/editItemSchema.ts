import { z } from "zod";
import itemSchema from "./itemSchema";
import { TranslationType } from "@/types/translation";

export function editItemImagesSchema() {
  return z.object({
    images: z
      .array(z.union([z.string().url(), z.instanceof(File)]))
      .min(1)
      .max(3),
  });
}

export default function editItemSchema(translation: TranslationType) {
  return z.intersection(itemSchema(translation), editItemImagesSchema());
}
