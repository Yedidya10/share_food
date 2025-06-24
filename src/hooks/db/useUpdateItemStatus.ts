import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { ItemStatusEnum } from "@/types/item/item";

export function useUpdateItemStatus() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: ItemStatusEnum;
    }) => {
      const { error } = await supabase
        .from("items")
        .update({ status })
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      return { id, status };
    },
    onSuccess: ({ status }) => {
      const statusMessages: Record<ItemStatusEnum, string> = {
        published: "הפריט פורסם בהצלחה",
        draft: "הפריט נשמר כטיוטה",
        pending_publication: "הפריט ממתין לפרסום",
        given_away: "הפריט סומן כנמסר",
        update_pending: "הפריט ממתין לעדכון",
        rejected: "הפריט נדחה",
        expired: "הפריט פג תוקף",
      };

      toast.success(statusMessages[status as ItemStatusEnum] ?? "");
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (error) => {
      toast.error("שגיאה בעדכון סטטוס הפריט", {
        description: error.message,
      });
    },
  });

  return mutation;
}
