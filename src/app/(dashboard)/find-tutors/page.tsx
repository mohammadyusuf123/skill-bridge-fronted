'use client';

import { useTutors, useCategories } from '@/hooks/useApi';
import TutorCard from '@/components/tutor/TutorCard';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, Search, X, SlidersHorizontal, Star, DollarSign, Award, Sparkles } from 'lucide-react';
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

  const activeFilterCount = [
    filters.categoryId,
    filters.search,
    filters.minRate,
    filters.maxRate,
    filters.minRating,
    filters.sortBy
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      {/* <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 " 
             style={{ backgroundSize: '400% 400%' }} />
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" 
             style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" 
             style={{ animationDelay: '4s' }} />
      </div> */}

      <div className=" relative">
        {/* Hero Header Section */}
        <div className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Premium Tutoring Platform</span>
          </div>
          
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
            <span className="inline-block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient"
                  style={{ backgroundSize: '200% auto' }}>
              Find Your Perfect Tutor
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connect with expert tutors, unlock your potential, and achieve your learning goals with personalized guidance
          </p>
        </div>

        {/* Premium Search Card */}
        <Card className="mb-8  border-2 border-primary/20 backdrop-blur-sm bg-background/95 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-gradient" 
               style={{ backgroundSize: '100% 100%' }} />
          
          <CardContent className="p-8 relative">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Enhanced Search Input */}
              <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary z-10" />
                  <Input
                    placeholder="Search by name, subject, or expertise..."
                    value={filters.search || ''}
                    onChange={(e) => dispatch(setFilters({ search: e.target.value, page: 1 }))}
                    className="pl-12 h-12 text-base border-2 border-primary/10 focus:ring-0 focus:border-primary "
                  />
                </div>
              </div>
              
              {/* Filter Toggle Button */}
              <Button
                variant={showFilters ? "default" : "outline"}
                size="lg"
                onClick={() => setShowFilters(!showFilters)}
                className="relative h-12 min-w-[150px] group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  <span>Filters</span>
                </div>
              </Button>
              
              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={handleResetFilters}
                  className="h-12 min-w-[150px] hover:bg-destructive/10 hover:text-destructive transition-all"
                >
                  <X className="h-5 w-5 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <Card className="mb-8 border-2 border-primary/20 overflow-hidden backdrop-blur-sm bg-background/95">
            <div className="bg-primary/10  px-8 py-5 border-b border-primary/20 animate-gradient"
                 style={{ backgroundSize: '200% 200%' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-primary" />
                    Advanced Filters
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Customize your search to find the perfect match</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {activeFilterCount} active
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-8">
              <div className="grid gap-8">
                {/* Categories */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <Label className="text-lg font-semibold">Subject Categories</Label>
                      <p className="text-xs text-muted-foreground">Filter by subject area</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category.id}
                        variant={filters.categoryId === category.id ? 'default' : 'outline'}
                        className="cursor-pointer px-5 py-2.5 text-sm font-medium transition-all hover:scale-105 hover:shadow-lg relative overflow-hidden group"
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        <span className="relative z-10">{category.name}</span>
                        {filters.categoryId === category.id && (
                          <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 animate-gradient" 
                               style={{ backgroundSize: '200% 200%' }} />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                {/* Price Range */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <Label className="text-lg font-semibold">Hourly Rate Range</Label>
                      <p className="text-xs text-muted-foreground">Set your budget preferences</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground font-medium">Minimum ($)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.minRate || ''}
                        onChange={(e) => dispatch(setFilters({ minRate: Number(e.target.value) || undefined, page: 1 }))}
                        className="h-11 border-2 focus:border-primary focus:ring-0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground font-medium">Maximum ($)</Label>
                      <Input
                        type="number"
                        placeholder="Any"
                        value={filters.maxRate || ''}
                        onChange={(e) => dispatch(setFilters({ maxRate: Number(e.target.value) || undefined, page: 1 }))}
                        className="h-11 border-2 focus:border-primary focus:ring-0"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                {/* Minimum Rating */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-500/10">
                      <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <Label className="text-lg font-semibold">Minimum Rating</Label>
                      <p className="text-xs text-muted-foreground">Filter by tutor rating</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <Badge
                        key={rating}
                        variant={filters.minRating === rating ? 'default' : 'outline'}
                        className="cursor-pointer px-5 py-2.5 text-sm font-medium transition-all hover:scale-105 hover:shadow-lg relative overflow-hidden group"
                        onClick={() => dispatch(setFilters({ 
                          minRating: filters.minRating === rating ? undefined : rating,
                          page: 1 
                        }))}
                      >
                        <div className="flex items-center gap-1.5 relative z-10">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span>{rating}+ Stars</span>
                        </div>
                        {filters.minRating === rating && (
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 animate-gradient" 
                               style={{ backgroundSize: '200% 200%' }} />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                {/* Sort By */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <SlidersHorizontal className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <Label className="text-lg font-semibold">Sort By</Label>
                      <p className="text-xs text-muted-foreground">Order results by preference</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'averageRating', label: 'Highest Rated', icon: Star },
                      { value: 'hourlyRate', label: 'Price: Low to High', icon: DollarSign },
                      { value: 'totalSessions', label: 'Most Experienced', icon: Award },
                    ].map((option) => (
                      <Badge
                        key={option.value}
                        variant={filters.sortBy === option.value ? 'default' : 'outline'}
                        className="cursor-pointer px-5 py-2.5 text-sm font-medium transition-all hover:scale-105 hover:shadow-lg relative overflow-hidden group"
                        onClick={() => dispatch(setFilters({ sortBy: option.value as any, page: 1 }))}
                      >
                        <div className="flex items-center gap-1.5 relative z-10">
                          <option.icon className="h-3.5 w-3.5" />
                          <span>{option.label}</span>
                        </div>
                        {filters.sortBy === option.value && (
                          <div className="absolute inset-0 bg-primary animate-gradient" 
                               style={{ backgroundSize: '200% 200%' }} />
                        )}
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 px-1">
            <div className="space-y-1">
              <p className="text-base font-medium">
                Showing{' '}
                <span className="font-bold text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text">
                  {tutors.length}
                </span>
                {' '}of{' '}
                <span className="font-bold">{meta.total}</span>
                {' '}tutors
              </p>
              {hasActiveFilters && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
                </p>
              )}
            </div>
            {!hasActiveFilters && (
              <Badge variant="secondary" className="text-sm px-4 py-2 bg-primary/10 border-primary/20">
                <Sparkles className="h-3 w-3 mr-1" />
                Showing all available tutors
              </Badge>
            )}
          </div>
        )}

        {/* Tutors Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="relative">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <div className="absolute inset-0 h-16 w-16 animate-ping text-primary opacity-20">
                <Loader2 className="h-16 w-16" />
              </div>
            </div>
            <p className="text-lg text-muted-foreground mt-6 animate-pulse">Finding the best tutors for you...</p>
          </div>
        ) : tutors.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
              {tutors.map((tutor, index) => (
                <div 
                  key={tutor.id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <TutorCard tutor={tutor} />
                </div>
              ))}
            </div>

            {/* Load More */}
            {meta && meta.page < meta.totalPages && (
              <div className="flex flex-col items-center gap-4 py-12">
                <Button 
                  onClick={handleLoadMore} 
                  size="lg"
                  variant="outline"
                  className="min-w-[240px] h-14 text-base group relative overflow-hidden border-2 border-primary/20 hover:border-primary"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                  <span className="relative z-10">Load More Tutors</span>
                </Button>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">{meta.total - tutors.length}</span>
                  {' '}more tutor{meta.total - tutors.length !== 1 ? 's' : ''} available
                </p>
              </div>
            )}
          </>
        ) : (
          <Card className="shadow-2xl border-2 border-primary/20 backdrop-blur-sm bg-background/95">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="relative mb-6">
                <div className="rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 p-8 animate-pulse">
                  <Search className="h-16 w-16 text-primary" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 animate-ping" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No tutors found</h3>
              <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
                {hasActiveFilters 
                  ? "We couldn't find any tutors matching your criteria. Try adjusting your filters to see more results." 
                  : 'No tutors are available at the moment. Please check back later.'}
              </p>
              {hasActiveFilters && (
                <Button 
                  variant="default" 
                  onClick={handleResetFilters} 
                  size="lg"
                  className="h-12 px-8 bg-gradient-to-r from-primary to-purple-500 hover:shadow-lg transition-all"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}