import Link from "next/link";
import {
  Layers,
  GitBranch,
  Share2,
  Link2,
  Mail,
  ArrowUpRight,
  FileText,
  BarChart2,
  Sparkles,
  LayoutDashboard,
  UserCircle,
  Shield,
  Globe,
  BookOpen,
  HelpCircle,
  MessageSquare,
} from "lucide-react";

const YEAR = new Date().getFullYear();

const NAV_COLS = [
  {
    title: "Product",
    links: [
      { label: "Dashboard",       href: "/dashboard",  icon: <LayoutDashboard size={13} /> },
      { label: "New Business Plan",href: "/form",       icon: <FileText size={13} /> },
      { label: "Financial Model",  href: "/form",       icon: <BarChart2 size={13} /> },
      { label: "AI Assist",        href: "/form",       icon: <Sparkles size={13} /> },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Profile & Settings", href: "/profile",  icon: <UserCircle size={13} /> },
      { label: "Sign In",            href: "/sign-in",  icon: <ArrowUpRight size={13} /> },
      { label: "Sign Up",            href: "/sign-up",  icon: <ArrowUpRight size={13} /> },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "How It Works",     href: "/#how",        icon: <BookOpen size={13} /> },
      { label: "Features",         href: "/#features",   icon: <Globe size={13} /> },
      { label: "Agricoders Portal",href: "/",             icon: <Globe size={13} /> },
      { label: "System Status",    href: "/api/health",  icon: <Shield size={13} />, external: true },
      { label: "Support",          href: "mailto:agricoders@gmail.com", icon: <HelpCircle size={13} />, external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy",   href: "/privacy",  icon: <FileText size={13} /> },
      { label: "Terms of Service", href: "/terms",    icon: <FileText size={13} /> },
      { label: "Contact",          href: "mailto:agricoders@gmail.com", icon: <MessageSquare size={13} />, external: true },
    ],
  },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://linkedin.com", icon: <Link2 size={16} /> },
  { label: "Twitter",  href: "https://twitter.com",  icon: <Share2 size={16} /> },
  { label: "GitHub",   href: "https://github.com",   icon: <GitBranch size={16} /> },
  { label: "Email",    href: "mailto:agricoders@gmail.com", icon: <Mail size={16} /> },
];

const FEATURES = [
  "AI-Enhanced Documents",
  "Python Chart Engine",
  "19-Sheet Financial Model",
  "Any Business Type",
  "Any Currency",
  "Role-Based Dashboards",
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-800">

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/app" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-green-600 group-hover:bg-green-500 flex items-center justify-center flex-shrink-0 transition-colors">
                <Layers size={16} className="text-white" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">Logistack Plan</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 mb-5">
              Logistack Plan generates professional business plans and financial models using AI and Python charts.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {NAV_COLS.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-3">
                  {col.title}
                </h3>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-200 transition-colors group"
                        >
                          <span className="text-gray-600 group-hover:text-green-500 transition-colors">
                            {link.icon}
                          </span>
                          {link.label}
                          {link.href.startsWith("http") && (
                            <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-200 transition-colors group"
                        >
                          <span className="text-gray-600 group-hover:text-green-500 transition-colors">
                            {link.icon}
                          </span>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Feature tags column */}
          <div className="lg:col-span-1">
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-3">
              Capabilities
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {FEATURES.map((f) => (
                <span
                  key={f}
                  className="text-xs bg-gray-800 text-gray-400 border border-gray-700 rounded-md px-2 py-1"
                >
                  {f}
                </span>
              ))}
            </div>

            {/* Status indicator */}
            <div className="mt-5 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
              <span className="text-gray-500">All systems operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800/60" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-gray-600">
            <span>&copy; {YEAR} Logistack Plan. All rights reserved.</span>
            <span className="hidden sm:inline text-gray-700">·</span>
            <span>Built for founders, consultants &amp; financial analysts</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-600">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms</Link>
            <a href="/api/health" target="_blank" rel="noreferrer"
               className="flex items-center gap-1 hover:text-gray-400 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Status
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}
