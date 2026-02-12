'use client';

import { useStudentDashboard } from '@/hooks/useApi';
import BookingCard from '@/components/booking/BookingCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle, Clock, DollarSign, Loader2, TrendingUp, Calendar, Award } from 'lucide-react';
import { useCancelBooking } from '@/hooks/useApi';
import React from "react";
import StatsCard from '@/components/ui/statsCard';
import { useRouter } from 'next/navigation';
import SessionsCard from '@/components/ui/sessionsCard';
import RecentBookingsCard from '@/components/ui/recentBookingCard';



export default function StudentDashboardPage() {
  const { data, isLoading } = useStudentDashboard();
  const router = useRouter();
  const cancelBooking = useCancelBooking();

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
  const completionRate = dashboard?.overview.totalBookings 
    ? Math.round((dashboard.overview.completedSessions / dashboard.overview.totalBookings) * 100)
    : 0;

  return (
    <div className="min-h-screen ">
      <div className=" p-2 lg:p-4 space-y-8">
        {/* Header Section */}
        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 tracking-tight">
                Dashboard
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">
                Welcome back! Here's your learning overview.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border border-emerald-200 dark:border-emerald-800">
              <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                {completionRate}% Completion Rate
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid - Enhanced Design */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
          {/* Total Bookings Card */}
   <StatsCard
  title="Total Bookings"
  value={dashboard?.overview.totalBookings}
  subtitle="All time sessions"
  Icon={BookOpen}
  TrendIcon={TrendingUp}
/>

          {/* Completed Sessions Card */}
          <StatsCard
  title="Completed Sessions"
  value={dashboard?.overview.completedSessions}
  subtitle="Sessions completed"
  Icon={CheckCircle}
  TrendIcon={TrendingUp}
  overlayGradient='bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10'
  iconGradient='bg-gradient-to-br from-emerald-500 to-teal-600'
  trendIconColor='text-emerald-500'
  progressGradient='bg-gradient-to-br from-emerald-500 to-teal-600'
/>
        
          {/* Pending Sessions Card */}
          <StatsCard
  title="Pending Sessions"
  value={dashboard?.overview.pendingSessions}
  subtitle="Sessions pending"
  Icon={Clock}
  TrendIcon={TrendingUp}
  overlayGradient='bg-gradient-to-br from-amber-500/5 to-orange-500/5 dark:from-amber-500/10 dark:to-orange-500/10'
  iconGradient='bg-gradient-to-br from-amber-500 to-orange-600'
  trendIconColor='text-amber-500'
  progressGradient='bg-gradient-to-br from-amber-500 to-orange-600'
/>
         

          {/* Total Spent Card */}
          <StatsCard
  title="Total Spent"
  value={dashboard?.overview.totalSpent}
  subtitle="All time spent"
  Icon={DollarSign}
  TrendIcon={TrendingUp}
  overlayGradient='bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10'
  iconGradient='bg-gradient-to-br from-purple-500 to-pink-600'
  trendIconColor='text-purple-500'
  progressGradient='bg-gradient-to-br from-purple-500 to-pink-600'
/>
        </div>

        {/* Upcoming Bookings - Enhanced Design */}
           <SessionsCard 
          upcomingBookings={dashboard?.upcomingBookings}
          onCancel={(bookingId) => cancelBooking.mutate({ bookingId })}
        />
      

        {/* Recent Bookings - Enhanced Design */}
        {/* Recent Bookings Card - Reusable Component */}
        <RecentBookingsCard
          recentBookings={dashboard?.recentBookings}
          maxItems={4}
          showEmptyState={false}
        />
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
        