type Variant = "green" | "blue" | "purple" | "amber" | "rose" | "gray";

const STYLES: Record<Variant, string> = {
  green:  "bg-green-100 text-green-700 border-green-200",
  blue:   "bg-blue-100 text-blue-700 border-blue-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  amber:  "bg-amber-100 text-amber-700 border-amber-200",
  rose:   "bg-rose-100 text-rose-700 border-rose-200",
  gray:   "bg-gray-100 text-gray-600 border-gray-200",
};

export function roleBadgeVariant(role: string): Variant {
  if (role === "super_admin") return "purple";
  if (role === "admin") return "blue";
  return "gray";
}

export default function Badge({
  children,
  variant = "gray",
}: {
  children: React.ReactNode;
  variant?: Variant;
}) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${STYLES[variant]}`}>
      {children}
    </span>
  );
}
