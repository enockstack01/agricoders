import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import AgriNav from "@/components/layout/AgriNav";
import PageHero from "@/components/marketing/PageHero";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import AppIcon from "@/components/marketing/AppIcon";
import ScreenshotGallery from "@/components/marketing/ScreenshotGallery";
import Reveal from "@/components/ui/Reveal";
import { AGRICODERS_APPS } from "@/lib/apps";

export const metadata: Metadata = {
  title: "Our Systems | Agricoders",
  description:
    "CropManager, LivestockPro and Agriplan: the systems Agricoders has built for farmers and agribusinesses.",
};

export default function SystemsPage() {
  return (
    <div className="brand-deck flex min-h-screen flex-col bg-white text-[#111611] dark:bg-[#0c140d] dark:text-white">
      <AgriNav />

      <PageHero eyebrow="Agricoders" title="Our systems">
        <p>Three live products on web, iOS and Android, built for African farmers.</p>
      </PageHero>

      {AGRICODERS_APPS.map((app, i) => {
        const dark = i % 2 === 1;
        const external = app.href.startsWith("http");
        const live = app.status === "live";
        return (
          <section
            key={app.id}
            id={app.id}
            className={`scroll-mt-24 py-20 sm:py-24 ${dark ? "bg-[#1B5E20] text-white" : ""}`}
          >
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
              <Reveal className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className="mb-5 flex items-center gap-4">
                  <AppIcon src={app.icon} size={72} />
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                      live ? "bg-[#F9A825] text-[#111611]" : "bg-white/15"
                    }`}
                  >
                    {live ? "Live" : "Coming soon"}
                  </span>
                </div>
                <h2 className={`mb-2 text-[clamp(1.9rem,4vw,2.8rem)] font-bold leading-tight ${dark ? "" : "text-[#1B5E20] dark:text-green-300"}`}>
                  {app.name}
                </h2>
                <p className={`mb-5 text-lg font-bold ${dark ? "text-green-100/90" : "text-gray-600 dark:text-gray-300"}`}>{app.tagline}</p>
                <p className={`mb-7 text-[17px] leading-relaxed ${dark ? "text-green-50/90" : "text-gray-700 dark:text-gray-300"}`}>{app.description}</p>

                <ul className="m-0 mb-8 flex list-none flex-col gap-3 p-0">
                  {app.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-base font-bold">
                      <CheckCircle size={22} weight="fill" className="mt-0.5 flex-shrink-0 text-[#F9A825]" />
                      {f}
                    </li>
                  ))}
                </ul>

                {app.pricing && (
                  <p className={`mb-7 text-sm ${dark ? "text-green-100/80" : "text-gray-500 dark:text-gray-400"}`}>{app.pricing}</p>
                )}

                <Link
                  href={app.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F9A825] px-8 py-4 text-base font-bold text-[#111611] no-underline shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  Open {app.name}
                  {external ? <ArrowUpRight size={18} weight="bold" /> : <ArrowRight size={18} weight="bold" />}
                </Link>
              </Reveal>

              {app.screenshots && app.screenshots.length > 0 ? (
                <Reveal delay={120} className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <ScreenshotGallery shots={app.screenshots} name={app.name} />
                </Reveal>
              ) : (
                <Reveal delay={120} className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="rounded-2xl border border-[#D5E3D6] bg-[#F3F8F3] p-8 dark:border-white/10 dark:bg-white/[0.04]">
                    <p className="m-0 text-lg font-bold text-[#1B5E20] dark:text-green-300">Planning documents in minutes</p>
                    <p className="m-0 mt-2 text-gray-600 dark:text-gray-300">
                      Answer ten guided steps and receive a Business Plan (.docx) and a 19 sheet Financial Model (.xlsx).
                    </p>
                  </div>
                </Reveal>
              )}
            </div>
          </section>
        );
      })}

      <MarketingFooter />
    </div>
  );
}
