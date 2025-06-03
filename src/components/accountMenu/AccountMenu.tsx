"use client";

import { useLocale, Locale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { CiBoxList, CiLogout, CiSettings } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import { DirectionProvider } from "@radix-ui/react-direction";

export default function AccountMenu({
  user,
  translation, // Translation function, if needed
}: {
  user: { user_metadata: { avatar_url?: string; full_name?: string } };
  translation: {
    welcome: string;
    logout: string;
    profile: string;
    posts: string;
    settings: string;
  };
}) {
  const supabase = createClient();

  const locale = useLocale() as Locale;
  const dir = locale === "he" ? "rtl" : "ltr";

  return (
    <DirectionProvider dir={dir}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            className='flex items-center gap-2 px-1 pl-3 py-5 rounded-full cursor-pointer'
          >
            <Avatar>
              <AvatarImage src={user.user_metadata.avatar_url} />
              <AvatarFallback>
                {user.user_metadata.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <span>{translation.welcome}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='start'>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link
                href='/dashboard/profile'
                className='flex items-center w-full gap-2'
              >
                <RxAvatar />
                <span>{translation.profile}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href='/dashboard/my-items'
                className='flex items-center w-full gap-2'
              >
                <CiBoxList />
                <span>{translation.posts}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href='/dashboard/settings'
                className='flex items-center w-full gap-2'
              >
                <CiSettings />
                <span>{translation.settings}</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await supabase.auth.signOut();
            }}
          >
            <CiLogout />
            <span>{translation.logout}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DirectionProvider>
  );
}
