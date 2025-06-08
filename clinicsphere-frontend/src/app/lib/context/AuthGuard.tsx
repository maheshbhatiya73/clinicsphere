'use client';
import Loader from '@/app/components/Loader';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, loading, authChecked } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!authChecked || loading) return;

    // Only execute redirection logic after auth is fully checked
    if (!user) {
      // router.replace('/auth');
    } else if (
      allowedRoles &&
      !allowedRoles.includes(user.role.toLowerCase())
    ) {
      const fallbackRoute = `/dashboard/${user.role.toLowerCase()}`;
      if (pathname !== fallbackRoute) {
        router.replace(fallbackRoute);
      }
    }

    setChecked(true);
  }, [authChecked, loading, user, pathname]);

  // Wait until auth is fully validated before rendering anything
  if (!checked || loading || !authChecked) {
    return <Loader />;
  }

  return <>{children}</>;
}
