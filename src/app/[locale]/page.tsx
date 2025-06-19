import PostGrid from "@/components/postGrid/PostGrid";
import Image from "next/image";
// import {
//   FoodStatsBanner,
//   StatItem,
// } from "@/components/foodSaveBanner/FoodSaveBanner";

export default function Home() {
  // const stats: StatItem[] = [
  //   {
  //     label: "אובדן מזון בישראל",
  //     number: "38",
  //     unit: "אחוזים",
  //     lightColor: "text-red-600",
  //     darkColor: "text-red-400",
  //   },
  //   {
  //     label: "שווי אובדן שנתי",
  //     number: "24.3",
  //     unit: "מיליארד שקלים",
  //     lightColor: "text-yellow-600",
  //     darkColor: "text-yellow-400",
  //   },
  //   {
  //     label: "היקף אובדן מזון",
  //     number: "2.6",
  //     unit: "מיליון טון",
  //     lightColor: "text-orange-600",
  //     darkColor: "text-orange-400",
  //   },
  //   {
  //     label: "כמות מזון בר הצלה",
  //     number: "1.2",
  //     unit: "מיליון טון",
  //     lightColor: "text-green-600",
  //     darkColor: "text-green-400",
  //   },
  // ];

  return (
    <div className='flex flex-col'>
      <div className='p-4'>
        <div className='w-full flex gap-1 h-[250px] rounded-lg overflow-hidden'>
          <div className='relative h-[inherit] w-[calc(100%/3)]'>
            <Image
              src='/20250616_0830_Superheroes Sharing Food_simple_compose_01jxvkdrrzercsv2kwf5bp64y4.png'
              alt='Sharing food background'
              fill
              className='object-cover object-[100%_50%] md:object-[50%_80%]'
            />
          </div>
          <div className='relative h-[inherit] w-[calc(100%/3)]'>
            <Image
              src='/20250616_0830_Superheroes Sharing Food_simple_compose_01jxvkdrs0ea8r4ny4rsw4g6k4.png'
              alt='Sharing food background'
              fill
              className='object-cover object-[10%_0%] md:object-[50%_0%]'
            />
          </div>
          <div className='relative h-[inherit] w-[calc(100%/3)]'>
            <Image
              src='/20250616_0830_Superheroes Sharing Food_simple_compose_01jxvkdrs1ev4rpts3y630rfk2.png'
              alt='Sharing food background'
              fill
              className='object-cover object-[30%_0%] md:object-[50%_10%]'
            />
          </div>
        </div>
      </div>
      {/* Uncomment the following line to include the FoodStatsBanner component */}
      {/* <FoodStatsBanner stats={stats} /> */}
      <PostGrid />
    </div>
  );
}
