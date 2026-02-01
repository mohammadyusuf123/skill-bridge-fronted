'use client';

import { useBookings, useCompleteBooking, useCancelBooking } from '@/hooks/useApi';
import BookingCard from '@/components/booking/BookingCard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, BookOpen } from 'lucide-react';
import { useState } from 'react';
import type { BookingStatus } from '@/types';

export default function TutorBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const { data, isLoading } = useBookings();
  const completeBooking = useCompleteBooking();
  const cancelBooking = useCancelBooking();

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
        <h1 className="text-3xl font-bold">My Sessions</h1>
        <p className="text-muted-foreground">
          Manage your tutoring sessions and mark them as complete
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <p className="text-xs text-muted-foreground">Cancelled</p>
          </CardContent>
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
                  userRole="TUTOR"
                  onComplete={(id) => completeBooking.mutate({ bookingId: id })}
                  onCancel={(id) => cancelBooking.mutate({ bookingId: id })}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">No sessions found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {statusFilter === 'ALL' 
                    ? 'You don\'t have any sessions yet' 
                    : `No ${statusFilter.toLowerCase()} sessions`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}