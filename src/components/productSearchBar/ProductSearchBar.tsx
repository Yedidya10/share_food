"use client";

import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useState, useEffect } from "react";

export default function ProductSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("search") ?? ""
  );

  useEffect(() => {
    setSearchQuery(searchParams.get("search") ?? "");
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);

    const params = new URLSearchParams(searchParams.toString());

    if (newValue.trim()) {
      params.set("search", newValue);
    } else {
      params.delete("search");
    }

    // אפס את הדף כדי ש-infinite scroll יתחיל מהתחלה
    params.set("page", "0");

    router.replace("?" + params.toString());
  };

  return (
    <div className='flex-grow'>
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5' />
        <Input
          type='text'
          placeholder='חפש מוצרים לפי שם, תיאור או קטגוריה...'
          value={searchQuery}
          onChange={handleSearchChange}
          className={cn("h-12 pl-10")}
        />
      </div>
    </div>
  );
}
