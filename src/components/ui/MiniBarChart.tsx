"use client";

interface Props {
  data: Record<string, number>; // date -> count
  label?: string;
}

// CropManager-style column chart (pure CSS)
export default function MiniBarChart({ data, label }: Props) {
  const entries = Object.entries(data);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div>
      {label && <p className="kpi-label">{label}</p>}
      <div className="bar-chart">
        {entries.map(([date, count]) => (
          <div key={date} className="bar-col" title={`${date}: ${count}`}>
            <span className="bar-value">{count}</span>
            <div className="bar" style={{ height: `${Math.max((count / max) * 100, count > 0 ? 8 : 2)}%` }} />
            <span className="bar-label">
              {/* "YYYY-MM-DD" parses as UTC midnight; pin it to local time so the weekday doesn't shift */}
              {new Date(date.length === 10 ? `${date}T00:00:00` : date).toLocaleDateString("en-GB", { weekday: "short" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
