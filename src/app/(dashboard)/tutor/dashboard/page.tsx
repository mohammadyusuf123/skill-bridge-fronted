'use client';

import { useTutorDashboard, useCompleteBooking } from '@/hooks/useApi';
import StatsCard from '@/components/dashboard/StatsCard';
import BookingCard from '@/components/booking/BookingCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DollarSign, BookOpen, Users, Star, Loader2, TrendingUp, Clock, Award } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function TutorDashboardPage() {
  const { data, isLoading } = useTutorDashboard();
  const completeBooking = useCompleteBooking();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const dashboard = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tutor Dashboard</h1>
          <p className="text-muted-foreground">Track your tutoring performance and earnings</p>
        </div>
        {dashboard?.profileStatus && (
          <div className="flex gap-2">
            {dashboard.profileStatus.isVerified && (
              <Badge variant="secondary" className="gap-1">
                <Award className="h-3 w-3" />
                Verified
              </Badge>
            )}
            <Badge 
              variant="outline" 
              className={
                dashboard.profileStatus.isAvailable 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-gray-50 text-gray-700 border-gray-200'
              }
            >
              {dashboard.profileStatus.isAvailable ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
        )}
      </div>

      {/* Earnings Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Earnings"
          value={formatCurrency(dashboard?.overview.totalEarnings || 0)}
          icon={DollarSign}
          description="Lifetime earnings"
        />
        <StatsCard
          title="This Month"
          value={formatCurrency(dashboard?.overview.thisMonthEarnings || 0)}
          icon={TrendingUp}
          description="Current month earnings"
        />
        <StatsCard
          title="Total Sessions"
          value={dashboard?.overview.totalSessions || 0}
          icon={BookOpen}
          description="Completed sessions"
        />
        <StatsCard
          title="Total Students"
          value={dashboard?.overview.studentsCount || 0}
          icon={Users}
          description="Unique students taught"
        />
      </div>

      {/* Performance Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Average Rating"
          value={dashboard?.overview.averageRating ? Number(dashboard.overview.averageRating).toFixed(1) : 'N/A'}
          icon={Star}
          description={`${dashboard?.overview.totalReviews || 0} reviews`}
        />
        <StatsCard
          title="Completed Sessions"
          value={dashboard?.overview.completedSessions || 0}
          icon={BookOpen}
          description="Successfully completed"
        />
        <StatsCard
          title="Pending Sessions"
          value={dashboard?.overview.pendingSessions || 0}
          icon={Clock}
          description="Awaiting completion"
        />
      </div>

      {/* Upcoming Sessions */}
      {dashboard?.upcomingSessions && dashboard.upcomingSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your scheduled tutoring sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {dashboard.upcomingSessions.slice(0, 4).map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userRole="TUTOR"
                  onComplete={(id) => completeBooking.mutate({ bookingId: id })}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div >
        {/* Recent Sessions */}
        {dashboard?.recentSessions && dashboard.recentSessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Your latest tutoring sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 grid lg:grid-cols-3 gap-6">
                {dashboard.recentSessions.slice(0, 5).map((booking) => (
                   <BookingCard
                  key={booking.id}
                  booking={booking}
                  userRole="TUTOR"
                  onComplete={(id) => completeBooking.mutate({ bookingId: id })}
                />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Reviews */}
        {dashboard?.recentReviews && dashboard.recentReviews.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>What students are saying</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboard.recentReviews.map((review) => (
                  <div key={review.id} className="pb-4 border-b last:border-0">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={review.student?.image || ''} />
                        <AvatarFallback>
                          {review.student?.name?.[0]?.toUpperCase() || 'S'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{review.student?.name}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {review.comment}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* No Data State */}
      {(!dashboard?.upcomingSessions || dashboard.upcomingSessions.length === 0) &&
       (!dashboard?.recentSessions || dashboard.recentSessions.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No sessions yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Start getting bookings by making sure your profile is complete and your availability is set up.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
