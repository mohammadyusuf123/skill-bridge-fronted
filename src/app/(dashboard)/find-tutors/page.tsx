'use client';

import { useTutors, useCategories } from '@/hooks/useApi';
import TutorCard from '@/components/tutor/TutorCard';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Search, X, SlidersHorizontal } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters, resetFilters } from '@/store/slices/tutorSlice';
import { useState, useEffect } from 'react';

export default function FindTutorsPage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.tutor.filters);
  const [showFilters, setShowFilters] = useState(false);

  // Reset filters on mount to show ALL tutors initially
  useEffect(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  // Load tutors - will show ALL initially since filters are reset
  const { data, isLoading } = useTutors();
  console.log('Tutors API Response:', data);
  const { data: categoriesData } = useCategories();

  const categories = categoriesData?.data || [];
  const tutors = data?.data?.data || [];
  const meta = data?.data?.meta;

  const handleCategorySelect = (categoryId: string) => {
    if (filters.categoryId === categoryId) {
      dispatch(setFilters({ categoryId: undefined, page: 1 }));
    } else {
      dispatch(setFilters({ categoryId, page: 1 }));
    }
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const hasActiveFilters = filters.categoryId || filters.search || filters.minRate || filters.maxRate || filters.minRating;

  const handleLoadMore = () => {
    dispatch(setFilters({ page: (filters.page || 1) + 1 }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Find Tutors</h1>
        <p className="text-muted-foreground">
          Browse and search for the perfect tutor for your needs
        </p>
      </div>

      {/* Search and Filter Toggle */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tutors by name, subject..."
              value={filters.search || ''}
              onChange={(e) => dispatch(setFilters({ search: e.target.value, page: 1 }))}
              className="pl-10"
            />
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              !
            </Badge>
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={handleResetFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Categories */}
              <div className="space-y-2">
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="number"
                      placeholder="Min ($)"
                      value={filters.minRate || ''}
                      onChange={(e) => dispatch(setFilters({ minRate: Number(e.target.value) || undefined, page: 1 }))}
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Max ($)"
                      value={filters.maxRate || ''}
                      onChange={(e) => dispatch(setFilters({ maxRate: Number(e.target.value) || undefined, page: 1 }))}
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
                      onClick={() => dispatch(setFilters({ 
                        minRating: filters.minRating === rating ? undefined : rating,
                        page: 1 
                      }))}
                    >
                      {rating}+
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <Label>Sort By</Label>
                <div className="flex gap-2">
                  {[
                    { value: 'averageRating', label: 'Rating' },
                    { value: 'hourlyRate', label: 'Price' },
                    { value: 'totalSessions', label: 'Experience' },
                  ].map((option) => (
                    <Badge
                      key={option.value}
                      variant={filters.sortBy === option.value ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => dispatch(setFilters({ sortBy: option.value as any, page: 1 }))}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Info */}
      {meta && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {tutors.length} of {meta.total} tutors
            {hasActiveFilters && <span className="ml-2 text-primary">(filtered)</span>}
          </p>
          {!hasActiveFilters && (
            <p className="text-sm text-muted-foreground">
              Showing all available tutors
            </p>
          )}
        </div>
      )}

      {/* Tutors Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : tutors.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>

          {/* Load More */}
          {meta && meta.page < meta.totalPages && (
            <div className="flex justify-center">
              <Button onClick={handleLoadMore} variant="outline">
                Load More Tutors ({meta.total - tutors.length} more)
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No tutors found</p>
            <p className="text-sm text-muted-foreground mt-2">
              {hasActiveFilters ? 'Try adjusting your filters' : 'No tutors available at the moment'}
            </p>
            {hasActiveFilters && (
              <Button className="mt-4" variant="outline" onClick={handleResetFilters}>
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}