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
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Camera, 
  Shield, 
  Calendar,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function ProfilePage() {
  const { data, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header Section with Background */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background border">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="relative px-6 py-8 md:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar Section */}
            <div className="relative group">
              <Avatar className="h-28 w-28 border-4 border-background shadow-xl ring-2 ring-primary/20">
                <AvatarImage src={data?.data?.image || ''} />
                <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                  {data?.data?.name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{data?.data?.name}</h1>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {data?.data?.email}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="secondary" 
                  className="capitalize font-medium px-3 py-1"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  {data?.data?.role?.toLowerCase()}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={
                    data?.data?.status === 'ACTIVE' 
                      ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800' 
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }
                >
                  {data?.data?.status === 'ACTIVE' ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : (
                    <XCircle className="h-3 w-3 mr-1" />
                  )}
                  {data?.data?.status}
                </Badge>
                {data?.data?.emailVerified && (
                  <Badge variant="default" className="px-3 py-1">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content - 2 columns */}
        <div className="md:col-span-2 space-y-6">
          {/* Edit Profile Form */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal details and public profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Full Name */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="name" 
                        {...register('name')} 
                        placeholder="Enter your full name"
                        className="pl-10"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="phone" 
                        {...register('phone')} 
                        placeholder="+1 (555) 123-4567"
                        type="tel"
                        className="pl-10"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Profile Image URL */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="image" className="text-sm font-medium">
                      Profile Image URL
                    </Label>
                    <div className="relative">
                      <Camera className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="image" 
                        {...register('image')} 
                        placeholder="https://example.com/image.jpg"
                        type="url"
                        className="pl-10"
                      />
                    </div>
                    {errors.image && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        {errors.image.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Paste a URL to your profile picture
                    </p>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio" className="text-sm font-medium">
                      Bio
                    </Label>
                    <Textarea 
                      id="bio" 
                      {...register('bio')} 
                      rows={4} 
                      placeholder="Tell us a bit about yourself..."
                      className="resize-none"
                    />
                    {errors.bio && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        {errors.bio.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Brief description for your profile (max 500 characters)
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {isDirty ? '• Unsaved changes' : '• All changes saved'}
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
                    >
                      {updateProfile.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Account Information */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Account Details</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Email Address</p>
                    <p className="text-sm text-muted-foreground break-all">
                      {data?.data?.email}
                    </p>
                  </div>
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                </div>

                <Separator />

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Account Role</p>
                    <Badge variant="secondary" className="capitalize">
                      {data?.data?.role?.toLowerCase()}
                    </Badge>
                  </div>
                  <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                </div>

                <Separator />

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Account Status</p>
                    <Badge 
                      variant="outline" 
                      className={
                        data?.data?.status === 'ACTIVE' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : ''
                      }
                    >
                      {data?.data?.status}
                    </Badge>
                  </div>
                  {data?.data?.status === 'ACTIVE' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                  )}
                </div>

                <Separator />

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Email Status</p>
                    <Badge 
                      variant={data?.data?.emailVerified ? 'default' : 'secondary'}
                      className={data?.data?.emailVerified ? 'bg-green-600' : ''}
                    >
                      {data?.data?.emailVerified ? 'Verified' : 'Not Verified'}
                    </Badge>
                  </div>
                  {data?.data?.emailVerified ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Email Preferences
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" size="sm">
                <XCircle className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}