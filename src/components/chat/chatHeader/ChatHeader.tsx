"use client";

import { Link } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

type Props = {
  fullName: string;
  avatarUrl?: string;
};

export default function ChatHeader({ fullName, avatarUrl }: Props) {
  return (
    <div className='flex items-center gap-2 px-2 py-4'>
      <Link href='/chat' className='text-gray-400 md:hidden'>
        <ChevronLeft className='rtl:rotate-180' />
      </Link>
      <div className='flex items-center gap-3'>
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={fullName}
            width={40}
            height={40}
            className='rounded-full'
          />
        ) : (
          <div className='w-10 h-10 bg-gray-300 rounded-full' />
        )}
        <div className='text-lg font-medium'>{fullName}</div>
      </div>
    </div>
  );
}
