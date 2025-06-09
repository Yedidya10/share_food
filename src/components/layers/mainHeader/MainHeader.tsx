"use client";

import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { ModeToggle } from "@/components/theme/ModeToggle";
import AccountMenu from "@/components/accountMenu/AccountMenu";
import PostItemForm from "@/components/postItemForm/PostItemForm";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import ChatButton from "@/components/chatButton/ChatButton";
import { useEffect, useState } from "react";

export default function MainHeader() {
  const pathname = usePathname();

  const [user, setUser] = useState<{
    user_metadata: { avatar_url?: string; full_name?: string };
  } | null>(null);
  const [isUserConnected, setIsUserConnected] = useState(false);
  const tLogin = useTranslations("header.login");
  const tAccountMenu = useTranslations("header.accountMenu");
  const tGenericForm = useTranslations("form.generic");
  const tPostItemForm = useTranslations("form.postItem");
  const tCountries = useTranslations("countries");

  useEffect(() => {
    const supabase = createClient();
    const { data: authData } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
          setUser(session?.user || null);
          setIsUserConnected(true);
        }

        if (event === "SIGNED_OUT") {
          setUser(null);
          setIsUserConnected(false);
        }
      }
    );

    return () => {
      authData?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <header className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 backdrop-blur-sm bg-opacity-50 dark:bg-opacity-50 h-[80px]'>
      <div></div>
      <div className='flex items-center justify-between gap-2'>
        {user && isUserConnected ? (
          <>
            <ChatButton />
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
              user={user}
              setUser={setUser}
              translation={{
                welcome: tLogin("welcome", {
                  name: user.user_metadata.full_name || "User",
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
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className='flex items-center gap-2'
            >
              {tLogin("login")}
            </Link>
          </Button>
        )}
        <ModeToggle />
      </div>
    </header>
  );
}
