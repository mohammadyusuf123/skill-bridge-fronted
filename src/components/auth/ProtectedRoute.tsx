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
  const router = useRouter();

  useEffect(() => {
    // Only redirect to login if we're done loading AND there's no session
    // if (!isPending && !session) {
    //   router.push('/login');
    //   return;
    // }

    // Only check role requirements if we have a session
    // if (!isPending && session && requiredRole && (session as any).role !== requiredRole) {
    //   // Redirect based on user role
    //   const redirectMap: Record<UserRole, string> = {
    //     STUDENT: '/dashboard',
    //     TUTOR: '/tutor/dashboard',
    //     ADMIN: '/admin',
    //   };
    //   router.push(redirectMap[(session as any).role as UserRole] || '/');
    // }
    router.push('/dashboard');
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
