'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from "@/components/Header";
import DemoPasswordModal from '@/components/DemoPasswordModal';
import { isDemoUnlockedClient } from '@/lib/demoAuth';

export default function TrialChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if demo is unlocked on client side
    const checkUnlocked = () => {
      const unlocked = isDemoUnlockedClient('trial-chat');
      setIsUnlocked(unlocked);
    };
    
    checkUnlocked();
  }, []);

  const handleSuccess = () => {
    setIsUnlocked(true);
  };

  const handleCancel = () => {
    router.push('/');
  };

  // Show loading state while checking
  if (isUnlocked === null) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  // Show password modal if not unlocked
  if (isUnlocked === false) {
    return (
      <DemoPasswordModal
        demoId="trial-chat"
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Cinematic Background - Light Mode */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-200 via-slate-100 to-white opacity-100 dark:opacity-0 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Cinematic Background - Dark Mode (Matches Homepage Texture) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 opacity-0 dark:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Shared Noise Texture */}
      <div className="absolute inset-0 top-0 left-0 w-full h-full bg-noise opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0 mix-blend-overlay"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full max-w-7xl mx-auto w-full">
        <Header />
        <main className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
            {children}
        </main>
      </div>
    </div>
  );
}
