"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function ChatButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='outline' className='h-10'>
          <Link href='/chat' className='flex items-center gap-2'>
            <MessageCircle />
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Chat</TooltipContent>
    </Tooltip>
  );
}
