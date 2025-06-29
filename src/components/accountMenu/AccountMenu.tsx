"use client";

import { useLocale, Locale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  Moon,
  Sun,
  Shapes,
  Settings,
  LogOut,
  CircleUserRound,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { DirectionProvider } from "@radix-ui/react-direction";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import posthog from "posthog-js";

export default function AccountMenu({
  translation, // Translation function, if needed
}: {
  translation: {
    welcome: string;
    logout: string;
    profile: string;
    myItems: string;
    settings: string;
  };
}) {
  // const pathname = usePathname();
  const router = useRouter();
  const [greetUser, setGreetUser] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { setTheme } = useTheme();
  const supabase = createClient();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      posthog.reset();
      await supabase.auth.signOut();
      queryClient.removeQueries({ queryKey: ["user"] });
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };
  // function switchLang(newLocale: string) {
  //   router.replace(pathname, { locale: newLocale });
  // }

  const locale = useLocale() as Locale;
  const dir = locale === "he" ? "rtl" : "ltr";

  useEffect(() => {
    const { data: authData } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        setGreetUser(true);
      }
    });

    const timer = setTimeout(() => {
      setGreetUser(false);
    }, 5000);

    supabase.auth.getUser().then(({ data: userData, error: userError }) => {
      if (userError) {
        console.error("Error fetching user data:", userError);
        return;
      }

      if (userData?.user) {
        setUserName(
          userData.user.user_metadata.full_name.split(" ")[0] || null
        );
        setUserAvatar(userData.user.user_metadata.avatar_url || null);
      }

      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData?.user?.id)
        .then(({ data: userRoles, error: errorRoles }) => {
          if (errorRoles) {
            throw new Error(errorRoles.message);
          }

          const isAdmin = userRoles?.some((role) => role.role === "admin");

          setIsAdmin(isAdmin);
        });
    });

    return () => {
      authData?.subscription?.unsubscribe();
      clearTimeout(timer);
    };
  }, [supabase]);

  return (
    <DirectionProvider dir={dir}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='lg'
            aria-label='Account Menu'
            data-testid='account-menu-button'
            className='flex items-center gap-2 rounded-full ps-2 pe-4'
          >
            <Avatar>
              <AvatarImage asChild>
                <Image
                  src={userAvatar || "/default-avatar.png"}
                  alt={userName || "User Avatar"}
                  width={32}
                  height={32}
                  className='rounded-full'
                />
              </AvatarImage>
              <AvatarFallback>
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            {greetUser ? (
              <span className='transition-all duration-500 overflow-hidden whitespace-nowrap'>
                {translation.welcome}
              </span>
            ) : (
              <span className='transition-all duration-500 overflow-hidden whitespace-nowrap'>
                {userName || "User"}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='start'>
          {isAdmin && (
            <>
              <DropdownMenuLabel>תפריט ניהול</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => router.push("/admin-dashboard")}
                >
                  <div className='flex items-center w-full gap-2'>
                    <Shapes />
                    <span>לוח בקרה</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/admin-dashboard/users")}
                >
                  <div className='flex items-center w-full gap-2'>
                    <CircleUserRound />
                    <span>משתמשים</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/admin-dashboard/items")}
                >
                  <div className='flex items-center w-full gap-2'>
                    <Shapes />
                    <span>פריטים</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuLabel>תפריט משתמש</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
              <div className='flex items-center w-full gap-2'>
                <CircleUserRound />
                <span>{translation.profile}</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/my-items")}
            >
              <div className='flex items-center w-full gap-2'>
                <Shapes />
                <span>{translation.myItems}</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings")}
            >
              <div className='flex items-center w-full gap-2'>
                <Settings />
                <span>{translation.settings}</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {/* <DropdownMenuSub>
              <DropdownMenuSubTrigger className='flex items-center w-full gap-2'>
                <Globe className='h-[1rem] w-[1rem] scale-100 transition-all' />
                <span>שינוי שפה</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => switchLang("he")}>
                    עברית
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => switchLang("en")}>
                    English
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub> */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='flex items-center gap-2'>
                <Sun className='h-[1.2rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                <Moon className='absolute h-[1rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                <span>שינוי מראה</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className='align-end'>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    בהיר
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    כהה
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    מערכת
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut />
            <span>{translation.logout}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DirectionProvider>
  );
}
