// components/UserActions.tsx
"use client";

import { useState, useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Send, ClipboardCopy } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { deleteUser } from "@/lib/supabase/actions/deleteUser";

export default function UserActions({ user }: { user: User }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (userId: string) => {
    startTransition(async () => {
      try {
        await deleteUser(userId);
        // Remove the deleted user from local state
        alert("User deleted successfully.");
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(user.id)}
            className='flex items-center space-x-1'
          >
            <ClipboardCopy />
            <span>Copy User ID</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpenDialog(true)}
            className='flex items-center space-x-1'
          >
            <Trash2 className=' text-red-500' />
            <span>Delete User</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='flex items-center space-x-1'>
            <Send />
            <span>Send Message</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
          </DialogHeader>
          <p className='text-sm text-gray-500'>Are you sure?</p>
          <p className='text-sm text-gray-500 mt-2'>
            This action cannot be undone. This will permanently delete the user
            account.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button
              variant='destructive'
              onClick={() => handleDelete(user.id)}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
