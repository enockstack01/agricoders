import { FormSubmission, UserProfileDefaults } from "@/types";

// Base defaults — all text fields empty, financial rates use sensible universal defaults
export const defaultFormData: Omit<FormSubmission, "userId"> = {
  companyInfo: {
    authorName: "",
    authorTitle: "Founder & CEO",
    companyName: "",
    productName: "",
    phone: "",
    email: "",
    location: "",
    submittedTo: "",
    submissionDate: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    companyType: "Private Limited Company",
    companyFocus: "",
    currency: "USD",
    website: "",
    companyLogo: "",
  },

  businessDescription: {
    vision: "",
    mission: "",
    shortTermGoals: ["", "", ""],
    mediumTermGoals: ["", "", ""],
    longTermGoals: ["", "", ""],
    values: [
      { name: "Innovation", description: "" },
      { name: "Quality", description: "" },
      { name: "Integrity", description: "" },
      { name: "Customer Focus", description: "" },
    ],
    products: [
      { name: "", description: "" },
      { name: "", description: "" },
    ],
    workingModelSteps: ["", "", ""],
    technologies: ["", "", ""],
    rawMaterials: ["", "", ""],
    swot: {
      strengths: ["", "", ""],
      weaknesses: ["", "", ""],
      opportunities: ["", "", ""],
      threats: ["", "", ""],
    },
    pestel: {
      political: "",
      economic: "",
      social: "",
      technological: "",
      environmental: "",
      legal: "",
    },
  },

  marketAnalysis: {
    globalMarketSize2024: 0,
    globalMarketSize2025: 0,
    globalMarketSize2030: 0,
    gdpContribution: 0,
    employmentPercentage: 0,
    competitors: [
      { name: "", description: "" },
      { name: "", description: "" },
      { name: "", description: "" },
    ],
    targetSegments: [
      { name: "", description: "" },
      { name: "", description: "" },
      { name: "", description: "" },
    ],
    marketingStrategies: ["", "", ""],
    distributionChannels: ["", "", ""],
  },

  staff: [
    { role: "Chief Executive Officer (CEO)", count: 1, responsibilities: "", salaryPerEmployee: 0 },
    { role: "Operations Manager",           count: 1, responsibilities: "", salaryPerEmployee: 0 },
    { role: "Sales & Marketing Manager",    count: 1, responsibilities: "", salaryPerEmployee: 0 },
  ],

  financial: {
    capex: [
      { item: "", quantity: 1, costPerUnit: 0 },
      { item: "", quantity: 1, costPerUnit: 0 },
      { item: "", quantity: 1, costPerUnit: 0 },
    ],
    products: [],
    services: [],
    opexItems: [
      { item: "Office Rent",              monthlyAmount: 0, growthRate: 0,   isVariable: false },
      { item: "Internet & Utilities",     monthlyAmount: 0, growthRate: 0,   isVariable: false },
      { item: "Marketing & Promotion",    monthlyAmount: 0, growthRate: 0,   isVariable: false },
      { item: "Insurance",                monthlyAmount: 0, growthRate: 0,   isVariable: false },
      { item: "Miscellaneous",            monthlyAmount: 0, growthRate: 0,   isVariable: false },
      { item: "Raw Materials / Inventory",monthlyAmount: 0, growthRate: 0.1, isVariable: true  },
    ],
    revenuePackages: [
      { product: "", packageName: "Basic Package",   pricePerUnitPerMonth: 0, customersPerMonth: 0, annualCustomers: 0, growthRate: 0.1 },
      { product: "", packageName: "Premium Package", pricePerUnitPerMonth: 0, customersPerMonth: 0, annualCustomers: 0, growthRate: 0.1 },
    ],
    loan: { amount: 0, annualInterestRate: 0.12, termYears: 5 },
    discountRate: 0.12,
    citRate: 0.30,
    rssbRate: 0.05,
    healthInsuranceRate: 0.0,
    maternityRate: 0.0,
    projectionYears: 5,
  },
};

/**
 * Merges user profile defaults into the base form defaults.
 * Call this when creating a new plan to pre-fill the form with saved preferences.
 */
export function buildDefaultFormData(
  profile?: UserProfileDefaults | null
): Omit<FormSubmission, "userId"> {
  if (!profile) return defaultFormData;

  return {
    ...defaultFormData,
    companyInfo: {
      ...defaultFormData.companyInfo,
      authorTitle:  profile.authorTitle  || defaultFormData.companyInfo.authorTitle,
      location:     profile.location     || defaultFormData.companyInfo.location,
      companyType:  profile.companyType  || defaultFormData.companyInfo.companyType,
      companyFocus: profile.industry     || defaultFormData.companyInfo.companyFocus,
      currency:     profile.currency     || defaultFormData.companyInfo.currency,
    },
    financial: {
      ...defaultFormData.financial,
      citRate:             profile.citRate             ?? defaultFormData.financial.citRate,
      rssbRate:            profile.rssbRate            ?? defaultFormData.financial.rssbRate,
      healthInsuranceRate: profile.healthInsuranceRate ?? defaultFormData.financial.healthInsuranceRate,
      maternityRate:       profile.maternityRate       ?? defaultFormData.financial.maternityRate,
      discountRate:        profile.discountRate        ?? defaultFormData.financial.discountRate,
      loan: {
        ...defaultFormData.financial.loan,
        annualInterestRate: profile.loanRate      ?? defaultFormData.financial.loan.annualInterestRate,
        termYears:          profile.loanTermYears ?? defaultFormData.financial.loan.termYears,
      },
    },
  };
}
