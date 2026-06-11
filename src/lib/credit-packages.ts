export const CREDIT_PACKAGES = [
  {
    id: "starter",
    label: "Starter",
    credits: 10,
    usdCents: 1000,
    description: "2 generations",
    saves: null,
    popular: false,
  },
  {
    id: "standard",
    label: "Standard",
    credits: 25,
    usdCents: 2300,
    description: "5 generations",
    saves: "Save 8%",
    popular: false,
  },
  {
    id: "growth",
    label: "Growth",
    credits: 50,
    usdCents: 4000,
    description: "10 generations",
    saves: "Save 20%",
    popular: true,
  },
  {
    id: "pro",
    label: "Pro",
    credits: 100,
    usdCents: 7500,
    description: "20 generations",
    saves: "Save 25%",
    popular: false,
  },
] as const;

export type PackageId = (typeof CREDIT_PACKAGES)[number]["id"];
