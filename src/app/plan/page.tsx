"use client";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  FileText,
  ChartBar,
  ArrowRight,
  CheckCircle,
  Brain,
  TrendUp,
  ShieldCheck,
  Globe,
  Medal,
  Users,
  SignIn,
  Handshake,
} from "@phosphor-icons/react";
import AgriNav from "@/components/layout/AgriNav";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import MarketingFooter from "@/components/marketing/MarketingFooter";

const FEATURES = [
  {
    Icon: Brain,
    title: "Professional narrative",
    desc: "Executive Summary, Industry Analysis, Market Context and Conclusion, tailored to your business, industry and location.",
  },
  {
    Icon: ChartBar,
    title: "Six professional charts",
    desc: "Revenue forecasts, cash flow, income summaries and break even charts, generated and embedded into your Word document.",
  },
  {
    Icon: TrendUp,
    title: "Complete financial model",
    desc: "A 19 sheet Excel workbook covering CAPEX, OPEX, revenue, cash flow, NPV, IRR, payback period, balance sheet and loan amortisation.",
  },
  {
    Icon: FileText,
    title: "Investor ready business plan",
    desc: "A structured Word document covering every section investors and lenders expect, formatted for immediate submission.",
  },
  {
    Icon: Globe,
    title: "Any business, any market",
    desc: "From agribusiness to technology and hospitality. Every global currency is supported and the analysis adapts to your country.",
  },
  {
    Icon: Medal,
    title: "Expert support included",
    desc: "Our team helps you get the details right, from financial figures to market data.",
  },
];

const STATS = [
  { value: "< 5 min", label: "Generation time" },
  { value: "19", label: "Excel sheets" },
  { value: "6", label: "Embedded charts" },
  { value: "100+", label: "Currencies supported" },
];

const BUSINESS_PLAN_ITEMS = [
  "AI written Executive Summary",
  "Company introduction and vision",
  "Industry and market analysis",
  "Competitor review",
  "Financial highlights and projections",
  "Six embedded professional charts",
  "APA cited reference list",
];

const FINANCIAL_MODEL_ITEMS = [
  "CAPEX and product bill of materials",
  "Staff, payroll and deduction schedules",
  "Operating expenses (multi year)",
  "Revenue forecast and sales volume",
  "Cash flow statement",
  "Income statement and P&L",
  "NPV, IRR, payback period and balance sheet",
];

const STEPS = [
  {
    num: "1",
    title: "Complete the guided form",
    desc: "A structured 10 step form walks you through company details, team, products, market analysis and financial projections. No finance expertise required.",
    time: "About 10 minutes",
  },
  {
    num: "2",
    title: "AI generates your documents",
    desc: "The system analyses your data and produces the narrative, all financial calculations and six embedded charts.",
    time: "2 to 3 minutes",
  },
  {
    num: "3",
    title: "Receive and present",
    desc: "Receive a complete Business Plan Word document and a full Excel financial model, internally consistent and ready for investors.",
    time: "Instant",
  },
];

const QUALITY_ITEMS = [
  {
    Icon: Medal,
    title: "Consultant standard output",
    desc: "Documents follow professional business document structures, so investors and lenders take them seriously.",
  },
  {
    Icon: Users,
    title: "Extra mile client support",
    desc: "Our team helps you get the inputs right, from financial figures to market data, through every part of the process.",
  },
  {
    Icon: ShieldCheck,
    title: "Internally consistent",
    desc: "The narrative and the financial model are aligned, and every figure in the document matches the model.",
  },
  {
    Icon: Brain,
    title: "Market specific intelligence",
    desc: "Content is generated for your industry, country and business context, not a generic template with your name inserted.",
  },
];

const STANDARD_PRICE_ITEMS = [
  "Full business plan (.docx) and financial model (.xlsx)",
  "19 sheet Excel spreadsheet",
  "Six embedded professional charts",
  "NPV, IRR and payback analysis",
  "Investor ready in minutes",
];

const CUSTOM_PRICE_ITEMS = [
  "All standard documents included (USD 20 value)",
  "Custom sections for your specific needs",
  "Expert review and refinement",
  "Market specific personalisation",
  "Direct consultation with a specialist",
  "Tailored strategic recommendations",
];

const AMBER_BTN =
  "inline-flex items-center justify-center gap-2.5 rounded-full border-0 bg-[#F9A825] px-8 py-4 text-base font-bold text-[#111611] shadow-lg transition-transform hover:-translate-y-0.5";
const GHOST_BTN =
  "inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 bg-transparent px-8 py-4 text-base font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10";
const CARD = "rounded-2xl border border-[#D5E3D6] bg-[#F3F8F3] dark:border-white/10 dark:bg-white/[0.04]";

function Badge({ Icon, size = 56, light = false }: { Icon: React.ElementType; size?: number; light?: boolean }) {
  return (
    <span
      className="flex flex-shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, background: light ? "#fff" : "#1B5E20", color: light ? "#1B5E20" : "#fff" }}
    >
      <Icon size={size * 0.5} weight="fill" />
    </span>
  );
}

function SectionTitle({ title, sub, light = false }: { title: string; sub?: string; light?: boolean }) {
  return (
    <Reveal className="mx-auto mb-12 max-w-3xl text-center">
      <h2 className={`mb-3 text-balance text-[clamp(1.9rem,4.2vw,3rem)] font-bold leading-tight tracking-tight ${light ? "text-white" : "text-[#1B5E20] dark:text-green-300"}`}>
        {title}
      </h2>
      {sub && <p className={`m-0 text-lg ${light ? "text-green-100/80" : "text-gray-500 dark:text-gray-400"}`}>{sub}</p>}
    </Reveal>
  );
}

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) router.push("/plan/dashboard");
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="brand-deck flex min-h-screen flex-col bg-white text-[#111611] dark:bg-[#0c140d] dark:text-white">
      <AgriNav />

      {/* Hero: deck cover */}
      <div className="relative overflow-hidden bg-[#1B5E20] text-white">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-white/[0.04]" />
        <div className="pointer-events-none absolute -bottom-52 left-1/3 h-[520px] w-[520px] rounded-full bg-black/10" />
        <section className="relative mx-auto max-w-7xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="max-w-3xl">
            <div>
              <Reveal>
                <p className="mb-5 text-sm font-bold uppercase tracking-[0.28em] text-[#F9A825]">Agriplan</p>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="mb-5 text-balance text-[clamp(2.4rem,5.6vw,4.2rem)] font-bold leading-[1.05] tracking-tight">
                  Investor ready business plans in under 15 minutes
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="mb-8 max-w-xl text-xl leading-relaxed text-green-50/90">
                  Agriplan produces a complete Business Plan and a full Financial Model, so you can focus on building your business, not writing documents.
                </p>
              </Reveal>
              <Reveal delay={180}>
                <div className="mb-8 flex flex-col gap-3 sm:flex-row">
                  <SignUpButton mode="modal" forceRedirectUrl="/plan/dashboard">
                    <button className={AMBER_BTN}>
                      Generate my business plan
                      <ArrowRight size={18} weight="bold" />
                    </button>
                  </SignUpButton>
                  <SignInButton mode="modal" forceRedirectUrl="/plan/dashboard">
                    <button className={GHOST_BTN}>
                      <SignIn size={20} weight="bold" />
                      Sign in to dashboard
                    </button>
                  </SignInButton>
                </div>
              </Reveal>
              <Reveal delay={240}>
                <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-base font-bold">
                  {["Any industry", "Any country", "Any currency", "Delivered in minutes"].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <CheckCircle size={20} weight="fill" className="text-[#F9A825]" />
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

          </div>
        </section>
      </div>

      {/* Stats */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="mb-1 text-[clamp(2rem,4vw,3rem)] font-bold leading-none text-[#F9A825]">
                  <CountUp value={s.value} />
                </div>
                <div className="text-base font-bold">{s.label}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* What you get */}
      <section className="pb-24 pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Two complete documents, one generation"
            sub="Every generation produces a formatted Business Plan and a working Financial Model, built from your actual data."
          />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {[
              { Icon: FileText, name: "Business Plan", sub: "Microsoft Word (.docx)", items: BUSINESS_PLAN_ITEMS },
              { Icon: ChartBar, name: "Financial Model", sub: "Excel workbook (.xlsx, 19 sheets)", items: FINANCIAL_MODEL_ITEMS },
            ].map(({ Icon, name, sub, items }, i) => (
              <Reveal key={name} delay={i * 90}>
                <div className={`${CARD} h-full p-7 sm:p-9`}>
                  <div className="mb-6 flex items-center gap-4">
                    <Badge Icon={Icon} size={64} />
                    <div>
                      <p className="m-0 text-2xl font-bold text-[#1B5E20] dark:text-green-300">{name}</p>
                      <p className="m-0 text-sm text-gray-600 dark:text-gray-400">{sub}</p>
                    </div>
                  </div>
                  <ul className="m-0 flex list-none flex-col gap-3 p-0">
                    {items.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-base">
                        <CheckCircle size={20} weight="fill" className="flex-shrink-0 text-[#2E7D32]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 bg-[#1B5E20] py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle light title="Three steps, one session" sub="From your first input to investor ready documents, guided and complete." />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 90}>
                <div className="flex h-full flex-col rounded-2xl border border-white/15 bg-[#2E7D32]/40 p-7">
                  <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#1B5E20]">
                    {step.num}
                  </span>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#F9A825]">{step.time}</p>
                  <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                  <p className="m-0 text-[15px] leading-relaxed text-green-50/90">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <SignUpButton mode="modal" forceRedirectUrl="/plan/dashboard">
              <button className={AMBER_BTN}>
                Start now
                <ArrowRight size={18} weight="bold" />
              </button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Documents that read like consultant work"
            sub="Our system is built on professional business document structures, industry frameworks and real financial modelling standards. If you need help sourcing inputs or refining your narrative, our team is here."
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {QUALITY_ITEMS.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div className={`${CARD} h-full p-6`}>
                  <div className="mb-5"><Badge Icon={Icon} /></div>
                  <h3 className="mb-2 text-xl font-bold">{title}</h3>
                  <p className="m-0 text-[15px] leading-relaxed text-gray-600 dark:text-gray-300">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-24 border-y border-[#D5E3D6] bg-[#F3F8F3] py-24 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Everything in a single generation"
            sub="Built for founders, consultants and financial analysts who need professional output without the manual effort."
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 60}>
                <div className="h-full rounded-2xl border border-[#D5E3D6] bg-white p-6 dark:border-white/10 dark:bg-[#111814]">
                  <div className="mb-5"><Badge Icon={Icon} /></div>
                  <h3 className="mb-2 text-xl font-bold">{title}</h3>
                  <p className="m-0 text-[15px] leading-relaxed text-gray-600 dark:text-gray-300">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-24 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Clear, straightforward pricing"
            sub="Every package includes the complete standard documents. Choose system generated, or add expert customisation for extra sections."
          />
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
            <Reveal>
              <div className={`${CARD} flex h-full flex-col p-7`}>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-600 dark:text-gray-300">System generated</p>
                <div className="mb-3 flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-[#1B5E20] dark:text-green-300">USD 20</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">per document</span>
                </div>
                <p className="mb-5 text-[15px] text-gray-600 dark:text-gray-300">
                  The complete package, with Business Plan and Financial Model generated in minutes.
                </p>
                <ul className="mb-6 flex list-none flex-col gap-2.5 p-0">
                  {STANDARD_PRICE_ITEMS.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[15px]">
                      <CheckCircle size={18} weight="fill" className="flex-shrink-0 text-[#2E7D32]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <SignUpButton mode="modal" forceRedirectUrl="/plan/dashboard">
                  <button className="mt-auto w-full rounded-full border-0 bg-[#1B5E20] py-3.5 text-base font-bold text-white transition-transform hover:-translate-y-0.5">
                    Get started
                  </button>
                </SignUpButton>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <div className="relative flex h-full flex-col rounded-2xl border-2 border-[#F9A825] bg-white p-7 dark:bg-[#111814]">
                <span className="absolute -top-3.5 left-7 rounded-full bg-[#F9A825] px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-[#111611]">
                  Best value
                </span>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-600 dark:text-gray-300">Customised by an expert</p>
                <div className="mb-3 flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-[#1B5E20] dark:text-green-300">USD 69</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">per document</span>
                </div>
                <p className="mb-5 text-[15px] text-gray-600 dark:text-gray-300">
                  All standard parts, plus expert customisation for additional sections your business may need.
                </p>
                <ul className="mb-6 flex list-none flex-col gap-2.5 p-0">
                  {CUSTOM_PRICE_ITEMS.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[15px]">
                      <CheckCircle size={18} weight="fill" className="flex-shrink-0 text-[#2E7D32]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <SignUpButton mode="modal" forceRedirectUrl="/plan/dashboard">
                  <button className="mt-auto w-full rounded-full border-0 bg-[#F9A825] py-3.5 text-base font-bold text-[#111611] transition-transform hover:-translate-y-0.5">
                    Add custom sections
                  </button>
                </SignUpButton>
              </div>
            </Reveal>
          </div>
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Contact your administrator to get credits and start generating.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#1B5E20] px-6 py-16 text-center text-white sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/[0.06]" />
            <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-black/10" />
            <div className="relative mx-auto max-w-2xl">
              <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F9A825] text-[#111611]">
                <Handshake size={32} weight="fill" />
              </span>
              <h2 className="mb-5 text-balance text-[clamp(2rem,5vw,3.3rem)] font-bold leading-tight tracking-tight">
                Your next business plan should not take weeks
              </h2>
              <p className="mb-9 text-lg leading-relaxed text-green-50/90">
                Join entrepreneurs and consultants who use Agriplan to produce professional business documents in a single session.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <SignUpButton mode="modal" forceRedirectUrl="/plan/dashboard">
                  <button className={AMBER_BTN}>
                    Generate my business plan
                    <ArrowRight size={18} weight="bold" />
                  </button>
                </SignUpButton>
                <SignInButton mode="modal" forceRedirectUrl="/plan/dashboard">
                  <button className={GHOST_BTN}>
                    <SignIn size={20} weight="bold" />
                    Sign in to dashboard
                  </button>
                </SignInButton>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <MarketingFooter />
    </div>
  );
}
