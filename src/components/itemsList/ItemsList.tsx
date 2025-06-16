"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookCheck,
  BookDashed,
  CircleCheck,
  Hammer,
  Loader,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { dBitem } from "@/types/forms/item/item";
import { useState } from "react";
import EditItemFormWrapper from "../forms/editItemForm/EditItemFormWrapper";
import EditItemButton from "../editItemButton/EditItemButton";

export default function ItemsList({ items }: { items: dBitem[] }) {
  const [itemsData, setItemsData] = useState<Array<dBitem>>(items);
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  const handleEditClick = async (itemId: string) => {
    setLoadingItemId(itemId);
    await import("@/components/forms/editItemForm/EditItemForm");
    setOpenItemId(itemId);
    setLoadingItemId(null);
  };

  const supabase = createClient();

  const tPostItemForm = useTranslations("form.postItem");
  const tEditItemForm = useTranslations("form.editItem");
  const tGenericForm = useTranslations("form.generic");
  const tCountries = useTranslations("countries");

  const deleteItem = async (id: string) => {
    const { error } = await supabase
      .from("items")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      console.error("Error deleting item:", error);
      return;
    }

    // Trigger a re-fetch of the items or update the state
    // This could be done by lifting the state up to a parent component
    setItemsData((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const publishItem = async (id: string) => {
    const { error } = await supabase
      .from("items")
      .update({ status: "published" })
      .eq("id", id);

    if (error) {
      console.error("Error publishing item:", error);
      return;
    }

    // Update the state to reflect the change
    setItemsData((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, status: "published" } : item
      )
    );
  };

  const unPublishingItem = async (id: string) => {
    const { error } = await supabase
      .from("items")
      .update({ status: "pending" })
      .eq("id", id);

    if (error) {
      console.error("Error unPublishing item:", error);
      return;
    }

    // Update the state to reflect the change
    setItemsData((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, status: "pending" } : item
      )
    );
  };

  return (
    <div className='space-y-4 p-4 overflow-y-auto h-full'>
      {itemsData.map((item) => (
        <div
          key={item.id}
          className='border rounded p-4 flex flex-col md:flex-row md:items-center justify-between'
        >
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-start'>
            <div className='flex items-center gap-4 md:gap-6'>
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
            {item.status === "pending" ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    className='flex items-center justify-center'
                    onClick={() => publishItem(item.id)}
                  >
                    <BookCheck className='w-4 h-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Publish this item</TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    className='flex items-center justify-center'
                    onClick={() => unPublishingItem(item.id)}
                  >
                    <BookDashed className='w-4 h-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Unpublish this item</TooltipContent>
              </Tooltip>
            )}
            <EditItemButton
              onClick={() => handleEditClick(item.id)}
              disabled={loadingItemId === item.id}
            >
              {loadingItemId === item.id ? (
                <Loader2 className='animate-spin h-4 w-4' />
              ) : (
                <Pencil className='w-4 h-4' />
              )}
            </EditItemButton>
            <EditItemFormWrapper
              open={openItemId === item.id}
              onClose={() => setOpenItemId(null)}
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
                contactByPhone: !!item.phone_number,
                contactByEmail: !!item.email,
                phoneNumber: item.phone_number,
                email: item.email,
                isHaveWhatsApp: item.is_have_whatsapp,
              }}
              translation={{
                formTitle: tEditItemForm("formTitle"),
                formDescription: tEditItemForm("formDescription"),
                title: tPostItemForm("title"),
                titlePlaceholder: tPostItemForm("titlePlaceholder"),
                titleRequired: tPostItemForm("titleRequired"),
                titleMaxLength: tPostItemForm("titleMaxLength"),
                titleMinLength: tPostItemForm("titleMinLength"),
                description: tPostItemForm("description"),
                descriptionRequired: tPostItemForm("descriptionRequired"),
                descriptionMaxLength: tPostItemForm("descriptionMaxLength"),
                descriptionMinLength: tPostItemForm("descriptionMinLength"),
                descriptionPlaceholder: tPostItemForm("descriptionPlaceholder"),
                uploadImages: tPostItemForm("uploadImages"),
                uploadImagesError: tPostItemForm("uploadImagesError"),
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='destructive'
                  size='icon'
                  onClick={() => deleteItem(item.id)}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete this item</TooltipContent>
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  );
}
