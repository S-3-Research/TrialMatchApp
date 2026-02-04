"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { IntakeFormEdit } from "@/components/IntakeFormEdit";
import type { IntakeData } from "@/lib/types/intake";
import { INTAKE_STORAGE_KEY } from "@/lib/types/intake";

export default function SettingsPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [intakeData, setIntakeData] = useState<IntakeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const loadIntakeData = async () => {
      try {
        // Check localStorage first
        const stored = localStorage.getItem(INTAKE_STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored) as IntakeData;
          setIntakeData(data);
          setIsLoading(false);
          return;
        }

        // For signed-in users, check Supabase
        if (isSignedIn) {
          const response = await fetch("/api/tools", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              toolName: "get_user_profile",
              params: {},
            }),
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data?.intake_completed_at) {
              const data: IntakeData = {
                role: result.data.intake_role,
                response_style: result.data.intake_response_style,
                intent: result.data.intake_intent,
                completed_at: result.data.intake_completed_at,
              };
              setIntakeData(data);
            }
          }
        }
      } catch (error) {
        console.error("[Settings] Error loading intake data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadIntakeData();
  }, [isLoaded, isSignedIn]);

  const handleSave = async (data: IntakeData) => {
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(data));

      // For signed-in users, also save to Supabase
      if (isSignedIn) {
        const response = await fetch("/api/migrate-intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: data.role,
            response_style: data.response_style,
            intent: data.intent,
          }),
        });

        const result = await response.json();
        if (!result.success) {
          console.error("[Settings] Failed to save to Supabase:", result.error);
        }
      }

      // Dispatch event to notify App.tsx to reset session
      window.dispatchEvent(new CustomEvent('intake-preferences-updated'));
      
      // Redirect to chat
      router.push("/chat");
    } catch (error) {
      console.error("[Settings] Error saving preferences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/chat");
  };

  if (!isLoaded || isLoading) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="text-gray-500 dark:text-gray-400">Loading preferences...</div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center bg-slate-100 dark:bg-slate-950 py-12">
      <div className="w-full max-w-2xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Preferences
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isSignedIn 
              ? "Update your chat preferences. Changes will apply to new conversations."
              : "Update your chat preferences. Sign in to save them across devices."}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6">
          {intakeData ? (
            <IntakeFormEdit
              initialData={intakeData}
              onSave={handleSave}
              onCancel={handleCancel}
              isSaving={isSaving}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No preferences found. Complete the intake form to get started.
              </p>
              <button
                onClick={() => router.push("/chat")}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
              >
                Go to Chat
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
