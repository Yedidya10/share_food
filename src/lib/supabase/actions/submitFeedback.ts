// app/actions/submit-bug.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { v4 as uuid } from "uuid";

export async function submitFeedbackReport({
  description,
  imageDataUrl,
}: {
  description: string;
  imageDataUrl?: string;
}) {
  const supabase = await createClient();

  let imageUrl: string | null = null;

  if (imageDataUrl) {
    const buffer = Buffer.from(imageDataUrl.split(",")[1], "base64");
    const filename = `feedback_reports/${uuid()}.png`;

    const { error } = await supabase.storage
      .from("feedback-screenshots")
      .upload(filename, buffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("feedback-screenshots")
      .getPublicUrl(filename);

    imageUrl = publicUrlData?.publicUrl || null;
  }

  await supabase.from("feedback_reports").insert({
    description,
    image_url: imageUrl,
  });
}
