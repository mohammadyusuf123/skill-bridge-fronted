'use client';

import { useBooking, useCancelBooking, useCompleteBooking, useCreateReview } from '@/hooks/useApi';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Calendar, Clock, DollarSign, User, Star, ArrowLeft } from 'lucide-react';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';
import { useState } from 'react';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const bookingId = params.id as string;

  const { data, isLoading } = useBooking(bookingId);
  const cancelBooking = useCancelBooking();
  const completeBooking = useCompleteBooking();
  const createReview = useCreateReview();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const booking = data?.data;

  if (!booking) {
    return <div className="text-center py-20">Booking not found</div>;
  }

  const otherUser = session?.user.role === 'STUDENT' ? booking.tutor : booking.student;
  const isPast = new Date(booking.sessionDate) < new Date();
  const canReview = booking.status === 'COMPLETED' && !booking.review && session?.user.role === 'STUDENT';

  const handleReviewSubmit = () => {
    createReview.mutate({
      bookingId: booking.id,
      rating,
      comment,
    }, {
      onSuccess: () => {
        setShowReviewForm(false);
      },
    });
  };

  const statusColors: Record<string, string> = {
    CONFIRMED: 'bg-blue-500',
    COMPLETED: 'bg-green-500',
    CANCELLED: 'bg-red-500',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Booking Details</h1>
          <p className="text-muted-foreground">Session with {otherUser?.name}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Session Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{booking.subject}</CardTitle>
                  <CardDescription>
                    {session?.user.role === 'STUDENT' ? 'with' : 'by'} {otherUser?.name}
                  </CardDescription>
                </div>
                <Badge className={statusColors[booking.status]}>
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{formatDate(booking.sessionDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">{formatCurrency(booking.price)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{booking.duration} minutes</p>
                  </div>
                </div>
              </div>

              {booking.studentNotes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Student Notes:</p>
                  <p className="text-sm">{booking.studentNotes}</p>
                </div>
              )}

              {booking.tutorNotes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Tutor Notes:</p>
                  <p className="text-sm">{booking.tutorNotes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t flex gap-3 flex-wrap">
                {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                  <Button
                    variant="destructive"
                    onClick={() => cancelBooking.mutate({ bookingId: booking.id })}
                    disabled={cancelBooking.isPending}
                  >
                    {cancelBooking.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Cancel Booking
                  </Button>
                )}

                {booking.status === 'PENDING' && session?.user.role === 'TUTOR' && (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => completeBooking.mutate({ bookingId: booking.id })}
                    disabled={completeBooking.isPending}
                  >
                    {completeBooking.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm Booking
                  </Button>
                )}

                {booking.status === 'CONFIRMED' && session?.user.role === 'TUTOR' && (
                  <Button
                    onClick={() => completeBooking.mutate({ bookingId: booking.id })}
                    disabled={completeBooking.isPending}
                  >
                    {completeBooking.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Mark as Complete
                  </Button>
                )}

                {canReview && !showReviewForm && (
                  <Button onClick={() => setShowReviewForm(true)}>
                    Leave Review
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Review Form */}
          {showReviewForm && (
            <Card>
              <CardHeader>
                <CardTitle>Leave a Review</CardTitle>
                <CardDescription>Share your experience with {booking.tutor?.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Comment (Optional)</label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleReviewSubmit} disabled={createReview.isPending}>
                    {createReview.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Review
                  </Button>
                  <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Existing Review */}
          {booking.review && (
            <Card>
              <CardHeader>
                <CardTitle>Your Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < booking.review!.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                {booking.review.comment && (
                  <p className="text-muted-foreground">{booking.review.comment}</p>
                )}
                {booking.review.response && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-semibold mb-1">Tutor's Response:</p>
                    <p className="text-sm">{booking.review.response}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {session?.user.role === 'STUDENT' ? 'Tutor' : 'Student'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={otherUser?.image || ''} />
                  <AvatarFallback>
                    {otherUser?.name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{otherUser?.name}</p>
                  <p className="text-sm text-muted-foreground">{otherUser?.email}</p>
                </div>
              </div>
              {session?.user.role === 'STUDENT' && (
                <Button 
                  className="w-full mt-4"
                  variant="outline"
                  onClick={() => router.push(`/tutors/${booking.tutorProfile?.id}`)}
                >
                  View Profile
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}