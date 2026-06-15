import Link from "next/link";
import type { Metadata } from "next";
import {
  Layers,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Sprout,
} from "lucide-react";
import AgriNav from "@/components/layout/AgriNav";
import { AGRICODERS_APPS, type AppEntry } from "@/lib/apps";

export const metadata: Metadata = {
  title: "Apps — Agricoders",
  description:
    "Discover all Agricoders applications — purpose-built tools for agribusinesses and farmers.",
};

const ICON_MAP: Record<string, React.ReactNode> = {
  logistackplan: <Layers size={28} color="white" />,
};

function AppCard({ app }: { app: AppEntry }) {
  const icon = ICON_MAP[app.id] ?? <Sparkles size={28} color="white" />;
  const isLive = app.status === "live";

  return (
    <div
      className="agri-snap-card d-flex flex-column h-100"
      style={{
        background: "white",
        borderRadius: 28,
        padding: "40px 36px",
        boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
        border: "1.5px solid rgba(0,0,0,0.05)",
      }}
    >
      <div className="d-flex align-items-start justify-content-between mb-5">
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            width: 64,
            height: 64,
            background: app.accentColor,
            borderRadius: 20,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <span
          style={{
            background: isLive ? "#dcfce7" : "#f3f4f6",
            color: isLive ? "#15803d" : "#6b7280",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            padding: "4px 12px",
            borderRadius: 999,
          }}
        >
          {app.status === "live" ? "Live" : app.status === "beta" ? "Beta" : "Coming Soon"}
        </span>
      </div>

      <p
        className="text-xs font-semibold uppercase mb-1"
        style={{ color: app.accentColor, letterSpacing: "0.1em" }}
      >
        {app.category}
      </p>
      <h3 className="font-bold text-gray-900 mb-2" style={{ fontSize: 22, lineHeight: 1.2 }}>
        {app.name}
      </h3>
      <p className="mb-2" style={{ fontSize: 13, color: "#6b7280" }}>{app.tagline}</p>
      <p className="leading-relaxed mb-5" style={{ fontSize: 14, color: "#9ca3af" }}>
        {app.description}
      </p>

      <ul className="list-unstyled mb-5">
        {app.features.map((f) => (
          <li key={f} className="d-flex align-items-start gap-2 mb-2" style={{ fontSize: 13, color: "#6b7280" }}>
            <CheckCircle size={13} style={{ color: app.accentColor, flexShrink: 0, marginTop: 2 }} />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        {app.pricing && (
          <p className="mb-3" style={{ fontSize: 12, color: "#9ca3af" }}>{app.pricing}</p>
        )}
        {isLive ? (
          <Link
            href={app.href}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl transition-colors no-underline"
            style={{ background: app.accentColor, fontSize: 14 }}
          >
            Open {app.name}
            <ArrowRight size={14} />
          </Link>
        ) : (
          <span
            className="inline-flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl"
            style={{ background: "#f3f4f6", color: "#9ca3af", fontSize: 14 }}
          >
            Coming Soon
          </span>
        )}
      </div>
    </div>
  );
}

export default function AppsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <style>{`
        .agri-snap-card {
          transition: box-shadow 0.3s, transform 0.3s;
        }
        .agri-snap-card:hover {
          box-shadow: 0 20px 60px rgba(0,0,0,0.14) !important;
          transform: translateY(-6px);
        }
      `}</style>

      <AgriNav />

      {/* Hero */}
      <section className="py-20 text-center bg-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "#16a34a", letterSpacing: "0.14em" }}
              >
                Agricoders Platform
              </p>
              <h1
                className="font-extrabold text-gray-900 mb-5 leading-tight"
                style={{ fontSize: "clamp(28px, 5vw, 48px)" }}
              >
                Apps built for agribusiness
              </h1>
              <p
                className="text-gray-500 leading-relaxed mx-auto"
                style={{ fontSize: 16, maxWidth: 480 }}
              >
                Purpose-built tools that help farmers, agribusinesses, and agricultural
                entrepreneurs operate with precision and grow with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App cards */}
      <section className="pb-24">
        <div className="container">
          <div className="row g-4 align-items-stretch">
            {AGRICODERS_APPS.map((app) => (
              <div key={app.id} className="col-md-6 col-lg-4">
                <AppCard app={app} />
              </div>
            ))}
            {/* Placeholder for future apps */}
            <div className="col-md-6 col-lg-4">
              <div
                className="d-flex flex-column align-items-center justify-content-center h-100 text-center"
                style={{
                  borderRadius: 28,
                  padding: "48px 36px",
                  border: "2px dashed #e5e7eb",
                  minHeight: 240,
                }}
              >
                <Sparkles size={34} className="mb-4" style={{ color: "#d1d5db" }} />
                <p className="font-semibold mb-1" style={{ fontSize: 15, color: "#9ca3af" }}>
                  More apps coming
                </p>
                <p className="mb-0" style={{ fontSize: 13, color: "#d1d5db" }}>
                  New tools are in development for the Agricoders platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform integration section */}
      <section className="py-20" style={{ background: "#111827" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "#4ade80", letterSpacing: "0.14em" }}
              >
                Platform Integration
              </p>
              <h2
                className="font-bold text-white mb-4 leading-tight"
                style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
              >
                Integrate Agricoders apps on your platform
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8" style={{ fontSize: 15 }}>
                All Agricoders apps expose a public discovery API. Use it to list available apps,
                deep-link users into specific tools, or embed app launchers inside your own ecosystem.
              </p>
              <div
                className="text-left rounded-2xl p-4 mb-8 mx-auto"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontFamily: "monospace",
                  fontSize: 13,
                  color: "#4ade80",
                  maxWidth: 420,
                }}
              >
                GET /api/apps
              </div>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <a
                  href="/api/apps"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-colors no-underline"
                  style={{ background: "#16a34a", color: "white", fontSize: 14 }}
                >
                  View API Response
                  <ExternalLink size={14} />
                </a>
                <a
                  href="mailto:agricoders@gmail.com"
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-colors no-underline"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "white",
                    fontSize: 14,
                  }}
                >
                  Contact for Integration
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="bg-black border-t py-8" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="container">
          <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
            <Link href="/" className="d-flex align-items-center gap-2 no-underline">
              <div
                className="d-flex align-items-center justify-content-center rounded-2"
                style={{ width: 28, height: 28, background: "#16a34a" }}
              >
                <Sprout size={13} color="white" />
              </div>
              <span className="font-bold text-white" style={{ fontSize: 14 }}>
                Agricoders
              </span>
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
