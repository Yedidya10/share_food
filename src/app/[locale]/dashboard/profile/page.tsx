import { ProfileCard } from "@/components/profileCard/ProfileCard";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData || !userData.user) {
      throw new Error("User not authenticated");
    }

    const user = userData?.user;
    return (
      <ProfileCard
        user={{
          email: user.email || "",
          created_at: user.created_at || "",
          phone: user.phone || "",
          full_name: user.user_metadata?.full_name || "",
          avatar_url: user.user_metadata?.avatar_url || "",
        }}
      />
    );
  } catch (error) {
    console.error(error);
  }
}
