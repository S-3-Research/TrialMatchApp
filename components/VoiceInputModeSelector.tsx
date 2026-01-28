"use client";

import { useVoiceInputMode } from "@/contexts/VoiceInputModeContext";

export function VoiceInputModeSelector() {
  const { mode, setMode } = useVoiceInputMode();

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="voice-mode-select"
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Voice Input:
      </label>
      <select
        id="voice-mode-select"
        value={mode}
        onChange={(e) => setMode(e.target.value as "web-speech" | "whisper")}
        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      >
        <option value="web-speech">🌐 Web Speech (Free, Real-time)</option>
        <option value="whisper">🤖 Whisper (Accurate, $0.006/min)</option>
      </select>
    </div>
  );
}
