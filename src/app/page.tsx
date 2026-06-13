import Link from "next/link";
import type { Metadata } from "next";
import {
  Layers,
  Leaf,
  Satellite,
  Brain,
  Sprout,
  ArrowRight,
  Sparkles,
  CheckCircle,
  ChevronRight,
  Target,
  TrendingUp,
  MapPin,
  Sun,
  Link2,
  Share2,
  GitBranch,
  Mail,
  Smartphone,
  Megaphone,
  BarChart2,
} from "lucide-react";
import AgriStatsBar from "@/components/AgriStatsBar";

export const metadata: Metadata = {
  title: "Agricoders — Transforming Agriculture with Geospatial Technology & AI",
  description:
    "Agricoders is a program dedicated to equipping the agricultural sector with Geospatial Intelligence solutions and AI-powered software that farmers rely on to achieve maximum productivity.",
};

/* ─── Services ──────────────────────────────────────────────────────────── */
const PILLARS = [
  {
    Icon: Satellite,
    bg: "bg-amber-50",
    iconColor: "text-amber-700",
    border: "border-amber-100",
    title: "Geospatial & Location Intelligence",
    desc: "We empower farmers with location intelligence advisory services — developing open-source spatial planning tools and delivering Agtech consultancy to help agribusinesses make precision, data-driven decisions.",
    features: [
      "Open-source spatial planning tools",
      "GIS & remote-sensing advisory",
      "Agtech consultancy services",
    ],
  },
  {
    Icon: Smartphone,
    bg: "bg-blue-50",
    iconColor: "text-blue-700",
    border: "border-blue-100",
    title: "Web & Mobile App Development",
    desc: "We design and develop intelligent, production-grade Web and Mobile Applications purpose-built for agribusinesses — from farm management systems to market-linkage platforms.",
    features: [
      "Custom agribusiness web apps",
      "iOS & Android mobile apps",
      "Scalable, API-first architecture",
    ],
  },
  {
    Icon: Megaphone,
    bg: "bg-rose-50",
    iconColor: "text-rose-600",
    border: "border-rose-100",
    title: "Digital Marketing Services",
    desc: "We help agricultural businesses grow their digital presence through targeted content strategies, SEO, social media campaigns, and data-driven performance marketing tailored to the agri-sector.",
    features: [
      "Agribusiness SEO & content strategy",
      "Social media & paid campaigns",
      "Brand positioning for agri-markets",
    ],
  },
  {
    Icon: BarChart2,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-700",
    border: "border-emerald-100",
    title: "Agribusiness Planning & Financial Modelling",
    desc: "We provide professional Agribusiness Planning and Financial Modelling services. Our AI-powered platform, Logistack Plan, generates investor-ready business plans and 19-sheet financial models in under 15 minutes.",
    features: [
      "Investor-ready business plans",
      "19-sheet Excel financial models",
      "AI-powered narrative generation",
    ],
    cta: { label: "Try Logistack Plan", href: "/app" },
  },
] as const;

/* ─── Logistack Plan feature bullets ────────────────────────────────────── */
const LSP_FEATURES = [
  "AI-written Executive Summary, Industry & Market Analysis",
  "Complete 19-sheet Excel Financial Model",
  "Six embedded professional charts",
  "NPV, IRR, payback period & cash flow — auto-calculated",
  "Investor-ready Word document in under 15 minutes",
  "Supports any business, any country, any currency",
] as const;

/* ─── Page ─────────────────────────────────────────────────────────────── */
export default function AgricodersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">

      {/* ── Navigation ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/97 backdrop-blur-md border-b border-amber-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md group-hover:opacity-90 transition-opacity"
              style={{ background: "#052e16" }}
            >
              <Sprout size={17} className="text-amber-400" />
            </div>
            <span className="font-bold text-[15px] tracking-tight" style={{ color: "#052e16" }}>
              Agricoders
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: "Mission", href: "#mission" },
              { label: "Apps",    href: "#apps" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-amber-50 transition-all group/nav"
              >
                {link.label}
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-amber-500 scale-x-0 group-hover/nav:scale-x-100 transition-transform origin-left rounded-full" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/app"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-green-800 hover:text-green-950 hover:bg-green-50 rounded-lg transition-all border border-green-200"
            >
              <Layers size={13} className="text-amber-600" />
              Logistack Plan
            </Link>
            <Link
              href="/sign-up"
              className="flex items-center gap-2 px-4 py-2 text-amber-300 text-sm font-semibold rounded-xl transition-all hover:-translate-y-px shadow-md"
              style={{ background: "#052e16" }}
            >
              Get Started
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero — deep forest green with golden sunrise glow ──────── */}
      <section
        className="relative overflow-hidden px-4 sm:px-6 py-28 sm:py-36 text-center"
        style={{ background: "#071a07" }}
      >
        {/* Crop-row furrow pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 34px,rgba(74,222,128,0.045) 34px,rgba(74,222,128,0.045) 35px)",
          }}
        />
        {/* Golden sunrise radial glow from top */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 1000px 480px at 50% -80px,rgba(251,191,36,0.22) 0%,rgba(251,191,36,0.07) 50%,transparent 70%)",
          }}
        />
        {/* Side atmosphere glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] bg-green-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-400/6 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-semibold mb-8">
            <Sun size={11} />
            The Next Agricultural Technology Revolution
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white mb-6 leading-[1.08] tracking-tight">
            Equipping Agriculture with{" "}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              Geospatial Intelligence
            </span>{" "}
            &amp;{" "}
            <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
              AI‑Powered Tools
            </span>
          </h1>

          <p className="text-base sm:text-lg text-green-200/75 mb-10 max-w-2xl mx-auto leading-relaxed">
            Agricoders empowers farmers and agribusinesses with{" "}
            <strong className="text-amber-300 font-semibold">location intelligence</strong>,{" "}
            <strong className="text-white font-semibold">intelligent applications</strong>,{" "}
            <strong className="text-amber-300 font-semibold">digital marketing</strong>, and{" "}
            <strong className="text-white font-semibold">AI-powered business planning</strong> — so
            every agricultural business can operate with precision, grow with confidence, and plan with intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <a
              href="#apps"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-green-950 font-bold rounded-xl transition-all shadow-xl shadow-amber-900/30 hover:-translate-y-0.5 text-sm"
            >
              Explore Our Apps
              <ArrowRight size={16} />
            </a>
            <a
              href="#mission"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold rounded-xl transition-all text-sm hover:-translate-y-0.5"
            >
              Our Mission
              <ChevronRight size={15} className="text-green-300" />
            </a>
          </div>

          {/* Capability chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              "Geospatial Intelligence",
              "Web & Mobile Apps",
              "Digital Marketing",
              "Agribusiness Planning",
              "AI Financial Modelling",
            ].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5 text-xs text-green-200/80 font-medium"
              >
                <CheckCircle size={10} className="text-amber-400" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar with count-up ─────────────────────────────────── */}
      <AgriStatsBar />

      {/* ── Geospatial Intelligence Goal ───────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-amber-50 border-b border-amber-100">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-3xl border border-amber-200 shadow-xl shadow-amber-100/60 px-8 sm:px-14 py-12 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-amber-100/60 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-10 w-48 h-48 bg-green-100/50 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div
                className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: "#052e16", boxShadow: "0 10px 25px rgba(5,46,22,0.3)" }}
              >
                <Target size={28} className="text-amber-400" />
              </div>

              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 border border-amber-200 rounded-full px-3 py-1 mb-3">
                  <MapPin size={10} />
                  Our Core Goal
                </div>
                <blockquote className="text-lg sm:text-xl font-bold text-gray-900 leading-snug mb-3">
                  &ldquo;We empower farmers with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-600">
                    location intelligence
                  </span>{" "}
                  — building open-source spatial tools, intelligent applications, and AI-powered planning systems that any agribusiness can rely on.&rdquo;
                </blockquote>
                <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
                  From geospatial advisory and custom software to digital marketing and financial modelling,
                  Agricoders delivers the full stack of digital services that modern agribusinesses need
                  to grow, attract investors, and operate with precision.
                </p>
              </div>
            </div>

            {/* Supporting stats row */}
            <div className="relative mt-8 pt-6 border-t border-amber-100 grid grid-cols-3 gap-4">
              {[
                { Icon: TrendingUp,  value: "Maximum",   label: "Productivity"     },
                { Icon: MapPin,      value: "Precision",  label: "Geospatial Data"  },
                { Icon: CheckCircle, value: "Reliable",   label: "Farmer-Focused"   },
              ].map(({ Icon, value, label }) => (
                <div key={label} className="flex flex-col items-center text-center">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-2">
                    <Icon size={16} className="text-amber-700" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">{value}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission / Pillars ──────────────────────────────────────── */}
      <section id="mission" className="px-4 sm:px-6 lg:px-8 py-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-green-800 bg-green-50 border border-green-200 rounded-full px-3.5 py-1.5 mb-5">
              <Leaf size={11} />
              What we do
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "#052e16" }}>
              Four services driving agricultural transformation
            </h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
              Agricoders combines geospatial intelligence, software development, digital marketing,
              and AI-powered planning to solve real problems across the agricultural value chain.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PILLARS.map((p) => {
              const Icon = p.Icon;
              const hasCta = "cta" in p && p.cta;
              return (
                <div
                  key={p.title}
                  className={`bg-white rounded-2xl border ${p.border} p-7 hover:shadow-xl hover:-translate-y-1.5 hover:border-amber-200 transition-all duration-200 group flex flex-col`}
                >
                  <div className={`w-12 h-12 rounded-xl ${p.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon size={22} className={p.iconColor} />
                  </div>
                  <h3 className="font-bold mb-3 text-sm" style={{ color: "#052e16" }}>
                    {p.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{p.desc}</p>
                  <ul className="space-y-2 mb-5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                        <CheckCircle size={11} className="text-amber-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {hasCta && (
                    <div className="mt-auto">
                      <a
                        href={(p as typeof p & { cta: { label: string; href: string } }).cta.href}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        {(p as typeof p & { cta: { label: string; href: string } }).cta.label}
                        <ArrowRight size={12} />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Apps section — deep field backdrop ─────────────────────── */}
      <section
        id="apps"
        className="px-4 sm:px-6 lg:px-8 py-24 relative overflow-hidden"
        style={{ background: "#071a07" }}
      >
        {/* Vertical plowed-field column pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg,transparent,transparent 58px,rgba(74,222,128,0.03) 58px,rgba(74,222,128,0.03) 59px)",
          }}
        />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-green-400/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/20 rounded-full px-3.5 py-1.5 mb-5">
              <Sparkles size={11} />
              Agricoders Suite
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Tools built for the modern agribusiness
            </h2>
            <p className="text-sm text-green-300/60 max-w-md mx-auto">
              AI and geospatial applications designed to solve critical challenges in
              agricultural planning, financial modelling, and business development.
            </p>
          </div>

          {/* Featured app card */}
          <Link href="/app" className="block group">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-amber-400/30 hover:shadow-2xl hover:shadow-amber-900/20 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
              {/* Amber top accent stripe */}
              <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

              <div className="p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row gap-8 items-start">

                  {/* App icon + live badge */}
                  <div className="flex flex-col items-center sm:items-start gap-3 flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-700 to-green-950 flex items-center justify-center shadow-xl shadow-green-950/60 ring-4 ring-amber-400/20 group-hover:scale-105 group-hover:ring-amber-400/40 transition-all duration-300">
                      <Layers size={36} className="text-amber-400" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20 rounded-full px-2.5 py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      LIVE NOW
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-2">
                      <h3 className="text-xl font-extrabold text-white tracking-tight">
                        Logistack Plan
                      </h3>
                      <p className="text-sm text-amber-400 font-semibold mt-0.5">
                        AI Business Planning &amp; Financial Modelling
                      </p>
                    </div>

                    <p className="text-sm text-green-200/60 leading-relaxed mb-6 max-w-xl">
                      Generate a complete, investor-ready Business Plan and a full 19-sheet
                      Financial Model in under 15 minutes. Powered by artificial intelligence —
                      built for agribusinesses, startups, and agricultural entrepreneurs.
                    </p>

                    {/* Feature grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-7">
                      {LSP_FEATURES.map((f) => (
                        <div key={f} className="flex items-start gap-2 text-xs text-green-200/55">
                          <CheckCircle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
                          {f}
                        </div>
                      ))}
                    </div>

                    {/* CTA row */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 group-hover:bg-amber-300 text-green-950 text-sm font-bold rounded-xl shadow-md shadow-amber-900/30 transition-all group-hover:-translate-y-0.5">
                        Open Logistack Plan
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                      <span className="text-xs text-green-300/40 font-medium">
                        5 credits per generation · No subscription required
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 relative overflow-hidden bg-amber-50 border-t border-amber-100">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-16 w-96 h-96 bg-green-200/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-8 w-72 h-72 bg-amber-200/50 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold mb-7"
            style={{ background: "rgba(5,46,22,0.08)", borderColor: "rgba(5,46,22,0.12)", color: "#052e16" }}
          >
            <Sparkles size={11} />
            Start with Logistack Plan today
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-5 leading-tight" style={{ color: "#052e16" }}>
            Ready to build your agribusiness with the power of AI?
          </h2>
          <p className="text-stone-600 text-base mb-9 leading-relaxed max-w-lg mx-auto">
            Start with Logistack Plan — generate a complete, investor-ready business plan
            and financial model in under 15 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-amber-300 font-bold rounded-xl transition-all shadow-2xl hover:-translate-y-0.5 text-sm"
              style={{ background: "#052e16" }}
            >
              <Layers size={16} />
              Open Logistack Plan
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-transparent border font-semibold rounded-xl transition-all text-sm hover:-translate-y-0.5 hover:bg-green-950/5"
              style={{ borderColor: "rgba(5,46,22,0.25)", color: "#052e16" }}
            >
              Create Free Account
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-green-900" style={{ background: "#071a07" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-10">

            {/* Brand */}
            <div className="sm:col-span-2">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
                <div className="w-8 h-8 rounded-lg bg-green-900 group-hover:bg-green-800 flex items-center justify-center flex-shrink-0 transition-colors">
                  <Sprout size={15} className="text-amber-400" />
                </div>
                <span className="font-bold text-white text-base tracking-tight">Agricoders</span>
              </Link>
              <p className="text-sm leading-relaxed text-green-400/60 mb-5 max-w-xs">
                Equipping the agricultural sector with Geospatial Intelligence solutions
                that farmers rely on to achieve maximum productivity.
              </p>
              <div className="flex items-center gap-2">
                {[
                  { label: "LinkedIn", Icon: Link2,     href: "https://linkedin.com" },
                  { label: "Twitter",  Icon: Share2,    href: "https://twitter.com" },
                  { label: "GitHub",   Icon: GitBranch, href: "https://github.com" },
                  { label: "Email",    Icon: Mail,      href: "mailto:enockstack@gmail.com" },
                ].map(({ label, Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-green-900 hover:bg-green-800 flex items-center justify-center text-green-400 hover:text-amber-400 transition-colors"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Apps */}
            <div>
              <h3 className="text-xs font-semibold text-amber-400/60 uppercase tracking-widest mb-3">
                Apps
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/app"
                    className="flex items-center gap-1.5 text-sm text-green-400/60 hover:text-amber-400 transition-colors group"
                  >
                    <Layers size={12} className="text-green-700 group-hover:text-amber-400 transition-colors" />
                    Logistack Plan
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-xs font-semibold text-amber-400/60 uppercase tracking-widest mb-3">
                Company
              </h3>
              <ul className="space-y-2">
                {[
                  { label: "Mission",          href: "#mission" },
                  { label: "Contact",          href: "mailto:enockstack@gmail.com" },
                  { label: "Privacy Policy",   href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-green-400/60 hover:text-amber-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-green-900/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-green-700">
            <span>&copy; {new Date().getFullYear()} Agricoders. All rights reserved.</span>
            <span>Equipping agriculture with Geospatial Intelligence.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
