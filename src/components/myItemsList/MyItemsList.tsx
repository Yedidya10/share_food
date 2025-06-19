"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CircleCheck,
  Hammer,
  Loader,
  Trash2,
  LayoutGrid,
  List,
  Loader2,
  Pencil,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import EditItemFormWrapper from "@/components/forms/editItemForm/EditItemFormWrapper";
import EditItemButton from "@/components/editItemButton/EditItemButton";
import { toast } from "sonner";
import { useDeleteItem } from "@/hooks/db/useDeleteItem";
import useItems from "@/hooks/db/useItems";
import useCurrentUser from "@/hooks/db/useCurrentUser";
import { Item } from "@/types/db/item";
import { useInView } from "react-intersection-observer";

export default function MyItemsList() {
  const { data: currentUser } = useCurrentUser();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useItems({
    includeUserId: currentUser?.id,
    pageSize: 20,
  });
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [isEditItemFormSubmitSuccess, setIsEditItemFormSubmitSuccess] =
    useState<boolean | null>(null);
  const deleteItem = useDeleteItem();
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

  const itemsWrapper = cn(
    "w-full gap-4",
    layout === "grid"
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : "lg:flex lg:flex-col"
  );

  const itemWrapper = cn(
    "border rounded hover:shadow-lg transition-shadow dark:border-gray-700 dark:hover:shadow-gray-800",
    layout === "grid" ? "grid col-span-1" : "lg:flex lg:flex-row lg:space-x-4"
  );

  const headerWrapper = cn(
    "flex flex-col",
    layout === "grid" ? "space-y-2" : "lg:flex-row lg:space-x-4"
  );

  const itemImageWrapper = cn(
    "relative h-36",
    layout === "grid" ? "w-full col-span-1" : "col-span-1 lg:w-36"
  );

  const cardContentWrapper = cn(
    "flex flex-col space-y-2 dark:text-gray-400 col-span-1 text-gray-600 text-sm",
    layout === "grid" ? "col-span-1" : "lg:flex-2"
  );

  const cardHeaderWrapper = cn(
    "col-span-1",
    layout === "grid" ? "w-full" : "lg:w-1/2"
  );

  const cardFooterWrapper = cn(
    "flex space-x-2 col-span-1",
    layout === "grid" ? "items-end" : "items-start"
  );

  return (
    <div className='flex flex-col w-full space-y-4'>
      <div className='w-full hidden lg:flex justify-end items-center'>
        <ToggleGroup
          type='single'
          value={layout}
          onValueChange={(value) =>
            setLayout((value as "grid" | "list") ?? "grid")
          }
          className='lg:flex'
        >
          <ToggleGroupItem value='grid' aria-label='Grid view'>
            <LayoutGrid className='h-4 w-4' />
          </ToggleGroupItem>
          <ToggleGroupItem value='list' aria-label='List view'>
            <List className='h-4 w-4' />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {/* {isLoading && (
        <div className='flex justify-center items-center h-64'>
          <Loader className='animate-spin' size={32} />
        </div>
      )}
      {error && (
        <div className='text-red-500 flex justify-center items-center h-64'>
          אירעה שגיאה בטעינת הפריטים. אנא נסה שוב מאוחר יותר.
        </div>
      )}
      {!isLoading && !error && items?.length === 0 && (
        <div className='text-gray-500 flex justify-center items-center h-64'>
          {tPostItemForm("noItemsFound")}
        </div>
      )} */}
      <div className={itemsWrapper}>
        {// eslint-disable-next-line @typescript-eslint/no-explicit-any
        data?.pages?.flatMap((page: any) =>
          page?.map((item: Item) => (
            <Card key={item.id} className={itemWrapper}>
              <CardHeader className={cardHeaderWrapper}>
                <div className={headerWrapper}>
                  <div className={itemImageWrapper}>
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
                  <div className='flex flex-col space-y-1'>
                    <CardTitle className='font-semibold text-lg line-clamp-1'>
                      {item.title}
                    </CardTitle>
                    <Badge variant={"outline"}>
                      {item.status === "published" && (
                        <div className='flex items-center gap-1'>
                          <CircleCheck
                            className='inline text-green-500'
                            size={14}
                          />
                          <span>{tPostItemForm("status.published")}</span>
                        </div>
                      )}
                      {(item.status === "pending" ||
                        item.status === "edited") && (
                        <div className='flex items-center gap-1'>
                          <Loader
                            className='inline'
                            size={14}
                            color='#FFA500'
                          />
                          <span>{tPostItemForm("status.pending")}</span>
                        </div>
                      )}
                      {item.status === "draft" && (
                        <div className='flex items-center gap-1'>
                          <Hammer
                            className='inline'
                            size={14}
                            color='#808080'
                          />
                          <span>{tPostItemForm("status.draft")}</span>
                        </div>
                      )}
                    </Badge>
                    <CardDescription className='dark:text-gray-300 pt-3 max-h-15 line-clamp-2 text-gray-700'>
                      {item.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className={cardContentWrapper}>
                {item.phone_number && (
                  <>
                    <span>{tPostItemForm("phoneNumber")} פורסם</span>
                  </>
                )}
                {item.email && (
                  <>
                    <span className='line-clamp-1'>
                      {tPostItemForm("email")} פורסם
                    </span>
                  </>
                )}
              </CardContent>
              <CardFooter className={cardFooterWrapper}>
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
                  itemId={item.id}
                  itemStatus={item.status}
                  setIsEditItemFormSubmitSuccess={
                    setIsEditItemFormSubmitSuccess
                  }
                  open={openItemId === item.id}
                  onClose={() => setOpenItemId(null)}
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
                    contactByPhone: !!item.phone_number,
                    contactByEmail: !!item.email,
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
                    descriptionPlaceholder: tPostItemForm(
                      "descriptionPlaceholder"
                    ),
                    descriptionRequired: tPostItemForm("descriptionRequired"),
                    descriptionMaxLength: tPostItemForm("descriptionMaxLength"),
                    descriptionMinLength: tPostItemForm("descriptionMinLength"),
                    uploadImages: tPostItemForm("uploadImages"),
                    uploadImagesError: tPostItemForm("uploadImagesError"),
                    addressDetails: tPostItemForm("addressDetails"),
                    streetName: tPostItemForm("streetName"),
                    streetNamePlaceholder: tPostItemForm(
                      "streetNamePlaceholder"
                    ),
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
                    postalCodePlaceholder: tPostItemForm(
                      "postalCodePlaceholder"
                    ),
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
                <Button
                  variant='destructive'
                  size='icon'
                  onClick={() => deleteItem.mutate(item.id)}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
        {hasNextPage && (
          <div ref={ref} className='text-center text-muted-foreground py-4'>
            <Loader className='animate-spin' size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
