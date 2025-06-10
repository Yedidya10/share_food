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
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import EditItemForm from "@/components/editItemForm/EditItemForm";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
  const [layout, setLayout] = useState<"grid" | "list">("grid");
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
      <div className={itemsWrapper}>
        {items.map((item) => (
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
                  descriptionPlaceholder: tPostItemForm(
                    "descriptionPlaceholder"
                  ),
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
                onClick={() => deleteItem(item.id)}
              >
                <Trash2 className='w-4 h-4' />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
