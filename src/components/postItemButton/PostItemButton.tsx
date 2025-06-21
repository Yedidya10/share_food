import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";

export default function PostItemButton({
  onClick,
  disabled,
}: {
  onClick?: () => void;
  disabled?: boolean;
}) {
  function handleClick() {
    if (onClick) {
      onClick();
    }
  }

  return (
    <>
      {/* For Desktop */}
      <Button
        variant='outline'
        onClick={handleClick}
        disabled={disabled}
        aria-label='Create Item'
        data-testid='post-item-button'
        size='lg'
        className='hidden md:flex items-center gap-2 rounded-full'
      >
        <Plus className='h-5 w-5' />
        <span>פרסם פריט</span>
      </Button>

      {/* For Mobile */}
      <div className='md:hidden h-full flex'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              className='rounded-full'
              onClick={handleClick}
              disabled={disabled}
              aria-label='Create Item'
              data-testid='post-item-button'
            >
              <Plus className='h-5 w-5' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>פרסם פריט</TooltipContent>
        </Tooltip>
      </div>
    </>
  );
}
