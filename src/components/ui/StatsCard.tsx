import { TrendingUp, TrendingDown, Minus } from "@/components/plan/icons";

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  trend?: number;
  icon: React.ReactNode;
  accent?: "green" | "blue" | "purple" | "amber" | "rose";
}

// CropManager KPI card — accent names map onto its .kpi-icon tones
const TONE = { green: "green", blue: "blue", purple: "purple", amber: "orange", rose: "red" } as const;

export default function StatsCard({ label, value, sub, trend, icon, accent = "green" }: Props) {
  const text = value === null || value === undefined || value === "" ? "—" : String(value);
  return (
    <div className="kpi-card">
      <div className={`kpi-icon ${TONE[accent]}`}>{icon}</div>
      <div className="kpi-info">
        <div className="kpi-label">{label}</div>
        <div className="kpi-value" style={{ "--chars": Math.max(text.length, 4) } as React.CSSProperties}>
          {text}
        </div>
        {(sub || trend !== undefined) && (
          <div className={`kpi-trend ${trend === undefined ? "" : trend > 0 ? "up" : trend < 0 ? "down" : ""}`}>
            {trend !== undefined && (
              <>
                {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                {trend > 0 ? "+" : ""}{trend}%
              </>
            )}
            {sub && <span style={{ fontWeight: 500 }}>{sub}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
