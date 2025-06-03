"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Account Settings</h2>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete Account
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p>This action cannot be undone. This will permanently delete your account.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive">Confirm Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
