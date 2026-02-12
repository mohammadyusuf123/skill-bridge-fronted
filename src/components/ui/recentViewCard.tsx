import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils';

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  student?: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface RecentReviewsCardProps {
  reviews?: Review[];
  maxItems?: number;
  showEmptyState?: boolean;
}

export default function RecentReviewsCard({ 
  reviews, 
  maxItems = 5,
  showEmptyState = false 
}: RecentReviewsCardProps) {
  const displayReviews = (reviews || []).slice(0, maxItems);
  const hasReviews = displayReviews.length > 0;

  // Don't render if no reviews and empty state is disabled
  if (!hasReviews && !showEmptyState) {
    return null;
  }

  // Calculate average rating
  const averageRating = hasReviews
    ? (displayReviews.reduce((sum, r) => sum + r.rating, 0) / displayReviews.length).toFixed(1)
    : '0.0';

  return (
    <Card className="group rounded-3xl border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 animate-slide-up overflow-hidden bg-gradient-to-br from-white via-amber-50/30 to-yellow-50/50 dark:from-slate-900 dark:via-amber-950/20 dark:to-yellow-950/30 hover:shadow-2xl transition-all duration-500">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-orange-500/10 dark:from-amber-500/10 dark:via-yellow-500/10 dark:to-orange-500/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
        
        <CardHeader className="relative pb-6 pt-8 px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Title Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Star className="h-5 w-5 text-white fill-white" />
                </div>
                <CardTitle className="text-xl lg:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
                  Recent Reviews
                </CardTitle>
              </div>
              <CardDescription className="text-base text-slate-600 dark:text-slate-400 ml-12 mb-2">
                What students are saying about you
              </CardDescription>
            </div>

            {/* Rating Badge */}
            {hasReviews && (
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-amber-200 dark:border-amber-700/50 shadow-lg hover:shadow-xl transition-all duration-300 self-start sm:self-auto">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                  {averageRating} Average
                </span>
              </div>
            )}
          </div>
        </CardHeader>
      </div>

      {/* Content Section */}
      <CardContent className="p-6 lg:p-8">
        {hasReviews ? (
          <div className="space-y-5">
            {displayReviews.map((review, index) => (
              <div
                key={review.id}
                className="group/review pb-5 border-b border-slate-200 dark:border-slate-800 last:border-0 last:pb-0 animate-fade-in-up hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-2xl p-4 -m-4 transition-all duration-300"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-2 ring-amber-100 dark:ring-amber-900/50 group-hover/review:ring-amber-200 dark:group-hover/review:ring-amber-800 transition-all">
                      <AvatarImage src={review.student?.image || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 text-amber-700 dark:text-amber-300 font-semibold">
                        {review.student?.name?.[0]?.toUpperCase() || 'S'}
                      </AvatarFallback>
                    </Avatar>
                    {/* Verified badge */}
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                      <ThumbsUp className="h-3 w-3 text-white" strokeWidth={2.5} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <span className="font-semibold text-base text-slate-900 dark:text-slate-100">
                        {review.student?.name || 'Anonymous Student'}
                      </span>
                      
                      {/* Star Rating */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 transition-all ${
                              i < review.rating 
                                ? 'fill-amber-400 text-amber-400 scale-110' 
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Comment - now handles null */}
                    {review.comment && (
                      <div className="relative mb-3">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-300 to-orange-400 rounded-full opacity-50" />
                        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                          "{review.comment}"
                        </p>
                      </div>
                    )}

                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State (same as before)
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="max-w-md mx-auto space-y-6">
              {/* Empty State Icon */}
              <div className="relative inline-block">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                
                {/* Icon Container */}
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/50 dark:via-yellow-950/50 dark:to-orange-950/50 border-2 border-amber-200/50 dark:border-amber-800/50 shadow-2xl backdrop-blur-sm">
                  <div className="relative">
                    <Star className="h-16 w-16 sm:h-20 sm:w-20 text-amber-600 dark:text-amber-400" strokeWidth={1.5} />
                    {/* Decorative Elements */}
                    <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute -bottom-2 -left-2 h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 opacity-20 animate-bounce" style={{ animationDelay: '1s' }} />
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  No reviews yet
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Complete sessions with students to start receiving reviews
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Bottom Decorative Border */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-600 opacity-40" />

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

// Export the Review type for use in other components
export type { Review };