'use client';

import { useSession, signOut } from '@/lib/auth-client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  BookOpen, 
  User, 
  Calendar,
  Users,
  Settings,
  LogOut,
  GraduationCap,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppSession } from '@/types';

export default function Sidebar() {
   const { data: sessionData  } = useSession();
  const session = sessionData as AppSession | null;
  console.log('Sidebar session:', session);
  const pathname = usePathname();
  const role = session?.user?.role

  const studentLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/find-tutors', label: 'Find Tutors', icon: Users },
    { href: '/bookings', label: 'My Bookings', icon: BookOpen },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  const tutorLinks = [
    { href: '/tutor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tutor/bookings', label: 'Sessions', icon: BookOpen },
    { href: '/tutor/availability', label: 'Availability', icon: Calendar },
    { href: '/tutor/profile', label: 'Profile', icon: GraduationCap },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/bookings', label: 'Bookings', icon: BookOpen },
    { href: '/admin/categories', label: 'Categories', icon: Settings },
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'TUTOR' ? tutorLinks : studentLinks;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <aside className="w-64 border-r bg-muted/40 flex flex-col h-screen">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">TutorPlatform</span>
        </Link>
      </div>

      {session && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {session.user.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{role?.toLowerCase()}</p>
            </div>
          </div>
        </div>
      )}
      
      <nav className="flex-1 p-4 space-y-1">
        {links.map(link => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                pathname === link.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
