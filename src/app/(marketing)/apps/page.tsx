import type { Metadata } from "next";
import AgriNav from "@/components/layout/AgriNav";
import PageHero from "@/components/marketing/PageHero";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import SystemsExplorer from "@/components/marketing/SystemsExplorer";
import { AGRICODERS_APPS } from "@/lib/apps";

export const metadata: Metadata = {
  title: "Our Systems — Agricoders",
  description:
    "Discover the systems and tools Agricoders has built for agribusinesses and farmers.",
};

export default function SystemsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <AgriNav />

      <PageHero eyebrow="Agricoders" title="Our Systems">
        <p className="mx-auto max-w-[480px] text-base leading-relaxed text-gray-500 dark:text-gray-400">
          Tools and platforms we have built for agribusinesses, farmers, and entrepreneurs.
        </p>
      </PageHero>

      <section className="pb-24">
        <SystemsExplorer apps={AGRICODERS_APPS} />
      </section>

      <MarketingFooter />
    </div>
  );
}
