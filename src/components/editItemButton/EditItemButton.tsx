"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil } from "lucide-react";

export default function EditItemButton({ onClick }: { onClick: () => void }) {
  function handleClick() {
    console.log("Edit button clicked");
    if (onClick) {
      onClick();
    }
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='outline' size='icon' onClick={handleClick}>
          <Pencil className='w-4 h-4' />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Edit Item</p>
      </TooltipContent>
    </Tooltip>
  );
}
