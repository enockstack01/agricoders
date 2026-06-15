"use client";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FileText,
  BarChart2,
  ArrowRight,
  Layers,
  CheckCircle,
  Brain,
  LineChart,
  ShieldCheck,
  ChevronRight,
  X,
  Menu,
  Globe,
  TrendingUp,
  Zap,
  Award,
  Users,
  Link2,
  Share2,
  GitBranch,
  Mail,
  MapPin,
  Sprout,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const FEATURES = [
  {
    icon: <Brain size={28} />,
    title: "Professional Narrative",
    desc: "Executive Summary, Industry Analysis, Market Context, and Conclusion — fully tailored to your business, industry, and location. Written to professional consulting standards.",
  },
  {
    icon: <BarChart2 size={28} />,
    title: "Six Professional Charts",
    desc: "Revenue forecasts, cash flow, income summaries, and break-even charts — auto-generated and embedded into your Word document.",
  },
  {
    icon: <TrendingUp size={28} />,
    title: "Complete Financial Model",
    desc: "A 19-sheet Excel workbook covering CAPEX, OPEX, revenue, cash flow, NPV, IRR, payback period, balance sheet, and loan amortisation.",
  },
  {
    icon: <FileText size={28} />,
    title: "Investor-Ready Business Plan",
    desc: "A professionally structured Word document covering every section investors and lenders expect, formatted and ready for immediate submission.",
  },
  {
    icon: <Globe size={28} />,
    title: "Any Business, Any Market",
    desc: "From agribusiness to technology and hospitality. Supports every global currency and adapts analysis to your specific market and country.",
  },
  {
    icon: <Award size={28} />,
    title: "Expert Support Included",
    desc: "We go the extra mile to support every client with any inputs they need. Our team is available to help you get the details right, from financial figures to market data.",
  },
];

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) router.push("/dashboard");
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
        <div className="container-xl px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 flex-shrink-0">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{ width: 36, height: 36, background: "#16a34a" }}
              >
                <Layers size={17} color="white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white text-[15px] tracking-tight">Logistack Plan</span>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {[
                { label: "How it works", href: "#how-it-works" },
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all no-underline"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle compact />
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all border-0 bg-transparent">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-xl transition-all shadow-sm border-0"
                  style={{ background: "#16a34a" }}
                >
                  Get Started
                  <ArrowRight size={14} />
                </button>
              </SignUpButton>
            </div>

            <div className="flex items-center gap-1 md:hidden">
              <ThemeToggle compact />
              <button
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-0 bg-transparent"
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pb-4 pt-3 transition-colors">
            <div className="flex flex-col gap-1 mb-3">
              {[
                { label: "How it works", href: "#how-it-works" },
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg no-underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <SignInButton mode="modal">
                <button className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 bg-transparent">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl border-0"
                  style={{ background: "#16a34a" }}
                >
                  Get Started
                  <ArrowRight size={14} />
                </button>
              </SignUpButton>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="bg-black px-4 py-28 sm:py-36 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute rounded-full blur-3xl"
            style={{
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 600,
              height: 300,
              background: "rgba(22,163,74,0.10)",
            }}
          />
        </div>
        <div className="container position-relative">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                Investor-Ready Business Plans{" "}
                <span style={{ color: "#4ade80" }}>in Under 15 Minutes</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed">
                Logistack Plan uses Artificial Intelligence to instantly produce a complete{" "}
                <strong className="text-white">Business Plan</strong> and a full{" "}
                <strong className="text-white">Financial Model</strong>{" "}
                so you can focus on building your business, not writing documents.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                <SignUpButton mode="modal">
                  <button
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-white font-bold rounded-xl transition-all text-sm border-0"
                    style={{
                      background: "#16a34a",
                      boxShadow: "0 10px 25px rgba(22,163,74,0.35)",
                    }}
                  >
                    Generate My Business Plan
                    <ArrowRight size={16} />
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-xl transition-all text-sm border-0"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    Sign In to Dashboard
                    <ChevronRight size={15} className="text-gray-400" />
                  </button>
                </SignInButton>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
                {["Any industry", "Any country", "Any currency", "Delivered in minutes"].map((t) => (
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

      {/* Stats */}
      <section className="py-10" style={{ background: "#16a34a" }}>
        <div className="container">
          <div className="row g-4 text-center">
            {[
              { value: "< 5 min", label: "Generation Time" },
              { value: "19", label: "Excel Sheets" },
              { value: "6", label: "Embedded Charts" },
              { value: "100+", label: "Currencies Supported" },
            ].map((s) => (
              <div key={s.label} className="col-6 col-sm-3">
                <div className="text-3xl sm:text-4xl font-black text-white mb-1">{s.value}</div>
                <div
                  className="text-xs font-medium uppercase"
                  style={{ color: "#bbf7d0", letterSpacing: "0.1em" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Two complete documents, one generation
            </h2>
            <p className="text-gray-500 mx-auto" style={{ maxWidth: 400 }}>
              Every generation produces a professionally formatted Business Plan and a fully
              functional Financial Model, built from your actual data.
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-6">
              <div
                className="h-100 d-flex flex-column"
                style={{ background: "white", borderRadius: 28, padding: "40px 36px", boxShadow: "0 2px 20px rgba(0,0,0,0.07)", transition: "box-shadow 0.3s, transform 0.3s" }}
                onMouseEnter={(e) => { const el = e.currentTarget; el.style.boxShadow = "0 20px 60px rgba(0,0,0,0.14)"; el.style.transform = "translateY(-6px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget; el.style.boxShadow = "0 2px 20px rgba(0,0,0,0.07)"; el.style.transform = "translateY(0)"; }}
              >
                <div className="d-flex align-items-center gap-3 mb-5">
                  <div
                    className="d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 64, height: 64, background: "#111827", borderRadius: 20 }}
                  >
                    <FileText size={28} color="white" />
                  </div>
                  <div>
                    <p style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 2 }}>Business Plan</p>
                    <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 0 }}>Microsoft Word (.docx)</p>
                  </div>
                </div>
                <ul className="list-unstyled">
                  {[
                    "AI-Written Executive Summary",
                    "Company Introduction and Vision",
                    "Industry & Market Analysis",
                    "Competitor Review",
                    "Financial Highlights & Projections",
                    "Six Embedded Professional Charts",
                    "APA-Cited Reference List",
                  ].map((item) => (
                    <li key={item} className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: 15, color: "#4b5563" }}>
                      <CheckCircle size={15} style={{ color: "#16a34a", flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div
                className="h-100 d-flex flex-column"
                style={{ background: "white", borderRadius: 28, padding: "40px 36px", boxShadow: "0 2px 20px rgba(0,0,0,0.07)", transition: "box-shadow 0.3s, transform 0.3s" }}
                onMouseEnter={(e) => { const el = e.currentTarget; el.style.boxShadow = "0 20px 60px rgba(0,0,0,0.14)"; el.style.transform = "translateY(-6px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget; el.style.boxShadow = "0 2px 20px rgba(0,0,0,0.07)"; el.style.transform = "translateY(0)"; }}
              >
                <div className="d-flex align-items-center gap-3 mb-5">
                  <div
                    className="d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 64, height: 64, background: "#16a34a", borderRadius: 20 }}
                  >
                    <BarChart2 size={28} color="white" />
                  </div>
                  <div>
                    <p style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 2 }}>Financial Model</p>
                    <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 0 }}>Excel Workbook (.xlsx, 19 sheets)</p>
                  </div>
                </div>
                <ul className="list-unstyled">
                  {[
                    "CAPEX & Product Bill of Materials",
                    "Staff, Payroll & Deduction Schedules",
                    "Operating Expenses (Multi-Year)",
                    "Revenue Forecast & Sales Volume",
                    "Cash Flow Statement",
                    "Income Statement & P&L",
                    "NPV, IRR, Payback Period & Balance Sheet",
                  ].map((item) => (
                    <li key={item} className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: 15, color: "#4b5563" }}>
                      <CheckCircle size={15} style={{ color: "#16a34a", flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24" style={{ background: "#030712" }}>
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Three steps. One session.
            </h2>
            <p className="text-gray-400 mx-auto" style={{ maxWidth: 400 }}>
              From your first input to investor-ready documents, guided, automated, complete.
            </p>
          </div>
          <div className="row g-5">
            {[
              {
                num: "01",
                title: "Complete the guided form",
                desc: "Our structured 10-step form walks you through company details, team, products, market analysis, and financial projections. No finance expertise required.",
                time: "~10 minutes",
              },
              {
                num: "02",
                title: "AI generates your documents",
                desc: "Our system analyses your data and produces a professional narrative, all financial calculations, and six embedded charts, automatically.",
                time: "2 to 3 minutes",
              },
              {
                num: "03",
                title: "Receive and present",
                desc: "Receive a complete Business Plan Word document and a full Excel financial model, polished, internally consistent, and ready for investors.",
                time: "Instant",
              },
            ].map((step) => (
              <div key={step.num} className="col-md-4 text-center">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 mx-auto mb-4 shadow"
                  style={{
                    width: 56,
                    height: 56,
                    background: "#16a34a",
                    boxShadow: "0 10px 30px rgba(22,163,74,0.35)",
                  }}
                >
                  <span className="text-white font-black text-lg">{step.num}</span>
                </div>
                <div
                  className="inline-flex items-center gap-1 text-xs font-semibold rounded-full px-3 py-1 mb-3"
                  style={{
                    color: "#4ade80",
                    background: "rgba(22,163,74,0.1)",
                    border: "1px solid rgba(22,163,74,0.25)",
                  }}
                >
                  {step.time}
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">{step.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <SignUpButton mode="modal">
              <button
                className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-bold rounded-xl transition-all text-sm border-0"
                style={{
                  background: "#16a34a",
                  boxShadow: "0 10px 25px rgba(22,163,74,0.35)",
                }}
              >
                Start now
                <ArrowRight size={15} />
              </button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* Professional Quality */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "#16a34a", letterSpacing: "0.12em" }}
              >
                Our Promise
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                Your documents won&apos;t look like they were written by AI
              </h2>
              <p className="text-gray-500 leading-relaxed mb-5">
                We don&apos;t produce generic outputs. Our system is built on professional business document
                structures, industry-specific frameworks, and real financial modelling standards.
                Every business plan reads like it was written by an experienced consultant.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                We also go the extra mile to support every client. If you need help sourcing the
                right inputs, understanding your financials, or refining your narrative, our team
                is here to make sure the final document reflects your actual business.
              </p>
              <SignUpButton mode="modal">
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-bold rounded-xl transition-all border-0"
                  style={{ background: "#16a34a" }}
                >
                  Generate My Business Plan
                  <ArrowRight size={14} />
                </button>
              </SignUpButton>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                {[
                  {
                    Icon: Award,
                    title: "Indistinguishable from consultant work",
                    desc: "Our output meets the quality standard of documents produced by experienced business consultants. Investors and lenders take it seriously.",
                  },
                  {
                    Icon: Users,
                    title: "Extra-mile client support",
                    desc: "Our team helps you get the inputs right. From financial figures to market data, we support you through every part of the process.",
                  },
                  {
                    Icon: ShieldCheck,
                    title: "Internally consistent",
                    desc: "The business plan narrative and financial model are aligned. Every figure in the document matches the model. No inconsistencies.",
                  },
                  {
                    Icon: Brain,
                    title: "Market-specific intelligence",
                    desc: "Content is generated for your specific industry, country, and business context. Not a generic template with your name inserted.",
                  },
                ].map((item) => {
                  const ItemIcon = item.Icon;
                  return (
                    <div key={item.title} className="col-6">
                      <div
                        className="h-100"
                        style={{ background: "white", borderRadius: 24, padding: "28px 24px", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", transition: "box-shadow 0.3s, transform 0.3s" }}
                        onMouseEnter={(e) => { const el = e.currentTarget; el.style.boxShadow = "0 16px 48px rgba(0,0,0,0.14)"; el.style.transform = "translateY(-4px)"; }}
                        onMouseLeave={(e) => { const el = e.currentTarget; el.style.boxShadow = "0 2px 16px rgba(0,0,0,0.07)"; el.style.transform = "translateY(0)"; }}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center mb-3"
                          style={{ width: 52, height: 52, background: "rgba(22,163,74,0.1)", borderRadius: 16 }}
                        >
                          <ItemIcon size={22} style={{ color: "#16a34a" }} />
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 6 }}>{item.title}</p>
                        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, marginBottom: 0 }}>{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24" style={{ background: "#f9fafb" }}>
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything in a single generation
            </h2>
            <p className="text-gray-500 mx-auto" style={{ maxWidth: 420 }}>
              Built for founders, consultants, and financial analysts who need professional output
              without the manual effort.
            </p>
          </div>
          <div className="row g-4">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="col-md-6 col-lg-4">
                <div
                  className="h-100 d-flex flex-column"
                  style={{ background: "white", borderRadius: 24, padding: "36px 32px", boxShadow: "0 2px 20px rgba(0,0,0,0.07)", transition: "box-shadow 0.3s, transform 0.3s" }}
                  onMouseEnter={(e) => { const el = e.currentTarget; el.style.boxShadow = "0 20px 60px rgba(0,0,0,0.14)"; el.style.transform = "translateY(-6px)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget; el.style.boxShadow = "0 2px 20px rgba(0,0,0,0.07)"; el.style.transform = "translateY(0)"; }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center mb-4"
                    style={{ width: 60, height: 60, background: "#16a34a", borderRadius: 20, color: "white", flexShrink: 0 }}
                  >
                    {feat.icon}
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 10 }}>{feat.title}</h3>
                  <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.65, marginBottom: 0 }}>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it works */}
      <section className="py-24 bg-black">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Not a template tool.{" "}
              <span style={{ color: "#4ade80" }}>An intelligence engine.</span>
            </h2>
            <p className="text-gray-400 mx-auto leading-relaxed" style={{ maxWidth: 600 }}>
              Our system is built on an advanced AI model that understands your business context,
              industry, location, and financial data. It does not fill in blanks. It thinks, analyses,
              and produces market-specific strategic narrative that reflects your actual business.
            </p>
          </div>
          <div className="row g-3">
            {[
              {
                icon: <Brain size={26} />,
                title: "Context-Aware Analysis",
                desc: "The AI reads your industry, location, and financial inputs to generate narrative that accurately reflects your specific business.",
              },
              {
                icon: <Zap size={26} />,
                title: "Real-Time Financial Intelligence",
                desc: "NPV, IRR, payback period, break-even, and cash flow, all computed automatically with live Excel formulas.",
              },
              {
                icon: <ShieldCheck size={26} />,
                title: "Research-Backed Content",
                desc: "Sections include market statistics, industry benchmarks, and data-driven analysis with APA-cited references.",
              },
            ].map((item) => (
              <div key={item.title} className="col-md-4">
                <div
                  className="h-100"
                  style={{ background: "rgba(255,255,255,0.07)", borderRadius: 28, padding: "36px 32px", transition: "background 0.3s, transform 0.3s" }}
                  onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = "rgba(255,255,255,0.12)"; el.style.transform = "translateY(-5px)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = "rgba(255,255,255,0.07)"; el.style.transform = "translateY(0)"; }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center mb-4"
                    style={{ width: 60, height: 60, background: "rgba(22,163,74,0.25)", borderRadius: 20, color: "#4ade80" }}
                  >
                    {item.icon}
                  </div>
                  <h3 style={{ color: "white", fontWeight: 600, fontSize: 17, marginBottom: 10 }}>{item.title}</h3>
                  <p style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.65, marginBottom: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Clear, straightforward pricing
            </h2>
            <p className="text-gray-500 mx-auto" style={{ maxWidth: 420 }}>
              Get a complete, investor-ready business plan and financial model, professionally
              produced and fully yours.
            </p>
          </div>
          <div className="row g-4 justify-content-center align-items-start">

            <div className="col-md-5">
              <div
                className="d-flex flex-column"
                style={{ background: "white", borderRadius: 24, padding: "32px 28px", boxShadow: "0 2px 24px rgba(0,0,0,0.08)", transition: "box-shadow 0.3s, transform 0.3s" }}
                onMouseEnter={(e) => { const el = e.currentTarget; el.style.boxShadow = "0 20px 60px rgba(0,0,0,0.14)"; el.style.transform = "translateY(-6px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget; el.style.boxShadow = "0 2px 24px rgba(0,0,0,0.08)"; el.style.transform = "translateY(0)"; }}
              >
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#6b7280", marginBottom: 10 }}>
                  Per Document
                </p>
                <div className="d-flex align-items-baseline gap-1 mb-2">
                  <span style={{ fontSize: 44, fontWeight: 900, color: "#111827", lineHeight: 1 }}>$69</span>
                  <span style={{ fontSize: 13, color: "#9ca3af" }}>/ document</span>
                </div>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 18, lineHeight: 1.55 }}>
                  One document — either a <strong style={{ color: "#111827" }}>Business Plan</strong> or a <strong style={{ color: "#111827" }}>Financial Model</strong>.
                </p>
                <ul className="list-unstyled mb-4">
                  {[
                    "Written business plan (.docx)",
                    "OR 19-sheet financial model (.xlsx)",
                    "Six embedded professional charts",
                    "Delivered in minutes",
                  ].map((f) => (
                    <li key={f} className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: 14, color: "#374151" }}>
                      <CheckCircle size={14} style={{ color: "#16a34a", flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <SignUpButton mode="modal">
                  <button
                    className="w-full font-bold border-0 transition-all"
                    style={{ background: "#111827", color: "white", borderRadius: 12, padding: "12px 0", fontSize: 14 }}
                  >
                    Get Started
                  </button>
                </SignUpButton>
              </div>
            </div>

            <div className="col-md-5 position-relative">
              <div
                className="d-flex flex-column"
                style={{ background: "white", borderRadius: 24, padding: "32px 28px", boxShadow: "0 8px 40px rgba(22,163,74,0.22)", border: "2px solid #16a34a", transition: "box-shadow 0.3s, transform 0.3s" }}
                onMouseEnter={(e) => { const el = e.currentTarget; el.style.boxShadow = "0 24px 70px rgba(22,163,74,0.32)"; el.style.transform = "translateY(-6px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget; el.style.boxShadow = "0 8px 40px rgba(22,163,74,0.22)"; el.style.transform = "translateY(0)"; }}
              >
                <span
                  className="position-absolute font-bold text-white px-3 py-1 rounded-full"
                  style={{ top: -13, left: "50%", transform: "translateX(-50%)", background: "#16a34a", whiteSpace: "nowrap", fontSize: 11 }}
                >
                  Best Value
                </span>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#16a34a", marginBottom: 10 }}>
                  Complete Package
                </p>
                <div className="d-flex align-items-baseline gap-1 mb-2">
                  <span style={{ fontSize: 44, fontWeight: 900, color: "#111827", lineHeight: 1 }}>$137</span>
                  <span style={{ fontSize: 13, color: "#9ca3af" }}>/ bundle</span>
                </div>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 18, lineHeight: 1.55 }}>
                  Full <strong style={{ color: "#111827" }}>Business Plan + Financial Model</strong>. We develop it entirely, or you use our system yourself.
                </p>
                <ul className="list-unstyled mb-4">
                  {[
                    "Complete written business plan",
                    "Full 19-sheet financial model",
                    "Six embedded professional charts",
                    "NPV, IRR, payback & cash flow",
                    "Investor-ready in under 15 minutes",
                    "Self-serve or we build it for you",
                  ].map((f) => (
                    <li key={f} className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: 14, color: "#374151" }}>
                      <CheckCircle size={14} style={{ color: "#16a34a", flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <SignUpButton mode="modal">
                  <button
                    className="w-full font-bold border-0 transition-all"
                    style={{ background: "#16a34a", color: "white", borderRadius: 12, padding: "12px 0", fontSize: 14 }}
                  >
                    Get the Complete Package
                  </button>
                </SignUpButton>
              </div>
            </div>

          </div>
          <p className="text-center text-xs text-gray-400 mt-8 d-flex align-items-center justify-content-center gap-2">
            <LineChart size={11} style={{ color: "#16a34a" }} />
            Contact your administrator to get credits and start generating
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24" style={{ background: "#16a34a" }}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5 leading-tight">
                Your next business plan should not take weeks
              </h2>
              <p className="text-white mb-9 leading-relaxed" style={{ opacity: 0.9, maxWidth: 520, margin: "0 auto 2.25rem" }}>
                Join entrepreneurs and consultants who use Logistack Plan to produce professional
                business documents in a single session and present with confidence.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <SignUpButton mode="modal">
                  <button
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white font-bold rounded-xl hover:opacity-90 transition-all text-sm border-0"
                    style={{ color: "#15803d" }}
                  >
                    Generate My Business Plan
                    <ArrowRight size={16} />
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-xl hover:opacity-80 transition-all text-sm border-0"
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.4)",
                    }}
                  >
                    Sign In to Dashboard
                    <ChevronRight size={15} />
                  </button>
                </SignInButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="container py-5">
          <div className="row g-4 g-md-5">

            <div className="col-12 col-md-5">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-2"
                  style={{ width: 30, height: 30, background: "#16a34a" }}
                >
                  <Layers size={14} color="white" />
                </div>
                <span className="font-bold text-white">Logistack Plan</span>
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "#6b7280", maxWidth: 280 }}>
                Logistack Plan generates professional business plans and financial models using
                AI and Python charts.
              </p>
              <div className="d-flex align-items-center gap-1 mb-3">
                <MapPin size={13} style={{ color: "#4ade80", flexShrink: 0 }} />
                <span className="text-xs" style={{ color: "#6b7280" }}>
                  Kigali, KG 9 Ave, Deco Center, Kigali, Rwanda
                </span>
              </div>
              <div className="d-flex align-items-center gap-2 mb-3">
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
                    className="d-flex align-items-center justify-content-center rounded-2 no-underline"
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
              <div className="d-flex align-items-center gap-2 text-xs" style={{ color: "#6b7280" }}>
                <span
                  className="rounded-circle"
                  style={{ width: 7, height: 7, background: "#4ade80", display: "inline-block" }}
                />
                All systems operational
              </div>
            </div>

            <div className="col-6 col-md-3 col-lg-2 offset-md-1 offset-lg-2">
              <h3
                className="text-xs font-semibold uppercase mb-4"
                style={{ color: "#9ca3af", letterSpacing: "0.1em" }}
              >
                Product
              </h3>
              <ul className="list-unstyled">
                {[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "New Business Plan", href: "/form" },
                  { label: "Financial Model", href: "/form" },
                  { label: "Agricoders Portal", href: "/" },
                ].map((link) => (
                  <li key={link.label} className="mb-2">
                    <a href={link.href} className="text-sm no-underline" style={{ color: "#6b7280" }}>
                      {link.label}
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
                  { label: "Contact", href: "mailto:agricoders@gmail.com" },
                  { label: "Support", href: "mailto:agricoders@gmail.com" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                ].map((link) => (
                  <li key={link.label} className="mb-2">
                    <a href={link.href} className="text-sm no-underline" style={{ color: "#6b7280" }}>
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
                &copy; {new Date().getFullYear()} Logistack Plan by Agricoders. All rights reserved.
              </span>
              <div className="d-flex align-items-center gap-3 text-xs" style={{ color: "#4b5563" }}>
                <a href="/privacy" className="no-underline" style={{ color: "#4b5563" }}>Privacy</a>
                <a href="/terms" className="no-underline" style={{ color: "#4b5563" }}>Terms</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
