"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookCheck,
  BookDashed,
  CheckCircle,
  CircleCheck,
  Hammer,
  Loader,
  Loader2,
  Pencil,
  Trash2,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import EditItemFormWrapper from "../forms/editItemForm/EditItemFormWrapper";
import EditItemButton from "../editItemButton/EditItemButton";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import useItems from "@/hooks/db/useItems";
import { useInView } from "react-intersection-observer";
import { useDeleteItem } from "@/hooks/db/useDeleteItem";
import { useUpdateItemStatus } from "@/hooks/db/useUpdateItemStatus";
import { Item } from "@/types/db/item";

export default function ItemsList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useItems();
  const deleteItem = useDeleteItem();
  const { mutate: updateStatus, isPending } = useUpdateItemStatus();
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [isEditItemFormSubmitSuccess, setIsEditItemFormSubmitSuccess] =
    useState<boolean | null>(null);
  const { ref } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  useEffect(() => {
    if (isEditItemFormSubmitSuccess) {
      toast.success("הפריט נערך בהצלחה!", {
        description: "הפריט יפורסם לאחר אישור המערכת.",
        icon: <CheckCircle className='text-green-500' />,
      });
      setIsEditItemFormSubmitSuccess(null);
    }

    if (isEditItemFormSubmitSuccess === false) {
      toast.error("שגיאה בעריכת הפריט", {
        description: "אנא נסה שוב מאוחר יותר.",
        icon: <XCircle className='text-red-500' />,
      });
      setIsEditItemFormSubmitSuccess(null);
    }
  }, [isEditItemFormSubmitSuccess]);

  const handleEditClick = async (itemId: string) => {
    setLoadingItemId(itemId);
    await import("@/components/forms/editItemForm/EditItemForm");
    setOpenItemId(itemId);
    setLoadingItemId(null);
  };

  const tPostItemForm = useTranslations("form.postItem");
  const tEditItemForm = useTranslations("form.editItem");
  const tGenericForm = useTranslations("form.generic");
  const tCountries = useTranslations("countries");

  return (
    <div className='space-y-4 p-2 h-full'>
      {/* {isLoading && (
        <div className='flex items-center justify-center h-full'>
          <Loader className='animate-spin' size={24} />
        </div>
      )}
      {error && (
        <div className='text-red-500 text-center'>
          <p>שגיאה בטעינת הפריטים: {error.message}</p>
        </div>
      )}
      {!items?.length && !isLoading && (
        <div className='text-gray-500 text-center'>
          <p>אין פריטים זמינים להצגה.</p>
        </div>
      )} */}
      {// eslint-disable-next-line @typescript-eslint/no-explicit-any
      data?.pages?.flatMap((page: any) =>
        page?.map((item: Item) => (
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
                    {item.status === "published" && (
                      <div className='flex items-center gap-1'>
                        <CircleCheck
                          className='inline text-green-500'
                          size={14}
                        />
                        <span>{tPostItemForm("status.published")}</span>
                      </div>
                    )}
                    {item.status === "pending" && (
                      <div className='flex items-center gap-1'>
                        <Loader className='inline' size={14} color='#FFA500' />
                        <span>{tPostItemForm("status.pending")} - נוצר</span>
                      </div>
                    )}
                    {item.status === "edited" && (
                      <div className='flex items-center gap-1'>
                        <Loader className='inline' size={14} color='#FFA500' />
                        <span>{tPostItemForm("status.pending")} - נערך</span>
                      </div>
                    )}
                    {item.status === "draft" && (
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
              {item.status === "pending" || item.status === "edited" ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      className='flex items-center justify-center'
                      disabled={isPending}
                      onClick={() =>
                        updateStatus({ id: item.id, status: "published" })
                      }
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
                      disabled={isPending}
                      onClick={() =>
                        updateStatus({ id: item.id, status: "pending" })
                      }
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
                itemStatus={item.status}
                setIsEditItemFormSubmitSuccess={setIsEditItemFormSubmitSuccess}
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
                  descriptionPlaceholder: tPostItemForm(
                    "descriptionPlaceholder"
                  ),
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
                  phoneNumberPlaceholder: tPostItemForm(
                    "phoneNumberPlaceholder"
                  ),
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
                    onClick={() => deleteItem.mutate(item.id)}
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete this item</TooltipContent>
              </Tooltip>
            </div>
          </div>
        ))
      )}
      {hasNextPage && (
        <div ref={ref} className='flex items-center justify-center'>
          <Loader className='animate-spin' size={24} />
        </div>
      )}
      <Toaster
        position='top-center'
        duration={5000}
        richColors
        closeButton={false}
        toastOptions={{
          className: "bg-white dark:bg-gray-800 z-99",
        }}
      />
    </div>
  );
}
