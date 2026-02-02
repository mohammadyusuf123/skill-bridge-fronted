'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
const role = (session?.user as any)?.role;
  useEffect(() => {
    if (isPending) return;

    // 🔐 Not logged in
    if (!session) {
      router.replace('/login');
      return;
    }

   

    // 🔐 Role-based protection
    if (requiredRole && role !== requiredRole) {
      const redirectMap: Record<UserRole, string> = {
        STUDENT: '/dashboard',
        TUTOR: '/tutor/dashboard',
        ADMIN: '/admin',
      };

      const redirectPath = redirectMap[role as UserRole] || '/login';
      router.replace(redirectPath);
    }
  }, [session, isPending, requiredRole, router]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
}
