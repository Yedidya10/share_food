"use client";

import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import AccountMenu from "@/components/accountMenu/AccountMenu";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import ChatButton from "@/components/chat/chatButton/ChatButton";
import { useEffect, useState } from "react";
import Image from "next/image";
import PostItemFormWrapper from "@/components/forms/postItemForm/PostItemFormWrapper";
import PostItemButton from "@/components/postItemButton/PostItemButton";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function MainHeader() {
  const pathname = usePathname();

  const [user, setUser] = useState<{
    user_metadata: { avatar_url?: string; full_name?: string };
  } | null>(null);
  const [isUserConnected, setIsUserConnected] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateItemClick = async () => {
    setLoading(true);
    await import("@/components/forms/postItemForm/PostItemFormWrapper");
    setOpenModal(true);
    setLoading(false);
  };

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

  useEffect(() => {
    if (isSubmitSuccess) {
      toast.success("הפריט נוצר בהצלחה!", {
        description: "הפריט יפורסם לאחר אישור המערכת.",
        icon: <CheckCircle className='text-green-500' />,
      });
      setIsSubmitSuccess(null);
    }

    if (isSubmitSuccess === false) {
      toast.error("שגיאה ביצירת הפריט", {
        description: "אנא נסה שוב מאוחר יותר.",
        icon: <XCircle className='text-red-500' />,
      });
      setIsSubmitSuccess(null);
    }
  }, [isSubmitSuccess]);

  return (
    <header className='h-[60px] flex items-center justify-between border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 bg-white dark:bg-gray-900 backdrop-blur-sm bg-opacity-50 dark:bg-opacity-50'>
      <Link
        href='/'
        className='flex items-center gap-2 h-full p-2 text-lg font-semibold'
      >
        <Image
          src='/icon-192x192.png'
          alt='Logo'
          width={40}
          height={40}
          className='h-10 w-10 rounded-full'
        />
        <span className='hidden md:inline'>{tHeader("title")}</span>
      </Link>
      <div className='flex items-center justify-between gap-2 p-4'>
        {user && isUserConnected ? (
          <>
            <AccountMenu
              translation={{
                welcome: tLogin("welcome", {
                  name: user.user_metadata.full_name?.split(" ")[0] || "User",
                }),
                logout: tLogin("logout"),
                profile: tAccountMenu("profile"),
                myItems: tAccountMenu("myItems"),
                settings: tAccountMenu("settings"),
              }}
            />
            <ChatButton />
            <PostItemButton
              onClick={() => handleCreateItemClick()}
              disabled={loading}
            />
            <PostItemFormWrapper
              openModal={openModal}
              setIsSubmitSuccess={setIsSubmitSuccess}
              setOpenModal={setOpenModal}
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
          </>
        ) : (
          <Button variant='outline' className='h-10'>
            <Link
              href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
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
