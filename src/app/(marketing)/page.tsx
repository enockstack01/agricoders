import Link from "next/link";
import type { Metadata } from "next";
import {
  Layers,
  Sprout,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Satellite,
  Smartphone,
  Megaphone,
  BarChart2,
  Link2,
  Share2,
  GitBranch,
  Mail,
  MapPin,
  Award,
  Users,
} from "lucide-react";
import AgriNav from "@/components/layout/AgriNav";

export const metadata: Metadata = {
  title: "Agricoders — Geospatial Intelligence, Apps & Agribusiness Planning",
  description:
    "Agricoders empowers farmers and agribusinesses with location intelligence, intelligent web and mobile applications, digital marketing, and professional business planning.",
};

const SERVICES = [
  {
    Icon: Satellite,
    title: "Geospatial & Location Intelligence",
    desc: "We empower farmers with location intelligence advisory services, developing open-source spatial planning tools and delivering Agtech consultancy that gives agribusinesses a precise, data-driven view of every field.",
    features: [
      "Open-source spatial planning tools",
      "GIS & remote-sensing advisory",
      "Agtech consultancy services",
    ],
  },
  {
    Icon: Smartphone,
    title: "Web & Mobile App Development",
    desc: "We design and build intelligent, production-grade Web and Mobile Applications purpose-built for agribusinesses, from farm management systems to market-linkage platforms.",
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
    desc: "We provide professional Agribusiness Planning and Financial Modelling services. Our platform, Logistack Plan, generates investor-ready business plans and 19-sheet financial models in under 15 minutes.",
    features: [
      "Investor-ready business plans",
      "19-sheet Excel financial models",
      "Professional narrative generation",
    ],
    cta: { label: "Try Logistack Plan", href: "/app" },
  },
] as const;

export default function AgricodersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      <AgriNav />

      {/* Hero */}
      <section className="bg-black px-4 py-28 sm:py-36 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 rounded-full blur-3xl"
            style={{
              transform: "translateX(-50%)",
              width: 700,
              height: 350,
              background: "rgba(22,163,74,0.07)",
            }}
          />
        </div>
        <div className="container position-relative">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                Empowering Farmers with{" "}
                <span style={{ color: "#4ade80" }}>Intelligence & Technology</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed">
                Agricoders delivers{" "}
                <strong className="text-white">location intelligence</strong>,{" "}
                <strong className="text-white">intelligent applications</strong>,{" "}
                <strong className="text-white">digital marketing</strong>, and{" "}
                <strong className="text-white">professional business planning</strong>{" "}
                to help every agribusiness operate with precision and grow with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
                <a
                  href="#services"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-white font-bold rounded-xl transition-all text-sm no-underline"
                  style={{ background: "#16a34a" }}
                >
                  Explore Our Services
                  <ArrowRight size={16} />
                </a>
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-xl transition-all text-sm no-underline"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  Try Logistack Plan
                  <ChevronRight size={15} className="text-gray-400" />
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
                {[
                  "Geospatial Intelligence",
                  "Web & Mobile Apps",
                  "Digital Marketing",
                  "Business Planning",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle size={12} style={{ color: "#4ade80" }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-white py-24">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What we do</h2>
            <p className="text-gray-500 mx-auto" style={{ maxWidth: 460 }}>
              Four integrated services that cover every digital need of a modern agribusiness.
            </p>
          </div>
          <div className="row g-4">
            {SERVICES.map((s) => {
              const Icon = s.Icon;
              const hasCta = "cta" in s && s.cta;
              return (
                <div key={s.title} className="col-md-6 mb-1">
                  <div
                    className="h-100 d-flex flex-column transition-all duration-300"
                    style={{
                      background: "white",
                      borderRadius: 28,
                      padding: "40px 36px",
                      boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.boxShadow = "0 20px 60px rgba(0,0,0,0.14)";
                      el.style.transform = "translateY(-6px)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.boxShadow = "0 2px 20px rgba(0,0,0,0.07)";
                      el.style.transform = "translateY(0)";
                    }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center mb-6"
                      style={{ width: 68, height: 68, background: "#16a34a", borderRadius: 22, flexShrink: 0 }}
                    >
                      <Icon size={30} color="white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3" style={{ fontSize: 19, lineHeight: 1.3 }}>{s.title}</h3>
                    <p className="text-gray-500 leading-relaxed mb-5" style={{ fontSize: 15 }}>{s.desc}</p>
                    <ul className="list-unstyled mb-5">
                      {s.features.map((f) => (
                        <li key={f} className="d-flex align-items-start gap-2 mb-2.5" style={{ fontSize: 14, color: "#6b7280" }}>
                          <CheckCircle size={14} style={{ color: "#16a34a", flexShrink: 0, marginTop: 2 }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {hasCta && (
                      <div className="mt-auto">
                        <a
                          href={(s as typeof s & { cta: { label: string; href: string } }).cta.href}
                          className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl transition-colors no-underline"
                          style={{ background: "#16a34a", fontSize: 14 }}
                        >
                          {(s as typeof s & { cta: { label: string; href: string } }).cta.label}
                          <ArrowRight size={14} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Professional Quality */}
      <section className="py-24" style={{ background: "#111827" }}>
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "#4ade80", letterSpacing: "0.12em" }}
              >
                Our Standard
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                Work that goes beyond what the client expects
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Every deliverable we produce is built to a professional standard. We go the extra mile
                to understand your specific context, gather the inputs you need, and produce work
                that stands on its own without needing a disclaimer.
              </p>
              <Link
                href="/app"
                className="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-bold rounded-xl transition-all no-underline"
                style={{ background: "#16a34a" }}
              >
                See Logistack Plan
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                {[
                  {
                    Icon: Award,
                    title: "Professional output",
                    desc: "Our documents and deliverables meet the standard expected from experienced consultants, not the look of something auto-generated.",
                  },
                  {
                    Icon: Users,
                    title: "Extra-mile support",
                    desc: "We work closely with every client to gather the right inputs, answer questions, and ensure the output reflects their actual business.",
                  },
                  {
                    Icon: CheckCircle,
                    title: "Accurate and complete",
                    desc: "From financial models to business narratives, everything is internally consistent, data-driven, and ready to present.",
                  },
                  {
                    Icon: Layers,
                    title: "Any business, any sector",
                    desc: "We adapt our work to your industry, market, and country. No generic outputs. Every engagement is tailored.",
                  },
                ].map((item) => {
                  const ItemIcon = item.Icon;
                  return (
                    <div key={item.title} className="col-6 mb-1">
                      <div
                        className="h-100 transition-all duration-300"
                        style={{
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: 24,
                          padding: "28px 24px",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.background = "rgba(255,255,255,0.12)";
                          el.style.transform = "translateY(-4px)";
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.background = "rgba(255,255,255,0.07)";
                          el.style.transform = "translateY(0)";
                        }}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center mb-4"
                          style={{ width: 52, height: 52, background: "rgba(22,163,74,0.25)", borderRadius: 16 }}
                        >
                          <ItemIcon size={22} style={{ color: "#4ade80" }} />
                        </div>
                        <p className="text-white font-bold mb-2" style={{ fontSize: 15, lineHeight: 1.3 }}>{item.title}</p>
                        <p className="leading-relaxed mb-0" style={{ fontSize: 13, color: "#9ca3af" }}>{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logistack Plan spotlight */}
      <section className="py-24 bg-black">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div
                className="rounded-4 p-4 p-sm-5 position-relative overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div
                  className="position-absolute top-0 start-0 end-0"
                  style={{
                    height: 3,
                    background: "linear-gradient(90deg, #16a34a, #4ade80, #16a34a)",
                  }}
                />
                <div className="row g-4 align-items-start">
                  <div className="col-auto">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3 shadow"
                      style={{ width: 60, height: 60, background: "#16a34a" }}
                    >
                      <Layers size={28} color="white" />
                    </div>
                  </div>
                  <div className="col">
                    <p
                      className="text-xs font-bold uppercase tracking-widest mb-2"
                      style={{ color: "#4ade80", letterSpacing: "0.12em" }}
                    >
                      Logistack Plan · Live Now
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-tight">
                      Professional Business Planning for Agribusiness
                    </h2>
                    <p className="text-gray-400 leading-relaxed mb-5">
                      Generate a complete, investor-ready Business Plan and a full 19-sheet Financial Model
                      in under 15 minutes. Built for agribusinesses, startups, and agricultural
                      entrepreneurs who need professional documents without the consultant price tag.
                    </p>
                    <div className="row g-2 mb-5">
                      {[
                        "Written Executive Summary & Market Analysis",
                        "Complete 19-sheet Excel Financial Model",
                        "Six embedded professional charts",
                        "NPV, IRR, payback period (auto-calculated)",
                        "Investor-ready Word document in under 15 min",
                        "Any business, any country, any currency",
                      ].map((f) => (
                        <div key={f} className="col-12 col-sm-6 d-flex align-items-start gap-2 text-sm text-gray-400">
                          <CheckCircle
                            size={13}
                            style={{ color: "#4ade80", flexShrink: 0, marginTop: 2 }}
                          />
                          {f}
                        </div>
                      ))}
                    </div>
                    <div className="d-flex flex-wrap align-items-center gap-3">
                      <Link
                        href="/app"
                        className="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-bold rounded-xl transition-all no-underline"
                        style={{ background: "#16a34a" }}
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
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ background: "#16a34a" }}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-7">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5 leading-tight">
                Ready to build your agribusiness with precision?
              </h2>
              <p className="text-white mb-9 leading-relaxed" style={{ opacity: 0.85 }}>
                Start with Logistack Plan or get in touch to discuss how Agricoders can support
                your agribusiness journey.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white font-bold rounded-xl hover:opacity-90 transition-all text-sm no-underline"
                  style={{ color: "#15803d" }}
                >
                  <Layers size={16} />
                  Open Logistack Plan
                </Link>
                <a
                  href="mailto:agricoders@gmail.com"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-xl transition-all text-sm no-underline text-white"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.4)",
                  }}
                >
                  Contact Us
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="container py-5 pt-md-5 pb-md-4">
          <div className="row g-4 g-md-5">

            <div className="col-12 col-sm-12 col-md-5">
              <Link href="/" className="d-inline-flex align-items-center gap-2 mb-3 no-underline">
                <div
                  className="d-flex align-items-center justify-content-center rounded-2"
                  style={{ width: 30, height: 30, background: "#16a34a" }}
                >
                  <Sprout size={14} color="white" />
                </div>
                <span className="font-bold text-white">Agricoders</span>
              </Link>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#6b7280", maxWidth: 280 }}>
                Empowering farmers and agribusinesses with geospatial intelligence, intelligent
                applications, and professional planning.
              </p>
              <div className="d-flex align-items-center gap-1 mb-3">
                <MapPin size={13} style={{ color: "#4ade80", flexShrink: 0 }} />
                <span className="text-xs" style={{ color: "#6b7280" }}>
                  Kigali, KG 9 Ave, Deco Center, Kigali, Rwanda
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                {[
                  { label: "LinkedIn", Icon: Link2, href: "https://linkedin.com" },
                  { label: "Twitter", Icon: Share2, href: "https://twitter.com" },
                  { label: "GitHub", Icon: GitBranch, href: "https://github.com" },
                  { label: "Email", Icon: Mail, href: "mailto:agricoders@gmail.com" },
                ].map(({ label, Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="d-flex align-items-center justify-content-center rounded-2 transition-colors no-underline"
                    style={{
                      width: 30,
                      height: 30,
                      background: "rgba(255,255,255,0.05)",
                      color: "#6b7280",
                    }}
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            <div className="col-6 col-md-3 col-lg-2 offset-md-1 offset-lg-2">
              <h3
                className="text-xs font-semibold uppercase mb-4"
                style={{ color: "#9ca3af", letterSpacing: "0.1em" }}
              >
                Services
              </h3>
              <ul className="list-unstyled">
                {[
                  "Geospatial Intelligence",
                  "Web & Mobile Apps",
                  "Digital Marketing",
                  "Business Planning",
                ].map((s) => (
                  <li key={s} className="mb-2">
                    <a
                      href="#services"
                      className="text-sm no-underline transition-colors"
                      style={{ color: "#6b7280" }}
                    >
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-6 col-md-3 col-lg-2">
              <h3
                className="text-xs font-semibold uppercase mb-4"
                style={{ color: "#9ca3af", letterSpacing: "0.1em" }}
              >
                Company
              </h3>
              <ul className="list-unstyled">
                {[
                  { label: "Logistack Plan", href: "/app" },
                  { label: "Contact", href: "mailto:agricoders@gmail.com" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                ].map((link) => (
                  <li key={link.label} className="mb-2">
                    <a
                      href={link.href}
                      className="text-sm no-underline transition-colors"
                      style={{ color: "#6b7280" }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
        <div className="border-top" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="container py-3">
            <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2">
              <span className="text-xs" style={{ color: "#4b5563" }}>
                &copy; {new Date().getFullYear()} Agricoders. All rights reserved.
              </span>
              <span className="text-xs" style={{ color: "#4b5563" }}>
                Empowering agriculture with intelligence.
              </span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
