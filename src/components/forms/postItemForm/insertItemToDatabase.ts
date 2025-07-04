'use server'

import { z } from 'zod'
// Define your form schema using Zod
import postItemSchema from '@/lib/zod/item/postItemSchema/postItemSchema'
import postItemImagesSchema from '@/lib/zod/item/postItemSchema/postItemImagesSchema'
import { createClient } from '@/lib/supabase/server'

type PostItemFormSchema = z.infer<ReturnType<typeof postItemSchema>>
type PostItemImage = z.infer<
  ReturnType<typeof postItemImagesSchema>
>['images'][number]

export default async function insertItemToDatabase(values: PostItemFormSchema) {
  try {
    const supabase = await createClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('Session error:', JSON.stringify(userError, null, 2))
      return
    }
    const userId = userData?.user?.id
    const storage = supabase.storage.from('share-food-images')
    const { data: allFiles, error: listError } = await storage.list('public')
    if (listError) console.error('Error listing files:', listError.message)

    const uploadedUrls: string[] = []

    // 1️⃣ קודם – שימור כל התמונות הקיימות (אין להן .file)
    values.images
      .filter((img: PostItemImage) => !img.file)
      .forEach((img: PostItemImage) => {
        if (img.url) uploadedUrls.push(img.url)
      })

    // 2️⃣ אחר כך – העלאת התמונות החדשות
    for (const img of values.images.filter(
      (img: PostItemImage) => !!img.file,
    )) {
      const file = img.file! // File
      const hash = img.hash! // string
      const ext = file.name.split('.').pop()
      const fileName = `${hash}.${ext}`
      const filePath = `public/${fileName}`

      // בדיקה מוקדמת
      const exists = allFiles?.some((f) => f.name === fileName)
      const { data: urlData } = storage.getPublicUrl(filePath)
      const publicUrl = urlData?.publicUrl

      if (exists) {
        if (publicUrl) uploadedUrls.push(publicUrl)
        continue
      }

      // העלאה
      const { error: uploadError } = await storage.upload(filePath, file)
      if (uploadError) {
        // התעלמות מ־409
        if (uploadError.message?.includes('already exists')) {
          if (publicUrl) uploadedUrls.push(publicUrl)
          continue
        }
        console.error('Upload error for', filePath, uploadError.message)
        continue
      }

      if (publicUrl) {
        uploadedUrls.push(publicUrl)
      } else {
        console.warn('No publicUrl after upload for', filePath)
      }
    }

    const { error: insertError } = await supabase.from('items').insert([
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
        status: 'pending_publication',
        user_id: userId,
      },
    ])

    if (insertError) {
      return {
        success: false,
        message: `Error inserting item: ${insertError.message}`,
      }
    } else {
      return {
        success: true,
        message: 'Item inserted successfully',
      }
    }
  } catch (error) {
    console.error(error)
  }
}
