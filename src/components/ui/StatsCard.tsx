import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  trend?: number;
  icon: React.ReactNode;
  accent?: "green" | "blue" | "purple" | "amber" | "rose";
}

const ACCENT = {
  green:  { icon: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
  blue:   { icon: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
  purple: { icon: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
  amber:  { icon: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
  rose:   { icon: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400" },
};

export default function StatsCard({ label, value, sub, trend, icon, accent = "green" }: Props) {
  const a = ACCENT[accent];
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${a.icon}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{value}</p>
        <div className="flex items-center gap-2 mt-1.5">
          {sub && <span className="text-xs text-gray-400 dark:text-gray-500">{sub}</span>}
          {trend !== undefined && (
            <span className={`flex items-center gap-0.5 text-xs font-medium ${
              trend > 0 ? "text-green-600 dark:text-green-400" : trend < 0 ? "text-red-500 dark:text-red-400" : "text-gray-400 dark:text-gray-500"
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
