import { ProfileCard } from "@/components/profileCard/ProfileCard";
import { createClient } from "@/lib/supabase/server";


export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">You need to be logged in to view this page.</p>
      </div>
    );
  }


  return (
    <ProfileCard user={{
      email: user.email || "",
      created_at: user.created_at || "",
      phone: user.phone || "",
      full_name: user.user_metadata?.full_name || "",
      avatar_url: user.user_metadata?.avatar_url || "",
    }} />
  );
}