'use client';

import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '@/services/booking.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  Search, 
  Calendar, 
  Clock, 
  DollarSign,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  MessageSquare,
  TrendingUp,
  Filter
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';
import type { Booking } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // fetch ALL bookings via the admin endpoint
  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => bookingApi.getAllBookings(),
  });

  // normalise – backend may return { data: { data: [...] } } or { data: [...] }
  const raw = data?.data;
  const bookings: Booking[] = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as any)?.data)
      ? (raw as any).data
      : [];

  console.log('All bookings:', bookings);
  console.log('Current filter:', statusFilter);

  // Memoized filtered bookings
  const filteredBookings = useMemo(() => {
    let result = bookings;

    // Filter by status
    if (statusFilter !== 'ALL') {
      result = result.filter(b => b.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        (b.subject || '').toLowerCase().includes(q) ||
        (b.student?.name || '').toLowerCase().includes(q) ||
        (b.tutor?.name || '').toLowerCase().includes(q)
      );
    }

    console.log('Filtered bookings:', result);
    return result;
  }, [bookings, statusFilter, searchQuery]);

  const stats = useMemo(() => ({
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === 'PENDING').length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  }), [bookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-blue-500';
      case 'COMPLETED': return 'bg-green-500';
      case 'CANCELLED': return 'bg-red-500';
      case 'PENDING': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bookings Management</h1>
            <p className="text-muted-foreground">Monitor and manage all platform bookings</p>
          </div>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by subject, student name, or tutor name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 h-11 text-base"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card 
            className={`hover:shadow-lg transition-shadow cursor-pointer border-2 ${statusFilter === 'ALL' ? 'border-primary' : 'hover:border-primary/20'}`}
            onClick={() => setStatusFilter('ALL')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Total Bookings</CardDescription>
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-4xl font-bold">{stats.total}</CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>All time</span>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card 
            className={`hover:shadow-lg transition-shadow cursor-pointer border-2 ${statusFilter === 'PENDING' ? 'border-yellow-500' : 'hover:border-yellow-200'}`}
            onClick={() => setStatusFilter('PENDING')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Pending</CardDescription>
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <CardTitle className="text-4xl font-bold text-yellow-600">{stats.pending}</CardTitle>
              <div className="flex items-center gap-1 text-xs text-yellow-600 mt-1">
                <Clock className="h-3 w-3" />
                <span>Awaiting action</span>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card 
            className={`hover:shadow-lg transition-shadow cursor-pointer border-2 ${statusFilter === 'CONFIRMED' ? 'border-blue-500' : 'hover:border-blue-200'}`}
            onClick={() => setStatusFilter('CONFIRMED')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Confirmed</CardDescription>
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-4xl font-bold text-blue-600">{stats.confirmed}</CardTitle>
              <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                <Calendar className="h-3 w-3" />
                <span>Scheduled</span>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card 
            className={`hover:shadow-lg transition-shadow cursor-pointer border-2 ${statusFilter === 'COMPLETED' ? 'border-green-500' : 'hover:border-green-200'}`}
            onClick={() => setStatusFilter('COMPLETED')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Completed</CardDescription>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-4xl font-bold text-green-600">{stats.completed}</CardTitle>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>Finished</span>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <Card 
            className={`hover:shadow-lg transition-shadow cursor-pointer border-2 ${statusFilter === 'CANCELLED' ? 'border-red-500' : 'hover:border-red-200'}`}
            onClick={() => setStatusFilter('CANCELLED')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Cancelled</CardDescription>
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <CardTitle className="text-4xl font-bold text-red-600">{stats.cancelled}</CardTitle>
              <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                <XCircle className="h-3 w-3" />
                <span>Not completed</span>
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
       
        {/* Single content area that updates based on filter */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            {filteredBookings.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-dashed">
                  <CardContent className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                        <Filter className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">No bookings found</p>
                        <p className="text-muted-foreground text-sm mt-1">
                          {searchQuery 
                            ? 'Try adjusting your search criteria' 
                            : statusFilter === 'ALL' 
                              ? 'No bookings have been made yet'
                              : `No ${statusFilter.toLowerCase()} bookings`
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key={`${statusFilter}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {filteredBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
                      <div className="flex flex-col sm:flex-row">
                        {/* Status color stripe */}
                        <div className={`sm:w-1.5 h-1.5 sm:h-auto ${getStatusColor(booking.status)}`} />

                        <div className="flex-1 p-5">
                          {/* Header row */}
                          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                                {booking.subject}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Booking ID: {booking.id}
                              </p>
                            </div>
                            <Badge className={`${getStatusBadgeStyle(booking.status)} border font-semibold`}>
                              {booking.status}
                            </Badge>
                          </div>

                          {/* Student & Tutor */}
                          <div className="flex flex-wrap gap-6 mb-4 p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                  <AvatarImage src={booking.student?.image || ''} />
                                  <AvatarFallback className="text-sm bg-primary/10">
                                    {booking.student?.name?.[0]?.toUpperCase() || 'S'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-blue-500 border-2 border-background rounded-full flex items-center justify-center">
                                  <Users className="h-2 w-2 text-white" />
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground font-medium">Student</p>
                                <p className="text-sm font-semibold">{booking.student?.name || '—'}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                  <AvatarImage src={booking.tutor?.image || ''} />
                                  <AvatarFallback className="text-sm bg-primary/10">
                                    {booking.tutor?.name?.[0]?.toUpperCase() || 'T'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full flex items-center justify-center">
                                  <BookOpen className="h-2 w-2 text-white" />
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground font-medium">Tutor</p>
                                <p className="text-sm font-semibold">{booking.tutor?.name || '—'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Details row */}
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 px-3 py-2 bg-background rounded-lg border">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span className="font-medium">{formatDate(booking.sessionDate)}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 bg-background rounded-lg border">
                              <Clock className="h-4 w-4 text-primary" />
                              <span className="font-medium">
                                {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {booking.duration} min
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 rounded-lg border border-primary/20">
                              <DollarSign className="h-4 w-4 text-primary" />
                              <span className="font-bold text-primary">{formatCurrency(booking.price)}</span>
                            </div>
                          </div>

                          {/* Notes */}
                          {(booking.studentNotes || booking.tutorNotes) && (
                            <div className="mt-4 space-y-2">
                              {booking.studentNotes && (
                                <div className="flex gap-2 text-sm p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                  <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="font-semibold text-blue-900 dark:text-blue-100 text-xs mb-1">Student Note:</p>
                                    <p className="text-blue-800 dark:text-blue-200">{booking.studentNotes}</p>
                                  </div>
                                </div>
                              )}
                              {booking.tutorNotes && (
                                <div className="flex gap-2 text-sm p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                                  <MessageSquare className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="font-semibold text-green-900 dark:text-green-100 text-xs mb-1">Tutor Note:</p>
                                    <p className="text-green-800 dark:text-green-200">{booking.tutorNotes}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}