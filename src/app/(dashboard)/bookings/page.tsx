'use client';

import { useBookings, useCancelBooking, useCompleteBooking } from '@/hooks/useApi';
import { useSession } from '@/lib/auth-client';
import BookingCard from '@/components/booking/BookingCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  BookOpen, 
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Filter,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import type { BookingStatus } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-8 text-white shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Bookings</h1>
              <p className="text-white/80">View and manage your tutoring sessions</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={item}>
          <Card 
            className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden cursor-pointer ${
              statusFilter === 'ALL' ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setStatusFilter('ALL')}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Total Sessions</CardDescription>
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-4xl font-bold">{stats.total}</CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>All bookings</span>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card 
            className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden cursor-pointer ${
              statusFilter === 'PENDING' ? 'ring-2 ring-yellow-500' : ''
            }`}
            onClick={() => setStatusFilter('PENDING')}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Pending</CardDescription>
                <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <CardTitle className="text-4xl font-bold text-yellow-600">{stats.pending}</CardTitle>
              <div className="flex items-center gap-1 text-xs text-yellow-600 mt-1">
                <AlertCircle className="h-3 w-3" />
                <span>Awaiting confirmation</span>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card 
            className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden cursor-pointer ${
              statusFilter === 'CONFIRMED' ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setStatusFilter('CONFIRMED')}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Confirmed</CardDescription>
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-4xl font-bold text-blue-600">{stats.confirmed}</CardTitle>
              <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>Upcoming sessions</span>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card 
            className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden cursor-pointer ${
              statusFilter === 'COMPLETED' ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={() => setStatusFilter('COMPLETED')}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Completed</CardDescription>
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-4xl font-bold text-green-600">{stats.completed}</CardTitle>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>Finished sessions</span>
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >

        {/* Content */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            {filteredBookings.length > 0 ? (
              <motion.div
                key={`${statusFilter}-list`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid gap-4 md:grid-cols-2"
              >
                {filteredBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <BookingCard
                      booking={booking}
                      userRole="STUDENT"
                      onCancel={(id) => cancelBooking.mutate({ bookingId: id })}
                      onComplete={(id) => completeBooking.mutate({ bookingId: id })}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-dashed border-2">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Filter className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-semibold">No bookings found</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {statusFilter === 'ALL' 
                        ? 'Book a session with a tutor to get started!' 
                        : `No ${statusFilter.toLowerCase()} bookings`}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}