import { z } from "zod";
import itemSchema from "./itemSchema";
import { TranslationType } from "@/types/translation";

export function postItemImagesSchema() {
  return z.object({
    images: z.array(z.instanceof(File)).min(1).max(3),
    imageHashes: z.array(z.string()).min(1).max(3),
  });
}

export default function postItemSchema(translation: TranslationType) {
  return z.intersection(itemSchema(translation), postItemImagesSchema());
}
