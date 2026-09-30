type Variant = "green" | "blue" | "purple" | "amber" | "rose" | "gray";

// CropManager badge tones
const CLASS: Record<Variant, string> = {
  green: "badge-success",
  blue: "badge-info",
  purple: "badge-purple",
  amber: "badge-warning",
  rose: "badge-danger",
  gray: "badge-neutral",
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
  return <span className={`badge ${CLASS[variant]}`} style={{ textTransform: "capitalize" }}>{children}</span>;
}
