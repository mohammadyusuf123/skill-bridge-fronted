import { Clock, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BookingCard from '@/components/booking/BookingCard';

interface RecentBookingsCardProps {
  recentBookings?: any[];
  maxItems?: number;
  showEmptyState?: boolean;
}

export default function RecentBookingsCard({ 
  recentBookings, 
  maxItems = 4,
  showEmptyState = false 
}: RecentBookingsCardProps) {
  const displayBookings = recentBookings?.slice(0, maxItems) || [];
  const hasBookings = displayBookings.length > 0;

  // Don't render if no bookings and empty state is disabled
  if (!hasBookings && !showEmptyState) {
    return null;
  }

  return (
    <Card className="group rounded-3xl border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 animate-slide-up overflow-hidden bg-gradient-to-br from-white via-slate-50/30 to-slate-50/50 dark:from-slate-900 dark:via-slate-950/20 dark:to-slate-950/30 hover:shadow-2xl transition-all duration-500">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-indigo-500/5 to-purple-500/10 dark:from-slate-500/10 dark:via-indigo-500/10 dark:to-purple-500/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
        
        <CardHeader className="relative pb-6 pt-8 px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Title Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 shadow-lg shadow-slate-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
                  Recent Activity
                </CardTitle>
              </div>
              <CardDescription className="text-base text-slate-600 dark:text-slate-400 ml-14">
                Your recent bookings and sessions
              </CardDescription>
            </div>

            {/* Stats Badge */}
            {hasBookings && (
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 self-start sm:self-auto">
                <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                  {recentBookings?.length || 0} Total
                </span>
              </div>
            )}
          </div>
        </CardHeader>
      </div>

      {/* Content Section */}
      <CardContent className="p-6 lg:p-8">
        {hasBookings ? (
          <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-2">
            {displayBookings.map((booking, index) => (
              <div
                key={booking.id}
                className="animate-fade-in-up"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <BookingCard
                  booking={booking}
                  userRole="STUDENT"
                />
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="max-w-md mx-auto space-y-6">
              {/* Empty State Icon */}
              <div className="relative inline-block">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-500/20 to-indigo-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                
                {/* Icon Container */}
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 border-2 border-slate-200/50 dark:border-slate-800/50 shadow-2xl backdrop-blur-sm">
                  <div className="relative">
                    <TrendingUp className="h-16 w-16 sm:h-20 sm:w-20 text-slate-600 dark:text-slate-400" strokeWidth={1.5} />
                    {/* Decorative Elements */}
                    <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute -bottom-2 -left-2 h-6 w-6 rounded-full bg-gradient-to-br from-slate-400 to-indigo-500 opacity-20 animate-bounce" style={{ animationDelay: '1s' }} />
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  No recent activity
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Your completed and past sessions will appear here
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Bottom Decorative Border */}
      <div className="h-1 bg-gradient-to-r from-slate-400 via-indigo-500 to-purple-600 opacity-40" />

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        @media (max-width: 640px) {
          .animate-fade-in-up {
            animation-duration: 0.4s;
          }
        }
      `}</style>
    </Card>
  );
}