'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useCreateBooking, useTutorProfileByUserId } from '@/hooks/useApi';
import BookingForm from '@/components/booking/BookingForm';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CreateBookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tutorUserId = searchParams.get('tutorId');
  
  const { data: tutor, isLoading } = useTutorProfileByUserId(tutorUserId);
  const createBooking = useCreateBooking();

  const handleSubmit = (data: any) => {
    createBooking.mutate(data, {
      onSuccess: (response) => {
        router.push(`/bookings/${response.data.id}`);
      },
    });
  };

  if (!tutorUserId) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">No Tutor Selected</h1>
          <p className="text-muted-foreground mb-6">Please select a tutor to book a session</p>
          <Button onClick={() => router.push('/find-tutors')}>
            Browse Tutors
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Book a Session</h1>
          <p className="text-muted-foreground">Schedule your tutoring session</p>
        </div>
      </div>

      <BookingForm 
        tutor={tutor?.data} 
        onSubmit={handleSubmit}
        isLoading={createBooking.isPending}
      />
    </div>
  );
}