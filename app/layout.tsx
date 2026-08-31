import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import AssetPreviewModal from '@/components/assets/AssetPreviewModal';
import AuthProvider from '@/components/auth/AuthProvider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Flow — AI Filmmaking Workspace',
  description: 'Professional AI filmmaking studio for structured prompting, keyframe synthesis, motion generation, and sequence storyboarding.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-[#09090b] text-[#f4f4f5] relative flex flex-col selection:bg-blue-500/25 selection:text-white">
        <AuthProvider>
          {/* Main Application Container */}
          <div className="relative z-10 flex-1 flex flex-col">
            {children}
          </div>

          {/* Global Inspection Modals */}
          <AssetPreviewModal />
        </AuthProvider>
      </body>
    </html>
  );
}
