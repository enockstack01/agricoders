import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import AgriNav from "@/components/layout/AgriNav";
import PageHero from "@/components/marketing/PageHero";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Terms of Service — Agricoders",
  description: "The terms that govern your use of Agriplan and Agricoders products.",
};

const UPDATED = "August 21, 2026";

const SECTIONS = [
  {
    title: "1. Acceptance of terms",
    body: `By creating an account or using Agriplan, LivestockPro, or any other Agricoders product, you agree to these Terms of Service. If you do not agree, please do not use our products.`,
  },
  {
    title: "2. Your account",
    body: `You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must provide accurate information when creating your account.`,
  },
  {
    title: "3. Acceptable use",
    body: `You agree not to misuse our products — including attempting to disrupt our systems, reverse-engineer our software, use the service for unlawful purposes, or generate content that infringes on others' rights.`,
  },
  {
    title: "4. Generated content",
    body: `Business plans, financial models, and other documents you generate through Agriplan are yours to use for your own business purposes. We do not claim ownership over the specific business information you provide or the documents generated from it. Because content is AI-assisted, you are responsible for reviewing generated documents for accuracy before relying on them, e.g. for investor or regulatory submissions.`,
  },
  {
    title: "5. Payments",
    body: `Certain features (such as system-generated or expert-custom business plans) require payment as described at the point of purchase. Fees are non-refundable except where required by law or explicitly stated otherwise.`,
  },
  {
    title: "6. Service availability",
    body: `We aim to keep our products available and reliable, but we do not guarantee uninterrupted access. We may modify, suspend, or discontinue features with reasonable notice where practical.`,
  },
  {
    title: "7. Limitation of liability",
    body: `Our products, including AI-generated content, are provided "as is" without warranties of any kind. To the fullest extent permitted by law, Agricoders and Logistack Ltd are not liable for indirect, incidental, or consequential damages arising from your use of our products.`,
  },
  {
    title: "8. Changes to these terms",
    body: `We may update these Terms from time to time. Continued use of our products after changes take effect constitutes acceptance of the revised Terms.`,
  },
];

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <AgriNav />

      <PageHero eyebrow="Legal" title="Terms of Service">
        <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: {UPDATED}</p>
      </PageHero>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {SECTIONS.map((s, i) => (
              <Reveal key={s.title} delay={Math.min(i * 40, 200)} className="mb-8">
                <h2 className="mb-2.5 text-[19px] font-bold text-gray-900 dark:text-white">{s.title}</h2>
                <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">{s.body}</p>
              </Reveal>
            ))}

            <Reveal delay={220}>
              <div className="mt-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-5">
                <h3 className="mb-3 text-[15px] font-bold text-gray-900 dark:text-white">Questions about these terms?</h3>
                <div className="mb-2 flex items-center gap-2">
                  <Mail size={14} className="flex-shrink-0 text-green-600" />
                  <a href="mailto:logistackltd@gmail.com" className="text-sm text-gray-600 dark:text-gray-400 no-underline">
                    logistackltd@gmail.com
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0 text-green-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Deco Center — NYARUTARAMA, Kigali, Rwanda</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
