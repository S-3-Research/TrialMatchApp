"use client";

import { useState } from "react";
import { useFontSize } from "@/contexts/FontSizeContext";

export default function FontSizeSelector() {
  const { fontSize, setFontSize } = useFontSize();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleFontSizeChange = (size: "small" | "medium" | "large") => {
    setFontSize(size);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        aria-label="Font size"
      >
        <svg
          className="h-4 w-4"
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
        <span className="hidden sm:inline">
          {fontSize === "small" ? "A" : fontSize === "large" ? "A" : "A"}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-0 z-[101] mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <div className="p-2">
              <div className="mb-2 px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                Font Size
              </div>
              <button
                onClick={() => handleFontSizeChange("small")}
                className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm transition hover:bg-slate-100 dark:hover:bg-slate-700 ${
                  fontSize === "small"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                <span>Small</span>
                <span className="text-xs">A</span>
              </button>
              <button
                onClick={() => handleFontSizeChange("medium")}
                className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-base transition hover:bg-slate-100 dark:hover:bg-slate-700 ${
                  fontSize === "medium"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                <span>Medium</span>
                <span className="text-sm">A</span>
              </button>
              <button
                onClick={() => handleFontSizeChange("large")}
                className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-lg transition hover:bg-slate-100 dark:hover:bg-slate-700 ${
                  fontSize === "large"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                <span>Large</span>
                <span className="text-base">A</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
