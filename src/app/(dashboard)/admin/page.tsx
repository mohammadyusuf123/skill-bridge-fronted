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
  ArrowDownRight,
  Star,
  Clock,
  CheckCircle2,
  Activity,
  Sparkles
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const dashboard = data?.data;
  const overview = dashboard?.overview;
  const bookingGrowth = overview?.bookingGrowth ?? 0;

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

  return (
    <div className="space-y-8 pb-8">
      {/* Header with gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-8 text-white shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-white/80">Platform overview and real-time statistics</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Stats - Enhanced */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={item}>
          <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Total Users</CardDescription>
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-4xl font-bold">{overview?.totalUsers || 0}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">All registered users</p>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Total Tutors</CardDescription>
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-4xl font-bold">{overview?.totalTutors || 0}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Active tutors</p>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Total Students</CardDescription>
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <CardTitle className="text-4xl font-bold">{overview?.totalStudents || 0}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Active students</p>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Total Bookings</CardDescription>
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <CardTitle className="text-4xl font-bold">{overview?.totalBookings || 0}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">All time bookings</p>
            </CardHeader>
          </Card>
        </motion.div>
      </motion.div>

      {/* Revenue Stats - Enhanced */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-3"
      >
        <motion.div variants={item}>
          <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
            <CardHeader className="relative pb-3">
              <div className="flex items-center justify-between mb-3">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <DollarSign className="h-6 w-6" />
                </div>
                <Sparkles className="h-5 w-5 text-white/60" />
              </div>
              <CardDescription className="text-white/80 text-sm font-medium">Total Revenue</CardDescription>
              <CardTitle className="text-4xl font-bold">{formatCurrency(overview?.totalRevenue || 0)}</CardTitle>
              <p className="text-white/70 text-xs mt-1">Lifetime platform revenue</p>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
            <CardHeader className="relative pb-3">
              <div className="flex items-center justify-between mb-3">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <TrendingUp className="h-6 w-6" />
                </div>
                {/* <Calendar className="h-5 w-5 text-white/60" /> */}
              </div>
              <CardDescription className="text-white/80 text-sm font-medium">This Month Revenue</CardDescription>
              <CardTitle className="text-4xl font-bold">{formatCurrency(overview?.thisMonthRevenue || 0)}</CardTitle>
              <p className="text-white/70 text-xs mt-1">Current month earnings</p>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className={`relative overflow-hidden border-none shadow-lg ${bookingGrowth >= 0 ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'} text-white`}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
            <CardHeader className="relative pb-3">
              <div className="flex items-center justify-between mb-3">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {bookingGrowth >= 0 ? <ArrowUpRight className="h-6 w-6" /> : <ArrowDownRight className="h-6 w-6" />}
                </div>
                <Activity className="h-5 w-5 text-white/60" />
              </div>
              <CardDescription className="text-white/80 text-sm font-medium">Booking Growth</CardDescription>
              <CardTitle className="text-4xl font-bold">{bookingGrowth.toFixed(1)}%</CardTitle>
              <p className="text-white/70 text-xs mt-1">Compared to last month</p>
            </CardHeader>
          </Card>
        </motion.div>
      </motion.div>

      {/* Activity Stats - Enhanced */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-3"
      >
        <motion.div variants={item}>
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <CardDescription className="font-medium">Completed Bookings</CardDescription>
              </div>
              <CardTitle className="text-4xl font-bold text-green-600">
                {overview?.completedBookings || 0}
              </CardTitle>
              <div className="h-2 bg-green-100 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((overview?.completedBookings || 0) / (overview?.totalBookings || 1) * 100, 100)}%` }}
                />
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <CardDescription className="font-medium">Active Categories</CardDescription>
              </div>
              <CardTitle className="text-4xl font-bold text-blue-600">
                {overview?.activeCategories || 0}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-2">Subject categories available</p>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <CardDescription className="font-medium">This Month Bookings</CardDescription>
              </div>
              <CardTitle className="text-4xl font-bold text-purple-600">
                {overview?.thisMonthBookings || 0}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-2">Sessions this month</p>
            </CardHeader>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users - Enhanced */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-none shadow-lg h-full">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Recent Users
                  </CardTitle>
                  <CardDescription className="mt-1">Newly registered users</CardDescription>
                </div>
                <Link href="/admin/users">
                  <Button variant="outline" size="sm" className="group">
                    View All
                    <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {dashboard?.recentUsers && dashboard.recentUsers.length > 0 ? (
                <div className="space-y-3">
                  {dashboard.recentUsers.slice(0, 5).map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                        <AvatarImage src={user.image || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5">
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`capitalize ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'TUTOR' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.role.toLowerCase()}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No recent users</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Bookings - Enhanced */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-none shadow-lg h-full">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Recent Bookings
                  </CardTitle>
                  <CardDescription className="mt-1">Latest booking activity</CardDescription>
                </div>
                <Link href="/admin/bookings">
                  <Button variant="outline" size="sm" className="group">
                    View All
                    <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {dashboard?.recentBookings && dashboard.recentBookings.length > 0 ? (
                <div className="space-y-3">
                  {dashboard.recentBookings.slice(0, 5).map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{booking.subject}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">
                            {formatDate(booking.sessionDate)}
                          </p>
                          <span className="text-muted-foreground">•</span>
                          <p className="text-sm font-semibold text-primary">
                            {formatCurrency(booking.price)}
                          </p>
                        </div>
                      </div>
                      <Badge className={`font-semibold ${
                        booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' :
                        booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700 border-red-200' :
                        'bg-yellow-100 text-yellow-700 border-yellow-200'
                      } border`}>
                        {booking.status}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No recent bookings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Tutors - Enhanced */}
      {dashboard?.topTutors && dashboard.topTutors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Top Performing Tutors</CardTitle>
                  <CardDescription className="mt-1">Tutors with most sessions and highest ratings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dashboard.topTutors.slice(0, 6).map((tutor, index) => (
                  <motion.div
                    key={tutor.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:shadow-md transition-all group"
                  >
                    <div className="relative">
                      <Avatar className="h-14 w-14 border-2 border-background shadow-lg group-hover:scale-110 transition-transform">
                        <AvatarImage src={tutor.user?.image || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-lg">
                          {tutor.user?.name?.[0]?.toUpperCase() || 'T'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                        <span className="text-xs font-bold text-white">#{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate group-hover:text-primary transition-colors">{tutor.user?.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-sm">
                          <BookOpen className="h-3 w-3 text-primary" />
                          <span className="font-medium">{tutor.totalSessions}</span>
                        </div>
                        <span className="text-muted-foreground">•</span>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {tutor.averageRating ? Number(tutor.averageRating).toFixed(1) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Actions - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="border-none shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription className="mt-1">Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/admin/users">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full justify-start h-auto py-4 group hover:bg-primary/5 hover:border-primary/30">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Manage Users</p>
                        <p className="text-xs text-muted-foreground">View all users</p>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              </Link>
              <Link href="/admin/bookings">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full justify-start h-auto py-4 group hover:bg-primary/5 hover:border-primary/30">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                        <BookOpen className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">View Bookings</p>
                        <p className="text-xs text-muted-foreground">All sessions</p>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              </Link>
              <Link href="/admin/categories">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full justify-start h-auto py-4 group hover:bg-primary/5 hover:border-primary/30">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Categories</p>
                        <p className="text-xs text-muted-foreground">Manage subjects</p>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              </Link>
              <Link href="/tutors">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full justify-start h-auto py-4 group hover:bg-primary/5 hover:border-primary/30">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                        <GraduationCap className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Browse Tutors</p>
                        <p className="text-xs text-muted-foreground">Find tutors</p>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}