import { TutorProfile } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, BookOpen, DollarSign, Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface TutorCardProps {
  tutor: TutorProfile;
  index?: number;
}

export default function TutorCard({ tutor, index = 0 }: TutorCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: [0.21, 0.45, 0.27, 0.9]
      }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="group relative overflow-hidden h-full flex flex-col border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-xl">
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="relative">
          <div className="flex items-start gap-4">
            {/* Avatar with loading state */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
            >
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-background shadow-md ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
                  <AvatarImage 
                    src={tutor.user?.image || ''} 
                    alt={tutor.user?.name || ''}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    className={`transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                  <AvatarFallback className="text-lg bg-gradient-to-br from-primary/20 to-primary/5">
                    {tutor.user?.name?.[0]?.toUpperCase() || 'T'}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                {tutor.isAvailable && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full"
                  >
                    <span className="absolute inset-0 animate-ping bg-green-500 rounded-full opacity-75" />
                  </motion.div>
                )}
              </div>
            </motion.div>

            <div className="flex-1 space-y-1.5 min-w-0">
              <CardTitle className="text-lg truncate group-hover:text-primary transition-colors duration-200">
                {tutor.user?.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground truncate font-medium">
                {tutor.title}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {tutor.isVerified && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                  >
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                      <Award className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </motion.div>
                )}
                {tutor.isAvailable && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.35 }}
                  >
                    <Badge variant="outline" className="text-xs border-green-500/30 text-green-600 dark:text-green-400">
                      Available
                    </Badge>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      
        <CardContent className="space-y-4 flex-1 relative">
          {tutor.headline && (
            <p className="text-sm line-clamp-2 text-muted-foreground leading-relaxed">
              {tutor.headline}
            </p>
          )}
          
          {/* Stats row with icons */}
          <div className="flex items-center gap-6 text-sm">
            <motion.div 
              className="flex items-center gap-1.5"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">
                {tutor.averageRating ? Number(tutor.averageRating).toFixed(1) : 'New'}
              </span>
              {tutor.totalReviews > 0 && (
                <span className="text-muted-foreground">({tutor.totalReviews})</span>
              )}
            </motion.div>
          
            <motion.div 
              className="flex items-center gap-1.5 text-muted-foreground"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <BookOpen className="h-4 w-4" />
              <span className="font-medium">{tutor.totalSessions}</span>
              <span className="text-xs">sessions</span>
            </motion.div>
          </div>

          {/* Price section with enhanced design */}
          <motion.div 
            className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-baseline gap-1">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-primary">{tutor.hourlyRate}</span>
              <span className="text-sm text-muted-foreground font-medium">/hour</span>
            </div>
            <TrendingUp className="h-4 w-4 text-primary/60 ml-auto" />
          </motion.div>

          {/* Categories with stagger animation */}
          {tutor.categories && tutor.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tutor.categories.slice(0, 3).map((tc, i) => (
                <motion.div
                  key={tc.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1 + 0.4 + (i * 0.05)
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Badge 
                    variant="outline" 
                    className="text-xs hover:bg-primary/5 transition-colors cursor-default"
                  >
                    {tc.category.name}
                  </Badge>
                </motion.div>
              ))}
              {tutor.categories.length > 3 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.55 }}
                >
                  <Badge variant="outline" className="text-xs bg-muted/50">
                    +{tutor.categories.length - 3} more
                  </Badge>
                </motion.div>
              )}
            </div>
          )}
        </CardContent>
      
        <CardFooter className="flex gap-2 pt-4 relative border-t border-border/50">
          <Link href={`/tutors/${tutor.id}`} className="flex-1">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Button 
                variant="outline" 
                className="w-full hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all duration-200"
              >
                View Profile
              </Button>
            </motion.div>
          </Link>
          <Link href={`/bookings/create?tutorId=${tutor.userId}`} className="flex-1">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Button className="w-full shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-primary to-primary/90">
                Book Now
              </Button>
            </motion.div>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}