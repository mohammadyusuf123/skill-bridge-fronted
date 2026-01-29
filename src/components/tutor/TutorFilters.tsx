'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters, resetFilters } from '@/store/slices/tutorSlice';
import { useCategories } from '@/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export default function TutorFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.tutor.filters);
  const { data: categories } = useCategories();

  const handleCategorySelect = (categoryId: string) => {
    dispatch(setFilters({ categoryId }));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          {(filters.categoryId || filters.search || filters.minRate || filters.maxRate) && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label>Search</Label>
          <Input
            placeholder="Search tutors..."
            value={filters.search || ''}
            onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
          />
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <Label>Categories</Label>
          <div className="flex flex-wrap gap-2">
            {categories?.data?.map((category) => (
              <Badge
                key={category.id}
                variant={filters.categoryId === category.id ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleCategorySelect(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Hourly Rate</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                type="number"
                placeholder="Min"
                value={filters.minRate || ''}
                onChange={(e) => dispatch(setFilters({ minRate: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxRate || ''}
                onChange={(e) => dispatch(setFilters({ maxRate: Number(e.target.value) }))}
              />
            </div>
          </div>
        </div>

        {/* Minimum Rating */}
        <div className="space-y-2">
          <Label>Minimum Rating</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Badge
                key={rating}
                variant={filters.minRating === rating ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => dispatch(setFilters({ minRating: rating }))}
              >
                {rating}+
              </Badge>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <div className="flex flex-col gap-2">
            {[
              { value: 'averageRating', label: 'Rating' },
              { value: 'hourlyRate', label: 'Price' },
              { value: 'totalSessions', label: 'Experience' },
            ].map((option) => (
              <Badge
                key={option.value}
                variant={filters.sortBy === option.value ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => dispatch(setFilters({ sortBy: option.value as any }))}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
