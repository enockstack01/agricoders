export interface AppEntry {
  id: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  status: "live" | "beta" | "coming-soon";
  category: string;
  accentColor: string;
  features: string[];
  pricing?: string;
}

export const AGRICODERS_APPS: AppEntry[] = [
  {
    id: "logistackplan",
    name: "Logistack Plan",
    tagline: "AI Business Plan & Financial Model Generator",
    description:
      "Generate investor-ready business plans and 19-sheet financial models in under 15 minutes. Fully written, formatted, and ready to submit.",
    href: "/app",
    status: "live",
    category: "Business Planning",
    accentColor: "#16a34a",
    features: [
      "Investor-ready Business Plan (.docx)",
      "19-sheet Excel Financial Model",
      "AI-generated professional narrative",
      "6 embedded Python charts",
      "NPV, IRR & payback period",
      "Any business, country, currency",
    ],
    pricing: "$69 / document · $137 complete package",
  },
];
