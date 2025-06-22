import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateItemToDatabase from "@/components/forms/editItemForm/updateItemToDatabase";

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateItemToDatabase,
    onSuccess: (_, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ["item", itemId] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
