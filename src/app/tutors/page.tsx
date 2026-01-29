'use client';

import { useTutors } from '@/hooks/useApi';
import TutorCard from '@/components/tutor/TutorCard';
import TutorFilters from '@/components/tutor/TutorFilters';
import Navbar from '@/components/layout/Navbar';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters } from '@/store/slices/tutorSlice';

export default function TutorsPage() {
  const { data, isLoading } = useTutors();
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.tutor.filters);

  const handleLoadMore = () => {
    dispatch(setFilters({ page: (filters.page || 1) + 1 }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Find Your Perfect Tutor</h1>
          <p className="text-muted-foreground">
            Browse our expert tutors and book your first session today
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <TutorFilters />
            </div>
          </div>

          {/* Tutors Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : data?.data?.data && data.data.data.length > 0 ? (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {data.data.data.length} of {data.data.meta.total} tutors
                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data.data.data.map((tutor) => (
                    <TutorCard key={tutor.id} tutor={tutor} />
                  ))}
                </div>
                
                {/* Load More */}
                {data.data.meta.page < data.data.meta.totalPages && (
                  <div className="mt-8 text-center">
                    <Button onClick={handleLoadMore} variant="outline">
                      Load More Tutors
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No tutors found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
