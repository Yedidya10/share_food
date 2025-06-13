"use client";

import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import AccountMenu from "@/components/accountMenu/AccountMenu";
import PostItemForm from "@/components/postItemForm/PostItemForm";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import ChatButton from "@/components/chat/chatButton/ChatButton";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function MainHeader() {
  const pathname = usePathname();

  const [user, setUser] = useState<{
    user_metadata: { avatar_url?: string; full_name?: string };
  } | null>(null);
  const [isUserConnected, setIsUserConnected] = useState(false);
  const tHeader = useTranslations("header");
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
      <div className='flex items-center'>
        <Image
          src='/icon-192x192.png'
          alt='Logo'
          width={40}
          height={40}
          className='h-10 w-10 rounded-full'
        />
        <Link href='/' className='ml-2 text-lg font-semibold'>
          {tHeader("title")}
        </Link>
      </div>
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
                titleRequired: tPostItemForm("titleRequired"),
                titleMaxLength: tPostItemForm("titleMaxLength"),
                titleMinLength: tPostItemForm("titleMinLength"),
                description: tPostItemForm("description"),
                descriptionPlaceholder: tPostItemForm("descriptionPlaceholder"),
                descriptionRequired: tPostItemForm("descriptionRequired"),
                descriptionMaxLength: tPostItemForm("descriptionMaxLength"),
                descriptionMinLength: tPostItemForm("descriptionMinLength"),
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
              userName={user.user_metadata.full_name?.split(" ")[0] || "User"}
              translation={{
                welcome: tLogin("welcome", {
                  name: user.user_metadata.full_name?.split(" ")[0] || "User",
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
      </div>
    </header>
  );
}
