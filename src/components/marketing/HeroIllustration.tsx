/** Hero product mock-up: a "field intelligence" window showing organic field parcels shaded by
 *  suitability, terrain contours, a sweeping scan line, a pulsing priority pin, a layers panel and
 *  floating readout cards. Pure inline SVG + CSS animation (see globals.css "LANDING v2"), so it
 *  renders instantly, scales to any width and respects prefers-reduced-motion.
 *  Figures shown are illustrative UI, not live data. */
export default function HeroIllustration() {
  return (
    <svg viewBox="0 0 560 470" className="h-auto w-full overflow-visible" role="img" aria-label="Illustration of the Agricoders field-intelligence map with priority zones and yield outlook">
      <defs>
        <linearGradient id="hx-win" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12241a" />
          <stop offset="100%" stopColor="#0a150e" />
        </linearGradient>
        <linearGradient id="hx-high" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7CE08A" />
          <stop offset="100%" stopColor="#2E9E45" />
        </linearGradient>
        <linearGradient id="hx-mid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="100%" stopColor="#F9A825" />
        </linearGradient>
        <linearGradient id="hx-low" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFAB91" />
          <stop offset="100%" stopColor="#E64A19" />
        </linearGradient>
        <linearGradient id="hx-scan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#66BB6A" stopOpacity="0" />
          <stop offset="100%" stopColor="#66BB6A" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="hx-spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#43A047" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#43A047" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hx-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#66BB6A" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#66BB6A" stopOpacity="0" />
        </radialGradient>
        <clipPath id="hx-map">
          <rect x="136" y="92" width="384" height="276" rx="16" />
        </clipPath>
        <filter id="hx-shadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="18" stdDeviation="20" floodColor="#0b2a14" floodOpacity="0.35" />
        </filter>
        <filter id="hx-soft" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#0b2a14" floodOpacity="0.28" />
        </filter>
      </defs>

      <ellipse cx="300" cy="230" rx="280" ry="220" fill="url(#hx-glow)" />

      {/* ── App window ─────────────────────────────────────── */}
      <g filter="url(#hx-shadow)">
        <rect x="20" y="40" width="516" height="352" rx="26" fill="url(#hx-win)" stroke="rgba(129,199,132,0.22)" />
        {/* title bar */}
        <circle cx="46" cy="64" r="5" fill="#FF6B6B" />
        <circle cx="62" cy="64" r="5" fill="#FFD166" />
        <circle cx="78" cy="64" r="5" fill="#06D6A0" />
        <rect x="190" y="54" width="196" height="20" rx="10" fill="rgba(255,255,255,0.06)" />
        <text x="288" y="68" textAnchor="middle" fontFamily="var(--font-geist-sans), Nunito, sans-serif" fontSize="10.5" fontWeight="700" fill="rgba(255,255,255,0.55)">
          field-intelligence · priority map
        </text>

        {/* layers side panel */}
        <rect x="36" y="92" width="88" height="276" rx="16" fill="rgba(255,255,255,0.04)" />
        <text x="50" y="116" fontFamily="var(--font-geist-sans), Nunito, sans-serif" fontSize="9" fontWeight="800" letterSpacing="1" fill="rgba(255,255,255,0.4)">LAYERS</text>
        {[
          { y: 130, label: "Satellite", on: true, c: "#64B5F6" },
          { y: 162, label: "Soil", on: true, c: "#FFB74D" },
          { y: 194, label: "Suitability", on: true, c: "#81C784" },
          { y: 226, label: "Rainfall", on: false, c: "#4DD0E1" },
        ].map((l) => (
          <g key={l.label} transform={`translate(46 ${l.y})`}>
            <rect width="68" height="24" rx="12" fill={l.on ? "rgba(129,199,132,0.16)" : "rgba(255,255,255,0.04)"} />
            <circle cx="12" cy="12" r="4" fill={l.c} opacity={l.on ? 1 : 0.35} />
            <text x="21" y="15.5" fontFamily="var(--font-geist-sans), Nunito, sans-serif" fontSize="9.5" fontWeight="700" fill={l.on ? "#E8F5E9" : "rgba(255,255,255,0.35)"}>
              {l.label}
            </text>
          </g>
        ))}
        {/* mini legend */}
        <g transform="translate(46 282)" fontFamily="var(--font-geist-sans), Nunito, sans-serif" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.6)">
          <rect width="10" height="10" rx="3" fill="url(#hx-high)" /><text x="15" y="9">High</text>
          <rect y="18" width="10" height="10" rx="3" fill="url(#hx-mid)" /><text x="15" y="27">Medium</text>
          <rect y="36" width="10" height="10" rx="3" fill="url(#hx-low)" /><text x="15" y="45">Low</text>
        </g>

        {/* ── map ── */}
        <g clipPath="url(#hx-map)">
          <rect x="136" y="92" width="384" height="276" fill="#0f2016" />
          {/* terrain contours */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path
              key={i}
              d={`M120 ${130 + i * 42} C 220 ${100 + i * 42}, 300 ${170 + i * 42}, 400 ${130 + i * 42} S 520 ${110 + i * 42}, 560 ${140 + i * 42}`}
              fill="none"
              stroke="rgba(129,199,132,0.10)"
              strokeWidth="1.2"
            />
          ))}
          {/* field parcels */}
          <path d="M150 110 L262 104 L276 176 L160 190 Z" fill="url(#hx-high)" opacity="0.92" />
          <path d="M270 104 L372 110 L360 168 L284 176 Z" fill="url(#hx-mid)" opacity="0.85" />
          <path d="M380 110 L508 104 L500 196 L370 176 Z" fill="url(#hx-high)" opacity="0.78" />
          <path d="M156 198 L268 184 L262 272 L150 282 Z" fill="url(#hx-mid)" opacity="0.8" />
          <path d="M276 184 L366 178 L380 262 L272 274 Z" fill="url(#hx-high)" opacity="0.95" />
          <path d="M374 186 L506 204 L498 280 L388 268 Z" fill="url(#hx-low)" opacity="0.72" />
          <path d="M150 292 L270 282 L266 358 L150 360 Z" fill="url(#hx-low)" opacity="0.6" />
          <path d="M278 282 L388 276 L396 360 L276 360 Z" fill="url(#hx-mid)" opacity="0.75" />
          <path d="M396 276 L500 290 L506 360 L404 360 Z" fill="url(#hx-high)" opacity="0.65" />
          {/* parcel borders */}
          <g fill="none" stroke="rgba(10,21,14,0.55)" strokeWidth="2.5">
            <path d="M150 110 L262 104 L276 176 L160 190 Z" />
            <path d="M270 104 L372 110 L360 168 L284 176 Z" />
            <path d="M380 110 L508 104 L500 196 L370 176 Z" />
            <path d="M156 198 L268 184 L262 272 L150 282 Z" />
            <path d="M276 184 L366 178 L380 262 L272 274 Z" />
            <path d="M374 186 L506 204 L498 280 L388 268 Z" />
          </g>
          {/* river */}
          <path d="M136 250 C 200 236, 230 300, 300 290 S 420 330, 520 318" fill="none" stroke="#4FC3F7" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
          {/* priority outline */}
          <path d="M276 184 L366 178 L380 262 L272 274 Z" fill="none" stroke="#fff" strokeWidth="2.2" strokeDasharray="6 5" className="mkt-flow" />
          {/* sweeping scan line */}
          <g className="mkt-scan">
            <rect x="136" y="92" width="384" height="40" fill="url(#hx-scan)" />
            <rect x="136" y="131" width="384" height="1.5" fill="#A5D6A7" />
          </g>
        </g>

        {/* priority pin */}
        <g transform="translate(326 222)">
          <circle r="12" fill="#fff" opacity="0.35" className="mkt-ring" />
          <path d="M0 -26 C 12 -26, 18 -17, 18 -9 C 18 3, 0 16, 0 16 C 0 16, -18 3, -18 -9 C -18 -17, -12 -26, 0 -26 Z" fill="#fff" />
          <circle cy="-10" r="7" fill="#2E7D32" />
        </g>
      </g>

      {/* ── floating card: priority zones ───────────────────── */}
      <g className="mkt-bob" filter="url(#hx-soft)">
        <g transform="translate(384 8)">
          <rect width="164" height="84" rx="20" fill="#ffffff" />
          <rect x="14" y="14" width="32" height="32" rx="11" fill="#E8F5E9" />
          <path d="M22 30 l6 6 l11 -12" fill="none" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <text x="56" y="27" fontFamily="var(--font-geist-sans), Nunito, sans-serif" fontSize="9.5" fontWeight="800" letterSpacing="0.6" fill="#78909C">PRIORITY ZONES</text>
          <text x="56" y="46" fontFamily="var(--font-geist-sans), Nunito, sans-serif" fontSize="19" fontWeight="900" fill="#1B5E20">4 high</text>
          <rect x="14" y="58" width="136" height="8" rx="4" fill="#EEF4EF" />
          <rect x="14" y="58" width="96" height="8" rx="4" fill="#43A047" />
        </g>
      </g>

      {/* ── floating card: yield outlook ─────────────────────── */}
      <g className="mkt-bob-slow" filter="url(#hx-soft)">
        <g transform="translate(4 330)">
          <rect width="206" height="118" rx="22" fill="#ffffff" />
          <text x="18" y="28" fontFamily="var(--font-geist-sans), Nunito, sans-serif" fontSize="9.5" fontWeight="800" letterSpacing="0.6" fill="#78909C">YIELD OUTLOOK</text>
          <text x="18" y="56" fontFamily="var(--font-geist-sans), Nunito, sans-serif" fontSize="26" fontWeight="900" fill="#1B5E20">+18%</text>
          <rect x="94" y="40" width="50" height="20" rx="10" fill="#E8F5E9" />
          <text x="119" y="54" textAnchor="middle" fontFamily="var(--font-geist-sans), Nunito, sans-serif" fontSize="10" fontWeight="800" fill="#2E7D32">▲ season</text>
          <path d="M18 100 L44 92 L70 96 L96 80 L122 84 L148 68 L188 58 L188 108 L18 108 Z" fill="url(#hx-spark)" />
          <polyline points="18,100 44,92 70,96 96,80 122,84 148,68 188,58" fill="none" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="188" cy="58" r="4.5" fill="#fff" stroke="#2E7D32" strokeWidth="2.5" />
        </g>
      </g>

      {/* ── floating chip: weather ───────────────────────────── */}
      <g className="mkt-bob" filter="url(#hx-soft)">
        <g transform="translate(420 404)">
          <rect width="128" height="46" rx="23" fill="#ffffff" />
          <circle cx="24" cy="23" r="12" fill="#FFF3E0" />
          <circle cx="24" cy="23" r="5.5" fill="#FB8C00" />
          <text x="44" y="20" fontFamily="var(--font-geist-sans), Nunito, sans-serif" fontSize="9" fontWeight="800" fill="#78909C">RAIN IN 3 DAYS</text>
          <text x="44" y="34" fontFamily="var(--font-geist-sans), Nunito, sans-serif" fontSize="12" fontWeight="900" fill="#263238">Plant now</text>
        </g>
      </g>
    </svg>
  );
}
