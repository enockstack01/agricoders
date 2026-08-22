import Link from "next/link";
import type { Metadata } from "next";
import {
  Layers,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Satellite,
  Smartphone,
  Megaphone,
  BarChart2,
  Map,
  Crosshair,
  TrendingUp,
  Leaf,
  Sparkles,
  PawPrint,
} from "lucide-react";
import AgriNav from "@/components/layout/AgriNav";
import Reveal from "@/components/ui/Reveal";
import HeroIllustration from "@/components/marketing/HeroIllustration";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import { AGRICODERS_APPS } from "@/lib/apps";

const APP_ICONS: Record<string, React.ReactNode> = {
  logistackplan: <Layers size={26} color="white" />,
  livestockpro: <PawPrint size={26} color="white" />,
};

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
    cta: { label: "Try Logistack Plan", href: "/plan" },
  },
] as const;

const PRECISION_POINTS = [
  "Identify your highest-potential land zones first",
  "Reduce wasted inputs on low-yield areas",
  "Maximise revenue per hectare with spatial intelligence",
];

const PRECISION_CARDS = [
  {
    Icon: Map,
    title: "Field-level spatial planning",
    desc: "Map every plot, zone, and boundary with precision. Know exactly which areas to prioritise for planting, irrigation, and intervention.",
  },
  {
    Icon: Crosshair,
    title: "Focus where it matters most",
    desc: "Our tools surface the highest-impact areas so farmers concentrate effort where returns are greatest, not spread thin across everything.",
  },
  {
    Icon: TrendingUp,
    title: "Maximum productivity & profitability",
    desc: "By aligning inputs with spatial data, farms achieve higher yields, lower waste, and stronger margins, efficiently and sustainably.",
  },
  {
    Icon: Leaf,
    title: "Built for African agriculture",
    desc: "Designed around the realities of smallholder and commercial farming across Africa: variable soils, mixed crops, and limited margins for error.",
  },
];

export default function AgricodersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <AgriNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-black px-4 py-28 text-center sm:py-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="mkt-float absolute left-1/2 top-0 h-[350px] w-[700px] rounded-full bg-green-600/[0.07] blur-3xl" />
          <div className="mkt-float-slow absolute left-[30%] top-[120px] h-[200px] w-[320px] rounded-full bg-green-400/[0.06] blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="text-center lg:text-left">
              <Reveal>
                <h1 className="mb-6 text-balance text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Empowering Farmers with{" "}
                  <span className="text-green-400">Intelligence &amp; Technology</span>
                </h1>
              </Reveal>
              <Reveal delay={80}>
                <p className="mb-10 text-lg leading-relaxed text-gray-400 dark:text-gray-500 sm:text-xl">
                  Agricoders delivers{" "}
                  <strong className="text-white">location intelligence</strong>,{" "}
                  <strong className="text-white">intelligent applications</strong>,{" "}
                  <strong className="text-white">digital marketing</strong>, and{" "}
                  <strong className="text-white">professional business planning</strong>{" "}
                  to help every agribusiness operate with precision and grow with confidence.
                </p>
              </Reveal>
              <Reveal delay={160}>
                <div className="mb-12 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                  <a
                    href="#services"
                    className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-green-600 px-8 py-4 text-sm font-bold text-white no-underline transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Explore Our Services
                    <ArrowRight size={16} />
                  </a>
                  <Link
                    href="/plan"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-white no-underline transition-all hover:-translate-y-0.5"
                  >
                    Try Logistack Plan
                    <ChevronRight size={15} className="text-gray-400 dark:text-gray-500" />
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={240}>
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400 lg:justify-start">
                  {[
                    "Geospatial Intelligence",
                    "Web & Mobile Apps",
                    "Digital Marketing",
                    "Business Planning",
                  ].map((t) => (
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
                  <HeroIllustration />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-white dark:bg-gray-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">What we do</h2>
            <p className="mx-auto max-w-[460px] text-gray-500 dark:text-gray-400">
              Four integrated services that cover every digital need of a modern agribusiness.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SERVICES.map((s, i) => {
              const Icon = s.Icon;
              const hasCta = "cta" in s && s.cta;
              return (
                <Reveal key={s.title} delay={i * 90}>
                  <div className="hover-lift shadow-soft flex h-full flex-col rounded-[28px] bg-white dark:bg-gray-900 p-[clamp(24px,6vw,40px)_clamp(20px,5vw,36px)]">
                    <div className="mb-6 flex h-[68px] w-[68px] flex-shrink-0 items-center justify-center rounded-[22px] bg-green-600">
                      <Icon size={30} color="white" />
                    </div>
                    <h3 className="mb-3 text-[19px] font-bold leading-tight text-gray-900 dark:text-white">
                      {s.title}
                    </h3>
                    <p className="mb-5 text-[15px] leading-relaxed text-gray-500 dark:text-gray-400">{s.desc}</p>
                    <ul className="mb-5 list-none space-y-2.5 pl-0">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <CheckCircle size={14} className="mt-0.5 flex-shrink-0 text-green-600" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {hasCta && (
                      <div className="mt-auto">
                        <a
                          href={(s as typeof s & { cta: { label: string; href: string } }).cta.href}
                          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white no-underline transition-colors"
                        >
                          {(s as typeof s & { cta: { label: string; href: string } }).cta.label}
                          <ArrowRight size={14} />
                        </a>
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Geospatial precision section */}
      <section className="bg-gray-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* All section text before cards */}
          <div className="mb-14 flex justify-center">
            <Reveal className="max-w-3xl">
              <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.14em] text-green-400">
                Precision Agriculture
              </p>
              <h2 className="mb-5 text-balance text-center text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                Agriculture cannot be productive without{" "}
                <span className="text-green-400">the right precision tools</span>
              </h2>
              <p className="mb-6 text-center text-base leading-relaxed text-gray-400 dark:text-gray-500">
                The difference between a thriving farm and an underperforming one is often not effort. It is information.
                Without precise, location-aware intelligence, farmers work hard in the wrong places, at the wrong times,
                with the wrong resources. Precision tools change that.
              </p>
              <p className="mb-4 text-[15px] leading-relaxed text-gray-400 dark:text-gray-500">
                We develop geospatial planning tools for agriculture that help farmers prioritize where
                to focus their efforts, so every investment of time, labour, and input achieves the
                maximum possible productivity and profitability.
              </p>
              <p className="mb-6 text-[15px] leading-relaxed text-gray-400 dark:text-gray-500">
                Our tools analyse field-level spatial data, soil conditions, crop suitability, and
                productivity patterns to surface clear, actionable priorities, not guesswork.
              </p>
              <div className="flex flex-col gap-3">
                {PRECISION_POINTS.map((point) => (
                  <div key={point} className="flex items-start gap-2">
                    <CheckCircle size={15} className="mt-0.5 flex-shrink-0 text-green-400" />
                    <span className="text-sm text-gray-300">{point}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Full-width cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PRECISION_CARDS.map((item, i) => {
              const ItemIcon = item.Icon;
              return (
                <Reveal key={item.title} delay={i * 90}>
                  <div className="hover-lift-dark h-full rounded-[28px] border border-white/[0.12] bg-white/[0.07] p-[clamp(24px,6vw,40px)_clamp(20px,5vw,36px)]">
                    <div className="mb-5 flex h-[68px] w-[68px] flex-shrink-0 items-center justify-center rounded-[22px] bg-green-600/25">
                      <ItemIcon size={30} className="text-green-400" />
                    </div>
                    <h3 className="mb-3 text-[19px] font-bold leading-tight text-white">
                      {item.title}
                    </h3>
                    <p className="mb-0 text-[15px] leading-relaxed text-gray-400 dark:text-gray-500">{item.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Systems */}
      <section className="bg-black py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-14 text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-green-400">
              Agricoders
            </p>
            <h2 className="mb-4 text-balance text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Our Systems
            </h2>
            <p className="mx-auto max-w-[440px] text-[15px] text-gray-400 dark:text-gray-500">
              Tools and platforms we have built for agribusinesses, farmers, and entrepreneurs.
            </p>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-4">
            {AGRICODERS_APPS.map((app, i) => {
              const icon = APP_ICONS[app.id] ?? <Sparkles size={26} color="white" />;
              return (
                <Reveal
                  key={app.id}
                  delay={i * 90}
                  className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(41.6%-0.5rem)]"
                >
                  <div className="hover-lift-dark relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                    <div
                      className="absolute inset-x-0 top-0 h-[3px]"
                      style={{
                        background: `linear-gradient(90deg, ${app.accentColor}, #66BB6A, ${app.accentColor})`,
                      }}
                    />
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-xl"
                        style={{ background: app.accentColor }}
                      >
                        {icon}
                      </div>
                      <div>
                        <p className="mb-1 text-lg font-bold leading-tight text-white">
                          {app.name}
                        </p>
                        {app.status === "live" ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-green-400">
                            <span className="mkt-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                            Live
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">Coming soon</span>
                        )}
                      </div>
                    </div>
                    <p className="mb-6 text-sm leading-relaxed text-gray-400 dark:text-gray-500">
                      {app.description}
                    </p>
                    <div className="mt-auto">
                      <Link
                        href={app.href}
                        target={app.href.startsWith("http") ? "_blank" : undefined}
                        rel={app.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white no-underline transition-all hover:-translate-y-0.5 hover:shadow-lg"
                        style={{ background: app.accentColor }}
                      >
                        Open {app.name}
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}

            <Reveal
              delay={AGRICODERS_APPS.length * 90}
              className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(41.6%-0.5rem)]"
            >
              <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 p-5 text-center">
                <Sparkles size={32} className="mb-4 text-white/15" />
                <p className="mb-2 text-[15px] font-semibold text-gray-600 dark:text-gray-400">More systems coming</p>
                <p className="mb-0 text-[13px] text-gray-700 dark:text-gray-300">
                  New tools are in development.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-600 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center text-center">
            <Reveal className="max-w-2xl">
              <h2 className="mb-5 text-balance text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                Ready to build your agribusiness with precision?
              </h2>
              <p className="mb-9 leading-relaxed text-white/85">
                Explore our systems or get in touch to discuss how Agricoders can support
                your agribusiness journey.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/apps"
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-white dark:bg-gray-900 px-8 py-4 text-sm font-bold text-green-700 dark:text-green-400 no-underline transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg"
                >
                  <Layers size={16} />
                  Our Systems
                </Link>
                <a
                  href="mailto:agricoders@gmail.com"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-transparent px-8 py-4 text-sm font-semibold text-white no-underline transition-all hover:-translate-y-0.5"
                >
                  Contact Us
                  <ArrowRight size={15} />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
