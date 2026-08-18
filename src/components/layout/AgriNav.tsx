"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sprout,
  Layers,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Menu,
  X,
  PawPrint,
  Sparkles,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { AGRICODERS_APPS } from "@/lib/apps";

const APP_ICONS: Record<string, React.ReactNode> = {
  logistackplan: <Layers size={17} color="white" />,
  livestockpro: <PawPrint size={17} color="white" />,
};

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
    <div className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <header
        className={`mx-auto max-w-6xl rounded-2xl border transition-all duration-300 ${
          scrolled
            ? "bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl border-gray-200/80 dark:border-gray-800/80 shadow-lg shadow-black/[0.06]"
            : "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-gray-200/50 dark:border-gray-800/50 shadow-sm"
        }`}
      >
        <div className="px-3 sm:px-5">
          <div className="flex items-center justify-between h-14">

            <Link href="/" className="group/logo flex items-center gap-2.5 flex-shrink-0 no-underline">
              <div
                className="relative flex items-center justify-center rounded-xl transition-transform duration-300 group-hover/logo:scale-105 group-hover/logo:-rotate-3"
                style={{ width: 34, height: 34, background: "linear-gradient(135deg, #22c55e, #15803d)" }}
              >
                <Sprout size={16} color="white" />
                <span
                  className="absolute inset-0 rounded-xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: "0 0 0 4px rgba(22,163,74,0.16)" }}
                />
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

              <div className="group/apps relative">
                <Link
                  href="/apps"
                  className={`mkt-nav-link flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all no-underline ${
                    pathname === "/apps"
                      ? "is-active text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  Apps
                  <ChevronDown size={13} className="transition-transform duration-200 group-hover/apps:rotate-180" />
                </Link>

                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 invisible translate-y-1 transition-all duration-200 group-hover/apps:opacity-100 group-hover/apps:visible group-hover/apps:translate-y-0 group-focus-within/apps:opacity-100 group-focus-within/apps:visible group-focus-within/apps:translate-y-0">
                  <div
                    className="w-80 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2"
                    style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.16)" }}
                  >
                    {AGRICODERS_APPS.map((app) => (
                      <Link
                        key={app.id}
                        href={app.href}
                        target={app.href.startsWith("http") ? "_blank" : undefined}
                        rel={app.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 no-underline transition-colors"
                      >
                        <div
                          className="flex items-center justify-center rounded-lg flex-shrink-0"
                          style={{ width: 36, height: 36, background: app.accentColor }}
                        >
                          {APP_ICONS[app.id] ?? <Sparkles size={17} color="white" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {app.name}
                            </span>
                            {app.status === "live" && (
                              <span
                                className="mkt-pulse-dot rounded-full flex-shrink-0"
                                style={{ width: 5, height: 5, background: "#16a34a" }}
                              />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug mt-0.5">
                            {app.tagline}
                          </p>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href="/apps"
                      className="flex items-center justify-between px-3 py-2.5 mt-1 text-sm font-semibold rounded-xl no-underline transition-colors"
                      style={{ color: "#15803d" }}
                    >
                      View all systems
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            <div className="hidden md:flex items-center gap-1">
              <ThemeToggle compact />
              <Link
                href="/plan/sign-in"
                className="px-3.5 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all no-underline"
              >
                Sign In
              </Link>
              <Link
                href="/plan/sign-up"
                className="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-bold rounded-xl transition-all no-underline hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #22c55e, #15803d)",
                  boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
                }}
              >
                Get Started
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="flex items-center gap-1 md:hidden">
              <ThemeToggle compact />
              <button
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-colors border-0 bg-transparent"
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
            open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-gray-100 dark:border-gray-800 px-3 pb-4 pt-3 transition-colors">
            <Link
              href="/#services"
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/70 rounded-lg no-underline"
            >
              Services
            </Link>

            <p className="px-3 pt-3 pb-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
              Apps
            </p>
            <div className="flex flex-col gap-0.5 mb-2">
              {AGRICODERS_APPS.map((app) => (
                <Link
                  key={app.id}
                  href={app.href}
                  target={app.href.startsWith("http") ? "_blank" : undefined}
                  rel={app.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100/70 dark:hover:bg-gray-800/70 no-underline transition-colors"
                >
                  <div
                    className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{ width: 30, height: 30, background: app.accentColor }}
                  >
                    {APP_ICONS[app.id] ?? <Sparkles size={15} color="white" />}
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{app.name}</span>
                  {app.status === "live" && (
                    <span
                      className="mkt-pulse-dot rounded-full ml-auto flex-shrink-0"
                      style={{ width: 5, height: 5, background: "#16a34a" }}
                    />
                  )}
                </Link>
              ))}
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
                style={{ background: "linear-gradient(135deg, #22c55e, #15803d)" }}
              >
                Get Started
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
