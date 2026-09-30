import Link from "next/link";
import {
  Plant,
  LinkedinLogo,
  XLogo,
  GithubLogo,
  EnvelopeSimple,
  MapPin,
  ArrowRight,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import { AGRICODERS_APPS } from "@/lib/apps";

const SOCIALS = [
  { label: "LinkedIn", Icon: LinkedinLogo, href: "https://linkedin.com" },
  { label: "X (Twitter)", Icon: XLogo, href: "https://twitter.com" },
  { label: "GitHub", Icon: GithubLogo, href: "https://github.com" },
  { label: "Email", Icon: EnvelopeSimple, href: "mailto:agricoders@gmail.com" },
];

const SERVICES = ["Geospatial Intelligence", "Web & Mobile Apps", "Digital Marketing", "Business Planning"];

const COMPANY_LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Precision agriculture", href: "/#precision" },
  { label: "All systems", href: "/apps" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const linkCls =
  "text-[15px] font-semibold text-white/60 no-underline transition-colors hover:text-white";

/** Shared Agricoders footer used across the marketing site (home, apps, privacy, terms, plan landing). */
export default function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#050c07] text-white">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[900px] -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link href="/" className="group mb-5 inline-flex items-center gap-2.5 no-underline">
              <span className="mkt-sticker flex h-11 w-11 items-center justify-center rounded-2xl">
                <Plant size={24} weight="duotone" />
              </span>
              <span className="text-xl font-black tracking-tight text-white">
                Agri<span className="text-green-400">coders</span>
              </span>
            </Link>
            <p className="mb-6 max-w-sm text-[15px] leading-relaxed text-white/60">
              Empowering farmers and agribusinesses with geospatial intelligence, intelligent applications,
              digital marketing and professional planning.
            </p>
            <p className="mb-6 flex items-start gap-2 text-sm font-semibold text-white/60">
              <MapPin size={18} weight="duotone" className="mt-0.5 flex-shrink-0 text-green-400" />
              KG 9 Ave, Deco Center, Kigali, Rwanda
            </p>
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-white/60 no-underline ring-1 ring-white/10 transition-all hover:-translate-y-0.5 hover:bg-green-500/20 hover:text-white"
                >
                  <Icon size={20} weight="duotone" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h3 className="mb-4 text-xs font-black uppercase tracking-[0.14em] text-white/40">Services</h3>
              <ul className="m-0 list-none space-y-3 p-0">
                {SERVICES.map((s) => (
                  <li key={s}><Link href="/#services" className={linkCls}>{s}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-black uppercase tracking-[0.14em] text-white/40">Systems</h3>
              <ul className="m-0 list-none space-y-3 p-0">
                {AGRICODERS_APPS.map((app) => {
                  const external = app.href.startsWith("http");
                  return (
                    <li key={app.id}>
                      <Link
                        href={app.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className={`${linkCls} inline-flex items-center gap-1`}
                      >
                        {app.name}
                        {external && <ArrowUpRight size={13} weight="bold" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="mb-4 text-xs font-black uppercase tracking-[0.14em] text-white/40">Company</h3>
              <ul className="m-0 list-none space-y-3 p-0">
                {COMPANY_LINKS.map((l) => (
                  <li key={l.label}><Link href={l.href} className={linkCls}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* mini CTA */}
        <div className="mt-14 flex flex-col items-start justify-between gap-5 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="m-0 text-xl font-black">Start your business plan today</p>
            <p className="m-0 text-[15px] text-white/60">Investor-ready documents in under 15 minutes with Logistack Plan.</p>
          </div>
          <Link href="/plan" className="mkt-btn-primary inline-flex flex-shrink-0 items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-extrabold no-underline">
            Get started
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/45 sm:flex-row">
          <span>&copy; {year} Agricoders. All rights reserved.</span>
          <a href="mailto:agricoders@gmail.com" className="inline-flex items-center gap-1.5 text-white/60 no-underline hover:text-white">
            <EnvelopeSimple size={16} weight="duotone" />
            agricoders@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
