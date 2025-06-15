import MyItemsList from "@/components/myItemsList/MyItemsList";
import { createClient } from "@/lib/supabase/server";
export default async function MyItemsPage() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return (
      <div className='flex items-center justify-center h-[calc(100vh-80px)]'>
        <p className='text-gray-500'>
          You need to be logged in to view this page.
        </p>
      </div>
    );
  }

  // Fetch user's items from the database
  const { data: items, error: itemsError } = await supabase
    .from("active_items")
    .select("*")
    .eq("user_id", userData?.user?.id);
  if (itemsError) {
    return (
      <div className='flex items-center justify-center h-[calc(100vh-80px)]'>
        <p className='text-red-500'>
          Error fetching items. Please try again later.
        </p>
      </div>
    );
  }
  if (!items || items.length === 0) {
    return (
      <div className='flex items-center justify-center h-[calc(100vh-80px)]'>
        <p className='text-gray-500'>You have no items listed.</p>
      </div>
    );
  }

  return (
    <div className='h-[calc(100vh-80px)] overflow-y-auto p-4'>
      <MyItemsList items={items} />
    </div>
  );
}
