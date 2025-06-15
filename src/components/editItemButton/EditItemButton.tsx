"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function EditItemButton({
  onClick,
  disabled,
  children,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  function handleClick() {
    console.log("Edit button clicked");
    if (onClick) {
      onClick();
    }
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          onClick={handleClick}
          disabled={disabled}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>ערוך פריט</span>
      </TooltipContent>
    </Tooltip>
  );
}
