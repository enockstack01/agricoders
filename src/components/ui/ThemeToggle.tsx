"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle({ compact }: { compact?: boolean }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`${compact ? "p-1.5" : "p-2"} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors`}
    >
      {isDark ? <Sun size={compact ? 16 : 18} /> : <Moon size={compact ? 16 : 18} />}
    </button>
  );
}
