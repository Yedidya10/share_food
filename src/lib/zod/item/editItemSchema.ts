import { z } from "zod";
import itemSchema from "./itemSchema";

export function editItemImagesSchema() {
  return z.object({
    images: z
      .array(z.union([z.string().url(), z.instanceof(File)]))
      .min(1)
      .max(3),
  });
}

export default function editItemSchema({
  translation,
  isValidPhoneNumber,
}: {
  translation: { phoneNumberError: string; emailError: string };
  isValidPhoneNumber: (phone: string) => boolean;
}) {
  return z.intersection(
    itemSchema({ translation, isValidPhoneNumber }),
    editItemImagesSchema()
  );
}
