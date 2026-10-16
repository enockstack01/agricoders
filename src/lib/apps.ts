export interface Screenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

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
  screenshots?: Screenshot[];
}

const shot = (folder: string, file: string, alt: string, width: number, height: number): Screenshot => ({
  src: `/brand/${folder}/${file}.webp`,
  alt,
  width,
  height,
});

const lp = (file: string, alt: string, width: number, height: number) => shot("livestockpro", file, alt, width, height);
const cm = (file: string, alt: string, width: number, height: number) => shot("cropmanager", file, alt, width, height);

export const AGRICODERS_APPS: AppEntry[] = [
  {
    id: "cropmanager",
    name: "CropManager",
    tagline: "Crop Production Management System",
    description:
      "Plan, record and analyse every field, crop cycle, input, harvest and sale in one place, on web and mobile.",
    href: "https://crop.agricoders.com",
    status: "live",
    category: "Farm Management",
    accentColor: "#1B5E20",
    features: [
      "18 farm modules, from land and seasons to sales",
      "9 agronomic calculators",
      "Crop disease diagnosis from scouting records",
      "Profit by crop, by field and by season",
    ],
    screenshots: [
      cm("dashboard", "CropManager farm profile dashboard", 1400, 722),
      cm("dashboard-analytics", "CropManager dashboard with land utilisation and crop distribution", 1400, 721),
      cm("mobile-app", "CropManager mobile app splash and sign-in screens", 1400, 976),
      cm("web-sign-in", "CropManager web sign-in", 1024, 768),
    ],
  },
  {
    id: "livestockpro",
    name: "LivestockPro",
    tagline: "Livestock Management System",
    description:
      "Track herds, health records, breeding cycles, feed schedules and production for your livestock operation in one place, online or offline, in ten languages.",
    href: "https://livestockpro.agricoders.com/",
    status: "live",
    category: "Farm Management",
    accentColor: "#b45309",
    features: [
      "Animal and herd record keeping",
      "Health and vaccination tracking",
      "Breeding cycle management",
      "Feed and production scheduling",
    ],
    screenshots: [
      lp("dashboard-overview", "LivestockPro herd profile dashboard", 1400, 725),
      lp("farm-insights", "LivestockPro farm insights", 800, 770),
      lp("herd-profile", "LivestockPro herd health and farm at a glance", 800, 799),
      lp("herd-by-species", "Herd by species chart", 760, 372),
      lp("males-females", "Females and males by species chart", 760, 404),
      lp("age-structure", "Herd age structure chart", 760, 400),
      lp("herd-growth", "Herd growth chart", 760, 377),
      lp("health-outcomes", "Health records by outcome chart", 760, 422),
      lp("common-conditions", "Most common conditions chart", 760, 354),
      lp("pregnancy-status", "Pregnancy status chart", 760, 400),
      lp("births", "Births recorded and expected chart", 760, 377),
      lp("feed-cost", "Feed cost per month chart", 760, 400),
      lp("feed-by-type", "Feed spend by feed type chart", 760, 376),
      lp("milk", "Milk production chart", 760, 345),
      lp("eggs", "Egg production chart", 760, 358),
      lp("income-vs-expenses", "Income versus expenses chart", 760, 400),
      lp("net-cash-flow", "Net cash flow per month chart", 760, 400),
      lp("income-by-source", "Income by source chart", 760, 446),
      lp("expenses", "Expenses by category chart", 760, 377),
      lp("tasks", "Task status chart", 760, 377),
      lp("alerts", "Alerts by severity chart", 760, 402),
    ],
  },
  {
    id: "agriplan",
    name: "Agriplan",
    tagline: "AI Business Plan and Financial Model Generator",
    description:
      "Generate investor-ready business plans and 19-sheet financial models in under 15 minutes. Fully written, formatted and ready to submit.",
    href: "/plan",
    status: "live",
    category: "Business Planning",
    accentColor: "#2E7D32",
    features: [
      "Investor-ready Business Plan (.docx)",
      "19-sheet Excel Financial Model",
      "AI-generated professional narrative",
      "Six embedded charts",
      "NPV, IRR and payback period",
      "Any business, country or currency",
    ],
    pricing: "USD 20 system-generated, USD 69 customised by an expert",
  },
];
