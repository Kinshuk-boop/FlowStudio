'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

// Routes that do NOT require authentication
const PUBLIC_ROUTES = ['/', '/auth'];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { _init, user, loading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Start the Firebase auth listener once on mount
  useEffect(() => {
    const unsubscribe = _init();
    return unsubscribe;
  }, [_init]);

  // Route guard: redirect unauthenticated users to /auth
  useEffect(() => {
    if (loading) return;

    const isPublic = PUBLIC_ROUTES.some((route) =>
      route === '/' ? pathname === '/' : pathname.startsWith(route)
    );

    if (!user && !isPublic) {
      router.replace('/auth');
    }

    // If already logged in and landing on /auth, send to dashboard
    if (user && pathname.startsWith('/auth')) {
      router.replace('/dashboard');
    }
  }, [user, loading, pathname, router]);

  // Show a full-screen loader while the auth state resolves on first paint
  if (loading) {
    return (
      <div className="h-screen bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <p className="text-xs text-zinc-500 font-mono tracking-wider">FLOW</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
