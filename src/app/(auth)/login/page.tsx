// app/login/page.tsx - Updated
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      console.log('Attempting sign in...');
      
      // Direct fetch to backend (for debugging)
      const response = await fetch(
        'https://skill-bridge-backend-production-27ac.up.railway.app/api/auth/signin/email',
        {
          method: 'POST',
          credentials: 'include', // CRITICAL
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://skill-bridge-fronted-production.up.railway.app'
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            callbackURL: 'https://skill-bridge-fronted-production.up.railway.app/season'
          })
        }
      );
      
      console.log('Sign-in response status:', response.status);
      console.log('Sign-in response headers:', response.headers);
      
      const result = await response.json();
      console.log('Sign-in result:', result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Sign in failed');
      }
      
      toast.success('Login successful!');
      
      // Wait a moment for cookies to be set
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Test if session cookie was set
      const sessionResponse = await fetch(
        'https://skill-bridge-backend-production-27ac.up.railway.app/api/auth/session',
        {
          credentials: 'include',
          headers: {
            'Origin': 'https://skill-bridge-fronted-production.up.railway.app'
          }
        }
      );
      
      console.log('Session check after login:', sessionResponse.status);
      
      // Force redirect (bypass Next.js router)
      window.location.href = '/season';
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
          
          {/* Debug button */}
          <button 
            onClick={async () => {
              const res = await fetch(
                'https://skill-bridge-backend-production-27ac.up.railway.app/api/cookie-debug',
                { credentials: 'include' }
              );
              console.log('Debug:', await res.json());
            }}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Test Cookie Connection
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}