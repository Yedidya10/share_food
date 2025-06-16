"use client";

import Image from "next/image";

type Props = {
  fullName: string;
  avatarUrl?: string;
};

export default function ChatHeader({ fullName, avatarUrl }: Props) {
  return (
    <div className='flex items-center gap-3 p-4 border-b backdrop-blur-sm h-[70px] '>
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
  );
}
