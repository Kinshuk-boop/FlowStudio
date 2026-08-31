'use client';

import DotGridBackground from '@/components/canvas/DotGridBackground';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <DotGridBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
