/** Abstract geospatial-intelligence scene for the Agricoders hero — a floating map panel with
 *  plotted fields, a location pin, and a small analytics readout. Pure inline SVG, no external
 *  assets, so it renders instantly and matches the brand palette exactly. */
export default function HeroIllustration() {
  return (
    <svg viewBox="0 0 460 400" className="w-full h-auto" role="img" aria-label="Map of farm fields with data overlays">
      <defs>
        <linearGradient id="hi-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1b2b1c" />
          <stop offset="100%" stopColor="#0f1a10" />
        </linearGradient>
        <linearGradient id="hi-field-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
        <linearGradient id="hi-field-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#81C784" />
          <stop offset="100%" stopColor="#4CAF50" />
        </linearGradient>
        <radialGradient id="hi-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#66BB6A" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#66BB6A" stopOpacity="0" />
        </radialGradient>
        <filter id="hi-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>

      <circle cx="230" cy="190" r="190" fill="url(#hi-glow)" />

      {/* Main map panel */}
      <g filter="url(#hi-shadow)">
        <rect x="40" y="60" width="340" height="250" rx="22" fill="url(#hi-panel)" stroke="rgba(129,199,132,0.25)" />
        {/* grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`v${i}`} x1={40 + (i * 340) / 4} y1="60" x2={40 + (i * 340) / 4} y2="310" stroke="rgba(255,255,255,0.05)" />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <line key={`h${i}`} x1="40" y1={60 + (i * 250) / 3} x2="380" y2={60 + (i * 250) / 3} stroke="rgba(255,255,255,0.05)" />
        ))}
        {/* field plots */}
        <rect x="66" y="88" width="88" height="62" rx="10" fill="url(#hi-field-a)" opacity="0.9" />
        <rect x="168" y="88" width="60" height="62" rx="10" fill="rgba(255,255,255,0.06)" />
        <rect x="66" y="164" width="60" height="52" rx="10" fill="rgba(255,255,255,0.06)" />
        <rect x="140" y="164" width="100" height="52" rx="10" fill="url(#hi-field-b)" opacity="0.85" />
        <rect x="254" y="88" width="100" height="128" rx="10" fill="rgba(255,255,255,0.06)" />
        <rect x="66" y="230" width="120" height="56" rx="10" fill="rgba(255,255,255,0.06)" />
        <rect x="198" y="230" width="70" height="56" rx="10" fill="url(#hi-field-a)" opacity="0.7" />

        {/* location pin */}
        <g transform="translate(190,110)">
          <circle r="16" fill="#fff" opacity="0.95" />
          <circle r="16" fill="none" stroke="#66BB6A" strokeWidth="2">
            <animate attributeName="r" values="14;24;14" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0;0.7" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle r="6" fill="#1B5E20" />
        </g>
      </g>

      {/* Floating stat card */}
      <g filter="url(#hi-shadow)" transform="translate(268,206)">
        <rect width="150" height="86" rx="16" fill="#ffffff" />
        <text x="16" y="26" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="#546E7A" letterSpacing="0.5">
          YIELD FORECAST
        </text>
        <text x="16" y="52" fontFamily="Inter, sans-serif" fontSize="22" fontWeight="800" fill="#1B5E20">
          +18.4%
        </text>
        <polyline
          points="16,72 40,64 62,70 84,52 106,58 128,44 136,40"
          fill="none"
          stroke="#2E7D32"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Floating badge */}
      <g filter="url(#hi-shadow)" transform="translate(24,214)">
        <rect width="118" height="60" rx="14" fill="#ffffff" />
        <circle cx="26" cy="30" r="12" fill="#E8F5E9" />
        <path d="M20 30l4 4 8-8" fill="none" stroke="#2E7D32" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <text x="46" y="24" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#546E7A">FIELDS</text>
        <text x="46" y="40" fontFamily="Inter, sans-serif" fontSize="15" fontWeight="800" fill="#263238">1,248</text>
      </g>
    </svg>
  );
}
