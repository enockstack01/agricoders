// Modern marketing diagrams for the Agricoders landing page. Server components (no client JS):
// HTML/CSS for layouts that must reflow on mobile, inline SVG for illustrations.
// Animations live in globals.css ("LANDING v2") and switch off under prefers-reduced-motion.
import {
  MapTrifold,
  ChartLineUp,
  FileText,
  Plant,
  Stack,
  PawPrint,
  GlobeHemisphereEast,
  Megaphone,
} from "@phosphor-icons/react/dist/ssr";

/* ─────────────────────────────────────────────────────────────────────────────
   1. Process flow — Map → Analyse → Plan → Grow
   ───────────────────────────────────────────────────────────────────────────── */
const STEPS = [
  { Icon: MapTrifold, title: "Map", desc: "Capture every field, boundary and zone with geospatial data.", tone: "from-sky-400 to-blue-700" },
  { Icon: ChartLineUp, title: "Analyse", desc: "Score soil, terrain and crop suitability to find where returns are highest.", tone: "from-emerald-400 to-green-700" },
  { Icon: FileText, title: "Plan", desc: "Turn insight into investor-ready business plans and financial models.", tone: "from-fuchsia-400 to-purple-700" },
  { Icon: Plant, title: "Grow", desc: "Run operations on purpose-built apps and reach markets with digital marketing.", tone: "from-amber-300 to-orange-600" },
];

export function ProcessFlow() {
  return (
    <ol className="relative grid list-none grid-cols-1 gap-0 p-0 lg:grid-cols-4 lg:gap-6">
      {STEPS.map(({ Icon, title, desc, tone }, i) => (
        <li key={title} className="group relative flex gap-5 pb-10 last:pb-0 lg:flex-col lg:items-center lg:gap-0 lg:pb-0 lg:text-center">
          {/* connector: vertical on mobile, horizontal on desktop */}
          {i < STEPS.length - 1 && (
            <>
              <span aria-hidden className="mkt-step-line-v absolute left-[31px] top-[70px] bottom-0 w-[2px] lg:hidden" />
              <span aria-hidden className="mkt-step-line absolute left-[calc(50%+46px)] right-[calc(-50%+22px)] top-[40px] hidden h-[2px] lg:block" />
            </>
          )}
          <div className="relative flex-shrink-0">
            <span className={`flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br ${tone} text-white shadow-[0_14px_28px_-12px_rgba(16,40,24,0.6)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 lg:h-20 lg:w-20 lg:rounded-[26px]`}>
              <Icon size={34} weight="duotone" />
            </span>
            <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-900 text-xs font-black text-white dark:border-[#07100a] dark:bg-white dark:text-gray-900">
              {i + 1}
            </span>
          </div>
          <div className="pt-1 lg:pt-6">
            <h3 className="mb-1.5 text-xl font-black text-gray-900 dark:text-white">{title}</h3>
            <p className="m-0 max-w-[260px] text-[15px] leading-relaxed text-gray-500 dark:text-gray-400 lg:mx-auto">{desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. Precision layers — isometric stack of data layers → priority zones
   ───────────────────────────────────────────────────────────────────────────── */
const LAYERS = [
  { label: "Priority zones", sub: "Where to act first", top: "#43A047", side: "#1B5E20", accent: true },
  { label: "Crop suitability", sub: "What grows best where", top: "#9CCC65", side: "#558B2F" },
  { label: "Soil & terrain", sub: "Slope, texture, drainage", top: "#FFB74D", side: "#E65100" },
  { label: "Satellite imagery", sub: "Vegetation & land cover", top: "#64B5F6", side: "#1565C0" },
];

// isometric rhombus centred at (cx, cy)
function rhombus(cx: number, cy: number, w: number, h: number) {
  return `M${cx} ${cy - h} L${cx + w} ${cy} L${cx} ${cy + h} L${cx - w} ${cy} Z`;
}

export function PrecisionLayers() {
  const cx = 170;
  const w = 130;
  const h = 64;
  const gap = 74;
  const top0 = 110;
  return (
    <svg viewBox="0 0 540 470" className="h-auto w-full overflow-visible" role="img" aria-label="Diagram: satellite, soil and crop-suitability layers combine into priority zones">
      <defs>
        <pattern id="pl-grid" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="skewX(-30) scale(1 0.5)">
          <path d="M16 0 L0 0 0 16" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        </pattern>
        <filter id="pl-shadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#0b2a14" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* draw bottom → top so upper layers overlap */}
      {[...LAYERS].reverse().map((l, ri) => {
        const i = LAYERS.length - 1 - ri;
        const cy = top0 + i * gap;
        const thick = 12;
        return (
          <g key={l.label} filter="url(#pl-shadow)" className={i === 0 ? "mkt-bob" : undefined}>
            {/* side faces */}
            <path d={`M${cx - w} ${cy} L${cx} ${cy + h} L${cx} ${cy + h + thick} L${cx - w} ${cy + thick} Z`} fill={l.side} opacity="0.9" />
            <path d={`M${cx + w} ${cy} L${cx} ${cy + h} L${cx} ${cy + h + thick} L${cx + w} ${cy + thick} Z`} fill={l.side} />
            {/* top face */}
            <path d={rhombus(cx, cy, w, h)} fill={l.top} />
            <path d={rhombus(cx, cy, w, h)} fill="url(#pl-grid)" opacity="0.35" />
            {l.accent && (
              <>
                {/* highlighted parcels on the top layer */}
                <path d={rhombus(cx - 34, cy - 4, 40, 20)} fill="#fff" opacity="0.9" />
                <path d={rhombus(cx + 44, cy + 10, 32, 16)} fill="#fff" opacity="0.75" />
                <path d={rhombus(cx + 6, cy - 34, 26, 13)} fill="#fff" opacity="0.6" />
                <g transform={`translate(${cx - 34} ${cy - 30})`}>
                  <circle r="10" fill="#fff" opacity="0.4" className="mkt-ring" />
                  <path d="M0 -18 C 8 -18, 12 -12, 12 -6 C 12 2, 0 11, 0 11 C 0 11, -12 2, -12 -6 C -12 -12, -8 -18, 0 -18 Z" fill="#1B5E20" />
                  <circle cy="-7" r="4.5" fill="#fff" />
                </g>
              </>
            )}
            {/* leader line + label */}
            <path d={`M${cx + w - 10} ${cy} L${cx + w + 40} ${cy}`} stroke="currentColor" className="text-gray-300 dark:text-gray-600" strokeWidth="1.5" strokeDasharray="3 4" />
            <circle cx={cx + w + 44} cy={cy} r="4" fill={l.top} />
            <text x={cx + w + 56} y={cy - 3} fontFamily="var(--font-geist-sans), Nunito, sans-serif" fontSize="17" fontWeight="900" className="fill-gray-900 dark:fill-white">
              {l.label}
            </text>
            <text x={cx + w + 56} y={cy + 16} fontFamily="var(--font-geist-sans), Nunito, sans-serif" fontSize="13" fontWeight="600" className="fill-gray-500 dark:fill-gray-400">
              {l.sub}
            </text>
          </g>
        );
      })}

      {/* "combine" arrow down the left */}
      <path d={`M18 ${top0 + 3 * gap} L18 ${top0 + 8}`} stroke="#43A047" strokeWidth="2.5" strokeLinecap="round" className="mkt-flow" fill="none" />
      <path d={`M10 ${top0 + 20} L18 ${top0 + 6} L26 ${top0 + 20}`} stroke="#43A047" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. Ecosystem — hub-and-spoke with flowing data between services & systems
   ───────────────────────────────────────────────────────────────────────────── */
const NODES = [
  { x: 110, y: 90, label: "Logistack Plan", sub: "Business plans", Icon: Stack, grad: ["#66BB6A", "#1B5E20"] },
  { x: 490, y: 90, label: "LivestockPro", sub: "Herd management", Icon: PawPrint, grad: ["#F6B26B", "#B45309"] },
  { x: 110, y: 330, label: "Geospatial tools", sub: "Location intelligence", Icon: GlobeHemisphereEast, grad: ["#64B5F6", "#1565C0"] },
  { x: 490, y: 330, label: "Digital marketing", sub: "Market reach", Icon: Megaphone, grad: ["#CE93D8", "#7B1FA2"] },
];

export function Ecosystem() {
  const hub = { x: 300, y: 210 };
  return (
    <svg viewBox="0 0 600 420" className="h-auto w-full overflow-visible" role="img" aria-label="Diagram: Agricoders connects Logistack Plan, LivestockPro, geospatial tools and digital marketing">
      <defs>
        {NODES.map((n, i) => (
          <linearGradient key={i} id={`eco-g${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={n.grad[0]} />
            <stop offset="100%" stopColor={n.grad[1]} />
          </linearGradient>
        ))}
        <linearGradient id="eco-hub" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5CC663" />
          <stop offset="100%" stopColor="#1B5E20" />
        </linearGradient>
        <filter id="eco-shadow" x="-40%" y="-40%" width="180%" height="190%">
          <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#0b2a14" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* orbit rings */}
      <circle cx={hub.x} cy={hub.y} r="120" fill="none" stroke="currentColor" className="text-green-600/15 dark:text-green-300/15" strokeWidth="1.5" strokeDasharray="4 6" />
      <circle cx={hub.x} cy={hub.y} r="176" fill="none" stroke="currentColor" className="text-green-600/10 dark:text-green-300/10" strokeWidth="1.5" />

      {/* connectors with travelling data dots */}
      {NODES.map((n, i) => {
        const d = `M${hub.x} ${hub.y} Q ${(hub.x + n.x) / 2} ${n.y < hub.y ? hub.y - 10 : hub.y + 10} ${n.x} ${n.y}`;
        return (
          <g key={`c${i}`}>
            <path d={d} fill="none" stroke={`url(#eco-g${i})`} strokeWidth="3" strokeLinecap="round" className="mkt-flow" opacity="0.8" />
            <circle r="5" fill={n.grad[0]}>
              <animateMotion dur={`${2.6 + i * 0.4}s`} repeatCount="indefinite" path={d} keyPoints={i % 2 ? "1;0" : "0;1"} keyTimes="0;1" calcMode="linear" />
            </circle>
          </g>
        );
      })}

      {/* hub */}
      <g filter="url(#eco-shadow)">
        <circle cx={hub.x} cy={hub.y} r="70" fill="url(#eco-hub)" />
        <circle cx={hub.x} cy={hub.y} r="70" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
        <circle cx={hub.x} cy={hub.y} r="44" fill="#fff" opacity="0.25" className="mkt-ring" />
      </g>
      <text x={hub.x} y={hub.y + 2} textAnchor="middle" fontFamily="var(--font-geist-sans), Nunito, sans-serif" fontSize="19" fontWeight="900" fill="#fff">Agricoders</text>
      <text x={hub.x} y={hub.y + 21} textAnchor="middle" fontFamily="var(--font-geist-sans), Nunito, sans-serif" fontSize="11" fontWeight="800" letterSpacing="1" fill="rgba(255,255,255,0.8)">ONE PLATFORM</text>

      {/* nodes */}
      {NODES.map(({ x, y, label, sub, Icon }, i) => (
        <g key={label} className={i % 2 ? "mkt-bob-slow" : "mkt-bob"}>
          <g filter="url(#eco-shadow)">
            <rect x={x - 88} y={y - 34} width="176" height="68" rx="22" className="fill-white dark:fill-[#15201a]" />
          </g>
          <rect x={x - 76} y={y - 22} width="44" height="44" rx="14" fill={`url(#eco-g${i})`} />
          <Icon x={x - 68} y={y - 14} size={28} weight="duotone" color="#fff" />
          <text x={x - 22} y={y - 2} fontFamily="var(--font-geist-sans), Nunito, sans-serif" fontSize="14.5" fontWeight="900" className="fill-gray-900 dark:fill-white">{label}</text>
          <text x={x - 22} y={y + 16} fontFamily="var(--font-geist-sans), Nunito, sans-serif" fontSize="11.5" fontWeight="700" className="fill-gray-500 dark:fill-gray-400">{sub}</text>
        </g>
      ))}
    </svg>
  );
}
