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
  Download,
  Globe,
  TrendingUp,
  Zap,
} from "lucide-react";
import Footer from "@/components/layout/Footer";

const FEATURES = [
  {
    icon: <Brain size={20} />,
    title: "AI-Written Narrative",
    desc: "Executive Summary, Industry Analysis, Market Context, and Conclusion — fully tailored to your business, industry, and location.",
  },
  {
    icon: <BarChart2 size={20} />,
    title: "Six Professional Charts",
    desc: "Revenue forecasts, cash flow, income summaries, and break-even charts — auto-generated and embedded into your Word document.",
  },
  {
    icon: <TrendingUp size={20} />,
    title: "Complete Financial Model",
    desc: "A 19-sheet Excel workbook covering CAPEX, OPEX, revenue, cash flow, NPV, IRR, payback period, balance sheet, and loan amortisation.",
  },
  {
    icon: <FileText size={20} />,
    title: "Investor-Ready Business Plan",
    desc: "A professionally structured Word document covering every section investors and lenders expect — formatted and ready for immediate submission.",
  },
  {
    icon: <Globe size={20} />,
    title: "Any Business, Any Market",
    desc: "From agribusiness to technology and hospitality. Supports every global currency and adapts analysis to your specific market and country.",
  },
  {
    icon: <Download size={20} />,
    title: "Instant Document Delivery",
    desc: "Your Business Plan (.docx) and Financial Model (.xlsx) are ready for immediate download the moment generation completes.",
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

      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center shadow-sm">
                <Layers size={17} className="text-white" />
              </div>
              <span className="font-bold text-gray-900 text-[15px] tracking-tight">Logistack Plan</span>
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
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-all"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm">
                  Get Started
                  <ArrowRight size={14} />
                </button>
              </SignUpButton>
            </div>

            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-3 space-y-1">
            {[
              { label: "How it works", href: "#how-it-works" },
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "#pricing" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 mt-2">
              <SignInButton mode="modal">
                <button className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl">
                  Get Started
                  <ArrowRight size={14} />
                </button>
              </SignUpButton>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="bg-black px-4 sm:px-6 py-28 sm:py-36 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.06] tracking-tight">
            Investor-Ready Business Plans{" "}
            <span className="text-green-500">in Under 15 Minutes</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Logistack Plan uses Artificial Intelligence to instantly produce a complete{" "}
            <strong className="text-white">Business Plan</strong> and a full{" "}
            <strong className="text-white">Financial Model</strong> — so you can focus on building your business, not writing documents.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <SignUpButton mode="modal">
              <button className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-green-900/40">
                Generate My Business Plan
                <ArrowRight size={16} />
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold rounded-xl transition-all text-sm">
                Sign In to Dashboard
                <ChevronRight size={15} className="text-gray-400" />
              </button>
            </SignInButton>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
            {["Any industry", "Any country", "Any currency", "Download instantly"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={12} className="text-green-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-green-600 px-4 sm:px-6 py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: "< 5 min", label: "Generation Time" },
            { value: "19", label: "Excel Sheets" },
            { value: "6", label: "Embedded Charts" },
            { value: "100+", label: "Currencies Supported" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">{s.value}</div>
              <div className="text-xs text-green-100 font-medium uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── What you get ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Two complete documents, one generation
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Every generation produces a professionally formatted Business Plan and a fully functional Financial Model, built from your actual data.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border-2 border-gray-100 rounded-2xl p-7 hover:border-green-200 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
                  <FileText size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Business Plan</p>
                  <p className="text-xs text-gray-400">.docx — Microsoft Word</p>
                </div>
              </div>
              <ul className="space-y-2.5">
                {[
                  "Executive Summary — AI written",
                  "Company Introduction and Vision",
                  "Industry & Market Analysis",
                  "Competitor Review",
                  "Financial Highlights & Projections",
                  "Six Embedded Professional Charts",
                  "APA-Cited Reference List",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-2 border-gray-100 rounded-2xl p-7 hover:border-green-200 hover:shadow-lg transition-all">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                  <BarChart2 size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Financial Model</p>
                  <p className="text-xs text-gray-400">.xlsx — Excel, 19 sheets</p>
                </div>
              </div>
              <ul className="space-y-2.5">
                {[
                  "CAPEX & Product Bill of Materials",
                  "Staff, Payroll & Deduction Schedules",
                  "Operating Expenses — Multi-Year",
                  "Revenue Forecast & Sales Volume",
                  "Cash Flow Statement",
                  "Income Statement & P&L",
                  "NPV, IRR, Payback Period & Balance Sheet",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-24 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Three steps. One session.
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              From your first input to investor-ready documents — guided, automated, complete.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
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
                desc: "Our system analyses your data and produces a professional narrative, all financial calculations, and six embedded charts — automatically.",
                time: "2–3 minutes",
              },
              {
                num: "03",
                title: "Download and present",
                desc: "Receive a complete Business Plan Word document and a full Excel financial model — polished, internally consistent, and ready for investors.",
                time: "Instant",
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-900/40">
                  <span className="text-white font-black text-lg">{step.num}</span>
                </div>
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-400 bg-green-950 border border-green-900 rounded-full px-3 py-1 mb-3">
                  {step.time}
                </div>
                <h3 className="font-bold text-white mb-2 text-sm">{step.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <SignUpButton mode="modal">
              <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-green-900/40">
                Start now
                <ArrowRight size={15} />
              </button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything in a single generation
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Built for founders, consultants, and financial analysts who need professional output without the manual effort.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all group">
                <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center mb-4 text-white group-hover:bg-green-500 transition-colors">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{feat.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why it works ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Not a template tool.{" "}
              <span className="text-green-500">An intelligence engine.</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Our system is built on an advanced AI model that understands your business context, industry, location, and financial data. It does not fill in blanks — it thinks, analyses, and produces market-specific strategic narrative that reflects your actual business.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: <Brain size={18} />,
                title: "Context-Aware Analysis",
                desc: "The AI reads your industry, location, and financial inputs to generate narrative that accurately reflects your specific business.",
              },
              {
                icon: <Zap size={18} />,
                title: "Real-Time Financial Intelligence",
                desc: "NPV, IRR, payback period, break-even, and cash flow — all computed automatically with live Excel formulas.",
              },
              {
                icon: <ShieldCheck size={18} />,
                title: "Research-Backed Content",
                desc: "AI-generated sections include market statistics, industry benchmarks, and data-driven analysis with APA-cited references.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/8 transition-all">
                <div className="w-9 h-9 rounded-lg bg-green-600/20 flex items-center justify-center text-green-400 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 py-24 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Get a complete, investor-ready business plan and financial model — professionally produced, fully yours.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Per document */}
            <div className="border-2 border-gray-100 rounded-2xl p-8 hover:border-green-200 hover:shadow-lg transition-all">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Per Document</p>
              <div className="mb-2">
                <span className="text-5xl font-black text-gray-900">$69</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                One document — either a <strong className="text-gray-800">Business Plan</strong> or a <strong className="text-gray-800">Financial Model</strong>.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  "AI-written business plan (.docx)",
                  "OR 19-sheet financial model (.xlsx)",
                  "Six embedded professional charts",
                  "Instant download",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <SignUpButton mode="modal">
                <button className="w-full py-3 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all">
                  Get Started
                </button>
              </SignUpButton>
            </div>

            {/* Complete package */}
            <div className="border-2 border-green-500 rounded-2xl p-8 relative shadow-xl shadow-green-100">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[11px] font-bold bg-green-600 text-white px-4 py-1.5 rounded-full shadow-sm">
                Best Value
              </span>
              <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-4">Complete Package</p>
              <div className="mb-2">
                <span className="text-5xl font-black text-gray-900">$137</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Full <strong className="text-gray-800">Business Plan + Financial Model</strong>. We develop it entirely, or you use our system yourself.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  "Complete AI-written business plan",
                  "Full 19-sheet financial model",
                  "Six embedded professional charts",
                  "NPV, IRR, payback & cash flow",
                  "Investor-ready in under 15 minutes",
                  "Choose: self-serve or we build it for you",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <SignUpButton mode="modal">
                <button className="w-full py-3 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-green-200">
                  Get the Complete Package
                </button>
              </SignUpButton>
            </div>

          </div>
          <p className="text-center text-xs text-gray-400 mt-8 flex items-center justify-center gap-1.5">
            <LineChart size={11} className="text-green-500" />
            Contact your administrator to get credits and start generating
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-green-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5 leading-tight">
            Your next business plan should not take weeks
          </h2>
          <p className="text-green-100 text-base mb-9 leading-relaxed max-w-lg mx-auto">
            Join entrepreneurs and consultants who use Logistack Plan to produce professional, AI-powered business documents in a single session — and present with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <SignUpButton mode="modal">
              <button className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-all text-sm shadow-xl">
                Generate My Business Plan
                <ArrowRight size={16} />
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-sm">
                Sign In to Dashboard
                <ChevronRight size={15} />
              </button>
            </SignInButton>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
