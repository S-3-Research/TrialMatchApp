import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      <div className="mx-auto max-w-5xl px-6 py-12 text-center">
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <svg
              className="h-12 w-12 text-white"
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
        </div>

        {/* Heading */}
        <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-5xl font-bold text-transparent dark:from-blue-400 dark:to-indigo-400 sm:text-6xl">
          TrialChat
        </h1>
        <p className="mb-3 text-xl font-medium text-slate-700 dark:text-slate-200">
          Your AI-Powered Clinical Trial Navigator
        </p>
        <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          Empowering older adults and caregivers to participate in Alzheimer&apos;s
          disease and related dementias (ADRD) clinical trials through
          personalized education, trial matching, and simplified enrollment.
        </p>

        {/* Features Grid */}
        <div className="mb-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg dark:bg-slate-800/50">
            <div className="mb-3 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <svg
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
              Personalized Education
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Learn about ADRD clinical trials tailored to your unique situation
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg dark:bg-slate-800/50">
            <div className="mb-3 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                <svg
                  className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
              Smart Trial Matching
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Find clinical trials that match your specific needs and location
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg dark:bg-slate-800/50">
            <div className="mb-3 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <svg
                  className="h-6 w-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
              Simplified Enrollment
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Receive step-by-step guidance through the enrollment process
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <SignedIn>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              Start Your Journey
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50">
                Get Started
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Trust Badge */}
        <div className="mt-16 rounded-2xl bg-blue-50/50 p-6 dark:bg-slate-800/30">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            <span className="text-blue-600 dark:text-blue-400">✓</span> HIPAA
            Compliant &nbsp;•&nbsp;{" "}
            <span className="text-blue-600 dark:text-blue-400">✓</span> Secure &
            Private &nbsp;•&nbsp;{" "}
            <span className="text-blue-600 dark:text-blue-400">✓</span> Expert
            Guidance
          </p>
        </div>

        {/* Footer Credit */}
        <div className="mt-8 text-sm text-slate-500 dark:text-slate-400">
          Developed by Cal State Fullerton and S-3 Research LLC
          {" • "}
          <Link
            href="/updates"
            className="text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Updates
          </Link>
        </div>
      </div>
    </main>
  );
}
