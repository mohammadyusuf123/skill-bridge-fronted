'use client';

import { useProfile, useUpdateProfile } from '@/hooks/useApi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, UpdateProfileFormData } from '@/lib/validations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Mail, Phone, FileText } from 'lucide-react';

export default function ProfilePage() {
  const { data, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    values: data?.data ? {
      name: data.data.name || '',
      bio: data.data.bio || '',
      phone: data.data.phone || '',
      image: data.data.image || '',
    } : undefined,
  });

  const onSubmit = (formData: UpdateProfileFormData) => {
    updateProfile.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={data?.data?.image || ''} />
              <AvatarFallback className="text-3xl">
                {data?.data?.name?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{data?.data?.name}</h2>
              <p className="text-muted-foreground">{data?.data?.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="capitalize">
                  {data?.data?.role?.toLowerCase()}
                </Badge>
                <Badge variant="outline" className={
                  data?.data?.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : ''
                }>
                  {data?.data?.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input 
                id="name" 
                {...register('name')} 
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input 
                id="phone" 
                {...register('phone')} 
                placeholder="+1 (555) 123-4567"
                type="tel"
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Bio
              </Label>
              <Textarea 
                id="bio" 
                {...register('bio')} 
                rows={4} 
                placeholder="Tell us a bit about yourself..."
              />
              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Brief description for your profile (max 500 characters)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Profile Image URL</Label>
              <Input 
                id="image" 
                {...register('image')} 
                placeholder="https://example.com/image.jpg"
                type="url"
              />
              {errors.image && (
                <p className="text-sm text-destructive">{errors.image.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Enter a URL to your profile picture
              </p>
            </div>

            <div className="flex gap-3 pt-4">
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
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details (read-only)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="font-medium">{data?.data?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">Role</span>
            <Badge variant="secondary" className="capitalize">
              {data?.data?.role?.toLowerCase()}
            </Badge>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">Account Status</span>
            <Badge variant="outline" className={
              data?.data?.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : ''
            }>
              {data?.data?.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Email Verified</span>
            <Badge variant={data?.data?.emailVerified ? 'default' : 'secondary'}>
              {data?.data?.emailVerified ? 'Verified' : 'Not Verified'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
