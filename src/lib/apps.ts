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
    href: "/plan",
    status: "live",
    category: "Business Planning",
    accentColor: "#2E7D32",
    features: [
      "Investor-ready Business Plan (.docx)",
      "19-sheet Excel Financial Model",
      "AI-generated professional narrative",
      "6 embedded Python charts",
      "NPV, IRR & payback period",
      "Any business, country, currency",
    ],
    pricing: "$20 system-generated · $69 custom by expert",
  },
  {
    id: "livestockpro",
    name: "LivestockPro",
    tagline: "Livestock Management System",
    description:
      "Track herds, health records, breeding cycles, feed schedules, and production for your livestock operation in one place.",
    href: "https://livestockpro.agricoders.com/",
    status: "live",
    category: "Farm Management",
    accentColor: "#b45309",
    features: [
      "Animal & herd record keeping",
      "Health and vaccination tracking",
      "Breeding cycle management",
      "Feed and production scheduling",
    ],
  },
];
