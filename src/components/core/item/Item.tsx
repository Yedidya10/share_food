"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CircleCheck,
  Hammer,
  Loader,
  Trash2,
  Pencil,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditItemButton from "@/components/editItemButton/EditItemButton";
import { DbFoodItem } from "@/types/item/item";
import { useLocale, useTranslations } from "next-intl";
import { useDeleteItem } from "@/hooks/db/useDeleteItem";
import { DirectionProvider } from "@radix-ui/react-direction";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "@/i18n/navigation";

export default function Item({
  item,
  layout,
}: {
  item: DbFoodItem;
  layout: "grid-md" | "list";
}) {
  // Hooks
  const locale = useLocale();
  const route = useRouter();
  const handleDeleteItemClick = useDeleteItem();

  // Translations
  const tPostItemForm = useTranslations("form.postItem");

  // Event Handlers
  const handleEditItemClick = (itemId: string) => {
    // Navigate to edit item page
    route.push(`/edit-item/${itemId}`);
  };

  // Layout Toggle Handlers
  const itemWrapper = cn(
    "border rounded hover:shadow-lg transition-shadow dark:border-gray-700 dark:hover:shadow-gray-800",
    layout === "grid-md"
      ? "grid col-span-1"
      : "lg:flex lg:flex-row lg:space-x-4"
  );

  const headerWrapper = cn(
    "flex flex-col",
    layout === "grid-md" ? "space-y-2" : "lg:flex-row lg:space-x-4"
  );

  const itemImageWrapper = cn(
    "relative h-36",
    layout === "grid-md" ? "w-full col-span-1" : "col-span-1 lg:w-36"
  );

  const cardContentWrapper = cn(
    "flex flex-col space-y-2 dark:text-gray-400 col-span-1 text-gray-600 text-sm",
    layout === "grid-md" ? "col-span-1" : "lg:flex-2"
  );

  const cardHeaderWrapper = cn(
    "col-span-1",
    layout === "grid-md" ? "w-full" : "lg:w-1/2"
  );

  const cardFooterWrapper = cn(
    "flex space-x-2 col-span-1",
    layout === "grid-md" ? "items-end" : "items-start"
  );

  return (
    <DirectionProvider dir={locale === "he" ? "rtl" : "ltr"}>
      <Card key={item.id} className={itemWrapper}>
        <CardHeader className={cardHeaderWrapper}>
          <div className={headerWrapper}>
            <div className={itemImageWrapper}>
              <Image
                src={
                  typeof item.images[0] === "string"
                    ? item.images[0]
                    : "/placeholder-image.png"
                }
                alt={item.title}
                className='object-cover rounded-md'
                fill
              />
            </div>
            <div className='flex flex-col space-y-1'>
              <CardTitle className='font-semibold text-lg line-clamp-1'>
                {item.title}
              </CardTitle>
              <Badge variant={"outline"}>
                {item.status === "published" && (
                  <div className='flex items-center gap-1'>
                    <CircleCheck className='inline text-green-500' size={14} />
                    <span>{tPostItemForm("status.published")}</span>
                  </div>
                )}
                {(item.status === "pending_publication" ||
                  item.status === "update_pending") && (
                  <div className='flex items-center gap-1'>
                    <Loader className='inline' size={14} color='#FFA500' />
                    <span>{tPostItemForm("status.pending")}</span>
                  </div>
                )}
                {item.status === "draft" && (
                  <div className='flex items-center gap-1'>
                    <Hammer className='inline' size={14} color='#808080' />
                    <span>{tPostItemForm("status.draft")}</span>
                  </div>
                )}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className={cardContentWrapper}>
          <CardDescription className='dark:text-gray-300 pt-3 max-h-15 line-clamp-2 text-gray-700'>
            {item.description}
          </CardDescription>
        </CardContent>
        <CardFooter className={cardFooterWrapper}>
          {/* Generic Item Actions */}
          <EditItemButton onClick={() => handleEditItemClick(item.id)}>
            <Pencil className='w-4 h-4' />
          </EditItemButton>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='destructive'
                size='icon'
                onClick={() => handleDeleteItemClick.mutate(item.id)}
              >
                <Trash2 className='w-4 h-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>מחק פריט</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <span className='sr-only'>פתיחת תפריט</span>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>אפשרויות נוספות</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>פעולות</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.title)}
              >
                העתק כותרת פריט
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.description)}
              >
                העתק תיאור פריט
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>עדכון סטטוס</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>הפוך לטיוטה</DropdownMenuItem>
                  <DropdownMenuItem>סמן כנמסר</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
    </DirectionProvider>
  );
}
