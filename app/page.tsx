'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
            background: rgba(255, 255, 255, 0.03); 
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08); 
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card:hover {
            background: rgba(255, 255, 255, 0.07);
            border-color: rgba(56, 189, 248, 0.3);
            transform: translateY(-4px);
            box-shadow: 0 0 30px rgba(56, 189, 248, 0.05);
        }
        
        .bg-grid {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }
      `}} />

      <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-black relative overflow-hidden font-sans">
        {/* Backgrounds */}
        <div className="absolute inset-0 bg-grid pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-900/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute -bottom-1/2 left-0 right-0 h-[600px] bg-gradient-to-t from-purple-900/10 via-transparent to-transparent pointer-events-none w-full blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <Image
                src="/logo_white.png"
                alt="S-3 Logo"
                width={144}
                height={144}
                className="object-contain"
                priority
              />
              {/* <h1 className="text-3xl md:text-4xl font-bold text-white">Demos</h1> */}
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
                    <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/10 backdrop-blur-sm rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                      <span className="text-xs font-mono font-medium text-emerald-400 tracking-wider">UNLOCKED</span>
                    </div>
                  )}

                  {/* Demo Icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-blue-500/30 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-slate-400 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                  </div>

                  {/* Demo Info */}
                  <h3 className="text-xl font-medium text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {demo.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed font-light">
                    {demo.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-500 group-hover:text-blue-400 transition-colors border-t border-white/5 pt-4 mt-auto">
                    <span className="tracking-wider">{isUnlocked ? 'ACCESS TERMINAL' : 'VIEW MODULE'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="mt-16 text-center">
            <p className="text-slate-600 text-xs font-mono tracking-widest uppercase">
              <span className="mr-2 opacity-50">🔒</span>
              Secured Access Area
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
