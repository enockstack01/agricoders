"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sprout, Layers, ArrowRight, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function AgriNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/85 dark:bg-gray-900/85 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-sm"
          : "bg-white dark:bg-gray-900 border-transparent shadow-none"
      }`}
    >
      <div className="container-xl px-4">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 no-underline group">
            <div
              className="flex items-center justify-center rounded-xl transition-transform group-hover:scale-105"
              style={{ width: 36, height: 36, background: "#16a34a" }}
            >
              <Sprout size={16} color="white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-[15px] tracking-tight">Agricoders</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/#services"
              className="mkt-nav-link px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-all no-underline"
            >
              Services
            </Link>
            <Link
              href="/apps"
              className={`mkt-nav-link px-4 py-2 text-sm font-medium rounded-lg transition-all no-underline ${
                pathname === "/apps"
                  ? "is-active text-gray-900 dark:text-white"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
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
              Our Systems
            </Link>
            <Link
              href="/plan/sign-up"
              className="flex items-center gap-2 px-4 py-2 text-white text-sm font-bold rounded-xl transition-all shadow-sm no-underline hover:shadow-md hover:-translate-y-0.5"
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
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pb-4 pt-3 transition-colors">
          <div className="flex flex-col gap-1 mb-3">
            <Link
              href="/#services"
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg no-underline"
            >
              Services
            </Link>
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
              href="/plan/sign-in"
              onClick={() => setOpen(false)}
              className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-center no-underline"
            >
              Sign In
            </Link>
            <Link
              href="/plan/sign-up"
              onClick={() => setOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl no-underline"
              style={{ background: "#16a34a" }}
            >
              Get Started
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
