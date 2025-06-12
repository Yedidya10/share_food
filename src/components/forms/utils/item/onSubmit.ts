"use server";

import { z } from "zod";
// Define your form schema using Zod
import postItemSchema from "@/lib/zod/item/postItemSchema";
import { createClient } from "@/lib/supabase/server";

type PostItemFormSchema = z.infer<ReturnType<typeof postItemSchema>>;

export default async function onSubmit(values: PostItemFormSchema) {
  console.log("Form submitted with values:", values);
  console.log("Phone number:", values.phoneNumber);
  console.log("WhatsApp enabled:", values.isHaveWhatsApp);
  try {
    const files = values.images; // File[]
    const hashes = values.imageHashes; // string[]
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("Session error:", JSON.stringify(userError, null, 2));
      return;
    }

    const userId = userData?.user?.id;
    const uploadedUrls: string[] = [];
    const storage = supabase.storage.from("share-food-images");
    const { data: allFiles, error: listError } = await storage.list("public");
    if (listError) {
      console.error("Error listing files:", listError.message);
      // אפשר להמשיך, אבל יתכן שלא נזהה קיים
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const hash = hashes[i];
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${hash}.${ext}`;
      const filePath = `public/${fileName}`;

      // 1️⃣ בדיקה אם השם מופיע ברשימה
      const exists = allFiles?.some((f) => f.name === fileName);

      // 2️⃣ קבל URL תמיד (זה רק בונה URL, לא בודק קיום)
      const { data: urlData } = storage.getPublicUrl(filePath);

      const publicUrl = urlData?.publicUrl;

      if (exists) {
        // פשוט מוסיף את ה־URL הקיים
        if (publicUrl) uploadedUrls.push(publicUrl);
        continue;
      }

      // 3️⃣ אם לא קיים, מנסה להעלות
      const { error: uploadError } = await storage.upload(filePath, file);
      if (uploadError) {
        // אם קיבלנו 409 conflict, מתעלמים וממשיכים עם ה־URL
        if (
          uploadError.message &&
          uploadError.message.includes("The resource already exists")
        ) {
          console.log(
            "Already exists (Duplicate), using existing URL for",
            filePath
          );
          if (publicUrl) uploadedUrls.push(publicUrl);
          continue;
        }
        console.error("Upload error for", filePath, uploadError.message);
        continue;
      }

      // 4️⃣ אחרי העלאה מוצלחת – מוסיף את ה־URL
      if (publicUrl) {
        uploadedUrls.push(publicUrl);
      } else {
        console.warn("No publicUrl after upload for", filePath);
      }
    }

    console.log("Uploaded URLs:", uploadedUrls);

    const { error: insertError } = await supabase.from("items").insert([
      {
        title: values.title,
        description: values.description,
        images: uploadedUrls,
        street_name: values.streetName,
        street_number: values.streetNumber.trim(),
        city: values.city,
        country: values.country,
        postal_code: values.postalCode?.trim(),
        full_name: userData?.user?.user_metadata?.full_name || null,
        phone_number: values.phoneNumber || null,
        is_have_whatsapp: values.phoneNumber ? values.isHaveWhatsApp : false,
        email: values.email?.trim() || null,
        status: "pending", // Default status
        user_id: userId,
      },
    ]);

    if (insertError) {
      throw new Error(`Insert error: ${insertError.message}`);
    } else {
      //form.reset();
      // setPreviewUrls([]); // Clear preview URLs after successful submission
    }
  } catch (error) {
    console.error(error);
  }
}
