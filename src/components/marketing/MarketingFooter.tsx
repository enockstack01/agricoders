import Link from "next/link";
import { ArrowRight, ArrowUpRight, EnvelopeSimple, MapPin, Phone, Globe } from "@phosphor-icons/react/dist/ssr";
import { AGRICODERS_APPS } from "@/lib/apps";
import AppIcon from "./AppIcon";
import BrandMark from "./BrandMark";

const SERVICES = ["Business Planning", "Geospatial Intelligence", "Web & Mobile Apps", "Digital Marketing"];

const COMPANY_LINKS = [
  { label: "Our vision", href: "/#vision" },
  { label: "All systems", href: "/apps" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const headingCls = "mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#F9A825]";
const linkCls = "text-[15px] text-white/75 no-underline transition-colors hover:text-white";

/** Shared Agricoders footer (home, systems, plan, legal pages). Follows the brand closing-slide pattern:
 *  dark ink background, white logo lockup with the Logistack endorsement, contact line, one amber call to action. */
export default function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111611] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        {/* Call to action */}
        <div className="mb-14 flex flex-col items-start justify-between gap-5 rounded-2xl bg-[#1B5E20] p-7 sm:flex-row sm:items-center sm:p-9">
          <div>
            <p className="m-0 mb-1 text-2xl font-bold">Start your business plan today</p>
            <p className="m-0 text-base text-green-50/90">Investor ready documents in under 15 minutes with Agriplan.</p>
          </div>
          <Link
            href="/plan"
            className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-[#F9A825] px-7 py-3.5 text-base font-bold text-[#111611] no-underline transition-transform hover:-translate-y-0.5"
          >
            Get started
            <ArrowRight size={18} weight="bold" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Lockup and contact */}
          <div className="lg:col-span-4">
            <Link href="/" aria-label="Agricoders home" className="mb-5 inline-flex items-center gap-3 no-underline">
              <BrandMark size={48} />
              <span className="text-xl font-bold uppercase tracking-[0.18em] text-white">Agricoders</span>
            </Link>
            <p className="mb-6 max-w-sm text-[15px] leading-relaxed text-white/75">
              The operating system for African agriculture, built for African farmers.
            </p>
            <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[15px] text-white/75">
              <li className="flex items-start gap-3">
                <MapPin size={20} weight="fill" className="mt-0.5 flex-shrink-0 text-[#F9A825]" />
                Deco Center, Nyarutarama, Kigali, Rwanda
              </li>
              <li className="flex items-center gap-3">
                <EnvelopeSimple size={20} weight="fill" className="flex-shrink-0 text-[#F9A825]" />
                <a href="mailto:agricoderstech@gmail.com" className="text-white/75 no-underline hover:text-white">agricoderstech@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} weight="fill" className="flex-shrink-0 text-[#F9A825]" />
                <a href="tel:+250796847804" className="text-white/75 no-underline hover:text-white">+250 796 847 804</a>
              </li>
              <li className="flex items-center gap-3">
                <Globe size={20} weight="fill" className="flex-shrink-0 text-[#F9A825]" />
                <a href="https://www.agricoders.com" className="text-white/75 no-underline hover:text-white">www.agricoders.com</a>
              </li>
            </ul>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:col-span-8 lg:pl-10">
            <div>
              <h3 className={headingCls}>Systems</h3>
              <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
                {AGRICODERS_APPS.map((app) => {
                  const external = app.href.startsWith("http");
                  return (
                    <li key={app.id}>
                      <Link
                        href={app.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className={`${linkCls} inline-flex items-center gap-2.5`}
                      >
                        <AppIcon src={app.icon} size={24} />
                        {app.name}
                        {external && <ArrowUpRight size={13} weight="bold" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h3 className={headingCls}>Services</h3>
              <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
                {SERVICES.map((s) => (
                  <li key={s}><Link href="/#services" className={linkCls}>{s}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={headingCls}>Company</h3>
              <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
                {COMPANY_LINKS.map((l) => (
                  <li key={l.label}><Link href={l.href} className={linkCls}>{l.label}</Link></li>
                ))}
                <li>
                  <a href="https://logistack.space" target="_blank" rel="noopener noreferrer" className={`${linkCls} inline-flex items-center gap-1`}>
                    Logistack Ltd
                    <ArrowUpRight size={13} weight="bold" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-sm text-white/60 sm:flex-row">
          <span>&copy; {year} Logistack Ltd. All rights reserved.</span>
          <span className="flex items-center gap-3">
            <Link href="/privacy" className="text-white/60 no-underline hover:text-white">Privacy</Link>
            <span aria-hidden="true">|</span>
            <Link href="/terms" className="text-white/60 no-underline hover:text-white">Terms</Link>
            <span aria-hidden="true">|</span>
            <a href="https://logistack.space" target="_blank" rel="noopener noreferrer" className="text-white/60 no-underline hover:text-white">logistack.space</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
