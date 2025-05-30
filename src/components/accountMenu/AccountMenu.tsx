"use client";

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

export default function AccountMenu({
  user,
  translation, // Translation function, if needed
}: {
  user: { user_metadata: { avatar_url?: string; full_name?: string } };
  translation: {
    logout: string;
    profile: string;
    posts: string;
    settings: string;
  };
}) {
  const supabase = createClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='flex items-center gap-2 px-2 py-6'>
          <Avatar>
            <AvatarImage src={user.user_metadata.avatar_url} />
            <AvatarFallback>
              {user.user_metadata.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <span>Welcome, {user.user_metadata.full_name}!</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='start'>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href='/dashboard/profile'>{translation.profile}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href='/dashboard/posts'>{translation.posts}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href='/dashboard/settings'>{translation.settings}</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await supabase.auth.signOut();
          }}
        >
          {translation.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
