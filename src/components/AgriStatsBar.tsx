"use client";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { end: 100, suffix: "+",    label: "Supported Currencies" },
  { end: 15,  suffix: " min", label: "Plan Generation"      },
  { end: 19,  suffix: "",     label: "Financial Sheets"     },
  { end: 6,   suffix: "",     label: "Professional Charts"  },
];

function useCountUp(end: number, duration: number, started: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(end / (duration / 16)));
    const timer = setInterval(() => {
      current = Math.min(current + step, end);
      setValue(current);
      if (current >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, started]);
  return value;
}

function StatItem({ stat, started }: { stat: (typeof STATS)[number]; started: boolean }) {
  const val = useCountUp(stat.end, 1400, started);
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-black text-green-950 mb-1 tracking-tight">
        {val}{stat.suffix}
      </div>
      <div className="text-xs text-amber-800 font-semibold uppercase tracking-widest">
        {stat.label}
      </div>
    </div>
  );
}

export default function AgriStatsBar() {
  const ref = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setStarted(true); observer.disconnect(); }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 px-4 sm:px-6 py-10 border-b border-amber-300"
    >
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
        {STATS.map((s) => (
          <StatItem key={s.label} stat={s} started={started} />
        ))}
      </div>
    </section>
  );
}
