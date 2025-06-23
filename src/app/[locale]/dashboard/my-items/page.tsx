import MyItemsList from "@/components/myItemsList/MyItemsList";
import { getItemsNearby } from "@/lib/reactQuery/queries/getItemsNearby";
import { createClient } from "@/lib/supabase/server";

export default async function MyItemsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const initialItems = await getItemsNearby({
    includeUserId: user?.id,
    pageSize: 20,
  });

  return (
    <MyItemsList initialItems={initialItems} includeUserId={user?.id ?? null} />
  );
}
