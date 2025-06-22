// lib/hooks/useInsertItem.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import insertItemToDatabase from "@/components/forms/postItemForm/insertItemToDatabase";

export function useInsertItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: insertItemToDatabase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] }); // אופציונלי
    },
  });
}
