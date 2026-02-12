import { useRouter } from 'next/navigation';
import { BookOpen, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BookingCard from '@/components/booking/BookingCard';

interface UpcomingSessionsCardProps {
  upcomingBookings?: any[];
  onCancel: (bookingId: string) => void;
}

export default function SessionsCard({ upcomingBookings, onCancel }: UpcomingSessionsCardProps) {
  const router = useRouter();

  return (
    <Card className="group rounded-3xl border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 animate-slide-up overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 dark:from-slate-900 dark:via-emerald-950/20 dark:to-teal-950/20 hover:shadow-2xl transition-all duration-500">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 dark:from-emerald-500/20 dark:via-teal-500/20 dark:to-cyan-500/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
        
        <CardHeader className="relative pb-6 pt-8 px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Title Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
                  Upcoming Sessions
                </CardTitle>
              </div>
              <CardDescription className="text-base text-slate-600 dark:text-slate-400 ml-14">
                Your confirmed sessions
              </CardDescription>
            </div>

            {/* Active Badge */}
            {upcomingBookings && upcomingBookings.length > 0 && (
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-emerald-200 dark:border-emerald-800/50 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 self-start sm:self-auto">
                <div className="relative flex items-center justify-center">
                  <div className="absolute h-3 w-3 rounded-full bg-emerald-500 animate-ping opacity-75" />
                  <div className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {upcomingBookings.length} Active
                </span>
              </div>
            )}
          </div>
        </CardHeader>
      </div>

      {/* Content Section */}
      <CardContent className="p-6 lg:p-8">
        {upcomingBookings && upcomingBookings.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
            {upcomingBookings.map((booking, index) => (
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
                  onCancel={() => onCancel(booking.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
            <div className="max-w-md mx-auto space-y-6">
              {/* Empty State Icon */}
              <div className="relative inline-block">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 blur-3xl rounded-full scale-150 animate-pulse" />
                
                {/* Icon Container */}
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50 border-2 border-emerald-200/50 dark:border-emerald-800/50 shadow-2xl backdrop-blur-sm">
                  <div className="relative">
                    <BookOpen className="h-16 w-16 sm:h-20 sm:w-20 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
                    {/* Decorative Elements */}
                    <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute -bottom-2 -left-2 h-6 w-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 opacity-20 animate-bounce" style={{ animationDelay: '1s' }} />
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  No upcoming sessions yet
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Start your learning journey by booking a session with one of our expert tutors
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => router.push('/find-tutors')}
                className="group/btn relative inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-white font-bold shadow-lg shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 overflow-hidden"
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />
                
                <Calendar className="h-5 w-5 transition-transform group-hover/btn:rotate-12 duration-300" />
                <span className="relative text-base">Browse Tutors</span>
                
                {/* Arrow */}
                <svg 
                  className="h-5 w-5 transition-transform group-hover/btn:translate-x-1 duration-300" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>

              {/* Optional: Additional CTA */}
              <div className="pt-4">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">
                  or{' '}
                  <button 
                    onClick={() => router.push('/how-it-works')}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold underline-offset-2 hover:underline transition-colors"
                  >
                    learn how it works
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Bottom Decorative Border */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-50" />

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