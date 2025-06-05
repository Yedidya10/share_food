"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, Hammer, Loader, Trash2 } from "lucide-react";
import EditItemForm from "@/components/editItemForm/EditItemForm";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function MyItemsList({
  items,
}: {
  items: Array<{
    id: string;
    title: string;
    description: string;
    images: File[];
    street_name: string;
    street_number: string;
    city: string;
    postal_code: string;
    country: string;
    phone_number: string;
    is_have_whatsapp: boolean;
    email: string;
    status: "published" | "pending" | "draft";
    user_id: string;
    created_at: string;
  }>;
}) {
  const tPostItemForm = useTranslations("form.postItem");
  const tEditItemForm = useTranslations("form.editItem");
  const tGenericForm = useTranslations("form.generic");
  const tCountries = useTranslations("countries");

  const deleteItem = async (id: string) => {
    const supabas = createClient();

    const { data: userData, error: userError } = await supabas.auth.getUser();
    if (userError) {
      console.error("Error fetching user data:", userError);
      return;
    }

    if (!userData.user) {
      console.error("User not authenticated");
      return;
    }

    const userId = userData.user.id;
    await supabas
      .from("items")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)
      .then(({ error }) => {
        if (error) {
          alert(
            `Error deleting item: ${error.message}. Please try again later.`
          );
        } else {
          alert("Item deleted successfully.");
        }
      });
  };

  return (
    <div className='space-y-4'>
      {items.map((item) => (
        <div
          key={item.id}
          className='border rounded p-4 flex flex-col md:flex-row md:items-center justify-between'
        >
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-start'>
            <div className='flex items-center'>
              <div className='flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 relative w-[50px] h-[50px] md:w-[60px] md:h-[60px]'>
                <Image
                  src={
                    typeof item.images[0] === "string"
                      ? item.images[0]
                      : "/placeholder-image.png"
                  }
                  alt={item.title}
                  className='object-cover rounded-md'
                  fill
                />
              </div>
              <div className='flex flex-col space-y-2'>
                <h3 className='font-semibold text-lg'>{item.title}</h3>
                <Badge
                  variant={
                    item.status === "published" ? "secondary" : "outline"
                  }
                >
                  {item.status === "published" ? (
                    <div className='flex items-center gap-1'>
                      <CircleCheck
                        className='inline text-green-500'
                        size={14}
                      />
                      <span>{tPostItemForm("status.published")}</span>
                    </div>
                  ) : item.status === "pending" ? (
                    <div className='flex items-center gap-1'>
                      <Loader className='inline' size={14} color='#FFA500' />
                      <span>{tPostItemForm("status.pending")}</span>
                    </div>
                  ) : (
                    <div className='flex items-center gap-1'>
                      <Hammer className='inline' size={14} color='#808080' />
                      <span>{tPostItemForm("status.draft")}</span>
                    </div>
                  )}
                </Badge>
              </div>
            </div>
            <div className='text-sm text-gray-500 mr-8'>
              <p>{item.description}</p>
              <p>
                {item.phone_number && (
                  <>
                    <span>{tPostItemForm("phoneNumber")}: </span>
                    <span>{item.phone_number}</span>
                  </>
                )}
                {item.email && (
                  <>
                    <span className='block'>
                      {tPostItemForm("email")}: {item.email}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
          <div className='flex space-x-2 mt-2 md:mt-0'>
            <EditItemForm
              itemId={item.id}
              initialValues={{
                title: item.title,
                description: item.description,
                images: item.images,
                streetName: item.street_name,
                streetNumber: item.street_number,
                city: item.city,
                postalCode: item.postal_code,
                country: item.country,
                phoneNumber: item.phone_number,
                email: item.email,
                isHaveWhatsApp: item.is_have_whatsapp,
              }}
              translation={{
                formTitle: tEditItemForm("formTitle"),
                formDescription: tEditItemForm("formDescription"),
                title: tPostItemForm("title"),
                titlePlaceholder: tPostItemForm("titlePlaceholder"),
                titleError: tPostItemForm("titleError"),
                description: tPostItemForm("description"),
                descriptionPlaceholder: tPostItemForm("descriptionPlaceholder"),
                descriptionError: tPostItemForm("descriptionError"),
                uploadImages: tPostItemForm("uploadImages"),
                addressDetails: tPostItemForm("addressDetails"),
                streetName: tPostItemForm("streetName"),
                streetNamePlaceholder: tPostItemForm("streetNamePlaceholder"),
                streetNameError: tPostItemForm("streetNameError"),
                streetNumber: tPostItemForm("streetNumber"),
                streetNumberPlaceholder: tPostItemForm(
                  "streetNumberPlaceholder"
                ),
                streetNumberError: tPostItemForm("streetNumberError"),
                city: tPostItemForm("city"),
                cityPlaceholder: tPostItemForm("cityPlaceholder"),
                cityError: tPostItemForm("cityError"),
                postalCode: tPostItemForm("postalCode"),
                postalCodePlaceholder: tPostItemForm("postalCodePlaceholder"),
                postalCodeError: tPostItemForm("postalCodeError"),
                country: tPostItemForm("country"),
                contactDetails: tPostItemForm("contactDetails"),
                contactViaSite: tPostItemForm("contactViaSite"),
                phoneNumber: tPostItemForm("phoneNumber"),
                phoneNumberPlaceholder: tPostItemForm("phoneNumberPlaceholder"),
                phoneNumberError: tPostItemForm("phoneNumberError"),
                isHaveWhatsApp: tPostItemForm("isHaveWhatsApp"),
                isHaveWhatsAppTip: tPostItemForm("isHaveWhatsAppTip"),
                email: tPostItemForm("email"),
                emailPlaceholder: tPostItemForm("emailPlaceholder"),
                emailError: tPostItemForm("emailError"),
                submitButton: tPostItemForm("submitButton"),
                cancel: tGenericForm("cancel"),
                required: tGenericForm("required"),
                reset: tGenericForm("reset"),
                countries: {
                  israel: tCountries("il"),
                  usa: tCountries("usa"),
                },
              }}
            />
            <Button
              variant='destructive'
              size='icon'
              onClick={() => deleteItem(item.id)}
            >
              <Trash2 className='w-4 h-4' />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
