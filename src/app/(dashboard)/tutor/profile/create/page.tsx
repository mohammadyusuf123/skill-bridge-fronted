'use client';

import { useCreateTutorProfile, useCategories } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTutorProfileSchema, CreateTutorProfileFormData } from '@/lib/validations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Loader2, 
  GraduationCap, 
  Briefcase, 
  FileText,
  DollarSign,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export default function CreateTutorProfilePage() {
  const router = useRouter();
  const { data: categoriesData } = useCategories();
  const createProfile = useCreateTutorProfile();
  const categories = categoriesData?.data || [];

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CreateTutorProfileFormData>({
    resolver: zodResolver(createTutorProfileSchema),
    defaultValues: {
      title: '',
      headline: '',
      description: '',
      hourlyRate: 25,
      experience: 0,
      education: '',
      categoryIds: [],
    },
  });

  const watchAllFields = watch();
  const selectedCategories = watch('categoryIds') || [];
  const descriptionLength = watch('description')?.length || 0;

  // Calculate progress
  const calculateProgress = () => {
    let completed = 0;
    if (watchAllFields.title) completed += 20;
    if (watchAllFields.description && watchAllFields.description.length > 50) completed += 20;
    if (watchAllFields.hourlyRate && watchAllFields.hourlyRate > 0) completed += 15;
    if (watchAllFields.experience !== undefined && watchAllFields.experience >= 0) completed += 15;
    if (watchAllFields.education) completed += 15;
    if (selectedCategories.length > 0) completed += 15;
    return completed;
  };

  const progress = calculateProgress();

  const onSubmit = (formData: CreateTutorProfileFormData) => {
    createProfile.mutate(formData, {
      onSuccess: () => {
        router.push('/tutor/profile');
      },
    });
  };

  const toggleCategory = (categoryId: string) => {
    const current = selectedCategories;
    if (current.includes(categoryId)) {
      setValue('categoryIds', current.filter(id => id !== categoryId), { shouldValidate: true });
    } else {
      setValue('categoryIds', [...current, categoryId], { shouldValidate: true });
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['title', 'headline', 'description'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['hourlyRate', 'experience', 'education'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['categoryIds'];
    }

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto space-y-6 py-8 px-4">
        {/* Hero Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 mb-4">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Become a Tutor</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your knowledge and inspire students. Let's create your professional tutor profile.
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Profile Completion</p>
                  <p className="text-xs text-muted-foreground">Step {currentStep} of {totalSteps}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{progress}%</p>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className={currentStep >= 1 ? 'text-primary font-medium' : ''}>Basic Info</span>
                <span className={currentStep >= 2 ? 'text-primary font-medium' : ''}>Professional</span>
                <span className={currentStep >= 3 ? 'text-primary font-medium' : ''}>Subjects</span>
                <span className={currentStep >= 4 ? 'text-primary font-medium' : ''}>Review</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Welcome Alert */}
        {currentStep === 1 && (
          <Alert className="border-primary/50 bg-primary/5">
            <Sparkles className="h-4 w-4 text-primary" />
            <AlertTitle>Welcome to the tutor community! 🎉</AlertTitle>
            <AlertDescription>
              Fill out your profile to start accepting students. The more detailed your profile, the more students you'll attract.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Tell students who you are and what makes you special
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
                      placeholder="e.g., Expert Mathematics Tutor, Certified English Teacher"
                      className="pl-10"
                    />
                  </div>
                  {errors.title && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.title.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    This appears as your main heading on your profile
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headline" className="text-sm font-medium">
                    Catchy Headline
                  </Label>
                  <Input 
                    id="headline" 
                    {...register('headline')} 
                    placeholder="e.g., Making math fun and accessible for everyone!"
                    maxLength={200}
                  />
                  {errors.headline && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.headline.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    A short, memorable tagline (max 200 characters)
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
                    placeholder="Share your teaching philosophy, experience, and what makes your tutoring approach unique. Tell students why they should choose you..."
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
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Describe your teaching style and what sets you apart
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className={descriptionLength > 1900 ? 'text-orange-600 font-medium' : ''}>
                        {descriptionLength}
                      </span> / 2000
                    </p>
                  </div>
                </div>

                <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>Pro tip:</strong> Students love to know about your teaching methods, success stories, and what makes learning with you special. Be authentic!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Professional Details */}
          {currentStep === 2 && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Professional Details
                </CardTitle>
                <CardDescription>
                  Share your qualifications and set your rate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate" className="text-sm font-medium">
                      Hourly Rate (USD) *
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="hourlyRate" 
                        type="number" 
                        {...register('hourlyRate', { valueAsNumber: true })} 
                        placeholder="25"
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
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Average tutor rate: $30-50/hour
                    </p>
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
                    rows={5}
                    placeholder="e.g., 
- PhD in Mathematics, MIT (2018)
- M.Ed. in Education, Harvard (2015)
- Certified Mathematics Teacher
- Published researcher in education"
                    maxLength={500}
                    className="resize-none font-mono text-sm"
                  />
                  {errors.education && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {errors.education.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    List your degrees, certifications, and relevant achievements
                  </p>
                </div>

                <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                  <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-sm text-amber-900 dark:text-amber-100">
                    <strong>Pricing tip:</strong> Start with a competitive rate. You can always adjust it later based on demand and your experience on the platform.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Teaching Subjects */}
          {currentStep === 3 && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Teaching Subjects
                </CardTitle>
                <CardDescription>
                  Select all subjects you can teach (at least one required)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {categories.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map(category => (
                        <div
                          key={category.id}
                          onClick={() => toggleCategory(category.id)}
                          className={`
                            relative p-4 rounded-lg border-2 cursor-pointer transition-all
                            ${selectedCategories.includes(category.id)
                              ? 'border-primary bg-primary/5 shadow-md scale-105'
                              : 'border-border hover:border-primary/50 hover:bg-accent'
                            }
                          `}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`
                              h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                              ${selectedCategories.includes(category.id)
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground'
                              }
                            `}>
                              {selectedCategories.includes(category.id) && (
                                <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{category.name}</p>
                              {category.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {category.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedCategories.length > 0 && (
                      <div className="p-4 bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center gap-2 text-green-900 dark:text-green-100">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <p className="font-medium">
                            {selectedCategories.length} {selectedCategories.length === 1 ? 'subject' : 'subjects'} selected
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">No subjects available</p>
                    <p className="text-sm">Please contact support</p>
                  </div>
                )}

                {errors.categoryIds && (
                  <Alert className="border-destructive/50 bg-destructive/5">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-destructive">
                      {errors.categoryIds.message}
                    </AlertDescription>
                  </Alert>
                )}

                <Alert className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
                  <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <AlertDescription className="text-sm text-purple-900 dark:text-purple-100">
                    <strong>Selection tip:</strong> Choose subjects you're confident teaching. You can always add more subjects later as you expand your expertise!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Review Your Profile
                  </CardTitle>
                  <CardDescription>
                    Double-check your information before submitting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info Preview */}
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-3">BASIC INFORMATION</h3>
                    <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                      <div>
                        <p className="text-xs text-muted-foreground">Professional Title</p>
                        <p className="font-medium">{watchAllFields.title || <span className="text-muted-foreground italic">Not set</span>}</p>
                      </div>
                      {watchAllFields.headline && (
                        <div>
                          <p className="text-xs text-muted-foreground">Headline</p>
                          <p className="text-sm">{watchAllFields.headline}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground">About</p>
                        <p className="text-sm line-clamp-3">{watchAllFields.description || <span className="text-muted-foreground italic">Not set</span>}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Professional Details Preview */}
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-3">PROFESSIONAL DETAILS</h3>
                    <div className="grid gap-4 md:grid-cols-3 pl-4 border-l-2 border-primary/20">
                      <div>
                        <p className="text-xs text-muted-foreground">Hourly Rate</p>
                        <p className="text-lg font-bold text-primary">${watchAllFields.hourlyRate || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Experience</p>
                        <p className="font-medium">{watchAllFields.experience || 0} years</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Education</p>
                        <p className="text-sm line-clamp-2">{watchAllFields.education || <span className="text-muted-foreground italic">Not set</span>}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Subjects Preview */}
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-3">TEACHING SUBJECTS</h3>
                    <div className="pl-4 border-l-2 border-primary/20">
                      {selectedCategories.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedCategories.map(catId => {
                            const category = categories.find(c => c.id === catId);
                            return category ? (
                              <Badge key={catId} variant="default" className="px-3 py-1">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                {category.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        <p className="text-muted-foreground italic">No subjects selected</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {progress === 100 && (
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-900 dark:text-green-100">Profile Complete! 🎉</AlertTitle>
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Your profile is 100% complete and ready to go live. Students can start booking sessions with you!
                  </AlertDescription>
                </Alert>
              )}

              {progress < 100 && (
                <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950">
                  <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <AlertTitle className="text-amber-900 dark:text-amber-100">Almost There!</AlertTitle>
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    Your profile is {progress}% complete. Consider filling out all fields for better visibility!
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1 || createProfile.isPending}
                >
                  Previous
                </Button>

                <div className="flex gap-3">
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                    >
                      Next Step
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={createProfile.isPending}
                      size="lg"
                      className="min-w-[200px]"
                    >
                      {createProfile.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creating Profile...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Create Profile
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}