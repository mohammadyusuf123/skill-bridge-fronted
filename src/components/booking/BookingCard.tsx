import { Booking } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, DollarSign, User } from 'lucide-react';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface BookingCardProps {
  booking: Booking;
  userRole: 'STUDENT' | 'TUTOR' | 'ADMIN';
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
}

export default function BookingCard({ booking, userRole, onCancel, onComplete }: BookingCardProps) {
  const statusColors: Record<string, string> = {
    CONFIRMED: 'bg-blue-500 hover:bg-blue-600',
    COMPLETED: 'bg-green-500 hover:bg-green-600',
    CANCELLED: 'bg-red-500 hover:bg-red-600',
    PENDING: 'bg-yellow-500 hover:bg-yellow-600',
    NO_SHOW: 'bg-gray-500 hover:bg-gray-600',
  };

  const otherUser = userRole === 'STUDENT' ? booking.tutor : booking.student;
  const isPast = new Date(booking.sessionDate) < new Date();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar>
              <AvatarImage src={otherUser?.image || ''} />
              <AvatarFallback>{otherUser?.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{booking.subject}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {userRole === 'STUDENT' ? 'with' : 'by'} {otherUser?.name}
              </p>
            </div>
          </div>
          <Badge className={statusColors[booking.status]}>
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{formatDate(booking.sessionDate)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
          </span>
          <span className="text-muted-foreground">({booking.duration} min)</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{formatCurrency(booking.price)}</span>
        </div>

        {booking.studentNotes && userRole !== 'STUDENT' && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">Student Notes:</p>
            <p className="text-sm">{booking.studentNotes}</p>
          </div>
        )}

        {booking.tutorNotes && userRole !== 'TUTOR' && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">Tutor Notes:</p>
            <p className="text-sm">{booking.tutorNotes}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2 flex-wrap">
        <Link href={`/bookings/${booking.id}`}>
          <Button variant="outline" size="sm">View Details</Button>
        </Link>
        
        {booking.status === 'CONFIRMED' && !isPast && onCancel && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onCancel(booking.id)}
          >
            Cancel
          </Button>
        )}
        
        {booking.status === 'CONFIRMED' && userRole === 'TUTOR' && onComplete && (
          <Button 
            size="sm" 
            onClick={() => onComplete(booking.id)}
          >
            Mark Complete
          </Button>
        )}

        {booking.status === 'COMPLETED' && !booking.review && userRole === 'STUDENT' && (
          <Link href={`/bookings/${booking.id}/review`}>
            <Button size="sm" variant="secondary">Leave Review</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
