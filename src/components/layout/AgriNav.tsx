"use client";
// Agricoders site header: solid brand bar with the logo lockup, a Services menu, Vision link,
// a Systems menu with the real app icons, scroll-spy on the home page and a mobile sheet.
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CaretDown,
  List,
  X,
  GlobeHemisphereEast,
  DeviceMobile,
  Megaphone,
  ChartBar,
  Moon,
  Sun,
} from "@phosphor-icons/react";
import { useTheme } from "@/contexts/ThemeContext";
import { AGRICODERS_APPS } from "@/lib/apps";
import BrandMark from "@/components/marketing/BrandMark";
import AppIcon from "@/components/marketing/AppIcon";

const SERVICE_LINKS = [
  { title: "Business Planning", desc: "Investor-ready plans and models", Icon: ChartBar },
  { title: "Geospatial Intelligence", desc: "Field-level maps and spatial planning", Icon: GlobeHemisphereEast },
  { title: "Web & Mobile Apps", desc: "Production-grade agri platforms", Icon: DeviceMobile },
  { title: "Digital Marketing", desc: "SEO, content and campaigns", Icon: Megaphone },
];

// in-page sections on the home page (scroll-spy targets)
const SECTIONS = [
  { id: "vision", label: "Vision" },
  { id: "systems", label: "Systems" },
  { id: "services", label: "Services" },
];

const MENU_PANEL =
  "rounded-2xl border border-[#D5E3D6] bg-white p-2 shadow-[0_24px_60px_-20px_rgba(17,22,17,0.35)] dark:border-white/10 dark:bg-[#111814]";
const MENU_ITEM =
  "group flex items-start gap-3 rounded-xl p-3 no-underline transition-colors hover:bg-[#F3F8F3] dark:hover:bg-white/5";
const GROUP_LABEL = "px-3 pb-2 pt-3 text-xs font-bold uppercase tracking-[0.2em] text-[#555555] dark:text-gray-400";

function ServiceBadge({ Icon }: { Icon: React.ElementType }) {
  return (
    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#1B5E20] text-white">
      <Icon size={22} weight="fill" />
    </span>
  );
}

function ThemeButton() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-10 w-10 items-center justify-center rounded-full border-0 bg-transparent text-[#555555] transition-colors hover:bg-[#F3F8F3] hover:text-[#1B5E20] dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
    >
      {dark ? <Sun size={20} weight="fill" /> : <Moon size={20} weight="fill" />}
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
    `relative border-b-2 px-3 py-1.5 text-[15px] font-bold no-underline transition-colors ${
      on
        ? "border-[#F9A825] text-[#1B5E20] dark:text-white"
        : "border-transparent text-[#111611] hover:text-[#1B5E20] dark:text-gray-200 dark:hover:text-white"
    }`;

  return (
    <div className="sticky top-0 z-50" ref={navRef}>
      <header
        className={`border-b border-[#D5E3D6] bg-white/95 backdrop-blur transition-shadow duration-300 dark:border-white/10 dark:bg-[#0c140d]/95 ${
          scrolled ? "shadow-[0_10px_30px_-18px_rgba(17,22,17,0.35)]" : ""
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo lockup: symbol, wordmark, endorsement */}
          <Link href="/" aria-label="Agricoders home" className="flex flex-shrink-0 items-center gap-3 no-underline" onClick={() => setOpen(false)}>
            <BrandMark size={44} />
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-bold uppercase tracking-[0.18em] text-[#1B5E20] dark:text-white">Agricoders</span>
              <span className="hidden text-[10px] uppercase tracking-[0.2em] text-[#555555] dark:text-gray-400 sm:block">by Logistack Ltd</span>
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden items-center gap-3 lg:flex" aria-label="Main">
            {/* Services menu */}
            <div className="relative" onMouseEnter={() => setMenu("services")} onMouseLeave={() => setMenu(null)}>
              <button
                type="button"
                aria-expanded={menu === "services"}
                aria-haspopup="true"
                onClick={() => setMenu((m) => (m === "services" ? null : "services"))}
                className={`${linkCls(active === "services")} flex items-center gap-1 bg-transparent`}
              >
                Services
                <CaretDown size={13} weight="bold" className={`transition-transform ${menu === "services" ? "rotate-180" : ""}`} />
              </button>
              <div
                className={`absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3 transition-all duration-200 ${
                  menu === "services" ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0"
                }`}
              >
                <div className={`${MENU_PANEL} grid grid-cols-2 gap-1`}>
                  {SERVICE_LINKS.map(({ title, desc, Icon }) => (
                    <Link key={title} href={href("services")} onClick={() => setMenu(null)} className={MENU_ITEM}>
                      <ServiceBadge Icon={Icon} />
                      <span className="min-w-0">
                        <span className="block text-[15px] font-bold text-[#111611] dark:text-white">{title}</span>
                        <span className="block text-[13px] leading-snug text-[#555555] dark:text-gray-400">{desc}</span>
                      </span>
                    </Link>
                  ))}
                  <Link
                    href="/plan"
                    onClick={() => setMenu(null)}
                    className="col-span-2 mt-1 flex items-center justify-between rounded-xl bg-[#F3F8F3] px-4 py-3 no-underline dark:bg-white/5"
                  >
                    <span className="text-sm font-bold text-[#1B5E20] dark:text-green-300">
                      Generate a business plan in under 15 minutes
                    </span>
                    <ArrowRight size={16} weight="bold" className="text-[#1B5E20] dark:text-green-300" />
                  </Link>
                </div>
              </div>
            </div>

            <Link href={href("vision")} className={linkCls(active === "vision")}>Vision</Link>

            {/* Systems menu */}
            <div className="relative" onMouseEnter={() => setMenu("systems")} onMouseLeave={() => setMenu(null)}>
              <button
                type="button"
                aria-expanded={menu === "systems"}
                aria-haspopup="true"
                onClick={() => setMenu((m) => (m === "systems" ? null : "systems"))}
                className={`${linkCls(active === "systems" || pathname === "/apps")} flex items-center gap-1 bg-transparent`}
              >
                Systems
                <CaretDown size={13} weight="bold" className={`transition-transform ${menu === "systems" ? "rotate-180" : ""}`} />
              </button>
              <div
                className={`absolute left-1/2 top-full w-[340px] -translate-x-1/2 pt-3 transition-all duration-200 ${
                  menu === "systems" ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0"
                }`}
              >
                <div className={MENU_PANEL}>
                  {AGRICODERS_APPS.map((app) => (
                    <Link
                      key={app.id}
                      href={app.href}
                      target={app.href.startsWith("http") ? "_blank" : undefined}
                      rel={app.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      onClick={() => setMenu(null)}
                      className={MENU_ITEM}
                    >
                      <AppIcon src={app.icon} size={44} />
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 text-[15px] font-bold text-[#111611] dark:text-white">
                          {app.name}
                          {app.status === "live" && (
                            <span className="rounded-full bg-[#1B5E20] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Live</span>
                          )}
                        </span>
                        <span className="block text-[13px] leading-snug text-[#555555] dark:text-gray-400">{app.tagline}</span>
                      </span>
                    </Link>
                  ))}
                  <Link
                    href="/apps"
                    onClick={() => setMenu(null)}
                    className="mt-1 flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-[#1B5E20] no-underline hover:bg-[#F3F8F3] dark:text-green-300 dark:hover:bg-white/5"
                  >
                    View all systems
                    <ArrowUpRight size={16} weight="bold" />
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <ThemeButton />
            <Link
              href="/plan/sign-in"
              className="hidden rounded-full px-4 py-2 text-[15px] font-bold text-[#111611] no-underline transition-colors hover:bg-[#F3F8F3] dark:text-gray-200 dark:hover:bg-white/5 sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/plan/sign-up"
              className="hidden items-center gap-2 rounded-full bg-[#F9A825] px-5 py-2.5 text-[15px] font-bold text-[#111611] no-underline transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              Get started
              <ArrowRight size={16} weight="bold" />
            </Link>
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full border-0 bg-transparent text-[#111611] transition-colors hover:bg-[#F3F8F3] dark:text-white dark:hover:bg-white/10 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 top-[73px] z-40 overflow-y-auto bg-white px-4 pb-8 pt-2 transition-all duration-300 dark:bg-[#0c140d] lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="mx-auto max-w-2xl">
          <p className={GROUP_LABEL}>Systems</p>
          {AGRICODERS_APPS.map((app) => (
            <Link
              key={app.id}
              href={app.href}
              target={app.href.startsWith("http") ? "_blank" : undefined}
              rel={app.href.startsWith("http") ? "noopener noreferrer" : undefined}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl p-3 no-underline active:bg-[#F3F8F3] dark:active:bg-white/5"
            >
              <AppIcon src={app.icon} size={44} />
              <span className="flex-1">
                <span className="block text-base font-bold text-[#111611] dark:text-white">{app.name}</span>
                <span className="block text-[13px] text-[#555555] dark:text-gray-400">{app.tagline}</span>
              </span>
              <ArrowUpRight size={18} weight="bold" className="text-[#555555]" />
            </Link>
          ))}

          <p className={GROUP_LABEL}>Services</p>
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {SERVICE_LINKS.map(({ title, desc, Icon }) => (
              <Link
                key={title}
                href={href("services")}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl p-3 no-underline active:bg-[#F3F8F3] dark:active:bg-white/5"
              >
                <ServiceBadge Icon={Icon} />
                <span>
                  <span className="block text-base font-bold text-[#111611] dark:text-white">{title}</span>
                  <span className="block text-[13px] text-[#555555] dark:text-gray-400">{desc}</span>
                </span>
              </Link>
            ))}
          </div>

          <p className={GROUP_LABEL}>Explore</p>
          <div className="flex flex-wrap gap-2 px-2">
            <Link
              href={href("vision")}
              onClick={() => setOpen(false)}
              className="rounded-full bg-[#F3F8F3] px-4 py-2.5 text-[15px] font-bold text-[#1B5E20] no-underline dark:bg-white/10 dark:text-white"
            >
              Vision
            </Link>
            <Link
              href="/apps"
              onClick={() => setOpen(false)}
              className="rounded-full bg-[#F3F8F3] px-4 py-2.5 text-[15px] font-bold text-[#1B5E20] no-underline dark:bg-white/10 dark:text-white"
            >
              All systems
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 border-t border-[#D5E3D6] pt-4 dark:border-white/10">
            <Link
              href="/plan/sign-in"
              onClick={() => setOpen(false)}
              className="rounded-full border-2 border-[#1B5E20] px-4 py-3 text-center text-[15px] font-bold text-[#1B5E20] no-underline dark:border-white/30 dark:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/plan/sign-up"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full bg-[#F9A825] px-4 py-3 text-[15px] font-bold text-[#111611] no-underline"
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
