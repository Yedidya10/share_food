import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';

export function MyItemsList({ items }: { items: { id: string; title: string; status: 'pending' | 'published' }[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <Badge variant={item.status === 'published' ? 'default' : 'outline'}>
              {item.status === 'published' ? 'Published' : 'Pending'}
            </Badge>
          </div>
          <div className="flex space-x-2 mt-2 md:mt-0">
            <Button variant="outline" size="icon">
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="icon">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
