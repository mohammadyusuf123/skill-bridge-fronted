import { Booking } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, DollarSign, CheckCircle2, XCircle, Star } from 'lucide-react';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface BookingCardProps {
  booking: Booking;
  userRole: 'STUDENT' | 'TUTOR' | 'ADMIN';
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
}

export default function BookingCard({ booking, userRole, onCancel, onComplete }: BookingCardProps) {
  const statusStyles: Record<string, string> = {
    CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
    COMPLETED: 'bg-green-100 text-green-700 border-green-200',
    CANCELLED: 'bg-red-100 text-red-700 border-red-200',
    PENDING:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  };

  const otherUser = userRole === 'STUDENT' ? booking.tutor : booking.student;

  // Exactly which buttons appear:
  // PENDING    → show Cancel for student & tutor; show Confirm for tutor
  // CONFIRMED  → show Cancel for student & tutor; show Complete for tutor
  // COMPLETED  → show "Leave Review" for student (only if no review yet)
  // CANCELLED  → no action buttons
  const isPending   = booking.status === 'PENDING';
  const isConfirmed = booking.status === 'CONFIRMED';
  const isCompleted = booking.status === 'COMPLETED';
  const showCancel   = (isPending || isConfirmed) && onCancel;
  const showConfirm  = isPending && userRole === 'TUTOR' && onComplete;   // reuse onComplete handler – backend treats confirm same as complete for PENDING
  const showComplete = isConfirmed && userRole === 'TUTOR' && onComplete;
  const showReview   = isCompleted && userRole === 'STUDENT' && !booking.review;

  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={otherUser?.image || ''} />
              <AvatarFallback>{otherUser?.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{booking.subject}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {userRole === 'STUDENT' ? 'with' : 'by'} {otherUser?.name || '—'}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${statusStyles[booking.status] || 'bg-gray-100 text-gray-700'}`}>
            {booking.status}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>{formatDate(booking.sessionDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" />
          <span>{formatTime(booking.startTime)} – {formatTime(booking.endTime)}</span>
          <span className="ml-1">({booking.duration} min)</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="font-semibold">{formatCurrency(booking.price)}</span>
        </div>

        {/* If the student already left a review, show the star rating inline */}
        {booking.review && userRole === 'STUDENT' && (
          <div className="flex items-center gap-1 pt-1">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`h-4 w-4 ${s <= booking.review!.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-xs text-muted-foreground ml-1">Your review</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 pt-0">
        <Link href={`/bookings/${booking.id}`}>
          <Button variant="outline" size="sm">Details</Button>
        </Link>

        {showConfirm && (
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onComplete!(booking.id)}>
            <CheckCircle2 className="h-4 w-4 mr-1" /> Confirm
          </Button>
        )}

        {showComplete && (
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => onComplete!(booking.id)}>
            <CheckCircle2 className="h-4 w-4 mr-1" /> Completed
          </Button>
        )}

        {showCancel && (
          <Button size="sm" variant="destructive" onClick={() => onCancel!(booking.id)}>
            <XCircle className="h-4 w-4 mr-1" /> Cancel
          </Button>
        )}

        {showReview && (
          <Link href={`/bookings/${booking.id}`}>
            <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <Star className="h-4 w-4 mr-1" /> Leave Review
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}