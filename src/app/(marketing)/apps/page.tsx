import Link from "next/link";
import type { Metadata } from "next";
import { Sprout } from "lucide-react";
import AgriNav from "@/components/layout/AgriNav";
import Reveal from "@/components/ui/Reveal";
import SystemsExplorer from "@/components/marketing/SystemsExplorer";
import { AGRICODERS_APPS } from "@/lib/apps";

export const metadata: Metadata = {
  title: "Our Systems — Agricoders",
  description:
    "Discover the systems and tools Agricoders has built for agribusinesses and farmers.",
};

export default function SystemsPage() {
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
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "#2E7D32", letterSpacing: "0.14em" }}
              >
                Agricoders
              </p>
              <h1
                className="font-extrabold text-gray-900 mb-5 leading-tight"
                style={{ fontSize: "clamp(28px, 5vw, 48px)" }}
              >
                Our Systems
              </h1>
              <p
                className="text-gray-500 leading-relaxed mx-auto"
                style={{ fontSize: 16, maxWidth: 480 }}
              >
                Tools and platforms we have built for agribusinesses, farmers, and entrepreneurs.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <SystemsExplorer apps={AGRICODERS_APPS} />
      </section>

      <footer className="bg-black border-t py-8" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="container">
          <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
            <Link href="/" className="d-flex align-items-center gap-2 no-underline">
              <div
                style={{ width: 28, height: 28, background: "#2E7D32", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Sprout size={13} color="white" />
              </div>
              <span className="font-bold text-white" style={{ fontSize: 14 }}>Agricoders</span>
            </Link>
            <Link href="/" className="no-underline" style={{ fontSize: 13, color: "#6b7280" }}>
              ← Back to agricoders.com
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
