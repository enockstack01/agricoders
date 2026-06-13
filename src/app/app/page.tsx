"use client";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FileText,
  BarChart2,
  Download,
  Sparkles,
  TrendingUp,
  Globe,
  ArrowRight,
  Layers,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  LineChart,
  ShieldCheck,
  ChevronRight,
  Timer,
  X,
  Menu,
  Smartphone,
  Monitor,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import { CREDIT_PACKAGES } from "@/lib/credit-packages";

const STATS = [
  { value: "< 5 min", label: "Average Generation Time" },
  { value: "19", label: "Excel Sheets Generated" },
  { value: "6", label: "Professional Charts" },
  { value: "100+", label: "Supported Currencies" },
];

const FEATURES = [
  {
    icon: <Brain size={22} />,
    title: "AI-Powered Narrative",
    desc: "Our intelligent system writes your Executive Summary, Industry Analysis, Market Context, and Conclusion — fully tailored to your specific business, industry, and location.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: <BarChart2 size={22} />,
    title: "Six Embedded Charts",
    desc: "Professional revenue forecasts, cash flow, income summaries, and break-even analysis charts generated automatically and embedded into your Word document.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: <TrendingUp size={22} />,
    title: "Complete Financial Model",
    desc: "A full 19-sheet Excel workbook covering CAPEX, OPEX, revenue, cash flow, NPV, IRR, cost-benefit analysis, payback period, balance sheet, and loan amortization.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: <FileText size={22} />,
    title: "Investor-Ready Business Plan",
    desc: "A professionally structured Word document covering every section investors and lenders expect — referenced, formatted, and ready for immediate submission.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: <Globe size={22} />,
    title: "Any Business, Any Market",
    desc: "From technology startups to manufacturing, agriculture to hospitality. Supports every global currency and adapts analysis to your specific market and country.",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: <Download size={22} />,
    title: "Instant Document Delivery",
    desc: "Your Business Plan (.docx) and Financial Model (.xlsx) are ready for immediate download the moment generation completes. No waiting. No manual assembly.",
    color: "bg-rose-50 text-rose-600",
  },
];

const STEPS = [
  {
    num: "01",
    icon: <FileText size={20} />,
    title: "Complete the guided form",
    desc: "Our structured 10-step form walks you through company details, team composition, products and services, market analysis, and financial projections. No finance expertise required.",
    time: "10 minutes",
  },
  {
    num: "02",
    icon: <Brain size={20} />,
    title: "AI generates your documents",
    desc: "Our intelligent system analyzes your data and produces a professional narrative, all financial calculations, and six embedded charts — automatically and with precision.",
    time: "2 to 3 minutes",
  },
  {
    num: "03",
    icon: <Download size={20} />,
    title: "Download and present",
    desc: "Receive a complete Business Plan Word document and a full Excel financial model — polished, internally consistent, and ready for investors or financial institutions.",
    time: "Instant",
  },
];

const OLD_WAY = [
  "Spending 2 to 4 weeks writing a business plan manually",
  "Hiring expensive consultants for financial modeling",
  "Struggling with complex Excel formulas and projection logic",
  "Rewriting entire documents every time a number changes",
  "Inconsistent formatting across Word and Excel files",
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

      {/* ── Navigation Header ──────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/97 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Brand */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-md shadow-green-200">
                <Layers size={17} className="text-white" />
              </div>
              <span className="font-bold text-gray-900 text-[15px] tracking-tight">
                Logistack Plan
              </span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { label: "How it works", href: "#how-it-works" },
                { label: "Features", href: "#features" },
                { label: "Download", href: "#download" },
                { label: "Pricing", href: "#pricing" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all group"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-2">
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-green-500 to-emerald-700 hover:from-green-600 hover:to-emerald-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-green-200 hover:shadow-green-300 hover:-translate-y-px">
                  Get Started Free
                  <ArrowRight size={14} />
                </button>
              </SignUpButton>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-3 space-y-1">
            {[
              { label: "How it works", href: "#how-it-works" },
              { label: "Features", href: "#features" },
              { label: "Download", href: "#download" },
              { label: "Pricing", href: "#pricing" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 mt-2">
              <SignInButton mode="modal">
                <button className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-green-500 to-emerald-700 text-white text-sm font-semibold rounded-xl transition-all">
                  Get Started Free
                  <ArrowRight size={14} />
                </button>
              </SignUpButton>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-green-50/50 px-4 sm:px-6 py-24 sm:py-32 text-center">
        {/* Background geometry */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-48 -right-32 w-[500px] h-[500px] rounded-full bg-green-100/50 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-emerald-100/40 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/60 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* AI badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold mb-8 shadow-sm">
            <Sparkles size={12} className="text-green-500" />
            Powered by Artificial Intelligence
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold text-gray-900 mb-6 leading-[1.08] tracking-tight">
            Generate Investor-Ready{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                Business Plans
              </span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-green-100/70 rounded -z-0" />
            </span>
            <br className="hidden sm:block" />
            {" "}in Under 15 Minutes
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Logistack Plan uses{" "}
            <strong className="text-gray-700 font-semibold">Artificial Intelligence</strong>{" "}
            to instantly produce a complete{" "}
            <strong className="text-gray-700 font-semibold">Business Plan</strong> and a full{" "}
            <strong className="text-gray-700 font-semibold">Financial Model</strong> — so you
            can focus on building your business, not writing documents.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <SignUpButton mode="modal">
              <button className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-gradient-to-br from-green-500 to-emerald-700 hover:from-green-600 hover:to-emerald-800 text-white font-semibold rounded-xl transition-all shadow-xl shadow-green-200 hover:shadow-green-300 hover:-translate-y-0.5 text-sm">
                Generate My Business Plan
                <ArrowRight size={16} />
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl border border-gray-200 transition-all text-sm hover:-translate-y-0.5 hover:shadow-md">
                Sign In to Dashboard
                <ChevronRight size={15} className="text-gray-400" />
              </button>
            </SignInButton>
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs text-gray-400">
            {[
              "No credit card required",
              "Any industry",
              "Any currency",
              "Download instantly",
              "AI-generated narrative",
            ].map((label) => (
              <span
                key={label}
                className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3.5 py-1.5 shadow-sm font-medium"
              >
                <CheckCircle size={11} className="text-green-500" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 px-4 sm:px-6 py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl sm:text-4xl font-black text-white mb-1 tracking-tight">
                {s.value}
              </div>
              <div className="text-xs text-green-200 font-medium uppercase tracking-widest">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Problem vs Solution ─────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* The old way */}
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 rounded-full px-3.5 py-1.5 mb-6">
                <X size={11} />
                The conventional approach
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                Business planning should not consume weeks of your time
              </h2>
              <p className="text-sm text-gray-500 mb-7 leading-relaxed">
                Most founders and consultants lose 2 to 4 weeks per business plan — battling Word
                formatting, complex Excel formulas, financial projections, and narrative writing.
                That time is better invested in building your business.
              </p>
              <ul className="space-y-3">
                {OLD_WAY.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-gray-500">
                    <div className="w-5 h-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X size={10} className="text-red-400" />
                    </div>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* The Logistack Plan way */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50/70 rounded-2xl" />
              <div className="relative p-8">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-100 border border-green-200 rounded-full px-3.5 py-1.5 mb-6">
                  <Zap size={11} />
                  The Logistack Plan approach
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 leading-snug">
                  From input form to finished documents in a single session
                </h3>
                <div className="space-y-3.5">
                  {[
                    {
                      icon: <Timer size={15} />,
                      title: "Complete in under 15 minutes",
                      desc: "Fill the guided form in approximately 10 minutes. Documents generate in 3 minutes.",
                    },
                    {
                      icon: <Brain size={15} />,
                      title: "AI writes the narrative for you",
                      desc: "Intelligent analysis tailors professional narrative to your business, industry, and market.",
                    },
                    {
                      icon: <LineChart size={15} />,
                      title: "All financials calculated automatically",
                      desc: "Every formula, projection, chart, and financial ratio is computed on your behalf.",
                    },
                    {
                      icon: <ShieldCheck size={15} />,
                      title: "Consistent, publication-ready output",
                      desc: "Word and Excel documents formatted to a professional standard — every time.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex gap-3.5 items-start bg-white rounded-xl p-4 shadow-sm border border-green-100 hover:shadow-md hover:-translate-y-px transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── AI Intelligence section ─────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-green-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-400/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-semibold mb-8">
            <Sparkles size={12} />
            Artificial Intelligence at the core
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight">
            Not a template tool.{" "}
            <br className="hidden sm:block" />
            <span className="text-green-400">An intelligent business planning engine.</span>
          </h2>
          <p className="text-gray-400 text-base mb-12 max-w-2xl mx-auto leading-relaxed">
            Our system is built on an advanced AI model that understands your business context,
            industry, location, and financial data. It does not fill in blanks — it thinks,
            analyses, and produces market-specific strategic narrative that reflects your
            actual business, not generic boilerplate.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {[
              {
                icon: <Brain size={18} />,
                title: "Context-Aware Analysis",
                desc: "The AI reads your industry, location, and financial inputs to generate narrative that accurately reflects your specific business — not filler content.",
              },
              {
                icon: <Zap size={18} />,
                title: "Real-Time Financial Intelligence",
                desc: "NPV, IRR, payback period, break-even, cost-benefit analysis, and cash flow — all computed automatically with live Excel formulas.",
              },
              {
                icon: <ShieldCheck size={18} />,
                title: "Research-Backed Content",
                desc: "AI-generated sections include market statistics, industry benchmarks, and data-driven analysis with APA-cited references for credibility.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/5 border border-white/8 rounded-xl p-5 hover:bg-white/10 hover:border-white/15 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-green-500/15 border border-green-500/20 flex items-center justify-center text-green-400 mb-4 group-hover:bg-green-500/25 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-24 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-3.5 py-1.5 mb-5">
              <Clock size={11} />
              Start to finish in under 15 minutes
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Three steps to a complete business plan
            </h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              From your first input to investor-ready documents — the entire process is
              guided, automated, and completed in a single session.
            </p>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-green-200 via-green-400 to-green-200" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 relative">
              {STEPS.map((step, idx) => (
                <div key={step.num} className="flex flex-col items-center text-center group">
                  <div className="relative mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-green-200/60 relative z-10 group-hover:shadow-green-300 group-hover:-translate-y-1 transition-all">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-green-600 flex items-center justify-center shadow-sm z-20">
                      <span className="text-green-700 font-black text-[10px]">{idx + 1}</span>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 rounded-full px-3 py-1 mb-3 border border-green-100">
                    <Timer size={9} />
                    {step.time}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm leading-snug">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 text-center">
            <SignUpButton mode="modal">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-green-500 to-emerald-700 hover:from-green-600 hover:to-emerald-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-200 text-sm hover:-translate-y-0.5">
                Start the process now
                <ArrowRight size={15} />
              </button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* ── Features grid ────────────────────────────────────────────── */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Everything produced in a single generation
            </h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Built for founders, consultants, and financial analysts who need
              professional output without the manual effort.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 group cursor-default"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${feat.color} group-hover:scale-110 transition-transform`}
                >
                  {feat.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{feat.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What you receive ─────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Two complete documents, one generation
            </h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Every generation produces a professionally formatted Business Plan and a
              fully functional Financial Model, built from your actual data.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Business Plan */}
            <div className="border border-gray-200 rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <FileText size={22} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Business Plan</p>
                  <p className="text-xs text-gray-400 mt-0.5">.docx — Microsoft Word document</p>
                </div>
              </div>
              <ul className="space-y-2.5">
                {[
                  "Executive Summary — AI written",
                  "Company Introduction and Vision",
                  "Global and Local Industry Analysis",
                  "Market Analysis and Competitor Review",
                  "Financial Highlights and Projections",
                  "Six Embedded Professional Charts",
                  "Financial Tables — Revenue, CAPEX, OPEX",
                  "APA-Cited Reference List",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-xs text-gray-600">
                    <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Financial Model */}
            <div className="border border-gray-200 rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <BarChart2 size={22} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Financial Model</p>
                  <p className="text-xs text-gray-400 mt-0.5">.xlsx — Excel workbook, 19 sheets</p>
                </div>
              </div>
              <ul className="space-y-2.5">
                {[
                  "CAPEX and Product Bill of Materials",
                  "Staff, Payroll and Deduction Schedules",
                  "Operating Expenses — Multi-Year Projection",
                  "Revenue Forecast and Sales Volume Analysis",
                  "Cash Flow Statement",
                  "Income Statement and Profit and Loss",
                  "NPV, IRR and Cost-Benefit Analysis",
                  "Payback Period and Balance Sheet",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-xs text-gray-600">
                    <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── Download Apps ────────────────────────────────────────────── */}
      <section id="download" className="px-4 sm:px-6 lg:px-8 py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-3.5 py-1.5 mb-5">
              <Download size={11} />
              Available on all platforms
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Take Logistack Plan anywhere
            </h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Generate, review, and share business plans on any device. Available on iOS, Android, Windows, macOS, and Linux.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Mobile App */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-blue-200">
                  <Smartphone size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Mobile App</p>
                  <p className="text-xs text-gray-400">iOS &amp; Android</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-7 leading-relaxed">
                Access your business plans, monitor generation status, and download documents directly from your smartphone or tablet.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#"
                  className="flex items-center gap-3 px-5 py-3.5 bg-gray-950 hover:bg-gray-800 text-white rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg flex-1 justify-center"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[9px] text-gray-400 leading-none">Download on the</p>
                    <p className="text-sm font-semibold leading-tight mt-0.5">App Store</p>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 px-5 py-3.5 bg-gray-950 hover:bg-gray-800 text-white rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg flex-1 justify-center"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.546l2.302 1.332c.694.4.694 1.4 0 1.8l-2.302 1.332-2.603-2.6 2.603-2.864zM5.864 3.657L16.8 9.99l-2.302 2.302-8.635-8.635z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[9px] text-gray-400 leading-none">Get it on</p>
                    <p className="text-sm font-semibold leading-tight mt-0.5">Google Play</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Desktop App */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-md shadow-green-200">
                  <Monitor size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Desktop App</p>
                  <p className="text-xs text-gray-400">Windows, macOS &amp; Linux</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Full-featured desktop experience with offline document access, native notifications, and seamless file management.
              </p>
              <div className="space-y-2.5">
                {([
                  {
                    os: "Windows",
                    ext: ".exe installer · 64-bit",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-500">
                        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                      </svg>
                    ),
                  },
                  {
                    os: "macOS",
                    ext: ".dmg installer · Universal",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-700">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                    ),
                  },
                  {
                    os: "Linux",
                    ext: ".AppImage / .deb · x86_64",
                    icon: (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-orange-500">
                        <path d="M20.581 19.049c-.55-.446-.336-1.431-.601-2.098-.296-.75-1.151-1.145-1.655-1.662-.381-.393-.523-.881-.787-1.319-1.026-1.719-2.744-2.634-3.765-4.352-.376-.629-.455-1.546-.455-2.279 0-2.84 2.301-5.342 5.458-5.342 3.332 0 5.458 2.708 5.458 5.551 0 1.011-.313 2.149-1.062 2.807-.37.326-.753.434-1.093.707-.267.21-.387.583-.546.887-.411.784.21 1.95.21 2.786 0 .498-.193.855-.562 1.079l-.6.235zM11.97 23.077c-.73-.3-1.369-.843-1.932-1.406-.52-.52-.859-1.166-1.42-1.581-.547-.404-1.194-.549-1.783-.887-.54-.309-.889-.839-1.28-1.356-.614-.823-1.255-1.63-2.119-2.25-.483-.348-1.041-.607-1.476-1.041-.395-.398-.551-.955-.893-1.376-.519-.646-1.251-1.012-1.932-1.446-.629-.407-1.085-.977-1.382-1.682-.263-.626-.355-1.328-.355-2.001 0-3.246 2.603-5.845 5.845-5.845 1.601 0 3.052.652 4.102 1.707l.038.038c1.011.962 1.643 2.291 1.722 3.761l.007.278c.059 1.428-.382 2.809-.756 4.156-.28 1.003-.494 1.976-.494 2.98 0 .705.119 1.388.313 2.059.13.451.39 1.016.39 1.491 0 .437-.179.8-.488 1.051l-.107.058z" />
                      </svg>
                    ),
                  },
                ] as const).map((platform) => (
                  <a
                    key={platform.os}
                    href="#"
                    className="flex items-center gap-3.5 px-4 py-3.5 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-green-200 hover:shadow-sm transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:border-green-200 transition-colors">
                      {platform.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{platform.os}</p>
                      <p className="text-xs text-gray-400">{platform.ext}</p>
                    </div>
                    <Download size={13} className="text-gray-300 group-hover:text-green-500 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────── */}
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 py-24 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-3.5 py-1.5 mb-5">
              <Zap size={11} />
              Simple, transparent pricing
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Buy credits, generate instantly
            </h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Each business plan or financial model generation costs <strong className="text-gray-700">5 credits</strong>.
              No subscription, no lock-in. Buy once, use whenever.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {CREDIT_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
                  pkg.popular
                    ? "border-green-400 bg-gradient-to-b from-green-50 to-white shadow-lg shadow-green-100"
                    : "border-gray-200 bg-white hover:border-green-200 hover:shadow-md"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-green-600 text-white px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                    Most Popular
                  </span>
                )}
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{pkg.label}</p>
                <div className="mb-1">
                  <span className="text-4xl font-extrabold text-gray-900">${(pkg.usdCents / 100).toFixed(0)}</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  <strong className="text-gray-900">{pkg.credits} credits</strong>
                </p>
                <p className="text-xs text-gray-400 mb-4">{pkg.description}</p>
                {pkg.saves ? (
                  <p className="text-xs font-semibold text-green-600 mb-4">{pkg.saves}</p>
                ) : (
                  <div className="mb-4" />
                )}
                <div className="mt-auto">
                  <SignUpButton mode="modal">
                    <button className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      pkg.popular
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-200"
                        : "bg-gray-100 hover:bg-green-600 hover:text-white text-gray-800"
                    }`}>
                      Get Started
                    </button>
                  </SignUpButton>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <ShieldCheck size={11} className="text-green-500" />
            <span>5 credits per generation · Contact admin to get credits</span>
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────── */}
      <section
        className="px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-16 w-96 h-96 bg-white/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-8 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-7">
            <Zap size={11} />
            Ready in under 15 minutes
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5 leading-tight">
            Your next business plan should not take weeks to produce
          </h2>
          <p className="text-green-100 text-base mb-9 leading-relaxed max-w-lg mx-auto">
            Join entrepreneurs and consultants who use Logistack Plan to create professional,
            AI-powered business documents in a single session — and present with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <SignUpButton mode="modal">
              <button className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-all shadow-2xl hover:-translate-y-0.5 text-sm">
                Generate My Business Plan
                <ArrowRight size={16} />
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-transparent border border-white/35 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-sm hover:-translate-y-0.5">
                Sign In to Dashboard
                <ChevronRight size={15} />
              </button>
            </SignInButton>
          </div>
          <p className="text-green-200 text-xs mt-7">
            5 credits per generation · No subscription required
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
