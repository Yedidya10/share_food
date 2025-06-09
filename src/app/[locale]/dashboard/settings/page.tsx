"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/app/actions/db/deleteUser";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";

export default function SettingsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const route = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Fetch the current user data
    const fetchUserId = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) {
        console.error("Error fetching user data:", userError);
        return (
          <div className='flex items-center justify-center h-screen'>
            <p className='text-red-500'>Error fetching user data.</p>
          </div>
        );
      }

      setUserId(userData?.user?.id || null);
    };
    fetchUserId();
  }, []);

  const handleDelete = (userId: string) => {
    startTransition(async () => {
      try {
        await deleteUser(userId);
        route.push("/");
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    });
  };
  return (
    <div className='space-y-4'>
      {userId && (
        <>
          <h2 className='text-xl font-bold'>Account Settings</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='destructive'>Delete Account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Account</DialogTitle>
              </DialogHeader>
              <p className='text-sm text-gray-500'>Are you sure?</p>
              <p className='text-sm text-gray-500 mt-2'>
                This action cannot be undone. This will permanently delete your
                account.
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='outline'>Cancel</Button>
                </DialogClose>
                <Button
                  variant='destructive'
                  onClick={() => handleDelete(userId)}
                  disabled={isPending}
                >
                  {isPending ? "Deleting..." : "Confirm Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
