'use client';

import { useAdminDashboard } from '@/hooks/useApi';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Loader2,
  GraduationCap,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const dashboard = data?.data;
  const overview = dashboard?.overview;
const bookingGrowth = overview?.bookingGrowth ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and statistics</p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={overview?.totalUsers || 0}
          icon={Users}
          description="All registered users"
        />
        <StatsCard
          title="Total Tutors"
          value={overview?.totalTutors || 0}
          icon={GraduationCap}
          description="Active tutors"
        />
        <StatsCard
          title="Total Students"
          value={overview?.totalStudents || 0}
          icon={Users}
          description="Active students"
        />
        <StatsCard
          title="Total Bookings"
          value={overview?.totalBookings || 0}
          icon={BookOpen}
          description="All time bookings"
        />
      </div>

      {/* Revenue Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(overview?.totalRevenue || 0)}
          icon={DollarSign}
          description="Lifetime platform revenue"
        />
        <StatsCard
          title="This Month Revenue"
          value={formatCurrency(overview?.thisMonthRevenue || 0)}
          icon={TrendingUp}
          description="Current month"
        />
      <StatsCard
  title="Booking Growth"
  value={`${bookingGrowth.toFixed(1)}%`}
  icon={bookingGrowth >= 0 ? ArrowUpRight : ArrowDownRight}
  trend={{
    value: bookingGrowth,
    isPositive: bookingGrowth >= 0
  }}
  description="vs last month"
/>

      </div>

      {/* Activity Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed Bookings</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {overview?.completedBookings || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Categories</CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {overview?.activeCategories || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>This Month Bookings</CardDescription>
            <CardTitle className="text-3xl text-purple-600">
              {overview?.thisMonthBookings || 0}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Newly registered users</CardDescription>
              </div>
              <Link href="/admin/users">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {dashboard?.recentUsers && dashboard.recentUsers.length > 0 ? (
              <div className="space-y-4">
                {dashboard.recentUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center gap-4 pb-4 border-b last:border-0">
                    <Avatar>
                      <AvatarImage src={user.image || ''} />
                      <AvatarFallback>
                        {user.name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {user.role.toLowerCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No recent users</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest booking activity</CardDescription>
              </div>
              <Link href="/admin/bookings">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {dashboard?.recentBookings && dashboard.recentBookings.length > 0 ? (
              <div className="space-y-4">
                {dashboard.recentBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4 pb-4 border-b last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{booking.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(booking.sessionDate)} • {formatCurrency(booking.price)}
                      </p>
                    </div>
                    <Badge className={
                      booking.status === 'COMPLETED' ? 'bg-green-500' :
                      booking.status === 'CONFIRMED' ? 'bg-blue-500' :
                      booking.status === 'CANCELLED' ? 'bg-red-500' :
                      'bg-gray-500'
                    }>
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No recent bookings</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Tutors */}
      {dashboard?.topTutors && dashboard.topTutors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Tutors</CardTitle>
            <CardDescription>Tutors with most sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dashboard.topTutors.slice(0, 6).map((tutor) => (
                <div key={tutor.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={tutor.user?.image || ''} />
                    <AvatarFallback>
                      {tutor.user?.name?.[0]?.toUpperCase() || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{tutor.user?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {tutor.totalSessions} sessions • {tutor.averageRating ? Number(tutor.averageRating).toFixed(1) : 'N/A'}★
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/bookings">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                View Bookings
              </Button>
            </Link>
            <Link href="/admin/categories">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Manage Categories
              </Button>
            </Link>
            <Link href="/tutors">
              <Button variant="outline" className="w-full justify-start">
                <GraduationCap className="mr-2 h-4 w-4" />
                Browse Tutors
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
