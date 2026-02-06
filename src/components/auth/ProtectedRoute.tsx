// components/protected-route.tsx - CORRECTED
'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireProfile?: boolean;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requireProfile = false
}: ProtectedRouteProps) {
  const { data: session , isPending } = useSession();
  const router = useRouter();

  // ✅ CORRECT: User is directly on session object
  const user = session?.user;

  useEffect(() => {
    // Debug log
    console.log('ProtectedRoute debug:', {
      session,
      hasUser: !!user,
      userRole: user?.role,
      isPending
    });

    // Only redirect to login if we're done loading AND there's no user
    if (!isPending && !user) {
      console.log('No user found, redirecting to login');
      router.push('/login');
      return;
    }

    // Only check role requirements if we have a user
    if (!isPending && user && requiredRole && user.role !== requiredRole) {
      console.log(`Role mismatch: User is ${user.role}, required ${requiredRole}`);
      
      // Redirect based on user role
      const redirectMap: Record<UserRole, string> = {
        STUDENT: '/dashboard',
        TUTOR: '/tutor/dashboard',
        ADMIN: '/admin',
      };
      
      const redirectTo = redirectMap[user.role as UserRole] || '/';
      console.log(`Redirecting to: ${redirectTo}`);
      router.push(redirectTo);
    }
  }, [user, user?.role, isPending, requiredRole, router]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute: No user, rendering null');
    return null;
  }

  console.log('ProtectedRoute: User authenticated, rendering children');
  return <>{children}</>;
}