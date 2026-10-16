import Link from "next/link";
import Image from "next/image";
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
  Leaf,
  EnvelopeSimple,
  AppleLogo,
  AndroidLogo,
  Notebook,
  Virus,
  Pill,
  Bank,
  ClipboardText,
  ShieldCheck,
  TrendUp,
  CurrencyCircleDollar,
  Target,
  Handshake,
} from "@phosphor-icons/react/dist/ssr";
import AgriNav from "@/components/layout/AgriNav";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import AppIcon from "@/components/marketing/AppIcon";
import { AGRICODERS_APPS } from "@/lib/apps";

export const metadata: Metadata = {
  title: "Agricoders | Building the Future of Digital Agriculture",
  description:
    "Agricoders is building the operating system for African agriculture: CropManager, LivestockPro and Agriplan, made in Kigali for African farmers.",
};

/* Brand tokens, taken from the Agricoders pitch decks */
const FOREST = "#1B5E20";
const AMBER = "#F9A825";

const PROBLEM_STATS = [
  { big: "~½", desc: "of sub Saharan Africa's workforce farms" },
  { big: "~80%", desc: "of the region's food comes from small farms" },
  { big: "< ½", desc: "of the global average cereal yield" },
];

const PROBLEMS = [
  { Icon: Notebook, title: "Lost records", desc: "Farm data lives in notebooks and memory." },
  { Icon: Virus, title: "Late diagnosis", desc: "Disease is spotted after the losses." },
  { Icon: Pill, title: "Guesswork treatment", desc: "Few vets or agronomists to advise." },
  { Icon: Bank, title: "No access to finance", desc: "No records or plans to show a bank." },
];

const VALUES = [
  "Precision over guesswork",
  "Built for African agriculture",
  "Simplicity: plain language, sensible defaults",
  "Farmer data belongs to the farmer",
];

const PRODUCTS = AGRICODERS_APPS.map((app) => ({
  id: app.id,
  icon: app.icon,
  name: app.name,
  desc: app.tagline,
  href: app.href,
  status: app.status === "live" ? "Live" : "Coming soon",
}));

const LOOP = [
  { Icon: ClipboardText, label: "Record", amber: false },
  { Icon: ShieldCheck, label: "Protect", amber: true },
  { Icon: TrendUp, label: "Plan", amber: false },
  { Icon: CurrencyCircleDollar, label: "Grow", amber: false },
];

const SERVICES = [
  { Icon: ChartBar, title: "Business Planning", desc: "Investor ready plans and financial models, with expert customised packages." },
  { Icon: GlobeHemisphereEast, title: "Geospatial Intelligence", desc: "Location advisory, open source spatial tools and Agtech consultancy." },
  { Icon: DeviceMobile, title: "Web & Mobile Apps", desc: "Production grade, offline first apps for cooperatives, processors and NGOs." },
  { Icon: Megaphone, title: "Digital Marketing", desc: "SEO, content and campaigns that connect agribusinesses with buyers." },
];

const SPOTLIGHTS = [
  {
    name: "CropManager",
    sub: "Every field, crop cycle, input, harvest and sale in one place",
    stats: [
      { n: "18", l: "farm modules" },
      { n: "9", l: "agronomic calculators" },
    ],
    bullets: ["Higher yields", "Lower input costs", "Crop disease diagnosis", "Bankable season records"],
    img: "/brand/cropmanager/dashboard.webp",
    h: 722,
    flip: false,
  },
  {
    name: "LivestockPro",
    sub: "Health, breeding, feeding, production and money for every animal",
    stats: [
      { n: "8", l: "management areas" },
      { n: "10", l: "languages, works offline" },
    ],
    bullets: ["Health and vaccination tracking", "Offline first mobile app", "Breeding and birth planning", "Records lenders trust"],
    img: "/brand/livestockpro/dashboard-overview.webp",
    h: 725,
    flip: true,
  },
];

const AUDIENCES = [
  "Smallholder farmers",
  "Commercial & dairy farms",
  "Cooperatives & producer groups",
  "Veterinary & extension officers",
  "Lenders, insurers & buyers",
  "Government & public health bodies",
];

/** Section title block in the deck style: bold forest-green title with a muted subtitle underneath. */
function SectionTitle({ title, sub, light = false, center = false }: { title: string; sub?: string; light?: boolean; center?: boolean }) {
  return (
    <Reveal className={`mb-12 ${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      <h2 className={`mb-3 text-balance text-[clamp(1.9rem,4.2vw,3rem)] font-bold leading-tight tracking-tight ${light ? "text-white" : "text-[#1B5E20] dark:text-green-300"}`}>
        {title}
      </h2>
      {sub && <p className={`m-0 text-lg ${light ? "text-green-100/80" : "text-gray-500 dark:text-gray-400"}`}>{sub}</p>}
    </Reveal>
  );
}

/** Dark-green circular icon badge, as on the deck's cards. */
function Badge({ Icon, amber = false, size = 56 }: { Icon: React.ElementType; amber?: boolean; size?: number }) {
  return (
    <span
      className="flex flex-shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, background: amber ? AMBER : FOREST, color: amber ? "#111611" : "#fff" }}
    >
      <Icon size={size * 0.5} weight="fill" />
    </span>
  );
}

const CARD = "rounded-2xl border border-[#D5E3D6] bg-[#F3F8F3] dark:border-white/10 dark:bg-white/[0.04]";

export default function AgricodersPage() {
  return (
    <div className="brand-deck flex min-h-screen flex-col bg-white text-[#111611] dark:bg-[#0c140d] dark:text-white">
      {/* sticky nav lives at the page root so it stays pinned for the whole scroll */}
      <AgriNav />

      {/* ═════ HERO — deck cover: forest green, amber accents ═════ */}
      <div className="relative overflow-hidden bg-[#1B5E20] text-white">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-white/[0.04]" />
        <div className="pointer-events-none absolute -bottom-52 left-1/3 h-[520px] w-[520px] rounded-full bg-black/10" />

        <section className="relative mx-auto max-w-7xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-32 lg:pt-24">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <Reveal>
                <p className="mb-5 text-sm font-bold uppercase tracking-[0.28em] text-[#F9A825]">Agricoders</p>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="mb-5 text-balance text-[clamp(2.5rem,6vw,4.6rem)] font-bold leading-[1.05] tracking-tight">
                  Building the future of digital agriculture
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="mb-6 max-w-xl text-xl leading-relaxed text-green-50/90 sm:text-2xl">
                  The operating system for African agriculture.
                </p>
                <p className="mb-8 max-w-xl text-lg font-bold text-[#F9A825]">Built for African farmers</p>
              </Reveal>
              <Reveal delay={180}>
                <div className="mb-10 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#vision"
                    className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#F9A825] px-8 py-4 text-base font-bold text-[#111611] no-underline shadow-lg transition-transform hover:-translate-y-0.5"
                  >
                    See our agenda
                    <ArrowRight size={18} weight="bold" />
                  </a>
                  <Link
                    href="/plan"
                    className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 px-8 py-4 text-base font-bold text-white no-underline transition-all hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    <Stack size={20} weight="duotone" />
                    Try Agriplan
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={240}>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-base font-bold">
                  <span className="text-sm font-normal text-green-100/80">Every product runs on</span>
                  <span className="inline-flex items-center gap-2"><GlobeHemisphereEast size={22} weight="fill" /> Web</span>
                  <span className="inline-flex items-center gap-2"><AppleLogo size={22} weight="fill" /> iOS</span>
                  <span className="inline-flex items-center gap-2"><AndroidLogo size={22} weight="fill" /> Android</span>
                </div>
              </Reveal>
            </div>

            {/* product device + product pills, as on the deck cover */}
            <Reveal delay={150}>
              <div className="mx-auto w-full max-w-[620px]">
                <div className="overflow-hidden rounded-xl border-[6px] border-[#111611] bg-[#111611] shadow-2xl">
                  <Image
                    src="/brand/cropmanager/dashboard.webp"
                    alt="CropManager dashboard"
                    width={1400}
                    height={722}
                    className="h-auto w-full"
                    priority
                  />
                </div>
                <ul className="m-0 mt-6 flex list-none flex-wrap justify-center gap-3 p-0">
                  {AGRICODERS_APPS.map((app) => (
                    <li key={app.id} className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-4 text-sm font-bold text-[#111611]">
                      <AppIcon src={app.icon} size={24} /> {app.name}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      {/* ═════ PROBLEM — "Africa's largest employer runs on guesswork" ═════ */}
      <section id="gap" className="scroll-mt-24 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Africa's largest employer runs on guesswork"
            sub="The gap between a thriving farm and a struggling one is information"
          />

          <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PROBLEM_STATS.map((s, i) => (
              <Reveal key={s.big} delay={i * 80}>
                <div className="flex items-center gap-5">
                  <span className="text-[clamp(2.4rem,4.5vw,3.4rem)] font-bold leading-none text-[#F9A825]">
                    {s.big.match(/\d/) ? <CountUp value={s.big} /> : s.big}
                  </span>
                  <span className="text-[15px] leading-snug text-gray-600 dark:text-gray-300">{s.desc}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROBLEMS.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div className={`${CARD} h-full p-6`}>
                  <div className="mb-5"><Badge Icon={Icon} /></div>
                  <h3 className="mb-2 text-xl font-bold">{title}</h3>
                  <p className="m-0 text-[15px] leading-relaxed text-gray-600 dark:text-gray-300">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">Sources: FAO, IFAD, World Bank and African Development Bank, rounded estimates.</p>
        </div>
      </section>

      {/* ═════ VISION & AGENDA — forest section ═════ */}
      <section id="vision" className="scroll-mt-24 bg-[#1B5E20] py-24 text-white sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionTitle
                light
                title="Every African farmer running their farm as a business"
                sub="Knowing what they produce, what it costs and what it earns, and using that knowledge to grow more, waste less, access finance and feed the continent."
              />
              <ul className="m-0 flex list-none flex-col gap-4 p-0">
                {VALUES.map((v, i) => (
                  <Reveal key={v} delay={i * 70}>
                    <li className="flex items-center gap-3 text-lg font-bold">
                      <CheckCircle size={26} weight="fill" className="flex-shrink-0 text-[#F9A825]" />
                      {v}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>

            <Reveal delay={100}>
              <div className="rounded-2xl border border-white/15 bg-[#2E7D32]/40 p-7 sm:p-9">
                <div className="mb-4 flex items-center gap-3">
                  <Badge Icon={Target} amber size={48} />
                  <p className="m-0 text-sm font-bold uppercase tracking-[0.2em] text-[#F9A825]">Our mission</p>
                </div>
                <p className="m-0 text-xl leading-relaxed">
                  Empower farmers and agribusinesses with geospatial intelligence, intelligent applications and
                  professional planning, so every investment of land, labour, capital and inputs achieves the
                  greatest possible productivity and profitability.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═════ ONE PLATFORM, THREE PRODUCTS ═════ */}
      <section id="systems" className="scroll-mt-24 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="One platform, three products" sub="Every product on web, iOS and Android" />

          <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {PRODUCTS.map(({ id, icon, name, desc, href, status }, i) => {
              const external = href.startsWith("http");
              return (
                <Reveal key={id} delay={i * 90}>
                  <article className={`${CARD} group flex h-full flex-col p-7`}>
                    <div className="mb-6 flex items-center justify-between">
                      <AppIcon src={icon} size={64} />
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                          status === "Live" ? "bg-[#1B5E20] text-white" : "bg-[#F9A825] text-[#111611]"
                        }`}
                      >
                        {status === "Live" && <span className="mkt-pulse-dot inline-block h-1.5 w-1.5 rounded-full" />}
                        {status}
                      </span>
                    </div>
                    <h3 className="mb-2 text-2xl font-bold">{name}</h3>
                    <p className="mb-6 text-base text-gray-600 dark:text-gray-300">{desc}</p>
                    <Link
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="mt-auto inline-flex items-center gap-2 text-[15px] font-bold text-[#1B5E20] no-underline dark:text-green-300"
                    >
                      {status === "Live" ? `Open ${name}` : "Learn more"}
                      {external ? <ArrowUpRight size={16} weight="bold" /> : <ArrowRight size={16} weight="bold" />}
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </div>

          {/* Record > Protect > Plan > Grow loop band */}
          <Reveal delay={120}>
            <div className="flex flex-col items-stretch gap-4 rounded-2xl bg-[#1B5E20] px-6 py-6 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10">
              {LOOP.map(({ Icon, label, amber }, i) => (
                <div key={label} className="flex items-center gap-4 sm:gap-6">
                  <span
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ background: amber ? AMBER : "#fff", color: amber ? "#111611" : FOREST }}
                  >
                    <Icon size={24} weight="fill" />
                  </span>
                  <span className="text-xl font-bold">{label}</span>
                  {i < LOOP.length - 1 && <ArrowRight size={22} weight="bold" className="hidden text-[#F9A825] sm:ml-2 sm:block lg:ml-6" />}
                </div>
              ))}
            </div>
          </Reveal>
          <p className="mt-4 text-[15px] italic text-[#1B5E20] dark:text-green-300">
            Records cut losses, become bankable plans, and unlock finance to grow: a loop that repeats every season.
          </p>
        </div>
      </section>

      {/* ═════ PRODUCT SPOTLIGHT: CropManager + LivestockPro — forest ═════ */}
      <section className="bg-[#1B5E20] py-24 text-white sm:py-28">
        <div className="mx-auto flex max-w-7xl flex-col gap-24 px-4 sm:px-6 lg:px-8">
          {SPOTLIGHTS.map((p) => (
            <div key={p.name} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <Reveal className={p.flip ? "lg:order-2" : ""}>
                <h2 className="mb-2 text-[clamp(1.9rem,4vw,2.8rem)] font-bold leading-tight">{p.name}</h2>
                <p className="mb-8 text-lg text-green-100/80">{p.sub}</p>
                <div className="mb-8 flex flex-col gap-3">
                  {p.stats.map((s) => (
                    <div key={s.l} className="flex items-center gap-5 rounded-xl bg-[#2E7D32]/45 px-6 py-4">
                      <span className="w-14 text-4xl font-bold text-[#F9A825]"><CountUp value={s.n} /></span>
                      <span className="text-lg">{s.l}</span>
                    </div>
                  ))}
                </div>
                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-lg font-bold">
                      <CheckCircle size={24} weight="fill" className="flex-shrink-0 text-[#F9A825]" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={120} className={p.flip ? "lg:order-1" : ""}>
                <div className="overflow-hidden rounded-xl border-[6px] border-[#111611] bg-[#111611] shadow-2xl">
                  <Image src={p.img} alt={`${p.name} dashboard`} width={1400} height={p.h} className="h-auto w-full" />
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* ═════ SERVICES ═════ */}
      <section id="services" className="scroll-mt-24 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Four services, one agribusiness partner"
            sub="Alongside our products, our team works hand in hand with clients, from sourcing the right figures to onboarding a whole cooperative."
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 80}>
                <article className={`${CARD} h-full p-6`}>
                  <div className="mb-5"><Badge Icon={Icon} /></div>
                  <h3 className="mb-2 text-xl font-bold">{title}</h3>
                  <p className="m-0 text-[15px] leading-relaxed text-gray-600 dark:text-gray-300">{desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═════ WHO WE SERVE ═════ */}
      <section id="impact" className="scroll-mt-24 py-24 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            center
            title="Built for everyone who grows, funds and protects food"
            sub="Zero hunger, decent work and climate resilience start with better decisions on every farm."
          />
          <Reveal delay={100}>
            <ul className="m-0 flex list-none flex-wrap justify-center gap-3 p-0">
              {AUDIENCES.map((a) => (
                <li key={a} className={`${CARD} inline-flex items-center gap-2 px-5 py-3 text-[15px] font-bold`}>
                  <Leaf size={18} weight="fill" className="text-[#2E7D32] dark:text-green-400" />
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ═════ CTA ═════ */}
      <section id="contact" className="scroll-mt-24 px-4 pb-24 sm:px-6 sm:pb-28 lg:px-8">
        <Reveal>
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#1B5E20] px-6 py-16 text-center text-white sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/[0.06]" />
            <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-black/10" />
            <div className="relative mx-auto max-w-2xl">
              <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F9A825] text-[#111611]">
                <Handshake size={32} weight="fill" />
              </span>
              <h2 className="mb-5 text-balance text-[clamp(2rem,5vw,3.3rem)] font-bold leading-tight tracking-tight">
                Help us build the future of digital agriculture
              </h2>
              <p className="mb-9 text-lg leading-relaxed text-green-50/90">
                Farmers, cooperatives, lenders, investors and development partners: let&apos;s grow the
                continent&apos;s food system together.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="mailto:agricoders@gmail.com"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F9A825] px-8 py-4 text-base font-bold text-[#111611] no-underline shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <EnvelopeSimple size={20} weight="fill" />
                  Partner with us
                </a>
                <Link
                  href="/apps"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-white/40 px-8 py-4 text-base font-bold text-white no-underline transition-all hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <Stack size={20} weight="duotone" />
                  Explore our systems
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <MarketingFooter />
    </div>
  );
}
