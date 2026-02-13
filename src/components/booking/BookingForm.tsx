'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBookingSchema, CreateBookingFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TutorProfile } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { 
  Loader2, 
  Calendar, 
  Clock, 
  BookOpen, 
  DollarSign, 
  CheckCircle2,
  Star,
  Award,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface BookingFormProps {
  tutor: TutorProfile | undefined;
  onSubmit: (data: CreateBookingFormData) => void;
  isLoading?: boolean;
}

export default function BookingForm({ tutor, onSubmit, isLoading }: BookingFormProps) {
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateBookingFormData>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      tutorId: tutor?.userId,
    },
  });

  const startTime = watch('startTime');
  const endTime = watch('endTime');
  const subject = watch('subject');
  const sessionDate = watch('sessionDate');

  useEffect(() => {
    if (startTime && endTime && tutor) {
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
      
      if (durationMinutes > 0) {
        const price = (Number(tutor.hourlyRate) * durationMinutes) / 60;
        setEstimatedPrice(price);
        setDuration(durationMinutes);
      } else {
        setEstimatedPrice(0);
        setDuration(0);
      }
    }
  }, [startTime, endTime, tutor]);

  if (!tutor) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-12">
          <div className="text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Tutor not found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isFormValid = subject && sessionDate && startTime && endTime && estimatedPrice > 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Enhanced Tutor Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-primary/20 shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/70 to-primary/50" />
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Booking Session With</CardTitle>
              {tutor.isVerified && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  <Award className="h-3 w-3 mr-1" />
                  Verified Tutor
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-background shadow-xl ring-2 ring-primary/20">
                    <AvatarImage src={tutor.user?.image || ''} />
                    <AvatarFallback className="text-xl bg-gradient-to-br from-primary/20 to-primary/5">
                      {tutor.user?.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {tutor.isAvailable && (
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 border-3 border-background rounded-full">
                      <span className="absolute inset-0 animate-ping bg-green-500 rounded-full opacity-75" />
                    </div>
                  )}
                </div>
              </motion.div>
              
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="text-xl font-bold">{tutor.user?.name}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{tutor.title}</p>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">
                      {tutor.averageRating ? Number(tutor.averageRating).toFixed(1) : 'New'}
                    </span>
                    {tutor.totalReviews > 0 && (
                      <span className="text-muted-foreground">({tutor.totalReviews})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span className="font-medium">{tutor.totalSessions} sessions</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(tutor.hourlyRate)}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">/hour</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Session Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Session Details</CardTitle>
                <CardDescription>Schedule your tutoring session</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Subject Field */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Label htmlFor="subject" className="flex items-center gap-2 text-sm font-semibold">
                <BookOpen className="h-4 w-4 text-primary" />
                Subject *
              </Label>
              <div className="relative">
                <Input
                  id="subject"
                  {...register('subject')}
                  placeholder="e.g., Math - Calculus Derivatives"
                  disabled={isLoading}
                  className={`pl-4 transition-all duration-200 ${
                    errors.subject 
                      ? 'border-destructive focus-visible:ring-destructive' 
                      : subject 
                      ? 'border-green-500/50 focus-visible:ring-green-500/50' 
                      : ''
                  }`}
                />
                <AnimatePresence>
                  {subject && !errors.subject && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {errors.subject && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    {errors.subject.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Date Field */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <Label htmlFor="sessionDate" className="flex items-center gap-2 text-sm font-semibold">
                <Calendar className="h-4 w-4 text-primary" />
                Session Date *
              </Label>
              <div className="relative">
                <Input
                  id="sessionDate"
                  type="date"
                  {...register('sessionDate')}
                  min={new Date().toISOString().split('T')[0]}
                  disabled={isLoading}
                  className={`transition-all duration-200 ${
                    errors.sessionDate 
                      ? 'border-destructive focus-visible:ring-destructive' 
                      : sessionDate 
                      ? 'border-green-500/50 focus-visible:ring-green-500/50' 
                      : ''
                  }`}
                />
                <AnimatePresence>
                  {sessionDate && !errors.sessionDate && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {errors.sessionDate && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-destructive"
                  >
                    {errors.sessionDate.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Time Fields */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="space-y-2">
                <Label htmlFor="startTime" className="flex items-center gap-2 text-sm font-semibold">
                  <Clock className="h-4 w-4 text-primary" />
                  Start Time *
                </Label>
                <div className="relative">
                  <Input
                    id="startTime"
                    type="time"
                    {...register('startTime')}
                    disabled={isLoading}
                    className={`transition-all duration-200 ${
                      errors.startTime 
                        ? 'border-destructive focus-visible:ring-destructive' 
                        : startTime 
                        ? 'border-green-500/50 focus-visible:ring-green-500/50' 
                        : ''
                    }`}
                  />
                  <AnimatePresence>
                    {startTime && !errors.startTime && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {errors.startTime && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm text-destructive"
                    >
                      {errors.startTime.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="flex items-center gap-2 text-sm font-semibold">
                  <Clock className="h-4 w-4 text-primary" />
                  End Time *
                </Label>
                <div className="relative">
                  <Input
                    id="endTime"
                    type="time"
                    {...register('endTime')}
                    disabled={isLoading}
                    className={`transition-all duration-200 ${
                      errors.endTime 
                        ? 'border-destructive focus-visible:ring-destructive' 
                        : endTime 
                        ? 'border-green-500/50 focus-visible:ring-green-500/50' 
                        : ''
                    }`}
                  />
                  <AnimatePresence>
                    {endTime && !errors.endTime && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {errors.endTime && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm text-destructive"
                    >
                      {errors.endTime.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Estimated Price */}
            <AnimatePresence>
              {estimatedPrice > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden"
                >
                  <div className="p-5 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-xl border-2 border-primary/20 shadow-lg">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Session Summary
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {duration} min
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-primary">
                            {formatCurrency(estimatedPrice)}
                          </span>
                          <span className="text-sm text-muted-foreground">total</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Based on {formatCurrency(tutor.hourlyRate)}/hour × {(duration / 60).toFixed(1)} hours
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notes Field */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
            >
              <Label htmlFor="studentNotes" className="flex items-center gap-2 text-sm font-semibold">
                <MessageSquare className="h-4 w-4 text-primary" />
                Notes (Optional)
              </Label>
              <Textarea
                id="studentNotes"
                {...register('studentNotes')}
                placeholder="Any specific topics you'd like to cover or questions you have?"
                rows={4}
                disabled={isLoading}
                className="resize-none transition-all duration-200 focus-visible:ring-primary/50"
              />
              <AnimatePresence>
                {errors.studentNotes && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-destructive"
                  >
                    {errors.studentNotes.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <motion.div
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-primary to-primary/90 group relative overflow-hidden" 
            size="lg" 
            disabled={isLoading || !isFormValid}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Confirm Booking
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </form>
  );
}