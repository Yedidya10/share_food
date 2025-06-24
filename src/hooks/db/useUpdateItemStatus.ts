import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useUpdateItemStatus() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "published" | "pending_publication";
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
      toast.success(
        status === "published" ? "הפריט פורסם בהצלחה" : "הפריט הוחזר למצב המתנה"
      );
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
