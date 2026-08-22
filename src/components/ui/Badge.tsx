type Variant = "green" | "blue" | "purple" | "amber" | "rose" | "gray";

const STYLES: Record<Variant, string> = {
  green:  "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  blue:   "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  amber:  "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  rose:   "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  gray:   "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700",
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
