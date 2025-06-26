'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { MessageCircle } from 'lucide-react'
import { LinkButton } from '@/components/ui/link-button'

export default function ChatButton() {
  return (
    <>
      {/* For Desktop */}
      <LinkButton
        href="/chat"
        size="lg"
        variant="outline"
        className="hidden md:flex rounded-full"
      >
        <MessageCircle className="h-4 w-4" />
        <span>הודעות</span>
      </LinkButton>

      {/* For Mobile */}
      <div className="md:hidden flex">
        <Tooltip>
          <TooltipTrigger asChild>
            <LinkButton
              href="/chat"
              size="icon"
              variant="outline"
              className="rounded-full"
            >
              <MessageCircle className="h-5 w-5" />
            </LinkButton>
          </TooltipTrigger>
          <TooltipContent>הודעות</TooltipContent>
        </Tooltip>
      </div>
    </>
  )
}
