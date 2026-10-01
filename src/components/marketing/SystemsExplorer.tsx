"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Layers, Sparkles, PawPrint, X } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import type { AppEntry } from "@/lib/apps";

const ICON_MAP: Record<string, React.ReactNode> = {
  agriplan: <Layers size={26} color="white" />,
  livestockpro: <PawPrint size={26} color="white" />,
};

function SystemCard({ app, delay }: { app: AppEntry; delay: number }) {
  const icon = ICON_MAP[app.id] ?? <Sparkles size={26} color="white" />;

  return (
    <Reveal delay={delay} className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-0.75rem)]">
      <div className="hover-lift shadow-soft flex h-full flex-col rounded-[28px] border-[1.5px] border-black/5 bg-white dark:bg-gray-900 p-[clamp(24px,6vw,40px)_clamp(20px,5vw,36px)]">
        <div className="mb-6 flex items-start justify-between">
          <div
            className="flex h-[68px] w-[68px] flex-shrink-0 items-center justify-center rounded-[22px]"
            style={{ background: app.accentColor }}
          >
            {icon}
          </div>
          {app.status === "live" ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-green-600">
              <span className="mkt-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-green-600" />
              Live
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">Coming soon</span>
          )}
        </div>
        <span className="mb-3 inline-block self-start rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-[3px] text-[11px] font-semibold text-gray-500 dark:text-gray-400">
          {app.category}
        </span>
        <h3 className="mb-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">{app.name}</h3>
        <p className="mb-2 text-[13px] text-gray-500 dark:text-gray-400">{app.tagline}</p>
        <p className="mb-7 flex-grow text-sm leading-relaxed text-gray-400 dark:text-gray-500">{app.description}</p>
        {app.status === "live" ? (
          <Link
            href={app.href}
            target={app.href.startsWith("http") ? "_blank" : undefined}
            rel={app.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2 self-start rounded-xl px-5 py-2.5 text-sm font-semibold text-white no-underline transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: app.accentColor }}
          >
            Open {app.name}
            <ArrowRight size={14} />
          </Link>
        ) : (
          <span className="inline-flex items-center self-start rounded-xl bg-gray-100 dark:bg-gray-800 px-5 py-2.5 text-sm font-semibold text-gray-400 dark:text-gray-500">
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Search + filters */}
      <Reveal className="mb-10 flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="relative mb-4">
            <Search
              size={16}
              className="pointer-events-none absolute left-[18px] top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search systems by name or capability…"
              className="w-full rounded-2xl border-[1.5px] border-gray-200 dark:border-gray-800 py-[13px] pl-11 pr-11 text-sm outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border-0 bg-transparent text-gray-400 dark:text-gray-500"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`min-h-[40px] rounded-full border-0 px-4 py-2.5 text-[13px] font-semibold transition-all ${
                  category === c ? "bg-green-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="flex flex-wrap items-stretch justify-center gap-6">
          {filtered.map((app, i) => (
            <SystemCard key={app.id} app={app} delay={i * 80} />
          ))}
          <Reveal
            delay={filtered.length * 80}
            className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-0.75rem)]"
          >
            <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-gray-200 dark:border-gray-800 p-[clamp(28px,7vw,48px)_clamp(20px,5vw,36px)] text-center">
              <Sparkles size={32} className="mb-4 text-gray-300" />
              <p className="mb-1.5 text-[15px] font-semibold text-gray-400 dark:text-gray-500">More systems coming</p>
              <p className="mb-0 text-[13px] text-gray-300">New tools are under development.</p>
            </div>
          </Reveal>
        </div>
      ) : (
        <div className="py-12 text-center">
          <Search size={28} className="mx-auto mb-3 text-gray-300" />
          <p className="mb-1 text-[15px] font-semibold text-gray-500 dark:text-gray-400">
            No systems match &ldquo;{query}&rdquo;
          </p>
          <p className="text-[13px] text-gray-400 dark:text-gray-500">Try a different search term or category.</p>
        </div>
      )}
    </div>
  );
}
