"use client";

import { useLocale, Locale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  Moon,
  Sun,
  Shapes,
  Globe,
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

export default function AccountMenu({
  user,
  userName,
  translation, // Translation function, if needed
}: {
  user: { user_metadata: { avatar_url?: string; full_name?: string } };
  userName?: string;
  setUser: React.Dispatch<
    React.SetStateAction<{
      user_metadata: { avatar_url?: string; full_name?: string };
    } | null>
  >;
  translation: {
    welcome: string;
    logout: string;
    profile: string;
    posts: string;
    settings: string;
  };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [visibleWelcome, setVisibleWelcome] = useState(true);
  const { setTheme } = useTheme();
  const supabase = createClient();

  function switchLang(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  const locale = useLocale() as Locale;
  const dir = locale === "he" ? "rtl" : "ltr";

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleWelcome(false);
    }, 5000); // Hide after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <DirectionProvider dir={dir}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            className='flex items-center gap-2 px-1 pl-3 py-5 rounded-full cursor-pointer'
          >
            <Avatar>
              <AvatarImage asChild>
                <Image
                  src={user.user_metadata.avatar_url!}
                  alt={user.user_metadata.full_name!}
                  width={32}
                  height={32}
                  className='rounded-full'
                />
              </AvatarImage>
              <AvatarFallback>
                {user.user_metadata.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            {visibleWelcome ? (
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
                <span>{translation.posts}</span>
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
            <DropdownMenuSub>
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
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className='flex items-center gap-2'>
                <Sun className='h-[1.2rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                <Moon className='absolute h-[1rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                <span>שינוי מראה</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className='align-end'>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await supabase.auth.signOut();
            }}
          >
            <LogOut />
            <span>{translation.logout}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DirectionProvider>
  );
}
