import { Suspense } from 'react';
import AuthPage from '@/components/auth/AuthPage';

export default function Auth() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    }>
      <AuthPage />
    </Suspense>
  );
}
