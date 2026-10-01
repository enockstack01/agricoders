import Link from "next/link";
import type { Metadata } from "next";
import {
  Stack,
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  GlobeHemisphereEast,
  DeviceMobile,
  Megaphone,
  ChartBar,
  MapTrifold,
  Crosshair,
  TrendUp,
  Leaf,
  Sparkle,
  PawPrint,
  Lightning,
  EnvelopeSimple,
  Plant,
} from "@phosphor-icons/react/dist/ssr";
import AgriNav from "@/components/layout/AgriNav";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import HeroIllustration from "@/components/marketing/HeroIllustration";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import { ProcessFlow, PrecisionLayers, Ecosystem } from "@/components/marketing/Diagrams";
import { AGRICODERS_APPS } from "@/lib/apps";

export const metadata: Metadata = {
  title: "Agricoders — Geospatial Intelligence, Apps & Agribusiness Planning",
  description:
    "Agricoders empowers farmers and agribusinesses with location intelligence, intelligent web and mobile applications, digital marketing, and professional business planning.",
};

const APP_ICONS: Record<string, React.ReactNode> = {
  agriplan: <Stack size={30} weight="duotone" />,
  livestockpro: <PawPrint size={30} weight="duotone" />,
};

const STATS = [
  { value: "4", label: "Integrated services", sub: "for every agribusiness need" },
  { value: String(AGRICODERS_APPS.filter((a) => a.status === "live").length), label: "Live systems", sub: "built and running today" },
  { value: "<15", suffix: " min", label: "To a business plan", sub: "with Agriplan" },
  { value: "19", label: "Sheet financial model", sub: "NPV, IRR & payback" },
];

const SERVICES = [
  {
    Icon: GlobeHemisphereEast,
    title: "Geospatial & Location Intelligence",
    desc: "Location intelligence advisory, open-source spatial planning tools and Agtech consultancy that give agribusinesses a precise, data-driven view of every field.",
    features: ["Open-source spatial planning tools", "GIS & remote-sensing advisory", "Agtech consultancy services"],
    tone: "from-emerald-400 to-green-700",
    span: "lg:col-span-2",
  },
  {
    Icon: DeviceMobile,
    title: "Web & Mobile App Development",
    desc: "Intelligent, production-grade web and mobile applications purpose-built for agribusinesses.",
    features: ["Custom agribusiness platforms", "iOS & Android apps", "API-first architecture"],
    tone: "from-sky-400 to-blue-700",
    span: "",
  },
  {
    Icon: Megaphone,
    title: "Digital Marketing Services",
    desc: "Targeted content, SEO, social media and performance marketing tailored to the agri-sector.",
    features: ["Agribusiness SEO & content", "Social & paid campaigns", "Brand positioning"],
    tone: "from-amber-300 to-orange-600",
    span: "",
  },
] as const;

const PRECISION_POINTS = [
  "Identify your highest-potential land zones first",
  "Reduce wasted inputs on low-yield areas",
  "Maximise revenue per hectare with spatial intelligence",
];

const PRECISION_CARDS = [
  { Icon: MapTrifold, title: "Field-level spatial planning", desc: "Map every plot, zone and boundary. Know exactly where to plant, irrigate and intervene." },
  { Icon: Crosshair, title: "Focus where it matters", desc: "Surface the highest-impact areas so effort goes where returns are greatest." },
  { Icon: TrendUp, title: "Productivity & profitability", desc: "Align inputs with spatial data for higher yields, lower waste and stronger margins." },
  { Icon: Leaf, title: "Built for African agriculture", desc: "Designed around variable soils, mixed crops and smallholder-to-commercial realities." },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-600/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-green-700 dark:bg-green-400/10 dark:text-green-300">
      <Sparkle size={14} weight="fill" />
      {children}
    </span>
  );
}

export default function AgricodersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-[#07100a] dark:text-white">
      {/* sticky nav lives at the page root so it stays pinned for the whole scroll */}
      <AgriNav />

      {/* ═════ HERO ═════ (pulled up under the floating nav so the mesh shows behind it) */}
      <div className="mkt-mesh relative -mt-[84px] overflow-hidden pt-[84px]">
        <div className="mkt-grid-dots pointer-events-none absolute inset-0" />

        <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-28 lg:pt-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
            <div className="text-center lg:text-left">
              <Reveal>
                <Link
                  href="/plan"
                  className="group mb-7 inline-flex items-center gap-2 rounded-full border border-green-600/15 bg-white/80 py-1.5 pl-1.5 pr-4 text-sm font-bold text-gray-700 no-underline shadow-sm backdrop-blur transition-colors hover:border-green-600/40 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                >
                  <span className="mkt-sticker inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black">
                    <Lightning size={13} weight="fill" /> New
                  </span>
                  Business plans in under 15 minutes
                  <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="mb-6 text-balance text-[clamp(2.4rem,6vw,4.4rem)] font-black leading-[1.04] tracking-tight">
                  Empowering farmers with{" "}
                  <span className="mkt-gradient-text">intelligence &amp; technology</span>
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="mx-auto mb-9 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-300 sm:text-xl lg:mx-0">
                  Location intelligence, intelligent apps, digital marketing and professional business
                  planning — so every agribusiness operates with precision and grows with confidence.
                </p>
              </Reveal>
              <Reveal delay={180}>
                <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                  <a
                    href="#services"
                    className="mkt-btn-primary inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 text-base font-extrabold no-underline"
                  >
                    Explore our services
                    <ArrowRight size={18} weight="bold" />
                  </a>
                  <Link
                    href="/plan"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-900/10 bg-white px-8 py-4 text-base font-extrabold text-gray-900 no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-white/15 dark:bg-white/5 dark:text-white"
                  >
                    <Stack size={20} weight="duotone" className="text-green-600 dark:text-green-400" />
                    Try Agriplan
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={240}>
                <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-2 p-0 lg:justify-start">
                  {["Geospatial Intelligence", "Web & Mobile Apps", "Digital Marketing", "Business Planning"].map((t) => (
                    <li
                      key={t}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3.5 py-1.5 text-sm font-bold text-gray-700 shadow-sm dark:bg-white/5 dark:text-gray-300"
                    >
                      <CheckCircle size={16} weight="fill" className="text-green-600 dark:text-green-400" />
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={150}>
              <div className="mx-auto w-full max-w-[560px] lg:mr-0">
                <HeroIllustration />
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ═════ STATS ═════ */}
      <section className="relative z-10 -mt-10 px-4 sm:px-6 lg:px-8">
        <div className="mkt-card mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-[28px] !bg-gray-100 p-0 hover:!translate-y-0 dark:!bg-white/5 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white px-5 py-7 text-center dark:bg-[#111814] sm:px-8">
              <div className="mb-1 text-[clamp(2rem,4vw,2.9rem)] font-black leading-none tracking-tight text-green-700 dark:text-green-400">
                <CountUp value={s.value} />
                {"suffix" in s && <span className="text-[0.55em]">{s.suffix}</span>}
              </div>
              <div className="text-base font-extrabold">{s.label}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═════ SERVICES (bento) ═════ */}
      <section id="services" className="scroll-mt-24 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <Eyebrow>What we do</Eyebrow>
            <h2 className="mb-4 text-balance text-[clamp(2rem,4.5vw,3.2rem)] font-black leading-tight tracking-tight">
              Four services. <span className="mkt-gradient-text">One agribusiness partner.</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Integrated services that cover every digital need of a modern agribusiness.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ Icon, title, desc, features, tone, span }, i) => (
              <Reveal key={title} delay={i * 80} className={span}>
                <article className="mkt-card group flex h-full flex-col rounded-[28px] p-7 sm:p-9">
                  <span className={`mb-6 flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br ${tone} text-white shadow-[0_14px_28px_-12px_rgba(16,40,24,0.6)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110`}>
                    <Icon size={34} weight="duotone" />
                  </span>
                  <h3 className="mb-3 text-[22px] font-black leading-tight">{title}</h3>
                  <p className="mb-6 text-[15.5px] leading-relaxed text-gray-500 dark:text-gray-400">{desc}</p>
                  <ul className="m-0 mt-auto flex list-none flex-wrap gap-2 p-0">
                    {features.map((f) => (
                      <li key={f} className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-[13px] font-bold text-gray-700 dark:bg-white/5 dark:text-gray-300">
                        <CheckCircle size={15} weight="fill" className="text-green-600 dark:text-green-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}

            {/* Featured: Business planning (wide, dark gradient) */}
            <Reveal delay={260} className="md:col-span-2 lg:col-span-2">
              <article className="group relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-[28px] p-7 text-white shadow-[0_24px_60px_-24px_rgba(27,94,32,0.8)] sm:p-9 md:flex-row md:items-center" style={{ background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #43A047 100%)" }}>
                <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />
                <div className="pointer-events-none absolute -bottom-28 right-40 h-56 w-56 rounded-full bg-white/[0.06]" />
                <div className="relative max-w-lg">
                  <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/15 text-white ring-1 ring-white/25 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <ChartBar size={34} weight="duotone" />
                  </span>
                  <h3 className="mb-3 text-[24px] font-black leading-tight">Agribusiness Planning &amp; Financial Modelling</h3>
                  <p className="mb-0 text-[15.5px] leading-relaxed text-white/85">
                    Agriplan generates investor-ready business plans and 19-sheet financial models in
                    under 15 minutes — narrative, charts and projections included.
                  </p>
                </div>
                <div className="relative flex flex-col gap-3 md:min-w-[220px]">
                  {["Investor-ready business plans", "19-sheet Excel financial models", "Professional narrative generation"].map((f) => (
                    <span key={f} className="inline-flex items-center gap-2 text-[15px] font-bold">
                      <CheckCircle size={18} weight="fill" className="text-green-200" />
                      {f}
                    </span>
                  ))}
                  <Link
                    href="/plan"
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-[15px] font-extrabold text-green-800 no-underline shadow-lg transition-transform hover:-translate-y-0.5"
                  >
                    Try Agriplan
                    <ArrowRight size={16} weight="bold" />
                  </Link>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═════ HOW IT WORKS ═════ */}
      <section id="how-it-works" className="scroll-mt-24 border-y border-gray-100 bg-gray-50/70 py-24 dark:border-white/5 dark:bg-white/[0.02] sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <Eyebrow>How we work</Eyebrow>
            <h2 className="mb-4 text-balance text-[clamp(2rem,4.5vw,3.2rem)] font-black leading-tight tracking-tight">
              From the field to the <span className="mkt-gradient-text">bottom line</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              One journey, four steps — each powered by an Agricoders service.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <ProcessFlow />
          </Reveal>
        </div>
      </section>

      {/* ═════ PRECISION ═════ */}
      <section id="precision" className="scroll-mt-24 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
            <Reveal>
              <Eyebrow>Precision agriculture</Eyebrow>
              <h2 className="mb-5 text-balance text-[clamp(2rem,4.5vw,3.2rem)] font-black leading-tight tracking-tight">
                Productive farming needs <span className="mkt-gradient-text">the right precision tools</span>
              </h2>
              <p className="mb-5 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                The difference between a thriving farm and an underperforming one is often not effort — it is
                information. We develop geospatial planning tools that help farmers prioritise where to focus,
                so every investment of time, labour and input achieves maximum productivity.
              </p>
              <p className="mb-7 text-[15.5px] leading-relaxed text-gray-500 dark:text-gray-400">
                Our tools combine field-level spatial data, soil conditions, crop suitability and productivity
                patterns into clear, actionable priorities — not guesswork.
              </p>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {PRECISION_POINTS.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-base font-bold">
                    <span className="mkt-sticker mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full">
                      <CheckCircle size={16} weight="bold" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120}>
              <div className="mkt-card rounded-[32px] p-5 hover:!translate-y-0 sm:p-8">
                <PrecisionLayers />
              </div>
            </Reveal>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRECISION_CARDS.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="mkt-card group h-full rounded-[24px] p-6">
                  <span className="mkt-sticker mb-5 flex h-12 w-12 items-center justify-center rounded-2xl">
                    <Icon size={26} weight="duotone" />
                  </span>
                  <h3 className="mb-2 text-lg font-black leading-tight">{title}</h3>
                  <p className="m-0 text-[15px] leading-relaxed text-gray-500 dark:text-gray-400">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═════ SYSTEMS ═════ */}
      <section id="systems" className="scroll-mt-24 relative overflow-hidden py-24 sm:py-28" style={{ background: "linear-gradient(180deg, #07130b 0%, #0b1d11 100%)" }}>
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 text-white sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-green-300">
              <Sparkle size={14} weight="fill" /> Our systems
            </span>
            <h2 className="mb-4 text-balance text-[clamp(2rem,4.5vw,3.2rem)] font-black leading-tight tracking-tight">
              Tools built for agribusiness, <span className="text-green-400">running today</span>
            </h2>
            <p className="text-lg text-white/65">
              Platforms we have built for agribusinesses, farmers and entrepreneurs — connected into one ecosystem.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div className="flex flex-col gap-5">
              {AGRICODERS_APPS.map((app, i) => {
                const external = app.href.startsWith("http");
                return (
                  <Reveal key={app.id} delay={i * 90}>
                    <article className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] sm:p-7">
                      <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${app.accentColor}, #66BB6A)` }} />
                      <div className="mb-4 flex items-center gap-4">
                        <span
                          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[18px] text-white shadow-lg transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105"
                          style={{ background: `linear-gradient(135deg, ${app.accentColor}bb, ${app.accentColor})` }}
                        >
                          {APP_ICONS[app.id] ?? <Sparkle size={30} weight="duotone" />}
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="m-0 text-xl font-black">{app.name}</h3>
                            {app.status === "live" ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-400/15 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wide text-green-300">
                                <span className="mkt-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-green-400" /> Live
                              </span>
                            ) : (
                              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wide text-white/60">Coming soon</span>
                            )}
                          </div>
                          <p className="m-0 text-sm font-bold text-white/55">{app.tagline}</p>
                        </div>
                      </div>
                      <p className="mb-5 text-[15px] leading-relaxed text-white/70">{app.description}</p>
                      <Link
                        href={app.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-gray-900 no-underline transition-transform hover:-translate-y-0.5"
                      >
                        Open {app.name}
                        {external ? <ArrowUpRight size={15} weight="bold" /> : <ArrowRight size={15} weight="bold" />}
                      </Link>
                    </article>
                  </Reveal>
                );
              })}
              <Reveal delay={AGRICODERS_APPS.length * 90}>
                <div className="flex items-center gap-4 rounded-[26px] border-2 border-dashed border-white/10 p-6">
                  <Sparkle size={28} weight="duotone" className="flex-shrink-0 text-green-300/70" />
                  <div>
                    <p className="m-0 font-extrabold text-white/80">More systems coming</p>
                    <p className="m-0 text-sm text-white/50">New tools are in development.</p>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={150}>
              <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-4 text-white sm:p-6 [&_.fill-white]:fill-[#132019] [&_.fill-gray-900]:fill-white [&_.fill-gray-500]:fill-white/60">
                <Ecosystem />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═════ CTA ═════ */}
      <section id="contact" className="scroll-mt-24 px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
        <Reveal>
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] px-6 py-16 text-center text-white shadow-[0_40px_80px_-30px_rgba(27,94,32,0.8)] sm:px-12 sm:py-20" style={{ background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 45%, #00897B 100%)" }}>
            <div className="mkt-grid-dots pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.25)_1px,transparent_1px)]" />
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-white/[0.07]" />
            <div className="relative mx-auto max-w-2xl">
              <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[22px] bg-white/15 ring-1 ring-white/25">
                <Plant size={34} weight="duotone" />
              </span>
              <h2 className="mb-5 text-balance text-[clamp(2rem,5vw,3.4rem)] font-black leading-tight tracking-tight">
                Ready to build your agribusiness with precision?
              </h2>
              <p className="mb-9 text-lg leading-relaxed text-white/85">
                Explore our systems or get in touch to discuss how Agricoders can support your agribusiness journey.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/apps"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-8 py-4 text-base font-extrabold text-green-800 no-underline shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <Stack size={20} weight="duotone" />
                  Our systems
                </Link>
                <a
                  href="mailto:agricoders@gmail.com"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 px-8 py-4 text-base font-extrabold text-white no-underline transition-all hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <EnvelopeSimple size={20} weight="duotone" />
                  Contact us
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <MarketingFooter />
    </div>
  );
}
