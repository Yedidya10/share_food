"use client";

import { Loader, LayoutGrid, List, CheckCircle, XCircle } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import useItems from "@/hooks/db/useItems";
import { useInView } from "react-intersection-observer";
import Item from "@/components/core/item/Item";
import { DbFoodItem } from "@/types/item/item";

export default function MyItemsList({
  initialItems,
  includeUserId,
}: {
  initialItems?: DbFoodItem[];
  includeUserId?: string | null;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useItems({
    includeUserId: includeUserId ?? undefined,
    pageSize: 20,
  });
  const [layout, setLayout] = useState<"grid-md" | "list">("grid-md");
  const [isEditItemFormSubmitSuccess, setIsEditItemFormSubmitSuccess] =
    useState<boolean | null>(null);

  const { ref } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const items = data?.pages.flat() ?? initialItems;

  useEffect(() => {
    if (isEditItemFormSubmitSuccess) {
      toast.success("הפריט נערך בהצלחה!", {
        description: "הפריט יפורסם לאחר אישור המערכת.",
        icon: <CheckCircle className='text-green-500' />,
      });
      setIsEditItemFormSubmitSuccess(null);
    }

    if (isEditItemFormSubmitSuccess === false) {
      toast.error("שגיאה בעריכת הפריט", {
        description: "אנא נסה שוב מאוחר יותר.",
        icon: <XCircle className='text-red-500' />,
      });
      setIsEditItemFormSubmitSuccess(null);
    }
  }, [isEditItemFormSubmitSuccess]);

  const itemsWrapper = cn(
    "w-full gap-4",
    layout === "grid-md"
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : "lg:flex lg:flex-col"
  );

  return (
    <div className='flex flex-col w-full space-y-4'>
      <div className='w-full hidden lg:flex justify-end items-center'>
        <ToggleGroup
          type='single'
          value={layout}
          onValueChange={(value) =>
            setLayout((value as "grid-md" | "list") ?? "grid-md")
          }
          className='lg:flex'
        >
          <ToggleGroupItem value='grid' aria-label='Grid view'>
            <LayoutGrid className='h-4 w-4' />
          </ToggleGroupItem>
          <ToggleGroupItem value='list' aria-label='List view'>
            <List className='h-4 w-4' />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {/* {isLoading && (
        <div className='flex justify-center items-center h-64'>
          <Loader className='animate-spin' size={32} />
        </div>
      )}
      {error && (
        <div className='text-red-500 flex justify-center items-center h-64'>
          אירעה שגיאה בטעינת הפריטים. אנא נסה שוב מאוחר יותר.
        </div>
      )}
      {!isLoading && !error && items?.length === 0 && (
        <div className='text-gray-500 flex justify-center items-center h-64'>
          {tPostItemForm("noItemsFound")}
        </div>
      )} */}
      <div className={itemsWrapper}>
        {items?.map((item: DbFoodItem) => (
          <Item key={item.id} item={item} layout={layout} />
        ))}
        {hasNextPage && (
          <div ref={ref} className='text-center text-muted-foreground py-4'>
            <Loader className='animate-spin' size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
