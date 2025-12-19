"use client";

import { useCallback, useState } from "react";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import { useColorScheme } from "@/hooks/useColorScheme";
import ResourcePanel from "@/components/ResourcePanel";

export default function App() {
  const { scheme, setScheme } = useColorScheme();
  const [isResourcePanelOpen, setIsResourcePanelOpen] = useState(false);

  const handleWidgetAction = useCallback(async (action: FactAction) => {
    if (process.env.NODE_ENV !== "production") {
      console.info("[ChatKitPanel] widget action", action);
    }
  }, []);

  const handleResponseEnd = useCallback(() => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[ChatKitPanel] response end");
    }
  }, []);

  return (
    <main className="flex flex-1 flex-col items-center justify-end bg-slate-100 dark:bg-slate-950">
      {/* Toggle Button - Fixed to top right */}
      <button
        onClick={() => setIsResourcePanelOpen(!isResourcePanelOpen)}
        className="fixed right-6 top-20 z-50 rounded-full bg-white/90 p-2.5 text-slate-700 shadow-lg ring-1 ring-black/5 backdrop-blur-sm transition hover:bg-white hover:shadow-xl dark:bg-slate-800/90 dark:text-slate-300 dark:ring-white/10 dark:hover:bg-slate-800"
        aria-label={isResourcePanelOpen ? "Hide resources" : "Show resources"}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isResourcePanelOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          )}
        </svg>
      </button>

      <div className="mx-auto w-full max-w-7xl">
        {/* Panels Container */}
        <div className="flex gap-4">
            <div className="flex-1">
              <ChatKitPanel
                theme={scheme}
                onWidgetAction={handleWidgetAction}
                onResponseEnd={handleResponseEnd}
                onThemeRequest={setScheme}
                onOpenResourcePanel={() => setIsResourcePanelOpen(true)}
              />
            </div>

            {isResourcePanelOpen && (
              <div className="flex-1 transition-all duration-300">
                <ResourcePanel
                  isOpen={isResourcePanelOpen}
                  onClose={() => setIsResourcePanelOpen(false)}
                />
              </div>
            )}
          </div>
      </div>
    </main>
  );
}
