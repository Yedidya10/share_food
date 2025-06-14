import PostGrid from "@/components/postGrid/PostGrid";
import { createClient } from "@/lib/supabase/server";
import {
  FoodStatsBanner,
  StatItem,
} from "@/components/foodSaveBanner/FoodSaveBanner";

export default async function Home() {
  const stats: StatItem[] = [
    {
      label: "אובדן מזון בישראל",
      number: "38",
      unit: "אחוזים",
      lightColor: "text-red-600",
      darkColor: "text-red-400",
    },
    {
      label: "שווי אובדן שנתי",
      number: "24.3",
      unit: "מיליארד שקלים",
      lightColor: "text-yellow-600",
      darkColor: "text-yellow-400",
    },
    {
      label: "היקף אובדן מזון",
      number: "2.6",
      unit: "מיליון טון",
      lightColor: "text-orange-600",
      darkColor: "text-orange-400",
    },
    {
      label: "כמות מזון בר הצלה",
      number: "1.2",
      unit: "מיליון טון",
      lightColor: "text-green-600",
      darkColor: "text-green-400",
    },
  ];

  const supabase = await createClient();

  const { data: itemsData, error: itemsError } = await supabase
    .from("active_items")
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

  return (
    <div className='flex flex-col p-4 gap-4'>
      <FoodStatsBanner stats={stats} />
      <PostGrid items={itemsData || []} />
    </div>
  );
}
