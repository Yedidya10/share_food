import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ModeToggle } from "@/components/theme/ModeToggle";
import AccountMenu from "@/components/accountMenu/AccountMenu";
import PostItemForm from "@/components/postItemForm/PostItemForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default async function MainHeader() {
  const tLogin = await getTranslations("header.login");
  const tAccountMenu = await getTranslations("header.accountMenu");
  const tGenericForm = await getTranslations("form.generic");
  const tPostItemForm = await getTranslations("form.postItem");
  const tCountries = await getTranslations("countries");

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    // Style the header bg like glassmorphism
    <header className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50 h-20 bg-white dark:bg-gray-900 backdrop-blur-sm bg-opacity-50 dark:bg-opacity-50'>
      <div></div>
      <div className='flex items-center justify-between gap-2'>
        {data?.user ? (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='outline' className='h-10'>
                  <Link href='/chat' className='flex items-center gap-2'>
                    <MessageCircle />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Chat</TooltipContent>
            </Tooltip>
            <PostItemForm
              translation={{
                formTitle: tPostItemForm("formTitle"),
                formDescription: tPostItemForm("formDescription"),
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
            <AccountMenu
              user={data.user}
              translation={{
                welcome: tLogin("welcome", {
                  name: data.user.user_metadata.full_name || "User",
                }),
                logout: tLogin("logout"),
                profile: tAccountMenu("profile"),
                posts: tAccountMenu("posts"),
                settings: tAccountMenu("settings"),
              }}
            />
          </>
        ) : (
          <Button variant='outline' className='h-10'>
            <Link href='/login' className='flex items-center gap-2'>
              {tLogin("login")}
            </Link>
          </Button>
        )}
        <ModeToggle />
      </div>
    </header>
  );
}
