import ItemsList from "@/components/itemsList/ItemsList";
import { createClient } from "@/lib/supabase/server";

export default async function ItemsPage() {
  try {
    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      return (
        <div className='flex items-center justify-center h-screen'>
          <p className='text-gray-500'>
            You need to be logged in to view this page.
          </p>
        </div>
      );
    }

    const { data: profilesData, error: usersError } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", userData.user?.id)
      .single();

    if (usersError) {
      throw new Error("Error fetching user data: " + usersError.message);
    }

    // Check if user is authenticated admin
    if (profilesData?.role !== "admin") {
      return (
        <div className='flex items-center justify-center h-screen'>
          <p className='text-gray-500'>
            You do not have permission to view this page.
          </p>
        </div>
      );
    }

    // Fetch user's items from the database
    const { data: items, error: itemsError } = await supabase
      .from("items")
      .select("*");
    if (itemsError) {
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
          <p className='text-gray-500'>No items found.</p>
        </div>
      );
    }

    return <ItemsList items={items} />;
  } catch (error) {
    console.error(error);
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-red-500'>
          An unexpected error occurred. Please try again later.
        </p>
      </div>
    );
  }
}
