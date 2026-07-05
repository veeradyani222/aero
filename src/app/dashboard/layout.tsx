'use client'
import React, { useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): React.ReactElement {
  const { user, userProfile, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && user == null) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-lg">Loading...</div>
      </div>
    );
  }

  // If user is not authenticated, show loading while redirecting
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-lg">Redirecting to sign in...</div>
      </div>
    );
  }

  // If user is authenticated, render the children
  return <>{children}</>;
} 


