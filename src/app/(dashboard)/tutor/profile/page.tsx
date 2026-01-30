'use client';

import { useOwnTutorProfile, useUpdateTutorProfile, useToggleTutorAvailability, useCategories } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateTutorProfileSchema, UpdateTutorProfileFormData } from '@/lib/validations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2, Award, DollarSign, GraduationCap, Briefcase, FileText } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function TutorProfilePage() {
  const router = useRouter();
  const { data: profileData, isLoading } = useOwnTutorProfile();
  const { data: categoriesData } = useCategories();
  const updateProfile = useUpdateTutorProfile();
  const toggleAvailability = useToggleTutorAvailability();

  const tutor = profileData?.data;
  const categories = categoriesData?.data || [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateTutorProfileFormData>({
    resolver: zodResolver(updateTutorProfileSchema),
    values: tutor ? {
      title: tutor.title || '',
      headline: tutor.headline || '',
      description: tutor.description || '',
      hourlyRate: Number(tutor.hourlyRate) || 0,
      experience: tutor.experience || 0,
      education: tutor.education || '',
      isAvailable: tutor.isAvailable || false,
      categoryIds: tutor.categories?.map(tc => tc.categoryId) || [],
    } : undefined,
  });

  const selectedCategories = watch('categoryIds') || [];

  const onSubmit = (formData: UpdateTutorProfileFormData) => {
    updateProfile.mutate(formData);
  };

  const handleToggleAvailability = () => {
    toggleAvailability.mutate();
  };

  const toggleCategory = (categoryId: string) => {
    const current = selectedCategories;
    if (current.includes(categoryId)) {
      setValue('categoryIds', current.filter(id => id !== categoryId));
    } else {
      setValue('categoryIds', [...current, categoryId]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Tutor Profile Found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              You need to create a tutor profile first.
            </p>
            <Button onClick={() => router.push('/tutor/profile/create')}>
              Create Tutor Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tutor Profile</h1>
          <p className="text-muted-foreground">Manage your tutoring profile and settings</p>
        </div>
        <div className="flex gap-2">
          {tutor.isVerified && (
            <Badge variant="secondary" className="gap-1">
              <Award className="h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Sessions</CardDescription>
            <CardTitle className="text-2xl">{tutor.totalSessions}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Average Rating</CardDescription>
            <CardTitle className="text-2xl">
              {tutor.averageRating ? Number(tutor.averageRating).toFixed(1) : 'N/A'}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Reviews</CardDescription>
            <CardTitle className="text-2xl">{tutor.totalReviews}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Hourly Rate</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(tutor.hourlyRate)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Availability Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Availability Status</CardTitle>
              <CardDescription>Control whether students can book sessions with you</CardDescription>
            </div>
            <Switch
              checked={tutor.isAvailable}
              onCheckedChange={handleToggleAvailability}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title *</Label>
              <Input 
                id="title" 
                {...register('title')} 
                placeholder="e.g., Mathematics Expert, English Language Tutor"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input 
                id="headline" 
                {...register('headline')} 
                placeholder="A brief, catchy introduction (max 200 characters)"
                maxLength={200}
              />
              {errors.headline && (
                <p className="text-sm text-destructive">{errors.headline.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">About You</Label>
              <Textarea 
                id="description" 
                {...register('description')} 
                rows={6}
                placeholder="Describe your teaching style, experience, and what makes you a great tutor..."
                maxLength={2000}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {watch('description')?.length || 0} / 2000 characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Professional Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Professional Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Hourly Rate ($) *
                </Label>
                <Input 
                  id="hourlyRate" 
                  type="number" 
                  {...register('hourlyRate', { valueAsNumber: true })} 
                  placeholder="50"
                  min="1"
                  max="1000"
                />
                {errors.hourlyRate && (
                  <p className="text-sm text-destructive">{errors.hourlyRate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input 
                  id="experience" 
                  type="number" 
                  {...register('experience', { valueAsNumber: true })} 
                  placeholder="5"
                  min="0"
                  max="50"
                />
                {errors.experience && (
                  <p className="text-sm text-destructive">{errors.experience.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="education" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Education
              </Label>
              <Textarea 
                id="education" 
                {...register('education')} 
                rows={3}
                placeholder="e.g., PhD in Mathematics from MIT, M.Ed. in Education from Harvard"
                maxLength={500}
              />
              {errors.education && (
                <p className="text-sm text-destructive">{errors.education.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Teaching Subjects</CardTitle>
            <CardDescription>Select the subjects you can teach (at least one required)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge
                  key={category.id}
                  variant={selectedCategories.includes(category.id) ? 'default' : 'outline'}
                  className="cursor-pointer text-sm px-3 py-1"
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
            {errors.categoryIds && (
              <p className="text-sm text-destructive mt-2">{errors.categoryIds.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3">
          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
