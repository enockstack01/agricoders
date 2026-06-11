export interface CompanyInfo {
  authorName: string;
  authorTitle: string;
  companyName: string;
  productName: string;
  phone: string;
  email: string;
  location: string;
  submittedTo: string;
  submissionDate: string;
  companyType: string;
  companyFocus: string;
  currency: string;
  website?: string;
  companyLogo?: string;
}

export interface SWOTItem {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface PESTELItem {
  political: string;
  economic: string;
  social: string;
  technological: string;
  environmental: string;
  legal: string;
}

export interface Product {
  name: string;
  description: string;
}

export interface ValueItem {
  name: string;
  description: string;
}

export interface BusinessDescription {
  vision: string;
  mission: string;
  shortTermGoals: string[];
  mediumTermGoals: string[];
  longTermGoals: string[];
  values: ValueItem[];
  products: Product[];
  workingModelSteps: string[];
  technologies: string[];
  rawMaterials: string[];
  swot: SWOTItem;
  pestel: PESTELItem;
}

export interface MarketAnalysis {
  globalMarketSize2024: number;
  globalMarketSize2025: number;
  globalMarketSize2030: number;
  gdpContribution: number;
  employmentPercentage: number;
  competitors: { name: string; description: string }[];
  targetSegments: { name: string; description: string }[];
  marketingStrategies: string[];
  distributionChannels: string[];
}

export interface StaffMember {
  role: string;
  count: number;
  responsibilities: string;
  salaryPerEmployee: number;
}

export interface CapexItem {
  item: string;
  quantity: number;
  costPerUnit: number;
}

export interface ProductComponent {
  item: string;
  quantity: number;
  costPerUnit: number;
}

export type KitComponent = ProductComponent;

// A physical product the business manufactures and sells
export interface ManufacturedProduct {
  name: string;
  description: string;
  batchSize: number;
  components: ProductComponent[];
}

// A service offering (intangible — no manufacturing components)
export interface ServiceOffering {
  name: string;
  description: string;
  serviceType: string;   // e.g. "Consulting", "SaaS / Subscription", "Training", "Support & Maintenance", "Licensing", "Custom Development", "Other"
  deliveryModel: string; // "Remote", "On-site", "Hybrid", "Digital"
  pricingModel: string;  // "Hourly", "Daily", "Monthly Retainer", "Project-based", "Per User / Seat", "Annual License"
}

export const SERVICE_TYPES = [
  "Consulting",
  "SaaS / Subscription",
  "Training & Education",
  "Support & Maintenance",
  "Licensing",
  "Custom Development",
  "Managed Services",
  "Professional Services",
  "Other",
] as const;

export const DELIVERY_MODELS = ["Remote", "On-site", "Hybrid", "Digital"] as const;

export const PRICING_MODELS = [
  "Hourly",
  "Daily",
  "Monthly Retainer",
  "Project-based",
  "Per User / Seat",
  "Annual License",
  "Per Transaction",
  "Other",
] as const;

export interface OpexItem {
  item: string;
  monthlyAmount: number;
  growthRate: number;
  isVariable: boolean;
}

export interface RevenuePackage {
  product: string;        // name of the product or service
  packageName: string;
  pricePerUnitPerMonth: number;
  customersPerMonth: number;
  annualCustomers: number;
  growthRate: number;
  isProductSale?: boolean;
  productSellingPrice?: number;
  // Legacy aliases
  isKitSale?: boolean;
  kitSellingPrice?: number;
}

export interface LoanData {
  amount: number;
  annualInterestRate: number;
  termYears: number;
}

export interface FinancialData {
  capex: CapexItem[];
  products: ManufacturedProduct[];
  services: ServiceOffering[];   // ← NEW: service offerings
  opexItems: OpexItem[];
  revenuePackages: RevenuePackage[];
  loan: LoanData;
  discountRate: number;
  citRate: number;
  rssbRate: number;
  healthInsuranceRate: number;
  maternityRate: number;
  projectionYears?: number;       // Number of years for financial projections (default 5)
  kitComponents?: KitComponent[]; // legacy
}

export interface FormSubmission {
  userId: string;
  companyInfo: CompanyInfo;
  businessDescription: BusinessDescription;
  marketAnalysis: MarketAnalysis;
  staff: StaffMember[];
  financial: FinancialData;
  createdAt?: Date;
  updatedAt?: Date;
}

// ── User profile / pre-configured defaults ──────────────────────────────────

export interface UserProfileDefaults {
  currency: string;
  location: string;
  companyType: string;
  industry: string;
  authorTitle: string;
  citRate: number;
  rssbRate: number;
  healthInsuranceRate: number;
  maternityRate: number;
  discountRate: number;
  loanRate: number;
  loanTermYears: number;
}

export interface UserProfile {
  userId: string;
  defaults: UserProfileDefaults;
  updatedAt?: Date;
}

// ── Computed Financial Results ───────────────────────────────────────────────

export type YearlyValues = number[];

export interface RevenueRow {
  product: string;
  packageName: string;
  values: YearlyValues;
}

export interface OpexRow {
  item: string;
  monthly: number;
  annual: number;
  values: YearlyValues;
}

export interface StaffRow {
  role: string;
  count: number;
  salary: number;
  annualSalary: number;
  rssbPension: number;
  healthInsurance: number;
  maternity: number;
  totalCompensation: number;
  payrollTax: number;
  netSalary: number;
}

export interface ProductResult {
  name: string;
  unitCost: number;
  totalCost: number;
  batchSize: number;
}

export interface FinancialResults {
  capexTotal: number;
  kitUnitCost: number;
  kitTotalCost: number;
  productResults: ProductResult[];
  opexRows: OpexRow[];
  totalOpex: YearlyValues;
  revenueRows: RevenueRow[];
  totalRevenue: YearlyValues;
  staffRows: StaffRow[];
  totalSalaries: number;
  annualSalaries: number;
  cashFlow: {
    beginningBalance: YearlyValues;
    totalInflows: YearlyValues;
    totalOutflows: YearlyValues;
    netCashFlow: YearlyValues;
    endingBalance: YearlyValues;
  };
  incomeStatement: {
    incomeTax: YearlyValues;
    totalCostOfSales: YearlyValues;
    grossMargin: YearlyValues;
    totalSalaries: YearlyValues;
    totalFixedExpenses: YearlyValues;
    commercialLoan: YearlyValues;
    totalExpenses: YearlyValues;
    netIncomeBeforeTax: YearlyValues;
    cit: YearlyValues;
    netIncomeAfterTax: YearlyValues;
  };
  payrollTaxTotal: number;
  annualPayrollTax: number;
  gorRevenue: {
    cit: YearlyValues;
    incomeTaxLabor: YearlyValues;
    rssb: YearlyValues;
    total: YearlyValues;
  };
  npv: {
    netCashFlow: YearlyValues;
    pv: YearlyValues;
    npvTotal: number;
    irr: number;
  };
  cba: {
    pvBenefit: YearlyValues;
    pvCost: YearlyValues;
    bcRatio: YearlyValues;
  };
  payback: {
    cashFlow: YearlyValues;
    cumulatedCashFlow: YearlyValues;
    years: number;
    months: number;
    days: number;
  };
  pnl: {
    annualRevenue: YearlyValues;
    operatingExpenses: YearlyValues;
    grossRevenue: YearlyValues;
  };
  crr: {
    totalRevenue: YearlyValues;
    operatingExpenses: YearlyValues;
    crr: YearlyValues;
  };
  balanceSheet: {
    cashAndEquivalents: YearlyValues;
    accountsReceivable: YearlyValues;
    inventory: YearlyValues;
    prepaidExpenses: YearlyValues;
    totalCurrentAssets: YearlyValues;
    ppe: YearlyValues;
    softwareDev: YearlyValues;
    totalNonCurrentAssets: YearlyValues;
    totalAssets: YearlyValues;
    accountsPayable: YearlyValues;
    commercialLoan: YearlyValues;
    deferredRevenue: YearlyValues;
    totalLiabilities: YearlyValues;
    founderCapital: YearlyValues;
    retainedEarnings: YearlyValues;
    totalEquity: YearlyValues;
    totalLiabilitiesAndEquity: YearlyValues;
  };
  breakEven: {
    fixedCost: number;
    sellingPricePerUnit: number;
    variableCostPerUnit: number;
    bepUnits: number;
    bepSalesValue: number;
    bepKits: number;
  };
  loanAmortization: {
    monthlyPayment: number;
    schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[];
  };
}
