import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import ConnectWithGoogle from "@/components/ConnectWithGoogle";
import { ModeToggle } from "@/components/theme/ModeToggle";
import AccountMenu from "@/components/accountMenu/AccountMenu";
import PostItemForm from "@/components/postItemForm/PostItemForm";

export default async function MainHeader() {
  const tLogin = await getTranslations("header.login");
  const tAccountMenu = await getTranslations("header.accountMenu");
  const tGenericForm = await getTranslations("form.generic");
  const tPostItemForm = await getTranslations("form.postItem");
  const tCountries = await getTranslations("countries");

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <header className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
      <div></div>
      <div className='flex items-center justify-between gap-2'>
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
        {data?.user ? (
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
        ) : (
          <ConnectWithGoogle
            translation={{
              ConnectWithGoogle: tLogin("connectWith", { provider: "Google" }),
            }}
          />
        )}
        <ModeToggle />
      </div>
    </header>
  );
}
