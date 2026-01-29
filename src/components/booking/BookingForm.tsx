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
import { Loader2 } from 'lucide-react';

interface BookingFormProps {
  tutor: TutorProfile | undefined;
  onSubmit: (data: CreateBookingFormData) => void;
  isLoading?: boolean;
}

export default function BookingForm({ tutor, onSubmit, isLoading }: BookingFormProps) {
  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);

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

  useEffect(() => {
    if (startTime && endTime && tutor) {
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
      
      if (durationMinutes > 0) {
        const price = (Number(tutor.hourlyRate) * durationMinutes) / 60;
        setEstimatedPrice(price);
      } else {
        setEstimatedPrice(0);
      }
    }
  }, [startTime, endTime, tutor]);

  if (!tutor) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Tutor not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Tutor Info */}
      <Card>
        <CardHeader>
          <CardTitle>Booking With</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={tutor.user?.image || ''} />
              <AvatarFallback>{tutor.user?.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{tutor.user?.name}</h3>
              <p className="text-sm text-muted-foreground">{tutor.title}</p>
              <p className="text-sm font-semibold mt-1">
                {formatCurrency(tutor.hourlyRate)}/hour
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
          <CardDescription>Enter the details for your tutoring session</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              {...register('subject')}
              placeholder="e.g., Math - Calculus Derivatives"
              disabled={isLoading}
            />
            {errors.subject && (
              <p className="text-sm text-destructive">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionDate">Session Date *</Label>
            <Input
              id="sessionDate"
              type="date"
              {...register('sessionDate')}
              min={new Date().toISOString().split('T')[0]}
              disabled={isLoading}
            />
            {errors.sessionDate && (
              <p className="text-sm text-destructive">{errors.sessionDate.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                {...register('startTime')}
                disabled={isLoading}
              />
              {errors.startTime && (
                <p className="text-sm text-destructive">{errors.startTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                {...register('endTime')}
                disabled={isLoading}
              />
              {errors.endTime && (
                <p className="text-sm text-destructive">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          {estimatedPrice > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Estimated Price</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(estimatedPrice)}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="studentNotes">Notes (Optional)</Label>
            <Textarea
              id="studentNotes"
              {...register('studentNotes')}
              placeholder="Any specific topics you'd like to cover or questions you have?"
              rows={4}
              disabled={isLoading}
            />
            {errors.studentNotes && (
              <p className="text-sm text-destructive">{errors.studentNotes.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Confirm Booking
      </Button>
    </form>
  );
}
