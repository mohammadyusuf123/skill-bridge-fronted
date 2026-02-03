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
  const { data: session, isPending } = useSession();
  console.log('Session in ProtectedRoute:', session);
  const router = useRouter();
  // Add debugging
  useEffect(() => {
    console.log('Session state:', { session, isPending  });
  }, [session, isPending]);

  useEffect(() => {
    if (isPending) return; // Wait for loading to finish

    if (!session) {
      console.log('No session found, redirecting to login');
      router.push('/login');
      return;
    }

    // Check role requirements
    if (requiredRole && (session as any).role !== requiredRole) {
      const redirectMap: Record<UserRole, string> = {
        STUDENT: '/dashboard',
        TUTOR: '/tutor/dashboard',
        ADMIN: '/admin',
      };
      router.push(redirectMap[(session as any).role as UserRole] || '/');
    }
  }, [session, isPending, requiredRole, router]);

//  [session, isPending, requiredRole, router]
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
