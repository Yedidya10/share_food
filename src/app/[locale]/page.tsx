import PostGrid from "@/components/postGrid/PostGrid";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  const { data: itemsData, error: itemsError } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (itemsError) {
    console.error("Error fetching items:", itemsError);
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-red-500'>
          Error fetching items. Please try again later.
        </p>
      </div>
    );
  }

  return <PostGrid userId={userData.user?.id} items={itemsData || []} />;
}
