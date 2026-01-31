'use client';

import { useBookings, useCancelBooking, useCompleteBooking } from '@/hooks/useApi';
import { useSession } from '@/lib/auth-client';
import BookingCard from '@/components/booking/BookingCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { BookingStatus } from '@/types';

export default function BookingsPage() {
  const { data: session } = useSession();
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  
  const { data, isLoading } = useBookings();
  const cancelBooking = useCancelBooking();
  const completeBooking = useCompleteBooking();

  const bookings = data?.data?.data || [];
  
  const filteredBookings = statusFilter === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter);

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">
          View and manage your tutoring sessions
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Sessions</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Confirmed</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.confirmed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Cancelled</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.cancelled}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="ALL">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="PENDING">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="CONFIRMED">Confirmed ({stats.confirmed})</TabsTrigger>
          <TabsTrigger value="COMPLETED">Completed ({stats.completed})</TabsTrigger>
          <TabsTrigger value="CANCELLED">Cancelled ({stats.cancelled})</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-6">
          {filteredBookings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userRole="STUDENT"
                  onCancel={(id) => cancelBooking.mutate({ bookingId: id })}
                  onComplete={(id) => completeBooking.mutate({ bookingId: id })}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-lg text-muted-foreground">No bookings found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {statusFilter === 'ALL' 
                    ? 'Book a session with a tutor to get started!' 
                    : `No ${statusFilter.toLowerCase()} bookings`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}