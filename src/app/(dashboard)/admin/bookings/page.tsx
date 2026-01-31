'use client';

import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '@/services/booking.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Search, Calendar, Clock, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';
import type { Booking } from '@/types';

export default function AdminBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery]   = useState('');

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

  // client-side filter
  const filtered = bookings.filter(b => {
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      (b.subject || '').toLowerCase().includes(q) ||
      (b.student?.name || '').toLowerCase().includes(q) ||
      (b.tutor?.name || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const stats = {
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === 'PENDING').length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  const statusStyles: Record<string, string> = {
    CONFIRMED: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    PENDING:   'bg-yellow-100 text-yellow-700',
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
        <h1 className="text-3xl font-bold">Bookings Management</h1>
        <p className="text-muted-foreground">View every booking on the platform</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by subject, student name, or tutor name…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-3"><CardDescription>Total</CardDescription><CardTitle className="text-3xl">{stats.total}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-3"><CardDescription>Confirmed</CardDescription><CardTitle className="text-3xl text-blue-600">{stats.confirmed}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-3"><CardDescription>Completed</CardDescription><CardTitle className="text-3xl text-green-600">{stats.completed}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-3"><CardDescription>Cancelled</CardDescription><CardTitle className="text-3xl text-red-600">{stats.cancelled}</CardTitle></CardHeader></Card>
      </div>

      {/* Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="ALL">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="PENDING">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="CONFIRMED">Confirmed ({stats.confirmed})</TabsTrigger>
          <TabsTrigger value="COMPLETED">Completed ({stats.completed})</TabsTrigger>
          <TabsTrigger value="CANCELLED">Cancelled ({stats.cancelled})</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-4">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">No bookings match your filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map(booking => (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    {/* colour stripe */}
                    <div className={`sm:w-2 h-2 sm:h-auto ${booking.status === 'CONFIRMED' ? 'bg-blue-500' : booking.status === 'COMPLETED' ? 'bg-green-500' : booking.status === 'CANCELLED' ? 'bg-red-500' : 'bg-gray-400'}`} />

                    <div className="flex-1 p-4">
                      {/* header row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <h3 className="font-semibold text-base">{booking.subject}</h3>
                        <span className={`inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusStyles[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                          {booking.status}
                        </span>
                      </div>

                      {/* student & tutor */}
                      <div className="flex flex-wrap gap-x-8 gap-y-2 mb-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={booking.student?.image || ''} />
                            <AvatarFallback className="text-xs">{booking.student?.name?.[0]?.toUpperCase() || 'S'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs text-muted-foreground">Student</p>
                            <p className="text-sm font-medium">{booking.student?.name || '—'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={booking.tutor?.image || ''} />
                            <AvatarFallback className="text-xs">{booking.tutor?.name?.[0]?.toUpperCase() || 'T'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs text-muted-foreground">Tutor</p>
                            <p className="text-sm font-medium">{booking.tutor?.name || '—'}</p>
                          </div>
                        </div>
                      </div>

                      {/* details row */}
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(booking.sessionDate)}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{formatTime(booking.startTime)} – {formatTime(booking.endTime)} ({booking.duration} min)</span>
                        <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4" /><span className="font-semibold text-gray-700">{formatCurrency(booking.price)}</span></span>
                      </div>

                      {/* notes */}
                      {booking.studentNotes && (
                        <p className="text-xs text-muted-foreground mt-2"><span className="font-medium">Student note:</span> {booking.studentNotes}</p>
                      )}
                      {booking.tutorNotes && (
                        <p className="text-xs text-muted-foreground mt-1"><span className="font-medium">Tutor note:</span> {booking.tutorNotes}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}