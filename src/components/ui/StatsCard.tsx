import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  trend?: number; // positive = up, negative = down, 0 = flat
  icon: React.ReactNode;
  accent?: "green" | "blue" | "purple" | "amber" | "rose";
}

const ACCENT = {
  green:  { bg: "bg-green-50",  text: "text-green-700",  icon: "bg-green-100 text-green-600" },
  blue:   { bg: "bg-blue-50",   text: "text-blue-700",   icon: "bg-blue-100 text-blue-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", icon: "bg-purple-100 text-purple-600" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-700",  icon: "bg-amber-100 text-amber-600" },
  rose:   { bg: "bg-rose-50",   text: "text-rose-700",   icon: "bg-rose-100 text-rose-600" },
};

export default function StatsCard({ label, value, sub, trend, icon, accent = "green" }: Props) {
  const a = ACCENT[accent];
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${a.icon}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-0.5 truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
        <div className="flex items-center gap-2 mt-1.5">
          {sub && <span className="text-xs text-gray-400">{sub}</span>}
          {trend !== undefined && (
            <span className={`flex items-center gap-0.5 text-xs font-medium ${
              trend > 0 ? "text-green-600" : trend < 0 ? "text-red-500" : "text-gray-400"
            }`}>
              {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
              {trend > 0 ? "+" : ""}{trend}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
