import Link from "next/link";
import type { Metadata } from "next";
import { Layers, ArrowRight, Sprout, Sparkles } from "lucide-react";
import AgriNav from "@/components/layout/AgriNav";
import { AGRICODERS_APPS, type AppEntry } from "@/lib/apps";

export const metadata: Metadata = {
  title: "Our Systems — Agricoders",
  description:
    "Discover the systems and tools Agricoders has built for agribusinesses and farmers.",
};

const ICON_MAP: Record<string, React.ReactNode> = {
  logistackplan: <Layers size={26} color="white" />,
};

function SystemCard({ app }: { app: AppEntry }) {
  const icon = ICON_MAP[app.id] ?? <Sparkles size={26} color="white" />;

  return (
    <div className="sys-card h-100 d-flex flex-column"
      style={{
        background: "white",
        borderRadius: 28,
        padding: "40px 36px",
        boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
        border: "1.5px solid rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          width: 68,
          height: 68,
          background: app.accentColor,
          borderRadius: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 8, lineHeight: 1.2 }}>
        {app.name}
      </h3>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>{app.tagline}</p>
      <p style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.65, marginBottom: 28, flexGrow: 1 }}>
        {app.description}
      </p>
      {app.status === "live" ? (
        <Link
          href={app.href}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl no-underline"
          style={{ background: app.accentColor, fontSize: 14, alignSelf: "flex-start" }}
        >
          Open {app.name}
          <ArrowRight size={14} />
        </Link>
      ) : (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "10px 20px",
            background: "#f3f4f6",
            color: "#9ca3af",
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 12,
            alignSelf: "flex-start",
          }}
        >
          Coming Soon
        </span>
      )}
    </div>
  );
}

export default function SystemsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <style>{`
        .sys-card {
          transition: box-shadow 0.3s, transform 0.3s;
        }
        .sys-card:hover {
          box-shadow: 0 20px 60px rgba(0,0,0,0.14) !important;
          transform: translateY(-6px);
        }
      `}</style>

      <AgriNav />

      <section className="py-20 text-center bg-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "#16a34a", letterSpacing: "0.14em" }}
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
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container">
          <div className="row g-4 align-items-stretch">
            {AGRICODERS_APPS.map((app) => (
              <div key={app.id} className="col-md-6 col-lg-4">
                <SystemCard app={app} />
              </div>
            ))}
            <div className="col-md-6 col-lg-4">
              <div
                style={{
                  height: "100%",
                  minHeight: 220,
                  borderRadius: 28,
                  padding: "48px 36px",
                  border: "2px dashed #e5e7eb",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Sparkles size={32} style={{ color: "#d1d5db", marginBottom: 16 }} />
                <p style={{ fontSize: 15, fontWeight: 600, color: "#9ca3af", marginBottom: 6 }}>
                  More systems coming
                </p>
                <p style={{ fontSize: 13, color: "#d1d5db", marginBottom: 0 }}>
                  New tools are under development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black border-t py-8" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="container">
          <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
            <Link href="/" className="d-flex align-items-center gap-2 no-underline">
              <div
                style={{ width: 28, height: 28, background: "#16a34a", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}
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
