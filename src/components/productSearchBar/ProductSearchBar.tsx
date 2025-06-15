import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function ProductSearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
