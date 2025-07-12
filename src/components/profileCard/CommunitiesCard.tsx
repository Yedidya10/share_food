'use client'

import { useState } from 'react'
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

export default function CommunitiesCard({
  communities,
  translations,
}: {
  communities: Array<{ id: string; name: string }>
  translations: {
    noCommunities: string
    joinCommunity: string
    leaveCommunity: string
    communities: Record<string, string>
  }
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  return (
    <div className="relative rounded-xl shadow dark:shadow-gray-800/50 p-6 rtl:text-right">
      {/* כותרת + כפתור */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          הקהילות שלך
        </h2>
        <Popover
          open={open}
          onOpenChange={setOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="default"
              disabled={true}
              size="sm"
            >
              <PlusIcon className="w-4 h-4 mr-1" /> הוסף קהילה
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-64">
            <Command>
              <CommandInput
                placeholder="חפש קהילה..."
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                <CommandEmpty>לא נמצאו קהילות</CommandEmpty>
                {communities
                  .filter((c) =>
                    translations.communities[c.name].includes(search),
                  )
                  .map((community) => (
                    <CommandItem
                      key={community.id}
                      onSelect={() => {
                        console.log('Request to join:', community.id)
                        setOpen(false)
                      }}
                      className="flex justify-between items-center"
                    >
                      <span>{translations.communities[community.name]}</span>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-blue-600 dark:text-blue-400"
                      >
                        {translations.joinCommunity}
                      </Button>
                    </CommandItem>
                  ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* אם אין קהילות */}
      {communities.length === 0 && (
        <p className="text-gray-600 dark:text-gray-300">
          {translations.noCommunities}
        </p>
      )}

      {/* רשימת קהילות כבאדג׳ים */}
      <div className="flex flex-wrap gap-2">
        {communities.map((community) => (
          <Badge
            key={community.id}
            className="flex items-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
          >
            {translations.communities[community.name]}
            {/* <Button
              title={translations.leaveCommunity}
              aria-label="Leave Community"
              size="icon"
              onClick={() => {
                console.log('Leave:', community.id)
              }}
              className="w-3 h-3 p-2 rounded-full bg-transparent hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-500 hover:text-gray-800 dark:hover:text-gray-100"
            >
              <X size={6} />
            </Button> */}
          </Badge>
        ))}
      </div>
    </div>
  )
}
