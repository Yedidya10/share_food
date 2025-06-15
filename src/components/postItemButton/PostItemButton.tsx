import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PostItemButton({
  onClick,
  disabled,
  children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}) {
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
          disabled={disabled}
          aria-label='Create Item'
          data-testid='post-item-button'
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>צור פריט</p>
      </TooltipContent>
    </Tooltip>
  );
}
