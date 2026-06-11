"use client";

interface Props {
  data: Record<string, number>; // date -> count
  label?: string;
}

export default function MiniBarChart({ data, label }: Props) {
  const entries = Object.entries(data);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="w-full">
      {label && <p className="text-xs text-gray-500 mb-2">{label}</p>}
      <div className="flex items-end gap-1 h-10">
        {entries.map(([date, count]) => (
          <div key={date} className="flex-1 flex flex-col items-center gap-0.5 group relative">
            <div
              className="w-full rounded-sm bg-green-500 transition-all hover:bg-green-600"
              style={{ height: `${Math.max((count / max) * 100, count > 0 ? 10 : 2)}%` }}
            />
            {/* Tooltip */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
              {date.slice(5)}: {count}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-400">{entries[0]?.[0]?.slice(5)}</span>
        <span className="text-xs text-gray-400">{entries[entries.length - 1]?.[0]?.slice(5)}</span>
      </div>
    </div>
  );
}
