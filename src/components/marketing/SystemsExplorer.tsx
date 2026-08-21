"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Layers, Sparkles, PawPrint, X } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import type { AppEntry } from "@/lib/apps";

const ICON_MAP: Record<string, React.ReactNode> = {
  logistackplan: <Layers size={26} color="white" />,
  livestockpro: <PawPrint size={26} color="white" />,
};

function SystemCard({ app, delay }: { app: AppEntry; delay: number }) {
  const icon = ICON_MAP[app.id] ?? <Sparkles size={26} color="white" />;

  return (
    <Reveal delay={delay} className="col-md-6 col-lg-4">
      <div
        className="sys-card h-100 d-flex flex-column"
        style={{
          background: "white",
          borderRadius: 28,
          padding: "clamp(24px, 6vw, 40px) clamp(20px, 5vw, 36px)",
          boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
          border: "1.5px solid rgba(0,0,0,0.05)",
        }}
      >
        <div className="d-flex align-items-start justify-content-between mb-6">
          <div
            style={{
              width: 68,
              height: 68,
              background: app.accentColor,
              borderRadius: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
          {app.status === "live" ? (
            <span
              className="d-inline-flex align-items-center gap-1.5"
              style={{ fontSize: 11, fontWeight: 600, color: "#2E7D32" }}
            >
              <span
                className="mkt-pulse-dot rounded-circle"
                style={{ width: 6, height: 6, background: "#2E7D32", display: "inline-block" }}
              />
              Live
            </span>
          ) : (
            <span style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af" }}>Coming soon</span>
          )}
        </div>
        <span
          className="d-inline-block mb-3"
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#6b7280",
            background: "#f3f4f6",
            borderRadius: 999,
            padding: "3px 10px",
            alignSelf: "flex-start",
          }}
        >
          {app.category}
        </span>
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
            target={app.href.startsWith("http") ? "_blank" : undefined}
            rel={app.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl no-underline transition-all hover:-translate-y-0.5 hover:shadow-lg"
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
    </Reveal>
  );
}

export default function SystemsExplorer({ apps }: { apps: AppEntry[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(apps.map((a) => a.category)))],
    [apps]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((a) => {
      const matchesCategory = category === "All" || a.category === category;
      const matchesQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.tagline.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [apps, query, category]);

  return (
    <div className="container">
      {/* Search + filters */}
      <Reveal className="row justify-content-center mb-10">
        <div className="col-lg-7">
          <div className="position-relative mb-4">
            <Search
              size={16}
              style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search systems by name or capability…"
              className="w-100"
              style={{
                padding: "13px 44px",
                borderRadius: 14,
                border: "1.5px solid #e5e7eb",
                fontSize: 14,
                outline: "none",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="border-0 bg-transparent d-flex align-items-center justify-content-center"
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="border-0 transition-all"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "7px 16px",
                  borderRadius: 999,
                  background: category === c ? "#2E7D32" : "#f3f4f6",
                  color: category === c ? "white" : "#4b5563",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="row g-4 align-items-stretch">
          {filtered.map((app, i) => (
            <SystemCard key={app.id} app={app} delay={i * 80} />
          ))}
          <Reveal delay={filtered.length * 80} className="col-md-6 col-lg-4">
            <div
              style={{
                height: "100%",
                minHeight: 220,
                borderRadius: 28,
                padding: "clamp(28px, 7vw, 48px) clamp(20px, 5vw, 36px)",
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
          </Reveal>
        </div>
      ) : (
        <div className="text-center py-5">
          <Search size={28} style={{ color: "#d1d5db", marginBottom: 12 }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: "#6b7280", marginBottom: 4 }}>
            No systems match &ldquo;{query}&rdquo;
          </p>
          <p style={{ fontSize: 13, color: "#9ca3af" }}>Try a different search term or category.</p>
        </div>
      )}
    </div>
  );
}
