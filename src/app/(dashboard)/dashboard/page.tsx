'use client';

import { useStudentDashboard } from '@/hooks/useApi';
import BookingCard from '@/components/booking/BookingCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle, Clock, DollarSign, Loader2, TrendingUp, Calendar, Award } from 'lucide-react';
import { useCancelBooking } from '@/hooks/useApi';
import React from "react";
import StatsCard from '@/components/ui/statsCard';
import { useRouter } from 'next/navigation';



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
        <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-lg animate-slide-up overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border border-emerald-200 dark:border-emerald-800">
            <CardHeader className="border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Upcoming Sessions
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                    Your confirmed sessions
                  </CardDescription>
                </div>
                {dashboard?.upcomingBookings && dashboard.upcomingBookings.length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border border-emerald-200 dark:border-emerald-800">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                      {dashboard.upcomingBookings.length} Active
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
          </div>
          <CardContent className="p-6">
            {dashboard?.upcomingBookings && dashboard.upcomingBookings.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {dashboard.upcomingBookings.map((booking, index) => (
                  <div
                    key={booking.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <BookingCard
                      booking={booking}
                      userRole="STUDENT"
                      onCancel={() => cancelBooking.mutate({ bookingId: booking.id })}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4">
                <div className="max-w-sm mx-auto space-y-4">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                    <div className="relative p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border border-emerald-200 dark:border-emerald-800">
                      <BookOpen className="h-16 w-16 mx-auto text-teal-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      No upcoming sessions
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Book a session with a tutor to get started on your learning journey!
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/find-tutors')} className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5">
                    Browse Tutors
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings - Enhanced Design */}
        {dashboard?.recentBookings && dashboard.recentBookings.length > 0 && (
          <Card className="rounded-2xl border-slate-200 dark:border-slate-800 shadow-lg animate-slide-up overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50">
              <CardHeader className="border-b border-slate-200 dark:border-slate-800">
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                  Your recent bookings and sessions
                </CardDescription>
              </CardHeader>
            </div>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                {dashboard.recentBookings.slice(0, 4).map((booking, index) => (
                  <div
                    key={booking.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <BookingCard
                      booking={booking}
                      userRole="STUDENT"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
      `}</style>
    </div>
  );
}