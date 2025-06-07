import UsersList from "@/components/usersList/UsersList";
import { createClient } from "@/lib/supabase/server";

export default async function UsersPage() {
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

    const { data: adminUsersData, error: adminUsersError } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", userData.user?.id)
      .single();

    if (adminUsersError) {
      throw new Error("Error fetching admin data: " + adminUsersError.message);
    }

    // Check if user is authenticated admin
    if (adminUsersData?.role !== "admin") {
      return (
        <div className='flex items-center justify-center h-screen'>
          <p className='text-gray-500'>
            You do not have permission to view this page.
          </p>
        </div>
      );
    }

    // Fetch all users from the database
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("*");

    if (usersError) {
      return (
        <div className='flex items-center justify-center h-screen'>
          <p className='text-red-500'>
            Error fetching users. Please try again later.
          </p>
        </div>
      );
    }

    return <UsersList usersData={usersData} />;
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
