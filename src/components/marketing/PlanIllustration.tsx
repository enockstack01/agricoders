/** Abstract "business plan generation" scene for the Agriplan hero — a document panel
 *  turning into a financial model, with a revenue chart and a floating NPV/IRR readout. Pure
 *  inline SVG, no external assets, matching the brand palette exactly. */
export default function PlanIllustration() {
  return (
    <svg viewBox="0 0 460 400" className="w-full h-auto" role="img" aria-label="Business plan document producing a financial model and revenue chart">
      <defs>
        <linearGradient id="pi-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1b2b1c" />
          <stop offset="100%" stopColor="#0f1a10" />
        </linearGradient>
        <linearGradient id="pi-bar" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#2E7D32" />
          <stop offset="100%" stopColor="#66BB6A" />
        </linearGradient>
        <radialGradient id="pi-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#66BB6A" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#66BB6A" stopOpacity="0" />
        </radialGradient>
        <filter id="pi-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>

      <circle cx="230" cy="190" r="190" fill="url(#pi-glow)" />

      {/* Main document panel */}
      <g filter="url(#pi-shadow)">
        <rect x="40" y="50" width="220" height="290" rx="18" fill="url(#pi-panel)" stroke="rgba(129,199,132,0.25)" />
        {/* document lines */}
        <rect x="66" y="82" width="120" height="12" rx="4" fill="rgba(255,255,255,0.16)" />
        <rect x="66" y="106" width="168" height="7" rx="3" fill="rgba(255,255,255,0.07)" />
        <rect x="66" y="122" width="168" height="7" rx="3" fill="rgba(255,255,255,0.07)" />
        <rect x="66" y="138" width="110" height="7" rx="3" fill="rgba(255,255,255,0.07)" />

        {/* mini bar chart inside the document */}
        <g transform="translate(66,170)">
          {[26, 44, 34, 58, 48, 68].map((h, i) => (
            <rect
              key={i}
              x={i * 26}
              y={80 - h}
              width="16"
              height={h}
              rx="4"
              fill={i === 5 ? "url(#pi-bar)" : "rgba(129,199,132,0.28)"}
            />
          ))}
        </g>

        <rect x="66" y="270" width="168" height="7" rx="3" fill="rgba(255,255,255,0.07)" />
        <rect x="66" y="286" width="130" height="7" rx="3" fill="rgba(255,255,255,0.07)" />

        {/* AI spark badge */}
        <g transform="translate(216,60)">
          <circle r="18" fill="#2E7D32" />
          <path d="M0,-8 L2.4,-2.4 8,0 2.4,2.4 0,8 -2.4,2.4 -8,0 -2.4,-2.4 Z" fill="#fff" />
        </g>
      </g>

      {/* Floating NPV/IRR stat card */}
      <g filter="url(#pi-shadow)" transform="translate(240,60)">
        <rect width="176" height="96" rx="16" fill="#ffffff" />
        <text x="16" y="24" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="#546E7A" letterSpacing="0.5">
          FINANCIAL MODEL
        </text>
        <text x="16" y="47" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="600" fill="#263238">
          NPV
        </text>
        <text x="160" y="47" textAnchor="end" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="800" fill="#1B5E20">
          $482K
        </text>
        <line x1="16" y1="56" x2="160" y2="56" stroke="#E0E0E0" />
        <text x="16" y="73" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="600" fill="#263238">
          IRR
        </text>
        <text x="160" y="73" textAnchor="end" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="800" fill="#1B5E20">
          34.2%
        </text>
      </g>

      {/* Floating "19 sheets" badge */}
      <g filter="url(#pi-shadow)" transform="translate(268,206)">
        <rect width="150" height="86" rx="16" fill="#ffffff" />
        <text x="16" y="26" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="#546E7A" letterSpacing="0.5">
          REVENUE FORECAST
        </text>
        <text x="16" y="52" fontFamily="Inter, sans-serif" fontSize="22" fontWeight="800" fill="#1B5E20">
          19 sheets
        </text>
        <polyline
          points="16,72 40,64 62,70 84,52 106,58 128,40 136,36"
          fill="none"
          stroke="#2E7D32"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Floating "ready" checkmark badge */}
      <g filter="url(#pi-shadow)" transform="translate(232,316)">
        <rect width="150" height="60" rx="14" fill="#ffffff" />
        <circle cx="26" cy="30" r="12" fill="#E8F5E9" />
        <path d="M20 30l4 4 8-8" fill="none" stroke="#2E7D32" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <text x="46" y="24" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#546E7A">STATUS</text>
        <text x="46" y="40" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="800" fill="#263238">Investor-ready</text>
      </g>
    </svg>
  );
}
