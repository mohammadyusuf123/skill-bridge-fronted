'use client';

import { useStudentDashboard } from '@/hooks/useApi';
import StatsCard from '@/components/dashboard/StatsCard';
import BookingCard from '@/components/booking/BookingCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle, Clock, DollarSign, Loader2 } from 'lucide-react';
import { useCancelBooking } from '@/hooks/useApi';
import { formatCurrency } from '@/lib/utils';

export default function StudentDashboardPage() {
  const { data, isLoading } = useStudentDashboard();
  const cancelBooking = useCancelBooking();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const dashboard = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your learning overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Bookings"
          value={dashboard?.overview.totalBookings || 0}
          icon={BookOpen}
          description="All time sessions"
        />
        <StatsCard
          title="Completed Sessions"
          value={dashboard?.overview.completedSessions || 0}
          icon={CheckCircle}
          description="Finished sessions"
        />
        <StatsCard
          title="Pending Sessions"
          value={dashboard?.overview.pendingSessions || 0}
          icon={Clock}
          description="Upcoming sessions"
        />
        <StatsCard
          title="Total Spent"
          value={formatCurrency(dashboard?.overview.totalSpent || 0)}
          icon={DollarSign}
          description="Lifetime spending"
        />
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>Your confirmed sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboard?.upcomingBookings && dashboard.upcomingBookings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {dashboard.upcomingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userRole="STUDENT"
                  onCancel={() => cancelBooking.mutate({ bookingId: booking.id })}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No upcoming sessions</p>
              <p className="text-sm text-muted-foreground">Book a session with a tutor to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      {dashboard?.recentBookings && dashboard.recentBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {dashboard.recentBookings.slice(0, 4).map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userRole="STUDENT"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
