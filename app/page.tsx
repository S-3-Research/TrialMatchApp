'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DEMOS, isDemoUnlockedClient, type DemoId } from '@/lib/demoAuth';

export default function DemoHomePage() {
  const [unlockedDemos, setUnlockedDemos] = useState<Set<DemoId>>(new Set());

  useEffect(() => {
    // Check which demos are unlocked
    const unlocked = new Set<DemoId>();
    Object.keys(DEMOS).forEach((demoId) => {
      if (isDemoUnlockedClient(demoId as DemoId)) {
        unlocked.add(demoId as DemoId);
      }
    });
    setUnlockedDemos(unlocked);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .glass-card {
            background: rgba(15, 23, 42, 0.4); 
            backdrop-filter: blur(12px);
            border: 1px solid rgba(148, 163, 184, 0.1); 
            transition: all 0.3s ease;
        }

        .glass-card:hover {
            background: rgba(30, 41, 59, 0.6);
            border-color: rgba(148, 163, 184, 0.3);
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }
        
        .bg-noise {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }
      `}} />

      <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-slate-950 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
        <div className="absolute inset-0 bg-noise opacity-30 mix-blend-soft-light pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl shadow-lg border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-slate-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">S-3 Demos</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Explore our AI-powered solutions
            </p>
          </div>

          {/* Demo Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {Object.values(DEMOS).map((demo) => {
              const isUnlocked = unlockedDemos.has(demo.id);
              
              return (
                <Link
                  key={demo.id}
                  href={demo.path}
                  className="glass-card rounded-2xl p-6 md:p-8 group relative overflow-hidden"
                >
                  {/* Lock Icon Overlay */}
                  {!isUnlocked && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-slate-700/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                  )}

                  {/* Unlocked Badge */}
                  {isUnlocked && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-500/30">
                      <span className="text-xs font-medium text-green-400">Unlocked</span>
                    </div>
                  )}

                  {/* Demo Icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                  </div>

                  {/* Demo Info */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {demo.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {demo.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
                    <span>{isUnlocked ? 'Enter Demo' : 'View Demo'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm">
              🔒 Each demo is password protected. Contact your administrator for access credentials.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
