'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters, resetFilters } from '@/store/slices/tutorSlice';
import { Button } from '@/components/ui/button';

export default function FilterSidebar({ categories }: any) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.tutor.filters);

  const handleCategorySelect = (categoryId: string) => {
    dispatch(
      setFilters({
        categoryId:
          filters.categoryId === categoryId ? undefined : categoryId,
        page: 1,
      })
    );
  };

  return (
    <div className="sticky top-24 h-fit">
      <Card className="rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Filters</h3>
            <Button variant="ghost" size="sm" onClick={() => dispatch(resetFilters())}>
              Clear
            </Button>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <Label>Search</Label>
            <Input
              placeholder="Search tutor..."
              value={filters.search || ''}
              onChange={(e) =>
                dispatch(setFilters({ search: e.target.value, page: 1 }))
              }
            />
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat: any) => (
                <Badge
                  key={cat.id}
                  variant={filters.categoryId === cat.id ? 'default' : 'outline'}
                  className="cursor-pointer px-3 py-1 rounded-full"
                  onClick={() => handleCategorySelect(cat.id)}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Minimum Rating</Label>
            <div className="flex gap-2">
              {[3, 4, 5].map((r) => (
                <Badge
                  key={r}
                  variant={filters.minRating === r ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() =>
                    dispatch(
                      setFilters({
                        minRating: filters.minRating === r ? undefined : r,
                        page: 1,
                      })
                    )
                  }
                >
                  ⭐ {r}+
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
