"use client";

import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import FontSizeSelector from "./FontSizeSelector";

export default function Header() {
  return (
    <header className="relative z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo and Framework Badge */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 transition hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
              <svg
                className="h-5 w-5 text-white"
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
            </div>
            <span className="text-lg font-bold text-slate-800 dark:text-white">
              TrialChat
            </span>
          </Link>
          <span className="hidden text-xs text-slate-400 dark:text-slate-500 sm:inline">
            alternative framework: chatkit + nextjs + clerk + supabase
          </span>
        </div>

        {/* Right: Auth Buttons */}
        <div className="flex items-center gap-3">
          <FontSizeSelector />

          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:from-blue-700 hover:to-indigo-700">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
