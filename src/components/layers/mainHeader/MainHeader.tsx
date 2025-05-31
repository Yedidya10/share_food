import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ModeToggle } from "@/components/theme/ModeToggle";
import AccountMenu from "@/components/accountMenu/AccountMenu";
import PostItemForm from "@/components/postItemForm/PostItemForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
            <PostItemForm
              translation={{
                title: tPostItemForm("title"),
                description: tPostItemForm("description"),
                uploadImages: tPostItemForm("uploadImages"),
                streetName: tPostItemForm("streetName"),
                streetNumber: tPostItemForm("streetNumber"),
                city: tPostItemForm("city"),
                postalCode: tPostItemForm("postalCode"),
                country: tPostItemForm("country"),
                phoneNumber: tPostItemForm("phoneNumber"),
                isHaveWhatsApp: tPostItemForm("isHaveWhatsApp"),
                email: tPostItemForm("email"),
                submit: tGenericForm("submit"),
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
