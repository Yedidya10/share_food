"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

type usersDataType = {
  id: string;
  email: string;
  role: "admin" | "user" | "moderator" | "new_user";
  full_name: string;
};

export default function UsersList({
  usersData,
}: {
  usersData: usersDataType[];
}) {
  const [users, setUsers] = useState<Array<usersDataType>>(usersData);

  const deleteUser = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error("Error deleting item:", error);
      return;
    }

    // Trigger a re-fetch of the items or update the state
    // This could be done by lifting the state up to a parent component
    setUsers((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div className='space-y-4'>
      {users.map((user) => (
        <div
          key={user.id}
          className='border rounded p-4 flex flex-col md:flex-row md:items-center justify-between'
        >
          <div className='flex items-center space-x-4'>
            <Image
              src={"/default-avatar.png"}
              alt={user.full_name}
              width={50}
              height={50}
              className='rounded-full'
            />
            <div>
              <h3 className='text-lg font-semibold'>{user.full_name}</h3>
              <p className='text-sm text-gray-500'>{user.email}</p>
              {/* {user.phone_number && (
                <p className='text-sm text-gray-500'>
                  Phone: {user.phone_number}
                </p>
              )}
              {user.is_have_whatsapp && (
                <Badge className='mt-1'>WhatsApp User</Badge>
              )} */}
            </div>
          </div>
          <div className='flex space-x-2 mt-2 md:mt-0'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='destructive'
                  size='icon'
                  onClick={() => deleteUser(user.id)}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete this user</TooltipContent>
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  );
}
