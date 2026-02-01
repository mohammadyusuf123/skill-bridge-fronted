'use client';

import { useCreateTutorProfile, useCategories } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTutorProfileSchema } from '@/lib/validations';
import type { CreateTutorProfileFormData } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, GraduationCap } from 'lucide-react';

export default function CreateTutorProfilePage() {
  const router = useRouter();
  const createProfile = useCreateTutorProfile();
  const { data: categoriesData } = useCategories();
  console.log('Categories Data:', categoriesData);
  const categories = categoriesData?.data || [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateTutorProfileFormData>({
    resolver: zodResolver(createTutorProfileSchema),
    defaultValues: {
      title: '',
      headline: '',
      description: '',
      hourlyRate: 50,
      experience: 0,
      education: '',
      categoryIds: [],
    },
  });

  const selectedCategories = watch('categoryIds') || [];

  const toggleCategory = (categoryId: string) => {
    const current = selectedCategories;
    if (current.includes(categoryId)) {
      setValue('categoryIds', current.filter(id => id !== categoryId));
    } else {
      setValue('categoryIds', [...current, categoryId]);
    }
  };

  const onSubmit = (data: CreateTutorProfileFormData) => {
    createProfile.mutate(data, {
      onSuccess: () => {
        router.push('/tutor/profile');
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <GraduationCap className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Create Tutor Profile</h1>
          <p className="text-muted-foreground">Fill in your details so students can find you</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title">Professional Title *</Label>
              <Input id="title" {...register('title')} placeholder="e.g. Mathematics Expert" />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" {...register('headline')} placeholder="A short catchy intro" maxLength={200} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">About You</Label>
              <Textarea id="description" {...register('description')} rows={4} placeholder="Describe your teaching style…" maxLength={2000} />
              <p className="text-xs text-muted-foreground">{watch('description')?.length || 0} / 2000</p>
            </div>
          </CardContent>
        </Card>

        {/* Professional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="hourlyRate">Hourly Rate ($) *</Label>
                <Input id="hourlyRate" type="number" {...register('hourlyRate', { valueAsNumber: true })} placeholder="50" min={1} max={1000} />
                {errors.hourlyRate && <p className="text-sm text-destructive">{errors.hourlyRate.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input id="experience" type="number" {...register('experience', { valueAsNumber: true })} placeholder="5" min={0} />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="education">Education</Label>
              <Textarea id="education" {...register('education')} rows={2} placeholder="e.g. PhD in Mathematics from MIT" maxLength={500} />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Teaching Subjects *</CardTitle>
            <CardDescription>Select at least one subject you can teach</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <Badge
                  key={cat.id}
                  variant={selectedCategories.includes(cat.id) ? 'default' : 'outline'}
                  className="cursor-pointer text-sm px-3 py-1"
                  onClick={() => toggleCategory(cat.id)}
                >
                  {cat.name}
                </Badge>
              ))}
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">No categories available yet.</p>
              )}
            </div>
            {errors.categoryIds && <p className="text-sm text-destructive mt-2">{errors.categoryIds.message}</p>}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3 items-center">
          <Button type="submit" disabled={createProfile.isPending}>
            {createProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Profile
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push('/tutor/dashboard')}>Cancel</Button>
        </div>
        {createProfile.error && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200">
            <p className="text-sm text-red-700 font-medium">Failed to create profile</p>
            <p className="text-xs text-red-600 mt-0.5">
              {(createProfile.error as any)?.response?.data?.message ||
               (createProfile.error as any)?.message ||
               'An unknown error occurred. Check the browser console for details.'}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
