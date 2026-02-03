// import { useSession } from '@/lib/auth-client';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import { Loader2 } from 'lucide-react';
import type { UserRole } from '@/types';
import { userService } from '@/services/userSeason';
import { NextRequest, NextResponse } from "next/server";
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireProfile?: boolean;
}

export default  async function ProtectedRoute(  request: NextRequest,
  response: NextResponse,{
  children,
  requiredRole,
  requireProfile = false
}: ProtectedRouteProps) {
   const { data: session} = await userService.getSession();
  console.log('Session data:', session);
  // const router = useRouter();
  // Add debugging

    if (!session) {
      console.log('No session found, redirecting to login');
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check role requirements
    if (session) {
     return NextResponse.redirect(new URL("/dashboard", request.url));
    }


//  [session, isPending, requiredRole, router]
  // if (isPending) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <Loader2 className="h-8 w-8 animate-spin text-primary" />
  //     </div>
  //   );
  // }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
