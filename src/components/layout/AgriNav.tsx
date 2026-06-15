"use client";
import { useState } from "react";
import Link from "next/link";
import { Sprout, Layers, ArrowRight, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function AgriNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
      <div className="container-xl px-4">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 no-underline">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width: 36, height: 36, background: "#16a34a" }}
            >
              <Sprout size={16} color="white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-[15px] tracking-tight">Agricoders</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <a
              href="#services"
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all no-underline"
            >
              Services
            </a>
            <Link
              href="/apps"
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all no-underline"
            >
              Apps
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle compact />
            <Link
              href="/apps"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all border border-gray-200 dark:border-gray-700 no-underline"
            >
              <Layers size={13} style={{ color: "#16a34a" }} />
              Our Apps
            </Link>
            <Link
              href="/sign-up"
              className="flex items-center gap-2 px-4 py-2 text-white text-sm font-bold rounded-xl transition-all shadow-sm no-underline"
              style={{ background: "#16a34a" }}
            >
              Get Started
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle compact />
            <button
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-0 bg-transparent"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pb-4 pt-3 transition-colors">
          <div className="flex flex-col gap-1 mb-3">
            <a
              href="#services"
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg no-underline"
            >
              Services
            </a>
            <Link
              href="/apps"
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg no-underline"
            >
              Apps
            </Link>
          </div>
          <div className="flex flex-col gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            <Link
              href="/sign-in"
              className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-center no-underline"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl no-underline"
              style={{ background: "#16a34a" }}
            >
              Get Started
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
