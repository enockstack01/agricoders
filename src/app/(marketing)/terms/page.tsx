import Link from "next/link";
import type { Metadata } from "next";
import { Sprout, Mail, MapPin } from "lucide-react";
import AgriNav from "@/components/layout/AgriNav";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Terms of Service — Agricoders",
  description: "The terms that govern your use of Logistack Plan and Agricoders products.",
};

const UPDATED = "August 21, 2026";

const SECTIONS = [
  {
    title: "1. Acceptance of terms",
    body: `By creating an account or using Logistack Plan, LivestockPro, or any other Agricoders product, you agree to these Terms of Service. If you do not agree, please do not use our products.`,
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
    body: `Business plans, financial models, and other documents you generate through Logistack Plan are yours to use for your own business purposes. We do not claim ownership over the specific business information you provide or the documents generated from it. Because content is AI-assisted, you are responsible for reviewing generated documents for accuracy before relying on them, e.g. for investor or regulatory submissions.`,
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
    <div className="min-h-screen flex flex-col bg-white">
      <AgriNav />

      <section className="py-20 text-center bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="mkt-float-slow absolute rounded-full blur-3xl"
            style={{ top: -60, left: "50%", transform: "translateX(-50%)", width: 500, height: 260, background: "rgba(46,125,50,0.06)" }}
          />
        </div>
        <div className="container position-relative">
          <div className="row justify-content-center">
            <Reveal className="col-lg-7">
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#2E7D32", letterSpacing: "0.14em" }}>
                Legal
              </p>
              <h1 className="font-extrabold text-gray-900 mb-3 leading-tight" style={{ fontSize: "clamp(28px, 5vw, 48px)" }}>
                Terms of Service
              </h1>
              <p className="text-gray-500" style={{ fontSize: 14 }}>Last updated: {UPDATED}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {SECTIONS.map((s, i) => (
                <Reveal key={s.title} delay={Math.min(i * 40, 200)} className="mb-8">
                  <h2 className="font-bold text-gray-900 mb-2.5" style={{ fontSize: 19 }}>{s.title}</h2>
                  <p className="text-gray-600 leading-relaxed" style={{ fontSize: 15 }}>{s.body}</p>
                </Reveal>
              ))}

              <Reveal delay={220}>
                <div
                  className="rounded-xl p-5 mt-10"
                  style={{ background: "#F5F7FA", border: "1px solid #E0E0E0" }}
                >
                  <h3 className="font-bold text-gray-900 mb-3" style={{ fontSize: 15 }}>Questions about these terms?</h3>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Mail size={14} style={{ color: "#2E7D32", flexShrink: 0 }} />
                    <a href="mailto:logistackltd@gmail.com" className="text-sm no-underline text-gray-600">
                      logistackltd@gmail.com
                    </a>
                  </div>
                  <div className="d-flex align-items-start gap-2">
                    <MapPin size={14} style={{ color: "#2E7D32", flexShrink: 0, marginTop: 2 }} />
                    <span className="text-sm text-gray-600">Deco Center — NYARUTARAMA, Kigali, Rwanda</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black border-t py-8" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="container">
          <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
            <Link href="/" className="d-flex align-items-center gap-2 no-underline">
              <div style={{ width: 28, height: 28, background: "#2E7D32", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sprout size={13} color="white" />
              </div>
              <span className="font-bold text-white" style={{ fontSize: 14 }}>Agricoders</span>
            </Link>
            <Link href="/privacy" className="no-underline" style={{ fontSize: 13, color: "#6b7280" }}>
              ← Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
