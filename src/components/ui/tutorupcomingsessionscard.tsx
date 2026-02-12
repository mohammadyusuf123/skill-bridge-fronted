import { Calendar, BookOpen, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BookingCard from '@/components/booking/BookingCard';

interface TutorUpcomingSessionsCardProps {
  upcomingSessions?: any[];
  onComplete: (bookingId: string) => void;
}

export default function TutorUpcomingSessionsCard({ 
  upcomingSessions, 
  onComplete 
}: TutorUpcomingSessionsCardProps) {
  const hasSessions = upcomingSessions && upcomingSessions.length > 0;

  return (
    <Card className="group rounded-3xl border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 animate-slide-up overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-blue-950/20 dark:to-indigo-950/20 hover:shadow-2xl transition-all duration-500">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
        
        <CardHeader className="relative pb-6 pt-8 px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between ">
            {/* Title Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl  bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl sm:text-2xl lg:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
                  Upcoming Sessions
                </CardTitle>
              </div>
              <CardDescription className="text-base text-slate-600 dark:text-slate-400 ml-14">
                Your scheduled tutoring sessions
              </CardDescription>
            </div>

            {/* Active Badge */}
            {hasSessions && (
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-blue-200 dark:border-blue-800/50 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 self-start sm:self-auto">
                <div className="relative flex items-center justify-center">
                  <div className="absolute h-3 w-3 rounded-full bg-blue-500 animate-ping opacity-75" />
                  <div className="relative h-2.5 w-2.5 rounded-full bg-blue-500" />
                </div>
                <span className="text-sm font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                  {upcomingSessions.length} Scheduled
                </span>
              </div>
            )}
          </div>
        </CardHeader>
      </div>

      {/* Content Section */}
      <CardContent className="p-6 lg:p-8">
        {hasSessions ? (
          <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {upcomingSessions.map((booking, index) => (
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
                  userRole="TUTOR"
                  onComplete={() => onComplete(booking.id)}
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
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 blur-3xl rounded-full scale-150 animate-pulse" />
                
                {/* Icon Container */}
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 border-2 border-blue-200/50 dark:border-blue-800/50 shadow-2xl backdrop-blur-sm">
                  <div className="relative">
                    <Users className="h-6 w-6 sm:h-10 sm:w-10 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                    {/* Decorative Elements */}
                    <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute -bottom-2 -left-2 h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-20 animate-bounce" style={{ animationDelay: '1s' }} />
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  No upcoming sessions
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Students will book sessions with you once your profile is complete and availability is set
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Bottom Decorative Border */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-50" />

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