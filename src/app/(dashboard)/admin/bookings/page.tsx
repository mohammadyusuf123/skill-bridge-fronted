'use client';

import { useBookings } from '@/hooks/useApi';
import BookingCard from '@/components/booking/BookingCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Loader2, Search, BookOpen } from 'lucide-react';
import { useState } from 'react';
import type { BookingStatus } from '@/types';

export default function AdminBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading } = useBookings();

  const bookings = data?.data?.data || [];
  
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
    const matchesSearch = searchQuery === '' ||
      booking.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.tutor?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
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
        <h1 className="text-3xl font-bold">Bookings Management</h1>
        <p className="text-muted-foreground">View and manage all platform bookings</p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by subject, student, or tutor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Bookings</CardDescription>
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
                  userRole="ADMIN"
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">No bookings found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchQuery ? 'Try a different search query' : 
                   statusFilter === 'ALL' ? 'No bookings in the system yet' : 
                   `No ${statusFilter.toLowerCase()} bookings`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
