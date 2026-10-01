"use client";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
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
  Globe,
  TrendingUp,
  Zap,
  Award,
  Users,
  Mail,
  MapPin,
} from "lucide-react";
import AgriNav from "@/components/layout/AgriNav";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import PlanIllustration from "@/components/marketing/PlanIllustration";

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

const STATS = [
  { value: "< 5 min", label: "Generation Time" },
  { value: "19", label: "Excel Sheets" },
  { value: "6", label: "Embedded Charts" },
  { value: "100+", label: "Currencies Supported" },
];

const BUSINESS_PLAN_ITEMS = [
  "AI-Written Executive Summary",
  "Company Introduction and Vision",
  "Industry & Market Analysis",
  "Competitor Review",
  "Financial Highlights & Projections",
  "Six Embedded Professional Charts",
  "APA-Cited Reference List",
];

const FINANCIAL_MODEL_ITEMS = [
  "CAPEX & Product Bill of Materials",
  "Staff, Payroll & Deduction Schedules",
  "Operating Expenses (Multi-Year)",
  "Revenue Forecast & Sales Volume",
  "Cash Flow Statement",
  "Income Statement & P&L",
  "NPV, IRR, Payback Period & Balance Sheet",
];

const STEPS = [
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
];

const QUALITY_ITEMS = [
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
];

const WHY_IT_WORKS = [
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
];

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) router.push("/plan/dashboard");
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <AgriNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-black px-4 py-28 text-center sm:py-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="mkt-float absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-green-600/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="text-center lg:text-left">
              <Reveal>
                <h1 className="mb-6 text-balance text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Investor-Ready Business Plans{" "}
                  <span className="text-green-400">in Under 15 Minutes</span>
                </h1>
              </Reveal>
              <Reveal delay={80}>
                <p className="mb-10 text-lg leading-relaxed text-gray-400 dark:text-gray-500 sm:text-xl">
                  Agriplan uses Artificial Intelligence to instantly produce a complete{" "}
                  <strong className="text-white">Business Plan</strong> and a full{" "}
                  <strong className="text-white">Financial Model</strong>{" "}
                  so you can focus on building your business, not writing documents.
                </p>
              </Reveal>
              <Reveal delay={160}>
                <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                  <SignUpButton mode="modal" forceRedirectUrl="/plan/dashboard">
                    <button className="inline-flex items-center justify-center gap-2.5 rounded-xl border-0 bg-green-600 px-8 py-4 text-sm font-bold text-white shadow-[0_10px_25px_rgba(46,125,50,0.35)] transition-all">
                      Generate My Business Plan
                      <ArrowRight size={16} />
                    </button>
                  </SignUpButton>
                  <SignInButton mode="modal" forceRedirectUrl="/plan/dashboard">
                    <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition-all">
                      Sign In to Dashboard
                      <ChevronRight size={15} className="text-gray-400 dark:text-gray-500" />
                    </button>
                  </SignInButton>
                </div>
              </Reveal>
              <Reveal delay={240}>
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400 lg:justify-start">
                  {["Any industry", "Any country", "Any currency", "Delivered in minutes"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <CheckCircle size={12} className="text-green-400" />
                      {t}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
            <div>
              <Reveal delay={120}>
                <div className="mx-auto w-full max-w-[280px] sm:max-w-[360px] lg:ml-auto lg:mr-0 lg:max-w-[460px]">
                  <PlanIllustration />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-green-600 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="mb-1 text-3xl font-black text-white sm:text-4xl">
                  <CountUp value={s.value} />
                </div>
                <div className="text-xs font-medium uppercase tracking-[0.1em] text-green-200">
                  {s.label}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-white dark:bg-gray-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-14 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Two complete documents, one generation
            </h2>
            <p className="mx-auto max-w-[400px] text-gray-500 dark:text-gray-400">
              Every generation produces a professionally formatted Business Plan and a fully
              functional Financial Model, built from your actual data.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Reveal>
              <div className="hover-lift shadow-soft flex h-full flex-col rounded-[28px] bg-white dark:bg-gray-900 p-[clamp(24px,6vw,40px)_clamp(20px,5vw,36px)]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[20px] bg-gray-900">
                    <FileText size={28} color="white" />
                  </div>
                  <div>
                    <p className="mb-0.5 text-lg font-bold text-gray-900 dark:text-white">Business Plan</p>
                    <p className="mb-0 text-[13px] text-gray-400 dark:text-gray-500">Microsoft Word (.docx)</p>
                  </div>
                </div>
                <ul className="list-none space-y-3 pl-0">
                  {BUSINESS_PLAN_ITEMS.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[15px] text-gray-600 dark:text-gray-400">
                      <CheckCircle size={15} className="flex-shrink-0 text-green-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={90}>
              <div className="hover-lift shadow-soft flex h-full flex-col rounded-[28px] bg-white dark:bg-gray-900 p-[clamp(24px,6vw,40px)_clamp(20px,5vw,36px)]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[20px] bg-green-600">
                    <BarChart2 size={28} color="white" />
                  </div>
                  <div>
                    <p className="mb-0.5 text-lg font-bold text-gray-900 dark:text-white">Financial Model</p>
                    <p className="mb-0 text-[13px] text-gray-400 dark:text-gray-500">Excel Workbook (.xlsx, 19 sheets)</p>
                  </div>
                </div>
                <ul className="list-none space-y-3 pl-0">
                  {FINANCIAL_MODEL_ITEMS.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[15px] text-gray-600 dark:text-gray-400">
                      <CheckCircle size={15} className="flex-shrink-0 text-green-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-950 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-16 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold text-white sm:text-4xl">
              Three steps. One session.
            </h2>
            <p className="mx-auto max-w-[400px] text-gray-400 dark:text-gray-500">
              From your first input to investor-ready documents, guided, automated, complete.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 90} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-green-600 shadow-[0_10px_30px_rgba(46,125,50,0.35)]">
                  <span className="text-lg font-black text-white">{step.num}</span>
                </div>
                <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-green-600/25 bg-green-600/10 px-3 py-1 text-xs font-semibold text-green-400">
                  {step.time}
                </div>
                <h3 className="mb-2 text-sm font-bold text-white">{step.title}</h3>
                <p className="text-xs leading-relaxed text-gray-400 dark:text-gray-500">{step.desc}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-14 text-center">
            <SignUpButton mode="modal" forceRedirectUrl="/plan/dashboard">
              <button className="inline-flex items-center gap-2 rounded-xl border-0 bg-green-600 px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(46,125,50,0.35)] transition-all">
                Start now
                <ArrowRight size={15} />
              </button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* Professional Quality */}
      <section className="bg-white dark:bg-gray-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-green-600">
              Our Promise
            </p>
            <h2 className="mb-4 text-balance text-3xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-4xl">
              Your documents won&apos;t look like they were written by AI
            </h2>
            <p className="mx-auto mb-3 max-w-[560px] leading-relaxed text-gray-500 dark:text-gray-400">
              We don&apos;t produce generic outputs. Our system is built on professional business document
              structures, industry-specific frameworks, and real financial modelling standards.
              Every business plan reads like it was written by an experienced consultant.
            </p>
            <p className="mx-auto mb-8 max-w-[560px] leading-relaxed text-gray-500 dark:text-gray-400">
              We also go the extra mile to support every client. If you need help sourcing the
              right inputs, understanding your financials, or refining your narrative, our team
              is here to make sure the final document reflects your actual business.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {QUALITY_ITEMS.map((item, i) => {
              const ItemIcon = item.Icon;
              return (
                <Reveal key={item.title} delay={i * 90}>
                  <div className="hover-lift shadow-soft flex h-full flex-col rounded-3xl bg-white dark:bg-gray-900 p-[clamp(22px,5.5vw,36px)_clamp(18px,4.5vw,32px)]">
                    <div className="mb-4 flex h-[60px] w-[60px] flex-shrink-0 items-center justify-center rounded-[20px] bg-green-600">
                      <ItemIcon size={26} color="white" />
                    </div>
                    <h3 className="mb-2.5 text-[17px] font-bold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="mb-0 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <SignUpButton mode="modal" forceRedirectUrl="/plan/dashboard">
              <button className="inline-flex items-center gap-2 rounded-xl border-0 bg-green-600 px-6 py-3 text-sm font-bold text-white transition-all">
                Generate My Business Plan
                <ArrowRight size={14} />
              </button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 dark:bg-gray-950 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-14 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Everything in a single generation
            </h2>
            <p className="mx-auto max-w-[420px] text-gray-500 dark:text-gray-400">
              Built for founders, consultants, and financial analysts who need professional output
              without the manual effort.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feat, i) => (
              <Reveal key={feat.title} delay={i * 60}>
                <div className="hover-lift shadow-soft flex h-full flex-col rounded-3xl bg-white dark:bg-gray-900 p-[clamp(22px,5.5vw,36px)_clamp(18px,4.5vw,32px)]">
                  <div className="mb-4 flex h-[60px] w-[60px] flex-shrink-0 items-center justify-center rounded-[20px] bg-green-600 text-white">
                    {feat.icon}
                  </div>
                  <h3 className="mb-2.5 text-[17px] font-bold text-gray-900 dark:text-white">{feat.title}</h3>
                  <p className="mb-0 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{feat.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why it works */}
      <section className="bg-black py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-14 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold text-white sm:text-4xl">
              Not a template tool.{" "}
              <span className="text-green-400">An intelligence engine.</span>
            </h2>
            <p className="mx-auto max-w-[600px] leading-relaxed text-gray-400 dark:text-gray-500">
              Our system is built on an advanced AI model that understands your business context,
              industry, location, and financial data. It does not fill in blanks. It thinks, analyses,
              and produces market-specific strategic narrative that reflects your actual business.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {WHY_IT_WORKS.map((item, i) => (
              <Reveal key={item.title} delay={i * 90}>
                <div className="hover-lift-dark h-full rounded-[28px] bg-white/[0.07] p-[clamp(22px,5.5vw,36px)_clamp(18px,4.5vw,32px)]">
                  <div className="mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-[20px] bg-green-600/25 text-green-400">
                    {item.icon}
                  </div>
                  <h3 className="mb-2.5 text-[17px] font-semibold text-white">{item.title}</h3>
                  <p className="mb-0 text-sm leading-relaxed text-gray-400 dark:text-gray-500">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white dark:bg-gray-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-14 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Clear, straightforward pricing
            </h2>
            <p className="mx-auto max-w-[420px] text-gray-500 dark:text-gray-400">
              All packages include the complete standard documents. Choose system-generated or add expert customization for additional sections.
            </p>
          </Reveal>
          <div className="flex flex-wrap items-start justify-center gap-4">
            <Reveal className="w-full sm:w-[calc(50%-0.5rem)] lg:max-w-[420px]">
              <div className="hover-lift shadow-soft flex h-full flex-col rounded-3xl bg-white dark:bg-gray-900 p-[clamp(20px,5vw,32px)_clamp(16px,4vw,28px)]">
                <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                  System Generated
                </p>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-[clamp(32px,8vw,44px)] font-black leading-none text-gray-900 dark:text-white">$20</span>
                  <span className="text-[13px] text-gray-400 dark:text-gray-500">per document</span>
                </div>
                <p className="mb-[18px] text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">
                  <strong className="text-gray-900 dark:text-white">Complete package</strong> — Business Plan & Financial Model, system-generated by AI in minutes.
                </p>
                <ul className="mb-4 list-none space-y-2 pl-0">
                  {[
                    "Full business plan (.docx) + financial model (.xlsx)",
                    "19-sheet Excel spreadsheet",
                    "Six embedded professional charts",
                    "NPV, IRR & payback analysis",
                    "Investor-ready in minutes",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle size={14} className="flex-shrink-0 text-green-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <SignUpButton mode="modal" forceRedirectUrl="/plan/dashboard">
                  <button className="w-full rounded-xl border-0 bg-gray-900 py-3 text-sm font-bold text-white transition-all">
                    Get Started
                  </button>
                </SignUpButton>
              </div>
            </Reveal>

            <Reveal delay={90} className="relative w-full sm:w-[calc(50%-0.5rem)] lg:max-w-[420px]">
              <div className="flex h-full flex-col rounded-3xl border-2 border-green-600 bg-white dark:bg-gray-900 p-[clamp(20px,5vw,32px)_clamp(16px,4vw,28px)] shadow-[0_8px_40px_rgba(46,125,50,0.22)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_rgba(46,125,50,0.32)]">
                <span className="absolute -top-[13px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-green-600 px-3 py-1 text-[11px] font-bold text-white">
                  Best Value
                </span>
                <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-green-600">
                  Custom by Expert
                </p>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-[clamp(32px,8vw,44px)] font-black leading-none text-gray-900 dark:text-white">$69</span>
                  <span className="text-[13px] text-gray-400 dark:text-gray-500">per document</span>
                </div>
                <p className="mb-[18px] text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">
                  Includes all standard parts plus{" "}
                  <strong className="text-gray-900 dark:text-white">expert customization</strong> for additional sections your business may need.
                </p>
                <ul className="mb-4 list-none space-y-2 pl-0">
                  {[
                    "All standard documents included ($20 value)",
                    "Custom sections for your specific needs",
                    "Expert review & refinement",
                    "Market-specific personalization",
                    "Direct consultation with specialist",
                    "Tailored strategic recommendations",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle size={14} className="flex-shrink-0 text-green-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <SignUpButton mode="modal" forceRedirectUrl="/plan/dashboard">
                  <button className="w-full rounded-xl border-0 bg-green-600 py-3 text-sm font-bold text-white transition-all">
                    Add Custom Sections
                  </button>
                </SignUpButton>
              </div>
            </Reveal>
          </div>
          <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-gray-400 dark:text-gray-500">
            <LineChart size={11} className="text-green-600" />
            Contact your administrator to get credits and start generating
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-green-600 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center text-center">
            <Reveal className="max-w-2xl">
              <h2 className="mb-5 text-balance text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                Your next business plan should not take weeks
              </h2>
              <p className="mx-auto mb-9 max-w-[520px] leading-relaxed text-white/90">
                Join entrepreneurs and consultants who use Agriplan to produce professional
                business documents in a single session and present with confidence.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <SignUpButton mode="modal" forceRedirectUrl="/plan/dashboard">
                  <button className="inline-flex items-center justify-center gap-2.5 rounded-xl border-0 bg-white dark:bg-gray-900 px-8 py-4 text-sm font-bold text-green-700 dark:text-green-400 transition-all hover:opacity-90">
                    Generate My Business Plan
                    <ArrowRight size={16} />
                  </button>
                </SignUpButton>
                <SignInButton mode="modal" forceRedirectUrl="/plan/dashboard">
                  <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-transparent px-8 py-4 text-sm font-semibold text-white transition-all hover:opacity-80">
                    Sign In to Dashboard
                    <ChevronRight size={15} />
                  </button>
                </SignInButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-black">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-green-600">
                  <Layers size={14} color="white" />
                </div>
                <span className="font-bold text-white">Agriplan</span>
              </div>
              <p className="mb-3 max-w-[300px] text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                Logistack Ltd — AI-powered business planning and financial modelling for agribusinesses and entrepreneurs.
              </p>
              <div className="mb-3 flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <MapPin size={13} className="mt-0.5 flex-shrink-0 text-green-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Deco Center — NYARUTARAMA, Kigali, Rwanda
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={13} className="flex-shrink-0 text-green-400" />
                  <a href="mailto:logistackltd@gmail.com" className="text-xs text-gray-500 dark:text-gray-400 no-underline">
                    logistackltd@gmail.com
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-px flex-shrink-0 text-xs text-green-400">☎</span>
                  <div className="flex flex-col gap-0.5">
                    <a href="tel:+250796847804" className="text-xs text-gray-500 dark:text-gray-400 no-underline">+250 796 847 804</a>
                    <a href="tel:+250783826653" className="text-xs text-gray-500 dark:text-gray-400 no-underline">+250 783 826 653</a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex-shrink-0 text-xs text-green-400">WhatsApp</span>
                  <a href="https://wa.me/250796847804" target="_blank" rel="noreferrer" className="text-xs text-gray-500 dark:text-gray-400 no-underline">
                    +250 796 847 804
                  </a>
                </div>
              </div>
              <a
                href="https://logistack.space/"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-green-400 no-underline"
              >
                logistack.space ↗
              </a>
            </div>

            <div className="grid grid-cols-2 gap-8 lg:col-span-3 lg:pl-12">
              <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500">
                  Product
                </h3>
                <ul className="list-none space-y-2 pl-0">
                  {[
                    { label: "Dashboard", href: "/plan/dashboard" },
                    { label: "New Business Plan", href: "/plan/form" },
                    { label: "Financial Model", href: "/plan/form" },
                    { label: "logistack.space", href: "https://logistack.space/" },
                    { label: "Agricoders Portal", href: "/" },
                  ].map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm text-gray-500 dark:text-gray-400 no-underline">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500">
                  Company
                </h3>
                <ul className="list-none space-y-2 pl-0">
                  {[
                    { label: "Contact", href: "mailto:logistackltd@gmail.com" },
                    { label: "Support", href: "mailto:logistackltd@gmail.com" },
                    { label: "Privacy Policy", href: "/privacy" },
                    { label: "Terms of Service", href: "/terms" },
                  ].map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm text-gray-500 dark:text-gray-400 no-underline">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Logistack Ltd. All rights reserved.
              </span>
              <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 no-underline">Privacy</Link>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 no-underline">Terms</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
