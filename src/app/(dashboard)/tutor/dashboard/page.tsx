'use client';

import { useTutorDashboard, useCompleteBooking } from '@/hooks/useApi';
import { Badge } from '@/components/ui/badge';
import { DollarSign, BookOpen, Users, Star, Loader2, TrendingUp, Clock, Award, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import TutorUpcomingSessionsCard from '@/components/ui/tutorupcomingsessionscard';
import TutorRecentSessionsCard from '@/components/ui/tutorrecentsessionscard';
import RecentReviewsCard from '@/components/ui/recentViewCard';
import StatsCard from '@/components/ui/statsCard';

export default function TutorDashboardPage() {
  const { data, isLoading } = useTutorDashboard();
  const completeBooking = useCompleteBooking();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const dashboard = data?.data;
  const completionRate = dashboard?.overview.totalSessions 
    ? Math.round((dashboard.overview.completedSessions / dashboard.overview.totalSessions) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Header Section */}
        <div className="space-y-2 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 tracking-tight">
                Tutor Dashboard
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
                Track your tutoring performance and earnings
              </p>
            </div>
            
            {/* Status Badges */}
            {dashboard?.profileStatus && (
              <div className="flex flex-wrap gap-2 self-start">
                {dashboard.profileStatus.isVerified && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border border-emerald-200 dark:border-emerald-800">
                    <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      Verified Tutor
                    </span>
                  </div>
                )}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                  dashboard.profileStatus.isAvailable 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-800' 
                    : 'bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/50 dark:to-gray-950/50 border-slate-200 dark:border-slate-800'
                }`}>
                  <div className={`h-2.5 w-2.5 rounded-full ${
                    dashboard.profileStatus.isAvailable 
                      ? 'bg-green-500 animate-pulse' 
                      : 'bg-slate-400'
                  }`} />
                  <span className={`text-sm font-semibold ${
                    dashboard.profileStatus.isAvailable
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {dashboard.profileStatus.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Earnings Stats Grid */}
        <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-2 lg:grid-cols-4 animate-slide-up">
          {/* Total Earnings Card */}
          <StatsCard
            title="Total Earnings"
            value={dashboard?.overview.totalEarnings || 0}
            Icon={DollarSign}
            subtitle="Lifetime earnings"
             TrendIcon={TrendingUp}
              overlayGradient='bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10'
              iconGradient='bg-gradient-to-br from-emerald-500 to-teal-600'
              trendIconColor='text-emerald-500'
              progressGradient='bg-gradient-to-br from-emerald-500 to-teal-600'
          />  
  

          {/* This Month Earnings Card */}
          <StatsCard
            title="This Month Earnings"
            value={dashboard?.overview.thisMonthEarnings || 0}
            Icon={TrendingUp}
            subtitle="This month's earnings"
             TrendIcon={DollarSign}
             />


          {/* Total Sessions Card */}
          <StatsCard
            title="Total Sessions"
            value={dashboard?.overview.totalSessions || 0}
            Icon={BookOpen}
            subtitle="Lifetime sessions"
             TrendIcon={BookOpen }
             overlayGradient='bg-gradient-to-br from-slate-500/5 to-slate-600/5 dark:from-slate-500/10 dark:to-slate-600/10'
             iconGradient='bg-gradient-to-br from-slate-500 to-slate-600' 
             trendIconColor='text-slate-500'
             progressGradient='bg-gradient-to-br from-slate-500 to-slate-600'
          />
 
          {/* Total Students Card */}
          <StatsCard
            title="Total Students"
            value={dashboard?.overview.studentsCount || 0}
            Icon={Users}
            subtitle="Lifetime students"
             TrendIcon={Users}
             overlayGradient='bg-gradient-to-br from-amber-500/5 to-orange-500/5 dark:from-amber-500/10 dark:to-orange-500/10'
             iconGradient='bg-gradient-to-br from-amber-500 to-orange-600' 
             trendIconColor='text-amber-500'
             progressGradient='bg-gradient-to-br from-amber-500 to-orange-600'
          />
        </div>

        {/* Performance Stats Grid */}
        <div className="grid gap-4 sm:gap-5 lg:gap-6 md:grid-cols-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {/* Average Rating Card */}
          <StatsCard
            title="Total Reviews"
            value= {dashboard?.overview.totalReviews || 0}
            Icon={Star}
            subtitle="Lifetime reviews"
             TrendIcon={Star}
             overlayGradient='bg-gradient-to-br from-yellow-500/5 to-amber-500/5 dark:from-yellow-500/10 dark:to-amber-500/10'
             iconGradient='bg-gradient-to-br from-yellow-500 to-amber-600' 
             trendIconColor='text-yellow-500'
             progressGradient='bg-gradient-to-br from-yellow-500 to-amber-600'
          />
        

          {/* Completed Sessions Card */}
          <StatsCard
            title="Completed Sessions"
            value={dashboard?.overview.completedSessions || 0}
            Icon={CheckCircle}
            subtitle="Lifetime completed sessions"
             TrendIcon={CheckCircle}
             overlayGradient='bg-gradient-to-br from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10'
             iconGradient='bg-gradient-to-br from-green-500 to-emerald-600' 
             trendIconColor='text-green-500'
             progressGradient='bg-gradient-to-br from-green-500 to-emerald-600'
          />

          {/* Pending Sessions Card */}
          <StatsCard
            title="Pending Sessions"
            value={dashboard?.overview.pendingSessions || 0}
            Icon={Clock}
            subtitle="Lifetime pending sessions"
             TrendIcon={Clock}
            overlayGradient='bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10'
  iconGradient='bg-gradient-to-br from-purple-500 to-pink-600'
  trendIconColor='text-purple-500'
  progressGradient='bg-gradient-to-br from-purple-500 to-pink-600'
          />
        </div>
         

        {/* Upcoming Sessions - Reusable Component */}
        <TutorUpcomingSessionsCard
          upcomingSessions={dashboard?.upcomingSessions}
          onComplete={(id) => completeBooking.mutate({ bookingId: id })}
        />

        {/* Recent Sessions - Reusable Component */}
        <TutorRecentSessionsCard
          recentSessions={dashboard?.recentSessions}
          maxItems={6}
          showEmptyState={false}
          onComplete={(id) => completeBooking.mutate({ bookingId: id })}
        />

        {/* Recent Reviews - Reusable Component */}
        <RecentReviewsCard
          reviews={dashboard?.recentReviews}
          maxItems={5}
          showEmptyState={false}
        />

        {/* No Data State */}
        {(!dashboard?.upcomingSessions || dashboard.upcomingSessions.length === 0) &&
         (!dashboard?.recentSessions || dashboard.recentSessions.length === 0) &&
         (!dashboard?.recentReviews || dashboard.recentReviews.length === 0) && (
          <div className="rounded-3xl border-0 shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl rounded-full scale-150" />
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-2 border-blue-200 dark:border-blue-800 shadow-2xl">
                  <BookOpen className="h-16 w-16 sm:h-20 sm:w-20 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                No sessions yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-center max-w-md text-base sm:text-lg">
                Start getting bookings by making sure your profile is complete and your availability is set up.
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .animate-fade-in,
          .animate-slide-up {
            animation-duration: 0.4s;
          }
        }
      `}</style>
    </div>
  );
}