import { MyItemsList } from "@/components/myItemsList/MyItemsList";
import { createClient } from "@/lib/supabase/server";

export default async function MyItemsPage() {
  const supabase = await createClient();

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData?.session?.user) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-gray-500'>
          You need to be logged in to view this page.
        </p>
      </div>
    );
  }

  // Fetch user's items from the database
  const { data: items, error: itemsError } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", sessionData.session.user.id);
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
  if (!items || items.length === 0) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-gray-500'>You have no items listed.</p>
      </div>
    );
  }

  return (
    <MyItemsList
      items={items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        images: item.images,

        status: (item.status as "pending" | "published") || "draft",
      }))}
    />
  );
}
