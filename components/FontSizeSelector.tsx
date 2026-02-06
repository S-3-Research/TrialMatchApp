"use client";

import { useFontSize } from "@/contexts/FontSizeContext";

export default function FontSizeSelector() {
  const { fontSize, setFontSize } = useFontSize();

  return (
    <div className="flex flex-col gap-1">
      <select
        value={fontSize}
        onChange={(e) => setFontSize(e.target.value as "small" | "medium" | "large")}
        className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400"
      >
        <option value="small">🔤 Small</option>
        <option value="medium">🔲 Medium</option>
        <option value="large">🔳 Large</option>
      </select>
    </div>
  );
}
