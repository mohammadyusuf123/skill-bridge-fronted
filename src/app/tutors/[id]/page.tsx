'use client';

import { useTutorProfile, useTutorReviews, useTutorAvailability } from '@/hooks/useApi';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import { 
  Star, 
  BookOpen, 
  Award, 
  Clock, 
  DollarSign, 
  Loader2,
  Calendar,
  GraduationCap,
  MapPin
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

const DAYS_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export default function TutorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tutorId = params.id as string;

  const { data: tutorData, isLoading: tutorLoading } = useTutorProfile(tutorId);
  const { data: reviewsData, isLoading: reviewsLoading } = useTutorReviews(tutorId, 1, 5);
  const { data: availabilityData } = useTutorAvailability(tutorId);

  if (tutorLoading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!tutorData?.data) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Tutor not found</h1>
        </div>
      </div>
    );
  }

  const tutor = tutorData.data;
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            ← Back to Tutors
          </Button>
          
          <Card>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-[auto_1fr_auto] gap-8 items-start">
                {/* Avatar */}
                <Avatar className="h-32 w-32">
                  <AvatarImage src={tutor.user?.image || ''} alt={tutor.user?.name || ''} />
                  <AvatarFallback className="text-3xl">
                    {tutor.user?.name?.[0]?.toUpperCase() || 'T'}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">{tutor.user?.name}</h1>
                      {tutor.isVerified && (
                        <Badge variant="secondary" className="gap-1">
                          <Award className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                      {tutor.isAvailable && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Available
                        </Badge>
                      )}
                    </div>
                    <p className="text-xl text-muted-foreground">{tutor.title}</p>
                  </div>

                  {tutor.headline && (
                    <p className="text-lg">{tutor.headline}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-lg">
                        {tutor.averageRating ? Number(tutor.averageRating).toFixed(1) : 'New'}
                      </span>
                      {tutor.totalReviews > 0 && (
                        <span className="text-muted-foreground">
                          ({tutor.totalReviews} reviews)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen className="h-5 w-5" />
                      <span>{tutor.totalSessions} sessions completed</span>
                    </div>

                    {tutor.experience && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GraduationCap className="h-5 w-5" />
                        <span>{tutor.experience} years experience</span>
                      </div>
                    )}
                  </div>

                  {tutor.categories && tutor.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tutor.categories.map((tc) => (
                        <Badge key={tc.id} variant="outline">
                          {tc.category.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Booking Card */}
                <Card className="w-full md:w-80">
                  <CardHeader>
                    <div className="flex items-baseline justify-center gap-1">
                      <DollarSign className="h-6 w-6 text-primary" />
                      <span className="text-4xl font-bold text-primary">
                        {tutor.hourlyRate}
                      </span>
                      <span className="text-muted-foreground">/hour</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => router.push(`/bookings/create?tutorId=${tutor.userId}`)}
                      disabled={!tutor.isAvailable}
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      Book Session
                    </Button>
                    {!tutor.isAvailable && (
                      <p className="text-sm text-center text-muted-foreground">
                        Currently unavailable
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {tutor.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {tutor.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {tutor.education && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{tutor.education}</p>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Reviews ({tutor.totalReviews})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : reviewsData?.data?.data && reviewsData.data.data.length > 0 ? (
                  <div className="space-y-6">
                    {reviewsData.data.data.map((review) => (
                      <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={review.student?.image || ''} />
                            <AvatarFallback>
                              {review.student?.name?.[0]?.toUpperCase() || 'S'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">{review.student?.name}</span>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                            {review.comment && (
                              <p className="text-muted-foreground mb-2">{review.comment}</p>
                            )}
                            {review.response && (
                              <div className="mt-3 ml-4 p-3 bg-muted rounded-lg">
                                <p className="text-sm font-semibold mb-1">Tutor's Response:</p>
                                <p className="text-sm text-muted-foreground">{review.response}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No reviews yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                {availabilityData?.data ? (
                  <div className="space-y-3">
                    {DAYS_ORDER.map((day) => {
                      const slots = availabilityData.data[day] || [];
                      if (slots.length === 0) return null;

                      return (
                        <div key={day} className="text-sm">
                          <div className="font-semibold mb-1 capitalize">
                            {day.toLowerCase()}
                          </div>
                          {slots.map((slot: any) => (
                            <div key={slot.id} className="text-muted-foreground">
                              {slot.startTime} - {slot.endTime}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No availability set
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response time:</span>
                  <span className="font-medium">Within 1 hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total students:</span>
                  <span className="font-medium">{tutor.totalSessions}</span>
                </div>
                {tutor.experience && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience:</span>
                    <span className="font-medium">{tutor.experience} years</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
