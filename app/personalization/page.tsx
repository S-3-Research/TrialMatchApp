"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface UserProfile {
  id?: string;
  clerk_user_id?: string;
  full_name?: string;
  email?: string;
  age?: number;
  gender?: string;
  has_adrd?: boolean;
  diagnosis_type?: string;
  diagnosed_date?: string;
  current_medications?: string[];
  is_caregiver?: boolean;
  relationship_to_patient?: string;
  preferred_language?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  mobility_status?: string;
  travel_radius_miles?: number;
}

export default function PersonalizationPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 表单状态
  const [formData, setFormData] = useState<UserProfile>({
    full_name: "",
    email: "",
    age: undefined,
    gender: "",
    has_adrd: false,
    diagnosis_type: "",
    diagnosed_date: "",
    current_medications: [],
    is_caregiver: false,
    relationship_to_patient: "",
    preferred_language: "en",
    location: {},
    mobility_status: "",
    travel_radius_miles: undefined,
  });

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      const data = await response.json();
      
      if (data.profile) {
        setProfile(data.profile);
        setFormData({
          ...data.profile,
          current_medications: data.profile.current_medications || [],
        });
      } else {
        // 用户还没有 profile，使用 Clerk 的数据预填充
        setFormData((prev) => ({
          ...prev,
          full_name: user?.fullName || "",
          email: user?.emailAddresses?.[0]?.emailAddress || "",
        }));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setMessage({ type: "error", text: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.profile);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update profile" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "An error occurred while updating profile" });
    } finally {
      setSaving(false);
    }
  };

  const handleClearProfile = async () => {
    if (!confirm("Are you sure you want to clear all your profile data? This action cannot be undone.")) {
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/profile", {
        method: "DELETE",
      });

      if (response.ok) {
        setProfile(null);
        setFormData({
          full_name: user?.fullName || "",
          email: user?.emailAddresses?.[0]?.emailAddress || "",
          age: undefined,
          gender: "",
          has_adrd: false,
          diagnosis_type: "",
          diagnosed_date: "",
          current_medications: [],
          is_caregiver: false,
          relationship_to_patient: "",
          preferred_language: "en",
          location: {},
          mobility_status: "",
          travel_radius_miles: undefined,
        });
        setMessage({ type: "success", text: "Profile cleared successfully!" });
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.error || "Failed to clear profile" });
      }
    } catch (error) {
      console.error("Error clearing profile:", error);
      setMessage({ type: "error", text: "An error occurred while clearing profile" });
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Personalization
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Manage your personal information and preferences
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-lg p-4 ${
              message.type === "success"
                ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
              Basic Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name || ""}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : undefined })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Gender
                </label>
                <select
                  value={formData.gender || ""}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Health Information */}
          <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
              Health Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.has_adrd || false}
                  onChange={(e) => setFormData({ ...formData, has_adrd: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                  I have been diagnosed with ADRD
                </label>
              </div>

              {formData.has_adrd && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Diagnosis Type
                    </label>
                    <input
                      type="text"
                      value={formData.diagnosis_type || ""}
                      onChange={(e) => setFormData({ ...formData, diagnosis_type: e.target.value })}
                      placeholder="e.g., Alzheimer's, Dementia, MCI"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Diagnosed Date
                    </label>
                    <input
                      type="date"
                      value={formData.diagnosed_date || ""}
                      onChange={(e) => setFormData({ ...formData, diagnosed_date: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_caregiver || false}
                  onChange={(e) => setFormData({ ...formData, is_caregiver: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                  I am a caregiver
                </label>
              </div>

              {formData.is_caregiver && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Relationship to Patient
                  </label>
                  <input
                    type="text"
                    value={formData.relationship_to_patient || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, relationship_to_patient: e.target.value })
                    }
                    placeholder="e.g., Spouse, Child, Friend"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Location & Preferences */}
          <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
              Location & Preferences
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  City
                </label>
                <input
                  type="text"
                  value={formData.location?.city || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, city: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  State
                </label>
                <input
                  type="text"
                  value={formData.location?.state || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, state: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Mobility Status
                </label>
                <select
                  value={formData.mobility_status || ""}
                  onChange={(e) => setFormData({ ...formData, mobility_status: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Select...</option>
                  <option value="mobile">Mobile</option>
                  <option value="limited">Limited</option>
                  <option value="homebound">Homebound</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Travel Radius (miles)
                </label>
                <input
                  type="number"
                  value={formData.travel_radius_miles || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      travel_radius_miles: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={handleClearProfile}
              disabled={saving || !profile}
              className="rounded-lg border-2 border-red-600 px-6 py-2 font-medium text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500"
            >
              Clear All Data
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 font-medium text-white transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
