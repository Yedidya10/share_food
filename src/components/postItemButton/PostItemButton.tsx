import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GoPlus } from "react-icons/go";

export default function PostItemButton({ onClick }: { onClick?: () => void }) {
  function handleClick() {
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
          className='h-10 w-10 p-0 rounded-full cursor-pointer flex items-center justify-center'
          onClick={handleClick}
          aria-label='Post Item'
        >
          <GoPlus />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Post Item</p>
      </TooltipContent>
    </Tooltip>
  );
}
