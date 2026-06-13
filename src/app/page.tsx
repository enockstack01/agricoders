import Link from "next/link";
import type { Metadata } from "next";
import {
  Layers,
  Sprout,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  MapPin,
  Satellite,
  Smartphone,
  Megaphone,
  BarChart2,
  Link2,
  Share2,
  GitBranch,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Agricoders — Geospatial Intelligence, Apps & Agribusiness Planning",
  description:
    "Agricoders empowers farmers and agribusinesses with location intelligence, intelligent web and mobile applications, digital marketing, and AI-powered business planning.",
};

const SERVICES = [
  {
    Icon: Satellite,
    title: "Geospatial & Location Intelligence",
    desc: "We empower farmers with location intelligence advisory services — developing open-source spatial planning tools and delivering Agtech consultancy that gives agribusinesses a precise, data-driven view of every field.",
    features: [
      "Open-source spatial planning tools",
      "GIS & remote-sensing advisory",
      "Agtech consultancy services",
    ],
  },
  {
    Icon: Smartphone,
    title: "Web & Mobile App Development",
    desc: "We design and build intelligent, production-grade Web and Mobile Applications purpose-built for agribusinesses — from farm management systems to market-linkage platforms.",
    features: [
      "Custom agribusiness web platforms",
      "iOS & Android mobile apps",
      "Scalable, API-first architecture",
    ],
  },
  {
    Icon: Megaphone,
    title: "Digital Marketing Services",
    desc: "We help agricultural businesses grow their digital presence through targeted content strategies, SEO, social media campaigns, and performance marketing tailored to the agri-sector.",
    features: [
      "Agribusiness SEO & content strategy",
      "Social media & paid campaigns",
      "Brand positioning for agri-markets",
    ],
  },
  {
    Icon: BarChart2,
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

export default function AgricodersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center shadow-sm">
              <Sprout size={17} className="text-white" />
            </div>
            <span className="font-bold text-white text-[15px] tracking-tight">Agricoders</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: "Services", href: "#services" },
              { label: "Logistack Plan", href: "/app" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/app"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white hover:text-white hover:bg-white/10 rounded-lg transition-all border border-white/20"
            >
              <Layers size={13} className="text-green-400" />
              Logistack Plan
            </Link>
            <Link
              href="/sign-up"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
            >
              Get Started
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="bg-black px-4 sm:px-6 py-28 sm:py-36 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-green-600/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-600/15 border border-green-600/30 text-green-400 text-xs font-semibold mb-8">
            <MapPin size={11} />
            Nairobi, Kenya · Serving Africa & Beyond
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.06] tracking-tight">
            Empowering Farmers with{" "}
            <span className="text-green-500">Intelligence & Technology</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Agricoders delivers <strong className="text-white">location intelligence</strong>,{" "}
            <strong className="text-white">intelligent applications</strong>,{" "}
            <strong className="text-white">digital marketing</strong>, and{" "}
            <strong className="text-white">AI-powered business planning</strong> — so every agribusiness can operate with precision and grow with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-green-900/30"
            >
              Explore Our Services
              <ArrowRight size={16} />
            </a>
            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold rounded-xl transition-all text-sm"
            >
              Try Logistack Plan
              <ChevronRight size={15} className="text-gray-400" />
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
            {["Geospatial Intelligence", "Web & Mobile Apps", "Digital Marketing", "AI Business Planning"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={12} className="text-green-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="px-4 sm:px-6 lg:px-8 py-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What we do
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Four integrated services that cover every digital need of a modern agribusiness.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SERVICES.map((s) => {
              const Icon = s.Icon;
              const hasCta = "cta" in s && s.cta;
              return (
                <div key={s.title} className="border-2 border-gray-100 rounded-2xl p-7 hover:border-green-200 hover:shadow-lg transition-all flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center mb-5">
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{s.desc}</p>
                  <ul className="space-y-2 mb-5">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                        <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {hasCta && (
                    <div className="mt-auto">
                      <a
                        href={(s as typeof s & { cta: { label: string; href: string } }).cta.href}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-lg transition-colors"
                      >
                        {(s as typeof s & { cta: { label: string; href: string } }).cta.label}
                        <ArrowRight size={13} />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Logistack Plan spotlight ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="border border-white/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-green-400 to-green-600" />
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="w-16 h-16 rounded-2xl bg-green-600 flex items-center justify-center shadow-xl flex-shrink-0">
                <Layers size={30} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2">Logistack Plan — Live Now</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-tight">
                  AI-Powered Business Planning for Agribusiness
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Generate a complete, investor-ready Business Plan and a full 19-sheet Financial Model in under 15 minutes. Powered by artificial intelligence — built for agribusinesses, startups, and agricultural entrepreneurs.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-7">
                  {[
                    "AI-written Executive Summary & Market Analysis",
                    "Complete 19-sheet Excel Financial Model",
                    "Six embedded professional charts",
                    "NPV, IRR, payback period — auto-calculated",
                    "Investor-ready Word document in under 15 min",
                    "Any business, any country, any currency",
                  ].map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm text-gray-400">
                      <CheckCircle size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/app"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-green-900/30"
                  >
                    Open Logistack Plan
                    <ArrowRight size={14} />
                  </Link>
                  <span className="text-xs text-gray-600">$69/document · $137 complete package</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-green-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5 leading-tight">
            Ready to build your agribusiness with precision?
          </h2>
          <p className="text-green-100 text-base mb-9 max-w-lg mx-auto leading-relaxed">
            Start with Logistack Plan or get in touch to discuss how Agricoders can support your agribusiness journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-all text-sm shadow-xl"
            >
              <Layers size={16} />
              Open Logistack Plan
            </Link>
            <a
              href="mailto:enockstack@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-sm"
            >
              Contact Us
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            <div className="sm:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                  <Sprout size={15} className="text-white" />
                </div>
                <span className="font-bold text-white text-base">Agricoders</span>
              </Link>
              <p className="text-sm leading-relaxed text-gray-500 mb-5 max-w-xs">
                Empowering farmers and agribusinesses with geospatial intelligence, intelligent applications, and AI-powered planning.
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
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-green-400 transition-colors"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Services</h3>
              <ul className="space-y-2.5">
                {["Geospatial Intelligence", "Web & Mobile Apps", "Digital Marketing", "Business Planning"].map((s) => (
                  <li key={s}>
                    <a href="#services" className="text-sm text-gray-500 hover:text-white transition-colors">{s}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Company</h3>
              <ul className="space-y-2.5">
                {[
                  { label: "Logistack Plan", href: "/app" },
                  { label: "Contact",        href: "mailto:enockstack@gmail.com" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                ].map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <span>&copy; {new Date().getFullYear()} Agricoders. All rights reserved.</span>
            <span>Empowering agriculture with intelligence.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
