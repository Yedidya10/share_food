"use server";

import { z } from "zod";
// Define your form schema using Zod
import editItemSchema from "@/lib/zod/item/editItemSchema";
import { createClient } from "@/lib/supabase/server";

type EditItemFormSchema = z.infer<ReturnType<typeof editItemSchema>>;

export default async function updateItemToDatabase({
  values,
  itemId,
  itemStatus
}: {
  values: EditItemFormSchema;
  itemId: string;
  itemStatus: string;
}) {
  try {
    const supabase = await createClient();
    const { error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Session error:", JSON.stringify(userError, null, 2));
      return;
    }

    const storage = supabase.storage.from("share-food-images");
    const { data: allFiles, error: listError } = await storage.list("public");
    if (listError) console.error("Error listing files:", listError.message);

    const uploadedUrls: string[] = [];

    // 1️⃣ שמירת URLs קיימים
    values.images
      .filter((img) => !img.file)
      .forEach((img) => {
        if (img.url) uploadedUrls.push(img.url);
      });

    // 2️⃣ העלאת חדשות
    for (const img of values.images.filter((img) => !!img.file)) {
      const file = img.file!;
      const hash = img.hash!;
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${hash}.${ext}`;
      const filePath = `public/${fileName}`;

      const exists = allFiles?.some((f) => f.name === fileName);
      const { data: urlData } = storage.getPublicUrl(filePath);
      const publicUrl = urlData?.publicUrl;

      if (exists) {
        if (publicUrl) uploadedUrls.push(publicUrl);
        continue;
      }

      const { error: uploadError } = await storage.upload(filePath, file);
      if (uploadError) {
        if (uploadError.message?.includes("already exists")) {
          if (publicUrl) uploadedUrls.push(publicUrl);
          continue;
        }
        console.error("Upload error for", filePath, uploadError.message);
        continue;
      }

      if (publicUrl) {
        uploadedUrls.push(publicUrl);
      } else {
        console.warn("No publicUrl after upload for", filePath);
      }
    }

    const { error: updateError } = await supabase
      .from("items")
      .update({
        title: values.title,
        description: values.description,
        images: uploadedUrls,
        street_name: values.streetName,
        street_number: values.streetNumber.trim(),
        city: values.city,
        country: values.country,
        postal_code: values.postalCode?.trim() || null,
        phone_number: values.phoneNumber || null,
        is_have_whatsapp: !!values.isHaveWhatsApp,
        email: values.email?.trim() || null,
        status: itemStatus === "pending" ? "pending" : "edited",
        // ... כל שאר השדות
      })
      .eq("id", itemId);

    if (updateError) {
      return {
        success: false,
        message: `Error  updating
         item: ${updateError.message}`,
      };
    } else {
      return {
        success: true,
        message: "Item updated successfully",
      };
    }
  } catch (error) {
    console.error(error);
  }
}
