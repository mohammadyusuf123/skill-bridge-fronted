import { TutorProfile } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, BookOpen, DollarSign, Award } from 'lucide-react';
import Link from 'next/link';

interface TutorCardProps {
  tutor: TutorProfile;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={tutor.user?.image || ''} alt={tutor.user?.name || ''} />
            <AvatarFallback className="text-lg">
              {tutor.user?.name?.[0]?.toUpperCase() || 'T'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1 min-w-0">
            <CardTitle className="text-lg truncate">{tutor.user?.name}</CardTitle>
            <p className="text-sm text-muted-foreground truncate">{tutor.title}</p>
            <div className="flex gap-1">
              {tutor.isVerified && (
                <Badge variant="secondary" className="text-xs">
                  <Award className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              {tutor.isAvailable && (
                <Badge variant="outline" className="text-xs">Available</Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 flex-1">
        {tutor.headline && (
          <p className="text-sm line-clamp-2 text-muted-foreground">{tutor.headline}</p>
        )}
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">
              {tutor.averageRating ? Number(tutor.averageRating).toFixed(1) : 'New'}
            </span>
            {tutor.totalReviews > 0 && (
              <span className="text-muted-foreground">({tutor.totalReviews})</span>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{tutor.totalSessions}</span>
          </div>
        </div>

        <div className="flex items-baseline gap-1">
          <DollarSign className="h-5 w-5 text-primary" />
          <span className="text-2xl font-bold text-primary">{tutor.hourlyRate}</span>
          <span className="text-sm text-muted-foreground">/hour</span>
        </div>

        {tutor.categories && tutor.categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tutor.categories.slice(0, 3).map((tc) => (
              <Badge key={tc.id} variant="outline" className="text-xs">
                {tc.category.name}
              </Badge>
            ))}
            {tutor.categories.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tutor.categories.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-4">
        <Link href={`/tutors/${tutor.id}`} className="flex-1">
          <Button variant="outline" className="w-full">View Profile</Button>
        </Link>
        <Link href={`/bookings/create?tutorId=${tutor.userId}`} className="flex-1">
          <Button className="w-full">Book Now</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
