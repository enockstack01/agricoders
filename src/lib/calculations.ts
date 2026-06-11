import {
  FinancialData,
  StaffMember,
  FinancialResults,
  YearlyValues,
  OpexRow,
  RevenueRow,
  StaffRow,
  ManufacturedProduct,
  ProductResult,
} from "@/types";

function growN(base: number, rate: number, n: number): YearlyValues {
  const arr: number[] = [base];
  for (let i = 1; i < n; i++) arr.push(arr[i - 1] * (1 + rate));
  return arr;
}

function flatN(val: number, n: number): YearlyValues {
  return Array(n).fill(val);
}

function addYV(a: YearlyValues, b: YearlyValues): YearlyValues {
  const len = Math.max(a.length, b.length);
  return Array.from({ length: len }, (_, i) => (a[i] ?? 0) + (b[i] ?? 0));
}

function subYV(a: YearlyValues, b: YearlyValues): YearlyValues {
  const len = Math.max(a.length, b.length);
  return Array.from({ length: len }, (_, i) => (a[i] ?? 0) - (b[i] ?? 0));
}

function sumYVArray(arr: YearlyValues[]): YearlyValues {
  if (arr.length === 0) return [];
  return arr.reduce(addYV);
}

function calcPayrollTax(monthlySalary: number): number {
  if (monthlySalary <= 0) return 0;
  if (monthlySalary <= 30000) return 0;
  if (monthlySalary <= 100000) return (monthlySalary - 30000) * 0.2;
  if (monthlySalary <= 200000) return 70000 * 0.2 + (monthlySalary - 100000) * 0.3;
  return 70000 * 0.2 + 100000 * 0.3 + (monthlySalary - 200000) * 0.3;
}

function irr(cashFlows: number[], guess = 0.1): number {
  const maxIter = 1000;
  const tol = 1e-7;
  let rate = guess;
  for (let i = 0; i < maxIter; i++) {
    let npv = 0;
    let dnpv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      const denom = Math.pow(1 + rate, t);
      npv += cashFlows[t] / denom;
      dnpv -= (t * cashFlows[t]) / Math.pow(1 + rate, t + 1);
    }
    if (Math.abs(dnpv) < 1e-12) break;
    const newRate = rate - npv / dnpv;
    if (Math.abs(newRate - rate) < tol) return newRate;
    rate = newRate;
  }
  return rate;
}

function resolveProducts(financial: FinancialData): ManufacturedProduct[] {
  if (financial.products && financial.products.length > 0) return financial.products;
  const legacy = (financial as unknown as Record<string, unknown>).kitComponents as ManufacturedProduct["components"] | undefined;
  if (legacy && legacy.length > 0) {
    const batchSize = (legacy[0] as { quantity?: number }).quantity || 10;
    return [{ name: "Product", description: "", batchSize, components: legacy }];
  }
  return [];
}

function isProductSale(pkg: FinancialData["revenuePackages"][0]): boolean {
  return !!(pkg.isProductSale || pkg.isKitSale);
}

function getProductSellingPrice(pkg: FinancialData["revenuePackages"][0]): number {
  return pkg.productSellingPrice ?? pkg.kitSellingPrice ?? 0;
}

export function computeFinancials(
  financial: FinancialData,
  staff: StaffMember[]
): FinancialResults {
  const { capex, opexItems, revenuePackages, loan, discountRate, citRate, rssbRate, healthInsuranceRate, maternityRate } = financial;
  const n = Math.max(1, financial.projectionYears ?? 5);

  // --- CAPEX ---
  const capexTotal = capex.reduce((s, i) => s + i.quantity * i.costPerUnit, 0);

  // --- Products ---
  const resolvedProducts = resolveProducts(financial);
  const productResults: ProductResult[] = resolvedProducts.map((p) => {
    const totalCost = p.components.reduce((s, c) => s + c.quantity * c.costPerUnit, 0);
    const unitCost = p.batchSize > 0 ? totalCost / p.batchSize : 0;
    return { name: p.name, unitCost, totalCost, batchSize: p.batchSize };
  });
  const kitTotalCost = productResults[0]?.totalCost ?? 0;
  const kitUnitCost = productResults[0]?.unitCost ?? 0;

  // --- OPEX ---
  const opexRows: OpexRow[] = opexItems.map((item) => {
    const annual = item.monthlyAmount * 12;
    const values = item.growthRate > 0 ? growN(annual, item.growthRate, n) : flatN(annual, n);
    return { item: item.item, monthly: item.monthlyAmount, annual, values };
  });
  const totalOpex = opexRows.length > 0 ? sumYVArray(opexRows.map((r) => r.values)) : flatN(0, n);

  // --- Revenue ---
  const revenueRows: RevenueRow[] = revenuePackages.map((pkg) => {
    const annualRevY1 = isProductSale(pkg)
      ? getProductSellingPrice(pkg) * pkg.annualCustomers
      : pkg.pricePerUnitPerMonth * 12 * pkg.annualCustomers;
    const values = growN(annualRevY1, pkg.growthRate, n);
    return { product: pkg.product, packageName: pkg.packageName, values };
  });
  const totalRevenue = revenueRows.length > 0 ? sumYVArray(revenueRows.map((r) => r.values)) : flatN(0, n);

  // --- Staff ---
  const staffRows: StaffRow[] = staff.map((s) => {
    const monthlySalary = s.salaryPerEmployee;
    const annualSalary = monthlySalary * s.count * 12;
    const rssb = monthlySalary * rssbRate;
    const hi = monthlySalary * healthInsuranceRate;
    const mat = monthlySalary * maternityRate;
    const payrollTax = calcPayrollTax(monthlySalary);
    return {
      role: s.role, count: s.count, salary: monthlySalary, annualSalary,
      rssbPension: rssb, healthInsurance: hi, maternity: mat,
      totalCompensation: rssb + hi + mat, payrollTax, netSalary: monthlySalary - (rssb + hi + mat),
    };
  });
  const totalMonthlySalaries = staffRows.reduce((s, r) => s + r.salary * r.count, 0);
  const totalSalaries = totalMonthlySalaries;
  const annualSalaries = totalMonthlySalaries * 12;
  const annualSalariesYV = flatN(annualSalaries, n);
  const totalMonthlyPayrollTax = staffRows.reduce((s, r) => s + r.payrollTax * r.count, 0);
  const payrollTaxTotal = totalMonthlyPayrollTax;
  const annualPayrollTax = totalMonthlyPayrollTax * 12;
  const totalMonthlyRSSB = staffRows.reduce((s, r) => s + r.rssbPension * r.count, 0);

  // --- Cash Flow ---
  const totalInflows: YearlyValues = totalRevenue;
  const totalOutflowsArr = addYV(totalOpex, annualSalariesYV);
  const netCashFlow = subYV(totalInflows, totalOutflowsArr);
  const endingBalance: number[] = [];
  const beginningBalance: number[] = [capexTotal];
  let prevEnd = capexTotal;
  for (let i = 0; i < n; i++) {
    const endBal = prevEnd + netCashFlow[i];
    endingBalance.push(endBal);
    if (i + 1 < n) beginningBalance.push(endBal);
    prevEnd = endBal;
  }
  const cashFlow = { beginningBalance, totalInflows, totalOutflows: totalOutflowsArr, netCashFlow, endingBalance };

  // --- Income Statement ---
  const fixedOpexRows = opexRows.filter((r) => !opexItems.find((i) => i.item === r.item)?.isVariable);
  const totalFixedExpenses = fixedOpexRows.length > 0 ? sumYVArray(fixedOpexRows.map((r) => r.values)) : flatN(0, n);
  const loanY1 = loan.amount;
  const loanStep = Math.round(loanY1 * 0.05);
  const commercialLoanYV: YearlyValues = Array.from({ length: n }, (_, i) => loanY1 + loanStep * i);
  const totalCostOfSalesRows = opexRows.filter((r) => opexItems.find((i) => i.item === r.item)?.isVariable);
  const totalCostOfSales = totalCostOfSalesRows.length > 0 ? sumYVArray(totalCostOfSalesRows.map((r) => r.values)) : flatN(0, n);
  const grossMargin = subYV(totalRevenue, totalCostOfSales);
  const totalExpenses = addYV(addYV(totalOpex, annualSalariesYV), commercialLoanYV);
  const netIncomeBeforeTax = subYV(totalRevenue, totalExpenses);
  const citYV: YearlyValues = netIncomeBeforeTax.map((v) => Math.max(0, v) * citRate);
  const netIncomeAfterTax = subYV(netIncomeBeforeTax, citYV);
  const incomeStatement = {
    incomeTax: totalRevenue, totalCostOfSales, grossMargin,
    totalSalaries: annualSalariesYV, totalFixedExpenses, commercialLoan: commercialLoanYV,
    totalExpenses, netIncomeBeforeTax, cit: citYV, netIncomeAfterTax,
  };

  // --- Government Revenue ---
  const incomeTaxLaborYV = flatN(annualPayrollTax, n);
  const rssbAnnualYV = flatN(totalMonthlyRSSB * 12, n);
  const gorTotal = addYV(addYV(citYV, incomeTaxLaborYV), rssbAnnualYV);
  const gorRevenue = { cit: citYV, incomeTaxLabor: incomeTaxLaborYV, rssb: rssbAnnualYV, total: gorTotal };

  // --- NPV ---
  const dr = discountRate;
  const pvArr: YearlyValues = netIncomeBeforeTax.map((cf, i) => cf / Math.pow(1 + dr, i + 1));
  const npvTotal = pvArr.reduce((a, b) => a + b, 0) - capexTotal;
  const irrVal = irr([-capexTotal, ...netIncomeBeforeTax]);
  const npv = { netCashFlow: netIncomeBeforeTax, pv: pvArr, npvTotal, irr: irrVal };

  // --- CBA ---
  const pvBenArr: YearlyValues = totalRevenue.map((r, i) => r / Math.pow(1 + dr, i + 1));
  const pvCostArr: YearlyValues = totalOpex.map((c, i) => c / Math.pow(1 + dr, i + 1));
  const bcRatioArr: YearlyValues = pvBenArr.map((b, i) => (pvCostArr[i] ? b / pvCostArr[i] : 0));
  const cba = { pvBenefit: pvBenArr, pvCost: pvCostArr, bcRatio: bcRatioArr };

  // --- Payback ---
  const initInvestment = -capexTotal;
  const pbWithInit = [initInvestment, ...netCashFlow];
  let cumulated = 0;
  const cumulatedArr: number[] = [];
  for (const cf of pbWithInit) { cumulated += cf; cumulatedArr.push(cumulated); }
  let pbYears = 0;
  let pbFrac = 0;
  for (let i = 1; i < cumulatedArr.length; i++) {
    if (cumulatedArr[i - 1] < 0 && cumulatedArr[i] >= 0) {
      pbYears = i - 1;
      pbFrac = Math.abs(cumulatedArr[i - 1]) / netCashFlow[i - 1];
      break;
    }
  }
  const totalPbYears = pbYears + pbFrac;
  const payback = {
    cashFlow: [initInvestment, ...netCashFlow.slice(0, n - 1)],
    cumulatedCashFlow: cumulatedArr.slice(0, n),
    years: totalPbYears, months: totalPbYears * 12, days: totalPbYears * 365,
  };

  // --- P&L ---
  const pnl = { annualRevenue: totalRevenue, operatingExpenses: totalOutflowsArr, grossRevenue: netCashFlow };

  // --- CRR ---
  const crr = {
    totalRevenue, operatingExpenses: totalOpex,
    crr: totalRevenue.map((r, i) => r / (totalOpex[i] || 1)),
  };

  // --- Balance Sheet ---
  const retainedEarnings = netIncomeAfterTax;
  const accReceivable: YearlyValues = totalRevenue.map((r) => r * 0.1);
  const inventoryBase = kitTotalCost > 0 ? kitTotalCost * 2 : capexTotal * 0.15;
  const inventoryYV: YearlyValues = Array.from({ length: n }, (_, i) => inventoryBase * (1 + 0.05 * i));
  const prepaidBase = capexTotal * 0.05 || 500000;
  const prepaidYV: YearlyValues = Array.from({ length: n }, (_, i) => prepaidBase * Math.pow(1.04, i));
  const totalCurrentAssets: YearlyValues = Array.from({ length: n }, (_, i) =>
    retainedEarnings[i] + accReceivable[i] + inventoryYV[i] + prepaidYV[i]
  );
  const ppeBase = capexTotal > 0 ? capexTotal * 1.5 : 1000000;
  const ppeYV: YearlyValues = Array.from({ length: n }, (_, i) => ppeBase * (1 + 0.05 * i));
  const softBase = capexTotal > 0 ? capexTotal * 0.3 : 300000;
  const softYV: YearlyValues = Array.from({ length: n }, (_, i) => softBase * (1 + 0.10 * i));
  const totalNCA: YearlyValues = Array.from({ length: n }, (_, i) => ppeYV[i] + softYV[i]);
  const totalAssets: YearlyValues = Array.from({ length: n }, (_, i) => totalCurrentAssets[i] + totalNCA[i]);
  const apBase = capexTotal * 0.3 || 500000;
  const apYV: YearlyValues = Array.from({ length: n }, (_, i) => apBase * (1 + 0.04 * i));
  const deferredBase = (totalRevenue[0] ?? 0) * 0.05 || 100000;
  const deferredYV: YearlyValues = Array.from({ length: n }, (_, i) =>
    i === 0 ? deferredBase : deferredBase * (1.1 + 0.1 * i)
  );
  const totalLiabilities: YearlyValues = Array.from({ length: n }, (_, i) =>
    apYV[i] + commercialLoanYV[i] + deferredYV[i]
  );
  const founderCapital: YearlyValues = Array.from({ length: n }, (_, i) =>
    totalAssets[i] - totalLiabilities[i] - retainedEarnings[i]
  );
  const totalEquity: YearlyValues = Array.from({ length: n }, (_, i) => founderCapital[i] + retainedEarnings[i]);
  const balanceSheet = {
    cashAndEquivalents: retainedEarnings, accountsReceivable: accReceivable,
    inventory: inventoryYV, prepaidExpenses: prepaidYV, totalCurrentAssets,
    ppe: ppeYV, softwareDev: softYV, totalNonCurrentAssets: totalNCA,
    totalAssets, accountsPayable: apYV, commercialLoan: commercialLoanYV,
    deferredRevenue: deferredYV, totalLiabilities, founderCapital,
    retainedEarnings, totalEquity, totalLiabilitiesAndEquity: totalAssets,
  };

  // --- Break-Even ---
  const productSalePkg = revenuePackages.find((p) => isProductSale(p));
  const sellingPrice = productSalePkg
    ? getProductSellingPrice(productSalePkg)
    : kitUnitCost > 0 ? kitUnitCost * 2 : 0;
  const bepUnits = sellingPrice > kitUnitCost ? capexTotal / (sellingPrice - kitUnitCost) : 0;
  const breakEven = {
    fixedCost: capexTotal, sellingPricePerUnit: sellingPrice, variableCostPerUnit: kitUnitCost,
    bepUnits, bepSalesValue: bepUnits * sellingPrice, bepKits: bepUnits,
  };

  // --- Loan Amortization ---
  const monthlyRate = loan.annualInterestRate / 12;
  const loanTermMonths = loan.termYears * 12;
  const monthlyPayment = monthlyRate > 0 && loanTermMonths > 0
    ? (loan.amount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / (Math.pow(1 + monthlyRate, loanTermMonths) - 1)
    : loanTermMonths > 0 ? loan.amount / loanTermMonths : 0;
  let balance = loan.amount;
  const schedule = Array.from({ length: loanTermMonths }, (_, i) => {
    const interest = balance * monthlyRate;
    const principal = monthlyPayment - interest;
    balance -= principal;
    return { month: i + 1, payment: monthlyPayment, principal, interest, balance: Math.max(0, balance) };
  });

  return {
    capexTotal, kitUnitCost, kitTotalCost, productResults,
    opexRows, totalOpex, revenueRows, totalRevenue,
    staffRows, totalSalaries, annualSalaries,
    cashFlow, incomeStatement, payrollTaxTotal, annualPayrollTax,
    gorRevenue, npv, cba, payback, pnl, crr, balanceSheet, breakEven,
    loanAmortization: { monthlyPayment, schedule },
  };
}
