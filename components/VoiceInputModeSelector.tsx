"use client";

import { useVoiceInputMode } from "@/contexts/VoiceInputModeContext";

export function VoiceInputModeSelector() {
  const { mode, setMode } = useVoiceInputMode();

  return (
    <div className="flex flex-col gap-1">
      <select
        id="voice-mode-select"
        value={mode}
        onChange={(e) => setMode(e.target.value as "web-speech" | "whisper")}
        className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
      >
        <option value="web-speech">🌐 Web Speech</option>
        <option value="whisper">🤖 Whisper</option>
      </select>
    </div>
  );
}
