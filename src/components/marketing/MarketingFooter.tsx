import Link from "next/link";
import { Sprout, Link2, Share2, GitBranch, Mail, MapPin } from "lucide-react";

const SOCIALS = [
  { label: "LinkedIn", Icon: Link2, href: "https://linkedin.com" },
  { label: "Twitter", Icon: Share2, href: "https://twitter.com" },
  { label: "GitHub", Icon: GitBranch, href: "https://github.com" },
  { label: "Email", Icon: Mail, href: "mailto:agricoders@gmail.com" },
];

const SERVICES = [
  "Geospatial Intelligence",
  "Web & Mobile Apps",
  "Digital Marketing",
  "Business Planning",
];

const COMPANY_LINKS = [
  { label: "Our Systems", href: "/apps", external: false },
  { label: "Logistack Plan", href: "/plan", external: false },
  { label: "Contact", href: "mailto:agricoders@gmail.com", external: true },
  { label: "Privacy Policy", href: "/privacy", external: false },
  { label: "Terms of Service", href: "/terms", external: false },
];

/** Shared Agricoders-branded footer used across the marketing site (home, apps, privacy, terms).
 *  Structurally mirrors src/components/layout/Footer.tsx (grid grid-cols-1 lg:grid-cols-5,
 *  no inline styles, sm:/lg: breakpoints) but carries Agricoders' own branding and links. */
export default function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.08] bg-black">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-3 inline-flex items-center gap-2 no-underline">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                <Sprout size={15} color="white" />
              </div>
              <span className="font-bold text-white">Agricoders</span>
            </Link>
            <p className="mb-4 max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Empowering farmers and agribusinesses with geospatial intelligence, intelligent
              applications, and professional planning.
            </p>
            <div className="mb-4 flex items-start gap-1.5">
              <MapPin size={13} className="mt-0.5 flex-shrink-0 text-green-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Kigali, KG 9 Ave, Deco Center, Kigali, Rwanda
              </span>
            </div>
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-gray-500 dark:text-gray-400 no-underline transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-3 lg:pl-12">
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500">
                Services
              </h3>
              <ul className="space-y-2">
                {SERVICES.map((s) => (
                  <li key={s}>
                    <Link
                      href="/#services"
                      className="text-sm text-gray-500 dark:text-gray-400 no-underline transition-colors hover:text-gray-200"
                    >
                      {s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-gray-500">
                Company
              </h3>
              <ul className="space-y-2">
                {COMPANY_LINKS.map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-gray-500 dark:text-gray-400 no-underline transition-colors hover:text-gray-200"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-500 dark:text-gray-400 no-underline transition-colors hover:text-gray-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              &copy; {year} Agricoders. All rights reserved.
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Empowering agriculture with intelligence.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
