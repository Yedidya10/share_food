// hooks/useSendMessage.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Message } from "@/types/chat/chat";
import { DbFoodItem } from "@/types/item/item";
import { v4 as uuidv4 } from "uuid";

type SendMessageInput = {
  conversationId: string;
  userId: string;
  content: string;
  shouldSendPreview: boolean;
  item?: DbFoodItem | null;
};

export function useSendMessage() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<void, Error, SendMessageInput, { previous?: Message[] }>({
    mutationFn: async ({
      conversationId,
      userId,
      content,
      shouldSendPreview,
      item,
    }) => {
      const toInsert: Partial<Message>[] = [];

      if (shouldSendPreview && item) {
        toInsert.push({
          conversation_id: conversationId,
          sender_id: userId,
          type: "system",
          content: "__ITEM_PREVIEW__",
          metadata: { item_id: item.id },
        });
      }

      toInsert.push({
        conversation_id: conversationId,
        sender_id: userId,
        type: "user",
        content: content.trim(),
      });

      const { error } = await supabase.from("messages").insert(toInsert);
      if (error) throw error;
    },

    onMutate: async (vars) => {
      await queryClient.cancelQueries({
        queryKey: ["chat-messages", vars.conversationId],
      });
      const previous = queryClient.getQueryData<Message[]>([
        "chat-messages",
        vars.conversationId,
      ]);

      const now = new Date().toISOString();
      const optimistic: Message[] = [];

      if (vars.shouldSendPreview && vars.item) {
        optimistic.push({
          id: `optimistic-${uuidv4()}`,
          conversation_id: vars.conversationId,
          sender_id: vars.userId,
          type: "system",
          content: "__ITEM_PREVIEW__",
          created_at: now,
          metadata: { item_id: vars.item.id },
        });
      }
      optimistic.push({
        id: `optimistic-${uuidv4()}`,
        conversation_id: vars.conversationId,
        sender_id: vars.userId,
        type: "user",
        content: vars.content.trim(),
        created_at: now,
      });

      queryClient.setQueryData<Message[]>(
        ["chat-messages", vars.conversationId],
        (old) => [...(old ?? []), ...optimistic]
      );

      return { previous };
    },

    onError: (_err, vars, context) => {
      queryClient.setQueryData(
        ["chat-messages", vars.conversationId],
        context?.previous ?? []
      );
    },

    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["chat-messages", vars.conversationId],
      });
    },
  });
}
