import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import ConnectWithGoogle from "@/components/ConnectWithGoogle";
import { ModeToggle } from "@/components/theme/ModeToggle";
import AccountMenu from "@/components/accountMenu/AccountMenu";

export default async function MainHeader() {
  const tLogin = await getTranslations("header.login");
  const tAccountMenu = await getTranslations("header.accountMenu");

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <header className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
      {data?.user ? (
        <AccountMenu
          user={data.user}
          translation={{
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
    </header>
  );
}
