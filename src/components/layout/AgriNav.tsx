"use client";
// Agricoders site navigation — floating glass pill with a Services mega-menu, a Systems
// dropdown, scroll-spy highlighting on the home page, and a full-screen mobile sheet.
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Plant,
  Stack,
  ArrowRight,
  ArrowUpRight,
  CaretDown,
  List,
  X,
  PawPrint,
  Sparkle,
  GlobeHemisphereEast,
  DeviceMobile,
  Megaphone,
  ChartBar,
  Moon,
  Sun,
} from "@phosphor-icons/react";
import { useTheme } from "@/contexts/ThemeContext";
import { AGRICODERS_APPS } from "@/lib/apps";

const APP_ICONS: Record<string, React.ReactNode> = {
  logistackplan: <Stack size={20} weight="duotone" />,
  livestockpro: <PawPrint size={20} weight="duotone" />,
};

const SERVICE_LINKS = [
  { title: "Geospatial Intelligence", desc: "Field-level maps & spatial planning", Icon: GlobeHemisphereEast, tone: "from-emerald-400 to-green-700" },
  { title: "Web & Mobile Apps", desc: "Production-grade agri platforms", Icon: DeviceMobile, tone: "from-sky-400 to-blue-700" },
  { title: "Digital Marketing", desc: "SEO, content & campaigns", Icon: Megaphone, tone: "from-amber-300 to-orange-600" },
  { title: "Business Planning", desc: "Investor-ready plans & models", Icon: ChartBar, tone: "from-fuchsia-400 to-purple-700" },
];

// in-page sections on the home page (scroll-spy targets)
const SECTIONS = [
  { id: "services", label: "Services" },
  { id: "how-it-works", label: "How it works" },
  { id: "precision", label: "Precision" },
  { id: "systems", label: "Systems" },
];

function ThemeButton() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-10 w-10 items-center justify-center rounded-full border-0 bg-transparent text-gray-600 transition-colors hover:bg-green-50 hover:text-green-700 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
    >
      {dark ? <Sun size={20} weight="duotone" /> : <Moon size={20} weight="duotone" />}
    </button>
  );
}

export default function AgriNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<"services" | "systems" | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const href = useCallback((id: string) => (isHome ? `#${id}` : `/#${id}`), [isHome]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scroll-spy: highlight the section currently in view
  useEffect(() => {
    if (!isHome) return;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [isHome]);

  // close menus on outside click / Escape
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMenu(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMenu(null); setOpen(false); }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // lock page scroll while the mobile sheet is open
  useEffect(() => {
    document.documentElement.classList.toggle("mkt-lock", open);
    return () => document.documentElement.classList.remove("mkt-lock");
  }, [open]);

  const linkCls = (on: boolean) =>
    `relative rounded-full px-4 py-2 text-[15px] font-bold no-underline transition-colors ${
      on
        ? "bg-green-50 text-green-800 dark:bg-white/10 dark:text-white"
        : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
    }`;

  return (
    <div className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4" ref={navRef}>
      <header
        className={`mkt-glass mx-auto max-w-6xl rounded-full transition-all duration-300 ${
          scrolled ? "shadow-[0_12px_40px_-12px_rgba(16,40,24,0.25)]" : "shadow-sm"
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-3 pl-3 pr-2 sm:pl-4">
          {/* Logo */}
          <Link href="/" className="group flex flex-shrink-0 items-center gap-2.5 no-underline" onClick={() => setOpen(false)}>
            <span className="mkt-sticker flex h-10 w-10 items-center justify-center rounded-2xl">
              <Plant size={22} weight="duotone" />
            </span>
            <span className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
              Agri<span className="text-green-600 dark:text-green-400">coders</span>
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {/* Services mega menu */}
            <div className="relative" onMouseEnter={() => setMenu("services")} onMouseLeave={() => setMenu(null)}>
              <button
                type="button"
                aria-expanded={menu === "services"}
                onClick={() => setMenu((m) => (m === "services" ? null : "services"))}
                className={`${linkCls(active === "services")} flex items-center gap-1 border-0 bg-transparent`}
              >
                Services
                <CaretDown size={13} weight="bold" className={`transition-transform ${menu === "services" ? "rotate-180" : ""}`} />
              </button>
              <div
                className={`absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3 transition-all duration-200 ${
                  menu === "services" ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0"
                }`}
              >
                <div className="grid grid-cols-2 gap-1 rounded-3xl border border-black/5 bg-white p-2 shadow-[0_24px_60px_-20px_rgba(16,40,24,0.35)] dark:border-white/10 dark:bg-[#111814]">
                  {SERVICE_LINKS.map(({ title, desc, Icon, tone }) => (
                    <Link
                      key={title}
                      href={href("services")}
                      onClick={() => setMenu(null)}
                      className="group flex items-start gap-3 rounded-2xl p-3 no-underline transition-colors hover:bg-green-50/70 dark:hover:bg-white/5"
                    >
                      <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-md transition-transform group-hover:-rotate-6 group-hover:scale-105`}>
                        <Icon size={22} weight="duotone" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-extrabold text-gray-900 dark:text-white">{title}</span>
                        <span className="block text-[13px] leading-snug text-gray-500 dark:text-gray-400">{desc}</span>
                      </span>
                    </Link>
                  ))}
                  <Link
                    href="/plan"
                    onClick={() => setMenu(null)}
                    className="col-span-2 mt-1 flex items-center justify-between rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 no-underline dark:from-white/5 dark:to-white/5"
                  >
                    <span className="text-sm font-bold text-green-800 dark:text-green-300">
                      New: generate a business plan in under 15 minutes
                    </span>
                    <ArrowRight size={16} weight="bold" className="text-green-700 dark:text-green-300" />
                  </Link>
                </div>
              </div>
            </div>

            <Link href={href("how-it-works")} className={linkCls(active === "how-it-works")}>How it works</Link>
            <Link href={href("precision")} className={linkCls(active === "precision")}>Precision</Link>

            {/* Systems dropdown */}
            <div className="relative" onMouseEnter={() => setMenu("systems")} onMouseLeave={() => setMenu(null)}>
              <button
                type="button"
                aria-expanded={menu === "systems"}
                onClick={() => setMenu((m) => (m === "systems" ? null : "systems"))}
                className={`${linkCls(active === "systems" || pathname === "/apps")} flex items-center gap-1 border-0 bg-transparent`}
              >
                Systems
                <CaretDown size={13} weight="bold" className={`transition-transform ${menu === "systems" ? "rotate-180" : ""}`} />
              </button>
              <div
                className={`absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3 transition-all duration-200 ${
                  menu === "systems" ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0"
                }`}
              >
                <div className="rounded-3xl border border-black/5 bg-white p-2 shadow-[0_24px_60px_-20px_rgba(16,40,24,0.35)] dark:border-white/10 dark:bg-[#111814]">
                  {AGRICODERS_APPS.map((app) => (
                    <Link
                      key={app.id}
                      href={app.href}
                      target={app.href.startsWith("http") ? "_blank" : undefined}
                      rel={app.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      onClick={() => setMenu(null)}
                      className="group flex items-start gap-3 rounded-2xl p-3 no-underline transition-colors hover:bg-green-50/70 dark:hover:bg-white/5"
                    >
                      <span
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-white shadow-md transition-transform group-hover:-rotate-6"
                        style={{ background: `linear-gradient(135deg, ${app.accentColor}cc, ${app.accentColor})` }}
                      >
                        {APP_ICONS[app.id] ?? <Sparkle size={20} weight="duotone" />}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 text-[15px] font-extrabold text-gray-900 dark:text-white">
                          {app.name}
                          {app.status === "live" && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-green-700 dark:bg-green-500/15 dark:text-green-300">
                              Live
                            </span>
                          )}
                        </span>
                        <span className="block text-[13px] leading-snug text-gray-500 dark:text-gray-400">{app.tagline}</span>
                      </span>
                    </Link>
                  ))}
                  <Link
                    href="/apps"
                    onClick={() => setMenu(null)}
                    className="mt-1 flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-extrabold text-green-700 no-underline hover:bg-green-50/70 dark:text-green-300 dark:hover:bg-white/5"
                  >
                    View all systems
                    <ArrowUpRight size={16} weight="bold" />
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <ThemeButton />
            <Link
              href="/plan/sign-in"
              className="hidden rounded-full px-4 py-2 text-[15px] font-bold text-gray-700 no-underline transition-colors hover:bg-gray-100/80 dark:text-gray-200 dark:hover:bg-white/5 sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/plan/sign-up"
              className="mkt-btn-primary hidden items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-extrabold no-underline sm:inline-flex"
            >
              Get started
              <ArrowRight size={16} weight="bold" />
            </Link>
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full border-0 bg-transparent text-gray-800 transition-colors hover:bg-gray-100/80 dark:text-white dark:hover:bg-white/10 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 top-[84px] z-40 overflow-y-auto px-4 pb-8 pt-2 transition-all duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div
          className={`mkt-glass mx-auto max-w-6xl rounded-[28px] p-3 shadow-[0_24px_60px_-20px_rgba(16,40,24,0.4)] transition-transform duration-300 ${
            open ? "translate-y-0" : "-translate-y-3"
          }`}
        >
          <p className="px-3 pb-2 pt-2 text-xs font-black uppercase tracking-[0.14em] text-gray-400">Services</p>
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {SERVICE_LINKS.map(({ title, desc, Icon, tone }) => (
              <Link
                key={title}
                href={href("services")}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-2xl p-3 no-underline active:bg-green-50 dark:active:bg-white/5"
              >
                <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-md`}>
                  <Icon size={22} weight="duotone" />
                </span>
                <span>
                  <span className="block text-base font-extrabold text-gray-900 dark:text-white">{title}</span>
                  <span className="block text-[13px] text-gray-500 dark:text-gray-400">{desc}</span>
                </span>
              </Link>
            ))}
          </div>

          <p className="px-3 pb-2 pt-4 text-xs font-black uppercase tracking-[0.14em] text-gray-400">Explore</p>
          <div className="flex flex-wrap gap-2 px-2">
            {SECTIONS.filter((s) => s.id !== "services").map((s) => (
              <Link
                key={s.id}
                href={href(s.id)}
                onClick={() => setOpen(false)}
                className="rounded-full bg-gray-100 px-4 py-2.5 text-[15px] font-bold text-gray-800 no-underline dark:bg-white/10 dark:text-white"
              >
                {s.label}
              </Link>
            ))}
          </div>

          <p className="px-3 pb-2 pt-4 text-xs font-black uppercase tracking-[0.14em] text-gray-400">Systems</p>
          {AGRICODERS_APPS.map((app) => (
            <Link
              key={app.id}
              href={app.href}
              target={app.href.startsWith("http") ? "_blank" : undefined}
              rel={app.href.startsWith("http") ? "noopener noreferrer" : undefined}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-2xl p-3 no-underline active:bg-green-50 dark:active:bg-white/5"
            >
              <span
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                style={{ background: `linear-gradient(135deg, ${app.accentColor}cc, ${app.accentColor})` }}
              >
                {APP_ICONS[app.id] ?? <Sparkle size={20} weight="duotone" />}
              </span>
              <span className="flex-1 text-base font-extrabold text-gray-900 dark:text-white">{app.name}</span>
              <ArrowUpRight size={18} weight="bold" className="text-gray-400" />
            </Link>
          ))}

          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-black/5 pt-3 dark:border-white/10">
            <Link
              href="/plan/sign-in"
              onClick={() => setOpen(false)}
              className="rounded-full border border-gray-200 px-4 py-3 text-center text-[15px] font-extrabold text-gray-800 no-underline dark:border-white/15 dark:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/plan/sign-up"
              onClick={() => setOpen(false)}
              className="mkt-btn-primary flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[15px] font-extrabold no-underline"
            >
              Get started
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
