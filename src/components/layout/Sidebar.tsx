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
  Home,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppSession } from '@/types';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Sidebar() {
  const { data: sessionData } = useSession();
  const session = sessionData as AppSession | null;
  const pathname = usePathname();
  const role = session?.user?.role;
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: any }) => {
    const isActive = pathname === href;
    
    const linkContent = (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-4 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "hover:bg-accent text-muted-foreground hover:text-foreground",
          isCollapsed && "justify-center px-3"
        )}
      >
        {isActive && !isCollapsed && (
          <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
        )}
        <Icon className={cn(
          "h-5 w-5 flex-shrink-0",
          isActive ? "text-primary" : "group-hover:scale-110 transition-transform"
        )} />
        {!isCollapsed && (
          <span className="text-sm">{label}</span>
        )}
      </Link>
    );

    if (isCollapsed) {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              {linkContent}
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              {label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return linkContent;
  };

  return (
    <aside 
      className={cn(
        "border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col h-screen transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className={cn(
        "p-4 border-b flex items-center",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">TutorPlatform</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "h-8 w-8 hover:bg-accent",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* User Section */}
      {session && (
        <div className={cn(
          "p-4 border-b",
          isCollapsed && "px-2"
        )}>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn(
                  "flex items-center gap-3 cursor-pointer hover:bg-accent rounded-lg p-2 transition-colors",
                  isCollapsed && "justify-center p-2"
                )}>
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary-foreground">
                      {session.user.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {role?.toLowerCase()}
                      </p>
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <div>
                    <p className="font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {role?.toLowerCase()}
                    </p>
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(link => (
          <NavLink key={link.href} {...link} />
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                  isCollapsed ? "justify-center px-0" : "justify-start"
                )}
                onClick={handleSignOut}
              >
                <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                {!isCollapsed && "Logout"}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Logout
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}