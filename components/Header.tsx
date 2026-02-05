"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import FontSizeSelector from "./FontSizeSelector";
import { VoiceInputModeSelector } from "./VoiceInputModeSelector";
import { useColorScheme } from "@/contexts/ColorSchemeContext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { preference, setPreference, scheme } = useColorScheme();

  const handleThemeChange = (newPreference: "light" | "dark" | "system") => {
    setPreference(newPreference);
    setIsOpen(false);
  };

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[95%] max-w-6xl -translate-x-1/2">
      <div className="flex h-14 items-center justify-evenly rounded-full border border-slate-200/50 bg-white/40 backdrop-blur-2xl px-4 shadow-xl dark:border-slate-700/50 dark:bg-slate-800/40">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-70">
          <svg
            className="h-6 w-6 text-slate-900 dark:text-slate-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            TrialChat
          </span>
        </Link>
        
        {/* Home */}
        <Link 
          href="/" 
          className="flex items-center gap-1.5 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Home</span>
        </Link>

        {/* Settings Dropdown */}
        <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenu.Trigger asChild>
            <button
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100/50 dark:text-slate-300 dark:hover:bg-slate-700/50"
              aria-label="Settings"
            >
              <span>Settings</span>
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-[60] w-64 rounded-xl border py-2 shadow-xl border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
              sideOffset={8}
              align="end"
            >
              <div className="px-3 py-2.5">
                <div className="mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">Font Size</div>
                <FontSizeSelector />
              </div>
              
              <DropdownMenu.Separator className="my-1 h-px bg-slate-100 dark:bg-slate-700" />
              
              <div className="px-3 py-2.5">
                <div className="mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">Voice Input</div>
                <VoiceInputModeSelector />
              </div>
              
              <DropdownMenu.Separator className="my-1 h-px bg-slate-100 dark:bg-slate-700" />
              
              <div className="px-3 py-2.5">
                <div className="mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">Theme</div>
                <select
                  value={preference}
                  onChange={(e) => handleThemeChange(e.target.value as "light" | "dark" | "system")}
                  className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700 transition-colors hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500"
                >
                  <option value="light">☀️ Light</option>
                  <option value="dark">🌙 Dark</option>
                  <option value="system">💻 System</option>
                </select>
              </div>
              
              <DropdownMenu.Separator className="my-1 h-px bg-slate-100 dark:bg-slate-700" />
              
              <div className="px-3 py-2.5">
                <div className="mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">Preferences</div>
                <DropdownMenu.Item asChild>
                  <Link
                    href="/settings"
                    className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs text-slate-700 rounded-lg border border-slate-300 bg-white transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer outline-none"
                  >
                    <span>⚙️</span>
                    <span>Edit Chat Preferences</span>
                  </Link>
                </DropdownMenu.Item>
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <SignedOut>
          {/* Sign In */}
          <SignInButton mode="modal">
            <button className="rounded-full px-5 py-1.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100/50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700/50">
              Sign In
            </button>
          </SignInButton>
          
          {/* Get Started */}
          <Link href="/chat">
            <button className="rounded-full bg-slate-900 px-5 py-1.5 text-sm font-medium text-white shadow-md transition-all hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white">
              Get Started
            </button>
          </Link>
        </SignedOut>

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        </SignedIn>
      </div>
    </header>
  );
}
