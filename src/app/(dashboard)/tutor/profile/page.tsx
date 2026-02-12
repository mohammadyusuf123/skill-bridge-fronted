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
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Loader2, 
  Award, 
  DollarSign, 
  GraduationCap, 
  Briefcase, 
  FileText,
  Star,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  AlertCircle
} from 'lucide-react';
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
    formState: { errors, isDirty },
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
  const descriptionLength = watch('description')?.length || 0;

  const onSubmit = (formData: UpdateTutorProfileFormData) => {
    updateProfile.mutate(formData);
  };

  const handleToggleAvailability = () => {
    toggleAvailability.mutate();
  };

  const toggleCategory = (categoryId: string) => {
    const current = selectedCategories;
    if (current.includes(categoryId)) {
      setValue('categoryIds', current.filter(id => id !== categoryId), { shouldDirty: true });
    } else {
      setValue('categoryIds', [...current, categoryId], { shouldDirty: true });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your tutor profile...</p>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No Tutor Profile Found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              Start your teaching journey by creating your professional tutor profile.
            </p>
            <Button onClick={() => router.push('/tutor/profile/create')} size="lg">
              <GraduationCap className="h-5 w-5 mr-2" />
              Create Tutor Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header Section with Gradient Background */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background border-2">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="relative px-6 py-8 md:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl ring-2 ring-primary/20">
                <AvatarImage src={tutor.user?.image || ''} />
                <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                  {tutor.user?.name?.[0]?.toUpperCase() || 'T'}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">{tutor.user?.name}</h1>
                  {tutor.isVerified && (
                    <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                      <Award className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-muted-foreground font-medium">{tutor.title || 'Professional Tutor'}</p>
                {tutor.headline && (
                  <p className="text-sm text-muted-foreground max-w-2xl">{tutor.headline}</p>
                )}
              </div>
            </div>

            {/* Availability Toggle Card */}
            <Card className="border-2 min-w-[200px]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {tutor.isAvailable ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-orange-600" />
                    )}
                    <div>
                      <p className="text-sm font-semibold">
                        {tutor.isAvailable ? 'Available' : 'Unavailable'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tutor.isAvailable ? 'Accepting bookings' : 'Not accepting'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={tutor.isAvailable}
                    onCheckedChange={handleToggleAvailability}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Sessions</p>
                <p className="text-2xl font-bold">{tutor.totalSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
                <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Average Rating</p>
                <p className="text-2xl font-bold">
                  {tutor.averageRating ? Number(tutor.averageRating).toFixed(1) : 'N/A'}
                  {tutor.averageRating && <span className="text-sm text-muted-foreground ml-1">/ 5</span>}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Reviews</p>
                <p className="text-2xl font-bold">{tutor.totalReviews}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Hourly Rate</p>
                <p className="text-2xl font-bold">{formatCurrency(tutor.hourlyRate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Your professional details visible to students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Professional Title *
                  </Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="title" 
                      {...register('title')} 
                      placeholder="e.g., Mathematics Expert, English Language Tutor"
                      className="pl-10"
                    />
                  </div>
                  {errors.title && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headline" className="text-sm font-medium">
                    Headline
                  </Label>
                  <Input 
                    id="headline" 
                    {...register('headline')} 
                    placeholder="A brief, catchy introduction"
                    maxLength={200}
                  />
                  {errors.headline && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.headline.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Max 200 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    About You *
                  </Label>
                  <Textarea 
                    id="description" 
                    {...register('description')} 
                    rows={8}
                    placeholder="Describe your teaching style, experience, and what makes you a great tutor..."
                    maxLength={2000}
                    className="resize-none"
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.description.message}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Describe your teaching philosophy and expertise
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className={descriptionLength > 1900 ? 'text-orange-600 font-medium' : ''}>
                        {descriptionLength}
                      </span> / 2000
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Details */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Professional Details
                </CardTitle>
                <CardDescription>
                  Your qualifications and expertise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate" className="text-sm font-medium">
                      Hourly Rate ($) *
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="hourlyRate" 
                        type="number" 
                        {...register('hourlyRate', { valueAsNumber: true })} 
                        placeholder="50"
                        min="1"
                        max="1000"
                        className="pl-10"
                      />
                    </div>
                    {errors.hourlyRate && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        {errors.hourlyRate.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-medium">
                      Years of Experience
                    </Label>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="experience" 
                        type="number" 
                        {...register('experience', { valueAsNumber: true })} 
                        placeholder="5"
                        min="0"
                        max="50"
                        className="pl-10"
                      />
                    </div>
                    {errors.experience && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        {errors.experience.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education" className="text-sm font-medium">
                    Education & Qualifications
                  </Label>
                  <Textarea 
                    id="education" 
                    {...register('education')} 
                    rows={4}
                    placeholder="e.g., PhD in Mathematics from MIT, M.Ed. in Education from Harvard"
                    maxLength={500}
                    className="resize-none"
                  />
                  {errors.education && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.education.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    List your degrees, certifications, and relevant qualifications
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Teaching Subjects */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Teaching Subjects
                </CardTitle>
                <CardDescription>
                  Select the subjects you can teach (at least one required)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <Badge
                        key={category.id}
                        variant={selectedCategories.includes(category.id) ? 'default' : 'outline'}
                        className="cursor-pointer text-sm px-4 py-2 hover:scale-105 transition-transform"
                        onClick={() => toggleCategory(category.id)}
                      >
                        {selectedCategories.includes(category.id) && (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        )}
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No categories available</p>
                  </div>
                )}
                {errors.categoryIds && (
                  <p className="text-sm text-destructive mt-3 flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {errors.categoryIds.message}
                  </p>
                )}
                {selectedCategories.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-3">
                    <CheckCircle2 className="h-3 w-3 inline mr-1 text-green-600" />
                    {selectedCategories.length} {selectedCategories.length === 1 ? 'subject' : 'subjects'} selected
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Profile Status */}
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Profile Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Verification</span>
                  <Badge variant={tutor.isVerified ? 'default' : 'secondary'}>
                    {tutor.isVerified ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Pending
                      </>
                    )}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Availability</span>
                  <Badge variant={tutor.isAvailable ? 'default' : 'secondary'} className={tutor.isAvailable ? 'bg-green-600' : ''}>
                    {tutor.isAvailable ? 'Open' : 'Closed'}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      {tutor.title ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={tutor.title ? 'text-foreground' : 'text-muted-foreground'}>
                        Professional title
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {tutor.description ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={tutor.description ? 'text-foreground' : 'text-muted-foreground'}>
                        About section
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {tutor.education ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={tutor.education ? 'text-foreground' : 'text-muted-foreground'}>
                        Education details
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {tutor.categories && tutor.categories.length > 0 ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={tutor.categories && tutor.categories.length > 0 ? 'text-foreground' : 'text-muted-foreground'}>
                        Teaching subjects
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => router.push('/tutor/availability')}
                  type="button"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Availability
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => router.push('/tutor/bookings')}
                  type="button"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Bookings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  type="button"
                >
                  <Star className="h-4 w-4 mr-2" />
                  View Reviews
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Actions */}
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {isDirty ? (
                  <>
                    <AlertCircle className="h-4 w-4 inline mr-1 text-orange-600" />
                    You have unsaved changes
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 inline mr-1 text-green-600" />
                    All changes saved
                  </>
                )}
              </p>
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => window.location.reload()}
                  disabled={updateProfile.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateProfile.isPending || !isDirty}
                  size="lg"
                >
                  {updateProfile.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}