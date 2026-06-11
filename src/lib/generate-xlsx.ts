import ExcelJS from "exceljs";
import { FormSubmission, FinancialResults } from "@/types";

// ─── Styling constants ───────────────────────────────────────────────────────
const GREEN       = "2E8B57";
const DARK_GREEN  = "1A5C3A";
const LIGHT_GREEN = "E8F5E9";
const BLUE_HDR    = "1E3A5F";
const AMBER       = "FFF3CD";
const NUM_FMT     = "#,##0.00";
const INT_FMT     = "#,##0";
const PCT_FMT     = "0.00%";

const HEADER_FONT  = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
const TOTAL_FONT   = { bold: true, size: 10 };
const LABEL_FONT   = { bold: true, size: 10 };
const NORMAL_FONT  = { size: 10 };

// ─── Cell address helpers ─────────────────────────────────────────────────────
function C(n: number): string {
  let s = "";
  while (n > 0) { n--; s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26); }
  return s;
}

function A(row: number, col: number, abs = false): string {
  return abs ? `$${C(col)}$${row}` : `${C(col)}${row}`;
}

function R(sheet: string, row: number, col: number, abs = true): string {
  const q = /[ \-&]/.test(sheet) ? `'${sheet}'` : sheet;
  return `${q}!${A(row, col, abs)}`;
}

function RNG(r1: number, c1: number, r2: number, c2: number): string {
  return `${A(r1, c1)}:${A(r2, c2)}`;
}

function F(formula: string, result: number | string): ExcelJS.CellValue {
  return { formula, result } as unknown as ExcelJS.CellValue;
}

// ─── Low-level cell writers ───────────────────────────────────────────────────
type WS = ExcelJS.Worksheet;

function border(cell: ExcelJS.Cell) {
  cell.border = {
    top:    { style: "thin", color: { argb: "FFD0D0D0" } },
    bottom: { style: "thin", color: { argb: "FFD0D0D0" } },
    left:   { style: "thin", color: { argb: "FFD0D0D0" } },
    right:  { style: "thin", color: { argb: "FFD0D0D0" } },
  };
}

function hdr(ws: WS, row: number, col: number, text: string, color = GREEN) {
  const cell = ws.getCell(row, col);
  cell.value = text;
  cell.font  = HEADER_FONT;
  cell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${color}` } };
  cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  border(cell);
}

function lbl(ws: WS, row: number, col: number, value: string | number, numFmt?: string) {
  const cell = ws.getCell(row, col);
  cell.value = value;
  cell.font  = LABEL_FONT;
  if (numFmt) cell.numFmt = numFmt;
  border(cell);
}

function v(ws: WS, row: number, col: number, value: number | string, shade = false, numFmt?: string) {
  const cell = ws.getCell(row, col);
  cell.value = value;
  cell.font  = NORMAL_FONT;
  if (numFmt) cell.numFmt = numFmt;
  if (shade) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${LIGHT_GREEN}` } };
  border(cell);
}

function f(ws: WS, row: number, col: number, formula: string, result: number | string, shade = false, numFmt?: string) {
  const cell = ws.getCell(row, col);
  cell.value = F(formula, result);
  cell.font  = NORMAL_FONT;
  if (numFmt) cell.numFmt = numFmt;
  if (shade) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${LIGHT_GREEN}` } };
  border(cell);
}

function tot(ws: WS, row: number, col: number, formula: string, result: number, numFmt = INT_FMT) {
  const cell = ws.getCell(row, col);
  cell.value = F(formula, result);
  cell.font  = TOTAL_FONT;
  cell.numFmt = numFmt;
  cell.fill  = { type: "pattern", pattern: "solid", fgColor: { argb: `FF${LIGHT_GREEN}` } };
  border(cell);
}

function title(ws: WS, row: number, col: number, text: string) {
  const cell = ws.getCell(row, col);
  cell.value = text;
  cell.font  = { bold: true, size: 12, color: { argb: `FF${DARK_GREEN}` } };
}

function yearHeaders(ws: WS, row: number, n: number, firstLabel = "Description", startYear?: number) {
  const yLabel = (i: number) => startYear ? String(startYear + i) : `Year ${i + 1}`;
  [firstLabel, ...Array.from({ length: n }, (_, i) => yLabel(i))].forEach((h, i) =>
    hdr(ws, row, 1 + i, h)
  );
}

function year0Headers(ws: WS, row: number, n: number, firstLabel = "Metric", startYear?: number) {
  const y0Label = startYear ? String(startYear - 1) : "Year 0";
  const yLabel  = (i: number) => startYear ? String(startYear + i) : `Year ${i + 1}`;
  [firstLabel, y0Label, ...Array.from({ length: n }, (_, i) => yLabel(i))].forEach((h, i) =>
    hdr(ws, row, 1 + i, h)
  );
}

function yCols(n: number, w = 20): { width: number }[] {
  return Array.from({ length: n }, () => ({ width: w }));
}

// ─── Inputs sheet fixed row positions (column B = 2) ─────────────────────────
const INP = {
  citRate:      7,
  discountRate: 8,
  rssbRate:     9,
  healthRate:   10,
  maternityRate:11,
  loanAmount:   14,
  loanRate:     15,
  loanTerm:     16,
};

const I = (row: number) => `Inputs!$B$${row}`;

// ─── Main generator ───────────────────────────────────────────────────────────
export async function generateFinancialModelXlsx(
  data: FormSubmission,
  results: FinancialResults
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = data.companyInfo.authorName || "Logistack Plan";
  wb.created = wb.modified = new Date();

  const { financial: fin, staff } = data;
  const ci = data.companyInfo;
  const cur = ci.currency || "USD";
  const n = Math.max(1, fin.projectionYears ?? 5);

  // Derive the first projection year from submission date (falls back to current year)
  const startYear: number = (() => {
    if (ci.submissionDate) {
      const parsed = new Date(ci.submissionDate).getFullYear();
      if (!isNaN(parsed) && parsed > 2000) return parsed;
    }
    return new Date().getFullYear();
  })();

  // ══════════════════════════════════════════════════════════════════
  // SHEET 0 — Inputs
  // ══════════════════════════════════════════════════════════════════
  const wsInp = wb.addWorksheet("Inputs");
  wsInp.columns = [{ width: 35 }, { width: 25 }, { width: 45 }];

  title(wsInp, 1, 1, "Logistack Plan — Financial Model Inputs");
  wsInp.getCell(1, 3).value = `Generated: ${new Date().toLocaleDateString()}`;

  const inp = (row: number, label: string, val_: string | number, desc: string, numFmt?: string) => {
    lbl(wsInp, row, 1, label);
    const cell = wsInp.getCell(row, 2);
    cell.value = val_;
    cell.font  = { bold: true, size: 10, color: { argb: "FF1A5C3A" } };
    if (numFmt) cell.numFmt = numFmt;
    border(cell);
    wsInp.getCell(row, 3).value = desc;
    wsInp.getCell(row, 3).font  = { italic: true, size: 9, color: { argb: "FF666666" } };
  };

  hdr(wsInp, 3, 1, "COMPANY", GREEN); hdr(wsInp, 3, 2, "Value", GREEN); hdr(wsInp, 3, 3, "Notes", GREEN);
  inp(4, "Company Name",    ci.companyName  || "",  "Business legal name");
  inp(5, "Currency",        cur,                    "ISO currency code used throughout model");

  hdr(wsInp, 6, 1, "FINANCIAL RATES", DARK_GREEN); hdr(wsInp, 6, 2, "", DARK_GREEN); hdr(wsInp, 6, 3, "", DARK_GREEN);
  inp(INP.citRate,       "Corporate Income Tax (CIT)",         fin.citRate,             "Tax on company profits — change here to update all sheets", PCT_FMT);
  inp(INP.discountRate,  "NPV / CBA Discount Rate",            fin.discountRate,         "Cost of capital for present-value calculations",             PCT_FMT);
  inp(INP.rssbRate,      "Social Security / Pension Rate",     fin.rssbRate,             "Employee contribution (mirrors employer where applicable)",  PCT_FMT);
  inp(INP.healthRate,    "Health Insurance Rate",              fin.healthInsuranceRate,  "Employee health insurance deduction rate",                   PCT_FMT);
  inp(INP.maternityRate, "Other Payroll Deduction Rate",       fin.maternityRate,        "Maternity / parental leave or other statutory deduction",    PCT_FMT);

  hdr(wsInp, 13, 1, "LOAN", DARK_GREEN); hdr(wsInp, 13, 2, "", DARK_GREEN); hdr(wsInp, 13, 3, "", DARK_GREEN);
  inp(INP.loanAmount, "Loan / Financing Amount",     fin.loan.amount,             `In ${cur} — 0 if no loan`, INT_FMT);
  inp(INP.loanRate,   "Annual Interest Rate (Loan)", fin.loan.annualInterestRate, "p.a. — used in PMT formula", PCT_FMT);
  inp(INP.loanTerm,   "Loan Term (Years)",           fin.loan.termYears,          "Number of years to fully repay");

  const loanMonthlyResult = results.loanAmortization.monthlyPayment;
  lbl(wsInp, 17, 1, "Monthly Loan Payment (calc)");
  const loanCell = wsInp.getCell(17, 2);
  loanCell.value = F(
    `=IF(${I(INP.loanAmount)}=0,0,PMT(${I(INP.loanRate)}/12,${I(INP.loanTerm)}*12,-${I(INP.loanAmount)}))`,
    loanMonthlyResult
  );
  loanCell.font = TOTAL_FONT;
  loanCell.numFmt = INT_FMT;
  border(loanCell);
  wsInp.getCell(17, 3).value = "Auto-calculated from above — do not edit";

  wsInp.getCell(19, 1).value = "Note: Change any value above and all linked sheets recalculate automatically.";
  wsInp.getCell(19, 1).font  = { italic: true, size: 9, color: { argb: "FF888888" } };
  wsInp.mergeCells(19, 1, 19, 3);

  // ══════════════════════════════════════════════════════════════════
  // SHEET 1 — CAPEX
  // ══════════════════════════════════════════════════════════════════
  const wsCX = wb.addWorksheet("CAPEX");
  wsCX.columns = [{ width: 38 }, { width: 12 }, { width: 22 }, { width: 22 }];
  title(wsCX, 1, 1, "Capital Expenditure (CAPEX)");

  ["Item / Asset", "Quantity", `Unit Cost (${cur})`, `Total Cost (${cur})`].forEach((h, i) => hdr(wsCX, 2, 1 + i, h));

  const capexDataStart = 3;
  fin.capex.filter(c => c.item).forEach((c, i) => {
    const row = capexDataStart + i;
    lbl(wsCX, row, 1, c.item);
    v(wsCX,   row, 2, c.quantity,    false, INT_FMT);
    v(wsCX,   row, 3, c.costPerUnit, false, NUM_FMT);
    f(wsCX,   row, 4, `=${A(row,2)}*${A(row,3)}`, c.quantity * c.costPerUnit, false, INT_FMT);
  });

  const capexDataEnd  = capexDataStart + fin.capex.filter(c => c.item).length - 1;
  const capexTotalRow = capexDataEnd + 1;
  lbl(wsCX, capexTotalRow, 1, "TOTAL CAPEX");
  tot(wsCX, capexTotalRow, 4, `=SUM(${RNG(capexDataStart, 4, capexDataEnd, 4)})`, results.capexTotal);

  const CAPEX_TOTAL = R("CAPEX", capexTotalRow, 4);

  // ══════════════════════════════════════════════════════════════════
  // SHEET 2 — Products
  // ══════════════════════════════════════════════════════════════════
  const wsProd = wb.addWorksheet("Products");
  wsProd.columns = [{ width: 38 }, { width: 12 }, { width: 22 }, { width: 22 }];
  title(wsProd, 1, 1, "Product Manufacturing — Bill of Materials");

  const mfgProducts = fin.products ?? [];
  const productUnitCostRefs: string[] = [];

  if (mfgProducts.length === 0) {
    wsProd.getCell(2, 1).value = "No manufactured products defined — services-only business.";
    wsProd.getCell(2, 1).font  = { italic: true, color: { argb: "FF888888" } };
  } else {
    let prodRow = 2;
    mfgProducts.forEach((product, pi) => {
      const pr = results.productResults[pi];
      wsProd.getCell(prodRow, 1).value = `Product ${pi + 1}: ${product.name}`;
      wsProd.getCell(prodRow, 1).font  = { bold: true, size: 11, color: { argb: `FF${GREEN}` } };
      v(wsProd, prodRow, 2, product.batchSize, false, INT_FMT);
      wsProd.getCell(prodRow, 3).value = "Batch Size (units)";
      wsProd.getCell(prodRow, 3).font  = { italic: true, size: 9 };
      prodRow++;

      ["Component / Material", "Quantity", `Cost/Unit (${cur})`, `Line Total (${cur})`].forEach((h, i) =>
        hdr(wsProd, prodRow, 1 + i, h)
      );
      prodRow++;

      const compStart = prodRow;
      product.components.filter(c => c.item).forEach((c) => {
        lbl(wsProd,  prodRow, 1, c.item);
        v(wsProd,    prodRow, 2, c.quantity,    false, INT_FMT);
        v(wsProd,    prodRow, 3, c.costPerUnit, false, NUM_FMT);
        f(wsProd,    prodRow, 4, `=${A(prodRow,2)}*${A(prodRow,3)}`, c.quantity * c.costPerUnit, false, INT_FMT);
        prodRow++;
      });
      const compEnd       = prodRow - 1;
      const batchTotalRow = prodRow;
      const unitCostRow   = prodRow + 1;

      lbl(wsProd, batchTotalRow, 1, "Grand Total (batch)");
      tot(wsProd, batchTotalRow, 4, `=SUM(${RNG(compStart,4,compEnd,4)})`, pr?.totalCost ?? 0);

      lbl(wsProd, unitCostRow, 1, `Unit Cost — ${product.name}`);
      f(wsProd, unitCostRow, 4,
        `=${A(batchTotalRow,4)}/${product.batchSize}`,
        Math.round(pr?.unitCost ?? 0),
        true, INT_FMT
      );
      productUnitCostRefs.push(R("Products", unitCostRow, 4));
      prodRow += 3;
    });
  }

  // ══════════════════════════════════════════════════════════════════
  // SHEET 3 — Staff
  // ══════════════════════════════════════════════════════════════════
  const wsStaff = wb.addWorksheet("Staff");
  wsStaff.columns = [
    { width: 32 }, { width: 8 }, { width: 18 }, { width: 18 }, { width: 18 },
    { width: 16 }, { width: 16 }, { width: 16 }, { width: 18 }, { width: 18 },
    { width: 18 }, ...yCols(n, 18),
  ];
  title(wsStaff, 1, 1, "Staff & Payroll");
  wsStaff.getCell(1, 6).value = `Social Security rate → ${I(INP.rssbRate)}`;
  wsStaff.getCell(1, 6).font  = { italic: true, size: 8, color: { argb: "FF888888" } };

  const staffHdrs = [
    "Role", "Count", `Salary/Employee/mo (${cur})`, `Monthly Total (${cur})`, `Annual Salary (${cur})`,
    `Pension/mo`, `Health/mo`, `Other/mo`, `Total Deductions/mo`, `Income Tax/mo`, `Net Salary/mo`,
    ...Array.from({ length: n }, (_, i) => `${startYear + i} Annual`),
  ];
  staffHdrs.forEach((h, i) => hdr(wsStaff, 2, 1 + i, h));

  const staffDataStart = 3;
  staff.forEach((s, i) => {
    const row = staffDataStart + i;
    const r   = results.staffRows[i];
    lbl(wsStaff, row, 1,  s.role);
    v(wsStaff,   row, 2,  s.count,              false, INT_FMT);
    v(wsStaff,   row, 3,  s.salaryPerEmployee,  false, INT_FMT);
    f(wsStaff,   row, 4,  `=${A(row,2)}*${A(row,3)}`,                    r.salary * r.count,   false, INT_FMT);
    f(wsStaff,   row, 5,  `=${A(row,4)}*12`,                              r.annualSalary,       false, INT_FMT);
    f(wsStaff,   row, 6,  `=${A(row,3)}*${I(INP.rssbRate)}`,              r.rssbPension,        false, INT_FMT);
    f(wsStaff,   row, 7,  `=${A(row,3)}*${I(INP.healthRate)}`,            r.healthInsurance,    false, INT_FMT);
    f(wsStaff,   row, 8,  `=${A(row,3)}*${I(INP.maternityRate)}`,         r.maternity,          false, INT_FMT);
    f(wsStaff,   row, 9,  `=${A(row,6)}+${A(row,7)}+${A(row,8)}`,        r.totalCompensation,  false, INT_FMT);
    const sal = A(row, 3);
    const taxFml = `=IF(${sal}<=0,0,IF(${sal}<=30000,0,IF(${sal}<=100000,(${sal}-30000)*0.2,IF(${sal}<=200000,70000*0.2+(${sal}-100000)*0.3,70000*0.2+100000*0.3+(${sal}-200000)*0.3))))`;
    f(wsStaff,   row, 10, taxFml, r.payrollTax, false, INT_FMT);
    f(wsStaff,   row, 11, `=${A(row,3)}-${A(row,9)}`, r.netSalary, false, INT_FMT);
    for (let yr = 0; yr < n; yr++) {
      f(wsStaff, row, 12 + yr, `=${A(row,5)}`, r.annualSalary, false, INT_FMT);
    }
  });

  const staffDataEnd  = staffDataStart + staff.length - 1;
  const staffTotalRow = staffDataEnd + 1;
  lbl(wsStaff, staffTotalRow, 1, "TOTAL STAFF COST");
  tot(wsStaff, staffTotalRow, 4, `=SUM(${RNG(staffDataStart,4,staffDataEnd,4)})`, results.totalSalaries);
  tot(wsStaff, staffTotalRow, 5, `=SUM(${RNG(staffDataStart,5,staffDataEnd,5)})`, results.annualSalaries);
  for (let yr = 0; yr < n; yr++) {
    const col = 12 + yr;
    tot(wsStaff, staffTotalRow, col, `=SUM(${RNG(staffDataStart,col,staffDataEnd,col)})`, results.annualSalaries);
  }
  tot(wsStaff, staffTotalRow, 10, `=SUM(${RNG(staffDataStart,10,staffDataEnd,10)})`, results.payrollTaxTotal);

  const STAFF_Y: string[] = Array.from({ length: n }, (_, i) =>
    R("Staff", staffTotalRow, 12 + i)
  );

  // ══════════════════════════════════════════════════════════════════
  // SHEET 4 — Operating Expenses (OPEX)
  // ══════════════════════════════════════════════════════════════════
  const wsOPEX = wb.addWorksheet("Operating expenses");
  wsOPEX.columns = [
    { width: 38 }, { width: 15 }, { width: 15 }, { width: 12 },
    ...yCols(n, 18),
  ];
  title(wsOPEX, 1, 1, `Operating Expenses (OPEX) — ${n}-Year Projection`);

  ["Cost Item", `Monthly (${cur})`, `Annual (${cur})`, "Growth Rate",
    ...Array.from({ length: n }, (_, i) => String(startYear + i))
  ].forEach((h, i) => hdr(wsOPEX, 2, 1 + i, h));

  const opexDataStart = 3;
  results.opexRows.forEach((r, i) => {
    const row  = opexDataStart + i;
    const item = fin.opexItems.find(op => op.item === r.item);
    lbl(wsOPEX, row, 1, r.item);
    v(wsOPEX,   row, 2, r.monthly,            false, INT_FMT);
    f(wsOPEX,   row, 3, `=${A(row,2)}*12`,    r.annual, false, INT_FMT);
    v(wsOPEX,   row, 4, item?.growthRate ?? 0, false, PCT_FMT);
    // Y1 = annual
    f(wsOPEX,   row, 5, `=${A(row,3)}`,        r.values[0] ?? 0, false, INT_FMT);
    // Y2..YN = previous × (1 + growth)
    for (let yr = 1; yr < n; yr++) {
      f(wsOPEX, row, 5 + yr, `=${A(row, 4 + yr)}*(1+${A(row,4)})`, r.values[yr] ?? 0, false, INT_FMT);
    }
  });

  const opexDataEnd  = opexDataStart + results.opexRows.length - 1;
  const opexTotalRow = opexDataEnd + 1;
  lbl(wsOPEX, opexTotalRow, 1, "TOTAL OPEX");
  v(wsOPEX, opexTotalRow, 2, results.opexRows.reduce((s, r) => s + r.monthly, 0), true, INT_FMT);
  for (let yr = 0; yr < n; yr++) {
    const col = 5 + yr;
    tot(wsOPEX, opexTotalRow, col, `=SUM(${RNG(opexDataStart,col,opexDataEnd,col)})`, results.totalOpex[yr] ?? 0);
  }

  const OPEX_Y: string[] = Array.from({ length: n }, (_, i) =>
    R("Operating expenses", opexTotalRow, 5 + i)
  );

  // ══════════════════════════════════════════════════════════════════
  // SHEET 5 — Revenue
  // ══════════════════════════════════════════════════════════════════
  const wsRev = wb.addWorksheet("Revenue");
  wsRev.columns = [
    { width: 28 }, { width: 22 }, { width: 10 }, { width: 20 }, { width: 18 }, { width: 12 },
    ...yCols(n, 20),
  ];
  title(wsRev, 1, 1, `Revenue Forecast — ${n}-Year Projection`);

  ["Product / Service", "Package / Tier", "Type", `Price/Unit (${cur})`, `${startYear} Volume`, "Growth Rate",
    ...Array.from({ length: n }, (_, i) => String(startYear + i))
  ].forEach((h, i) => hdr(wsRev, 2, 1 + i, h));

  const revDataStart = 3;
  fin.revenuePackages.forEach((pkg, i) => {
    const row = revDataStart + i;
    const r   = results.revenueRows[i];
    const isSale = !!(pkg.isProductSale || pkg.isKitSale);
    const price  = isSale ? (pkg.productSellingPrice ?? pkg.kitSellingPrice ?? pkg.pricePerUnitPerMonth)
                           : pkg.pricePerUnitPerMonth;

    lbl(wsRev, row, 1, pkg.product);
    lbl(wsRev, row, 2, pkg.packageName);
    v(wsRev,   row, 3, isSale ? "Product Sale" : "Recurring", false);
    v(wsRev,   row, 4, price,               false, NUM_FMT);
    v(wsRev,   row, 5, pkg.annualCustomers, false, INT_FMT);
    v(wsRev,   row, 6, pkg.growthRate,      false, PCT_FMT);

    const y1Fml = isSale
      ? `=${A(row,4)}*${A(row,5)}`
      : `=${A(row,4)}*12*${A(row,5)}`;

    f(wsRev, row, 7, y1Fml, r.values[0] ?? 0, false, INT_FMT);
    for (let yr = 1; yr < n; yr++) {
      f(wsRev, row, 7 + yr, `=${A(row, 6 + yr)}*(1+${A(row,6)})`, r.values[yr] ?? 0, false, INT_FMT);
    }
  });

  const revDataEnd  = revDataStart + fin.revenuePackages.length - 1;
  const revTotalRow = revDataEnd + 1;
  lbl(wsRev, revTotalRow, 1, "TOTAL REVENUE");
  const revTotals = results.totalRevenue.slice(0, n);
  for (let yr = 0; yr < n; yr++) {
    const col = 7 + yr;
    tot(wsRev, revTotalRow, col, `=SUM(${RNG(revDataStart,col,revDataEnd,col)})`, revTotals[yr] ?? 0);
  }

  const REV_Y: string[] = Array.from({ length: n }, (_, i) =>
    R("Revenue", revTotalRow, 7 + i)
  );

  // ══════════════════════════════════════════════════════════════════
  // SHEET 6 — Sales Forecast
  // ══════════════════════════════════════════════════════════════════
  const wsSF = wb.addWorksheet("Sales Forecast");
  wsSF.columns = [
    { width: 28 }, { width: 22 }, { width: 18 }, { width: 12 },
    ...yCols(n, 16),
  ];
  title(wsSF, 1, 1, "Sales Volume Forecast (Customer / Unit Count)");
  ["Product / Service", "Package", `${startYear} Volume`, "Growth Rate",
    ...Array.from({ length: n }, (_, i) => String(startYear + i))
  ].forEach((h, i) => hdr(wsSF, 2, 1 + i, h));

  fin.revenuePackages.forEach((pkg, i) => {
    const row = 3 + i;
    lbl(wsSF, row, 1, pkg.product);
    lbl(wsSF, row, 2, pkg.packageName);
    v(wsSF,   row, 3, pkg.annualCustomers, false, INT_FMT);
    v(wsSF,   row, 4, pkg.growthRate,      false, PCT_FMT);
    f(wsSF,   row, 5, `=${R("Revenue", 3 + i, 5)}`, pkg.annualCustomers, false, INT_FMT);
    for (let yr = 1; yr < n; yr++) {
      f(wsSF, row, 5 + yr,
        `=${A(row, 4 + yr)}*(1+${A(row,4)})`,
        Math.round(pkg.annualCustomers * Math.pow(1 + pkg.growthRate, yr)),
        false, INT_FMT
      );
    }
  });

  // ══════════════════════════════════════════════════════════════════
  // SHEET 7 — Cash Flow
  // ══════════════════════════════════════════════════════════════════
  const wsCF = wb.addWorksheet("Cash Flow");
  wsCF.columns = [{ width: 35 }, ...yCols(n, 20)];
  title(wsCF, 1, 1, "Projected Cash Flow Statement");
  yearHeaders(wsCF, 2, n, "Description", startYear);

  // Pre-compute ending balance row so beginning balances can reference it immediately
  const endBalRow = 11 + results.revenueRows.length;

  lbl(wsCF, 3, 1, "Beginning Cash Balance");
  f(wsCF, 3, 2, `=${CAPEX_TOTAL}`, results.cashFlow.beginningBalance[0] ?? results.capexTotal, false, INT_FMT);
  for (let yr = 1; yr < n; yr++) {
    f(wsCF, 3, 2 + yr, `=${A(endBalRow, 1 + yr)}`,
      results.cashFlow.beginningBalance[yr] ?? 0, false, INT_FMT);
  }

  hdr(wsCF, 4, 1, "CASH INFLOWS", GREEN);
  results.revenueRows.forEach((r, i) => {
    lbl(wsCF, 5 + i, 1, r.product + " — " + r.packageName);
    for (let yr = 0; yr < n; yr++) {
      f(wsCF, 5 + i, 2 + yr, `=${R("Revenue", revDataStart + i, 7 + yr)}`, r.values[yr] ?? 0, false, INT_FMT);
    }
  });

  const cfInflowRow = 5 + results.revenueRows.length;
  lbl(wsCF, cfInflowRow, 1, "Total Cash Inflows");
  for (let yr = 0; yr < n; yr++) {
    tot(wsCF, cfInflowRow, 2 + yr, `=${REV_Y[yr]}`, revTotals[yr] ?? 0);
  }

  hdr(wsCF, cfInflowRow + 1, 1, "CASH OUTFLOWS", BLUE_HDR);
  const opexOutRow  = cfInflowRow + 2;
  const staffOutRow = cfInflowRow + 3;
  const totalOutRow = cfInflowRow + 4;

  lbl(wsCF, opexOutRow,  1, "Total Operating Expenses");
  lbl(wsCF, staffOutRow, 1, "Total Salaries & Wages");
  lbl(wsCF, totalOutRow, 1, "Total Cash Outflows");

  for (let yr = 0; yr < n; yr++) {
    f(wsCF,   opexOutRow,  2 + yr, `=${OPEX_Y[yr]}`,  results.totalOpex[yr] ?? 0, false, INT_FMT);
    f(wsCF,   staffOutRow, 2 + yr, `=${STAFF_Y[yr]}`, results.annualSalaries,      false, INT_FMT);
    tot(wsCF, totalOutRow, 2 + yr, `=${A(opexOutRow,2+yr)}+${A(staffOutRow,2+yr)}`,
      results.cashFlow.totalOutflows[yr] ?? 0);
  }

  const netCFRow = totalOutRow + 1;
  // endBalRow = totalOutRow + 2 = cfInflowRow + 6 = 11 + revenueRows.length (pre-computed above)
  lbl(wsCF, netCFRow,  1, "Net Cash Flow");
  lbl(wsCF, endBalRow, 1, "Ending Cash Balance");

  for (let yr = 0; yr < n; yr++) {
    tot(wsCF, netCFRow,  2 + yr, `=${A(cfInflowRow,2+yr)}-${A(totalOutRow,2+yr)}`, results.cashFlow.netCashFlow[yr] ?? 0);
    tot(wsCF, endBalRow, 2 + yr, `=${A(3,2+yr)}+${A(netCFRow,2+yr)}`, results.cashFlow.endingBalance[yr] ?? 0);
  }

  const CF_NET_Y = Array.from({ length: n }, (_, yr) => R("Cash Flow", netCFRow,  2 + yr));
  const CF_END_Y = Array.from({ length: n }, (_, yr) => R("Cash Flow", endBalRow, 2 + yr));

  // ══════════════════════════════════════════════════════════════════
  // SHEET 8 — Income Statement
  // ══════════════════════════════════════════════════════════════════
  const wsIS = wb.addWorksheet("Income Statement");
  wsIS.columns = [{ width: 40 }, ...yCols(n, 20)];
  title(wsIS, 1, 1, `Income Statement — ${n}-Year Projection`);
  yearHeaders(wsIS, 3, n, "Line Item", startYear);

  let isRow = 4;

  hdr(wsIS, isRow, 1, "REVENUE", GREEN); isRow++;
  results.revenueRows.forEach((r, i) => {
    lbl(wsIS, isRow, 1, r.product + " — " + r.packageName);
    for (let yr = 0; yr < n; yr++) {
      f(wsIS, isRow, 2 + yr, `=${R("Revenue", revDataStart + i, 7 + yr)}`, r.values[yr] ?? 0, false, INT_FMT);
    }
    isRow++;
  });
  const isTotRevRow = isRow;
  lbl(wsIS, isTotRevRow, 1, "Total Revenue");
  for (let yr = 0; yr < n; yr++) tot(wsIS, isTotRevRow, 2 + yr, `=${REV_Y[yr]}`, revTotals[yr] ?? 0);
  isRow++;

  hdr(wsIS, isRow, 1, "COST OF SALES (Variable)", BLUE_HDR); isRow++;
  const varOpexRows = results.opexRows.filter(r => fin.opexItems.find(i => i.item === r.item)?.isVariable);
  varOpexRows.forEach((r) => {
    const srcIdx = results.opexRows.indexOf(r);
    lbl(wsIS, isRow, 1, r.item);
    for (let yr = 0; yr < n; yr++) {
      f(wsIS, isRow, 2 + yr, `=${R("Operating expenses", opexDataStart + srcIdx, 5 + yr)}`,
        r.values[yr] ?? 0, false, INT_FMT);
    }
    isRow++;
  });
  const isCogsRow = isRow;
  lbl(wsIS, isCogsRow, 1, "Total Cost of Sales");
  for (let yr = 0; yr < n; yr++) {
    tot(wsIS, isCogsRow, 2 + yr,
      `=SUM(${RNG(isCogsRow - varOpexRows.length, 2 + yr, isCogsRow - 1, 2 + yr)})`,
      results.incomeStatement.totalCostOfSales[yr] ?? 0);
  }
  isRow++;

  const isGrossRow = isRow;
  lbl(wsIS, isGrossRow, 1, "Gross Margin");
  for (let yr = 0; yr < n; yr++) {
    tot(wsIS, isGrossRow, 2 + yr, `=${A(isTotRevRow,2+yr)}-${A(isCogsRow,2+yr)}`,
      results.incomeStatement.grossMargin[yr] ?? 0);
  }
  isRow++;

  hdr(wsIS, isRow, 1, "SALARIES & WAGES", BLUE_HDR); isRow++;
  staff.forEach((s, i) => {
    lbl(wsIS, isRow, 1, s.role);
    for (let yr = 0; yr < n; yr++) {
      f(wsIS, isRow, 2 + yr, `=${R("Staff", staffDataStart + i, 12 + yr)}`,
        results.staffRows[i].annualSalary, false, INT_FMT);
    }
    isRow++;
  });
  const isSalRow = isRow;
  lbl(wsIS, isSalRow, 1, "Total Salaries");
  for (let yr = 0; yr < n; yr++) {
    tot(wsIS, isSalRow, 2 + yr, `=${STAFF_Y[yr]}`, results.annualSalaries);
  }
  isRow++;

  hdr(wsIS, isRow, 1, "FIXED OPERATING EXPENSES", BLUE_HDR); isRow++;
  const fixedOpexRows = results.opexRows.filter(r => !fin.opexItems.find(i => i.item === r.item)?.isVariable);
  fixedOpexRows.forEach((r) => {
    const srcIdx = results.opexRows.indexOf(r);
    lbl(wsIS, isRow, 1, r.item);
    for (let yr = 0; yr < n; yr++) {
      f(wsIS, isRow, 2 + yr, `=${R("Operating expenses", opexDataStart + srcIdx, 5 + yr)}`,
        r.values[yr] ?? 0, false, INT_FMT);
    }
    isRow++;
  });
  const isFixedRow = isRow;
  lbl(wsIS, isFixedRow, 1, "Total Fixed Expenses");
  for (let yr = 0; yr < n; yr++) {
    tot(wsIS, isFixedRow, 2 + yr,
      `=SUM(${RNG(isFixedRow - fixedOpexRows.length, 2 + yr, isFixedRow - 1, 2 + yr)})`,
      results.incomeStatement.totalFixedExpenses[yr] ?? 0);
  }
  isRow++;

  const isLoanRow = isRow;
  lbl(wsIS, isLoanRow, 1, "Commercial Loan (annual)");
  for (let yr = 0; yr < n; yr++) {
    v(wsIS, isLoanRow, 2 + yr, results.incomeStatement.commercialLoan[yr] ?? 0, false, INT_FMT);
  }
  isRow++;

  const isTotExpRow = isRow;
  lbl(wsIS, isTotExpRow, 1, "Total Expenses");
  for (let yr = 0; yr < n; yr++) {
    tot(wsIS, isTotExpRow, 2 + yr,
      `=${A(isSalRow,2+yr)}+${A(isFixedRow,2+yr)}+${A(isLoanRow,2+yr)}`,
      results.incomeStatement.totalExpenses[yr] ?? 0);
  }
  isRow++;

  const isNetBTRow = isRow;
  lbl(wsIS, isNetBTRow, 1, "Net Income Before Tax");
  for (let yr = 0; yr < n; yr++) {
    tot(wsIS, isNetBTRow, 2 + yr, `=${A(isTotRevRow,2+yr)}-${A(isTotExpRow,2+yr)}`,
      results.incomeStatement.netIncomeBeforeTax[yr] ?? 0);
  }
  isRow++;

  const isCITRow = isRow;
  lbl(wsIS, isCITRow, 1, `CIT (rate from ${I(INP.citRate)})`);
  for (let yr = 0; yr < n; yr++) {
    f(wsIS, isCITRow, 2 + yr,
      `=MAX(0,${A(isNetBTRow,2+yr)})*${I(INP.citRate)}`,
      results.incomeStatement.cit[yr] ?? 0, false, INT_FMT);
  }
  isRow++;

  const isNetATRow = isRow;
  lbl(wsIS, isNetATRow, 1, "Net Income After Tax");
  for (let yr = 0; yr < n; yr++) {
    tot(wsIS, isNetATRow, 2 + yr, `=${A(isNetBTRow,2+yr)}-${A(isCITRow,2+yr)}`,
      results.incomeStatement.netIncomeAfterTax[yr] ?? 0);
  }

  const IS_NET_BT = Array.from({ length: n }, (_, yr) => R("Income Statement", isNetBTRow, 2 + yr));
  const IS_CIT    = Array.from({ length: n }, (_, yr) => R("Income Statement", isCITRow,   2 + yr));

  // ══════════════════════════════════════════════════════════════════
  // SHEET 9 — NPV & IRR
  // ══════════════════════════════════════════════════════════════════
  const wsNPV = wb.addWorksheet("NPV");
  wsNPV.columns = [{ width: 35 }, { width: 18 }, ...yCols(n, 18)];
  title(wsNPV, 1, 1, `Net Present Value & IRR  (Discount rate → ${I(INP.discountRate)})`);
  year0Headers(wsNPV, 2, n, "Metric", startYear);

  lbl(wsNPV, 3, 1, `Initial Investment (= -${R("CAPEX", capexTotalRow, 4)})`);
  f(wsNPV,   3, 2, `=-${CAPEX_TOTAL}`, -results.capexTotal, false, INT_FMT);

  lbl(wsNPV, 4, 1, "Revenue (linked → Revenue sheet)");
  for (let yr = 0; yr < n; yr++) f(wsNPV, 4, 3 + yr, `=${REV_Y[yr]}`, revTotals[yr] ?? 0, false, INT_FMT);

  lbl(wsNPV, 5, 1, "Total Expenses (linked → Income Statement)");
  for (let yr = 0; yr < n; yr++) {
    f(wsNPV, 5, 3 + yr, `=${R("Income Statement", isTotExpRow, 2 + yr)}`,
      results.incomeStatement.totalExpenses[yr] ?? 0, false, INT_FMT);
  }

  lbl(wsNPV, 6, 1, "Net Cash Flow (= Revenue - Expenses)");
  f(wsNPV,   6, 2, `=${A(3,2)}`, -results.capexTotal, false, INT_FMT);
  for (let yr = 0; yr < n; yr++) {
    f(wsNPV, 6, 3 + yr, `=${A(4,3+yr)}-${A(5,3+yr)}`, results.npv.netCashFlow[yr] ?? 0, false, INT_FMT);
  }

  lbl(wsNPV, 7, 1, `Present Value  ÷(1+${I(INP.discountRate)})^year`);
  for (let yr = 0; yr < n; yr++) {
    f(wsNPV, 7, 3 + yr, `=${A(6,3+yr)}/(1+${I(INP.discountRate)})^${yr+1}`,
      results.npv.pv[yr] ?? 0, false, INT_FMT);
  }

  lbl(wsNPV, 9, 1, `NPV Total  =NPV(rate,Y1:Y${n})+Y0`);
  f(wsNPV,   9, 2,
    `=NPV(${I(INP.discountRate)},${RNG(6,3,6,2+n)})+${A(6,2)}`,
    results.npv.npvTotal, true, INT_FMT
  );
  wsNPV.getCell(9, 3).value = `← Uses Excel NPV function with discount rate from ${I(INP.discountRate)}`;

  lbl(wsNPV, 10, 1, `IRR  =IRR(Y0:Y${n})`);
  f(wsNPV,   10, 2, `=IRR(${RNG(6,2,6,2+n)})`, results.npv.irr, true, PCT_FMT);
  wsNPV.getCell(10, 3).value = "← Uses Excel IRR function on net cash flow row";

  // ══════════════════════════════════════════════════════════════════
  // SHEET 10 — CBA
  // ══════════════════════════════════════════════════════════════════
  const wsCBA = wb.addWorksheet("CBA");
  wsCBA.columns = [{ width: 30 }, ...yCols(n, 20)];
  title(wsCBA, 1, 1, `Cost-Benefit Analysis  (Discount rate → ${I(INP.discountRate)})`);
  yearHeaders(wsCBA, 2, n, "Description", startYear);

  lbl(wsCBA, 3, 1, "PV of Benefits (Revenue discounted)");
  lbl(wsCBA, 4, 1, "PV of Costs (OPEX discounted)");
  lbl(wsCBA, 5, 1, "B/C Ratio  =PV_Benefit / PV_Cost");
  for (let yr = 0; yr < n; yr++) {
    f(wsCBA, 3, 2 + yr, `=${REV_Y[yr]}/(1+${I(INP.discountRate)})^${yr+1}`,
      results.cba.pvBenefit[yr] ?? 0, false, NUM_FMT);
    f(wsCBA, 4, 2 + yr, `=${OPEX_Y[yr]}/(1+${I(INP.discountRate)})^${yr+1}`,
      results.cba.pvCost[yr] ?? 0, false, NUM_FMT);
    f(wsCBA, 5, 2 + yr, `=IF(${A(4,2+yr)}=0,0,${A(3,2+yr)}/${A(4,2+yr)})`,
      results.cba.bcRatio[yr] ?? 0, true, "0.00");
  }

  // ══════════════════════════════════════════════════════════════════
  // SHEET 11 — Payback Period
  // ══════════════════════════════════════════════════════════════════
  const wsPB = wb.addWorksheet("Payback");
  wsPB.columns = [{ width: 28 }, { width: 18 }, ...yCols(n, 18)];
  title(wsPB, 1, 1, "Payback Period Analysis");
  year0Headers(wsPB, 2, n, "Metric", startYear);

  lbl(wsPB, 3, 1, "Net Cash Flow (linked → Cash Flow sheet)");
  f(wsPB,   3, 2, `=-${CAPEX_TOTAL}`, -results.capexTotal, false, INT_FMT);
  for (let yr = 0; yr < n; yr++) {
    f(wsPB, 3, 3 + yr, `=${CF_NET_Y[yr]}`, results.cashFlow.netCashFlow[yr] ?? 0, false, INT_FMT);
  }

  lbl(wsPB, 4, 1, "Cumulative Cash Flow");
  f(wsPB,   4, 2, `=${A(3,2)}`, -results.capexTotal, false, INT_FMT);
  for (let yr = 0; yr < n; yr++) {
    f(wsPB, 4, 3 + yr,
      `=${A(4,2+yr)}+${A(3,3+yr)}`,
      results.payback.cumulatedCashFlow[yr] ?? 0,
      yr % 2 === 0, INT_FMT
    );
  }

  lbl(wsPB, 6, 1, "Payback Period (Years)");
  f(wsPB,   6, 2,
    `=IF(${A(4,2+n)}<0,">${n} years",IFERROR(MATCH(0,${RNG(4,2,4,2+n)},1),0))`,
    results.payback.years, true
  );
  lbl(wsPB, 7, 1, "Payback Period (Months)");
  f(wsPB,   7, 2, `=IFERROR(${A(6,2)}*12,"N/A")`, results.payback.months, true, "0.0");
  lbl(wsPB, 8, 1, "Payback Period (Days)");
  f(wsPB,   8, 2, `=IFERROR(${A(6,2)}*365,"N/A")`, results.payback.days, true, "0.0");

  // ══════════════════════════════════════════════════════════════════
  // SHEET 12 — Government Revenue
  // ══════════════════════════════════════════════════════════════════
  const wsGoR = wb.addWorksheet("Gov Revenue");
  wsGoR.columns = [{ width: 32 }, ...yCols(n, 20)];
  title(wsGoR, 1, 1, `Estimated Government Revenue Generated — ${n} Years`);
  yearHeaders(wsGoR, 2, n, `All figures (${cur})`, startYear);

  lbl(wsGoR, 3, 1, `Corporate Income Tax (CIT @ ${I(INP.citRate)})`);
  lbl(wsGoR, 4, 1, `Income Tax on Labor (from Staff sheet)`);
  lbl(wsGoR, 5, 1, `Social Security / Pension (from Staff @ ${I(INP.rssbRate)})`);
  lbl(wsGoR, 6, 1, "Total Government Revenue");
  wsGoR.getCell(6, 1).font = TOTAL_FONT;

  for (let yr = 0; yr < n; yr++) {
    f(wsGoR,   3, 2 + yr, `=${IS_CIT[yr]}`, results.gorRevenue.cit[yr] ?? 0, false, INT_FMT);
    f(wsGoR,   4, 2 + yr, `=${R("Staff",staffTotalRow,10)}*12`, results.gorRevenue.incomeTaxLabor[yr] ?? 0, false, INT_FMT);
    f(wsGoR,   5, 2 + yr, `=${R("Staff",staffTotalRow,6)}*12`,  results.gorRevenue.rssb[yr] ?? 0, false, INT_FMT);
    tot(wsGoR, 6, 2 + yr, `=SUM(${RNG(3,2+yr,5,2+yr)})`, results.gorRevenue.total[yr] ?? 0);
  }

  // ══════════════════════════════════════════════════════════════════
  // SHEET 13 — P&L Summary
  // ══════════════════════════════════════════════════════════════════
  const wsPL = wb.addWorksheet("P&L");
  wsPL.columns = [{ width: 32 }, ...yCols(n, 20)];
  title(wsPL, 1, 1, "Profit & Loss Summary");
  yearHeaders(wsPL, 2, n, "Category", startYear);

  lbl(wsPL, 3, 1, "Annual Revenue");
  lbl(wsPL, 4, 1, "Operating Expenses (OPEX + Staff)");
  lbl(wsPL, 5, 1, "Gross Operating Profit");
  for (let yr = 0; yr < n; yr++) {
    f(wsPL,   3, 2 + yr, `=${REV_Y[yr]}`,  revTotals[yr] ?? 0, false, INT_FMT);
    f(wsPL,   4, 2 + yr, `=${OPEX_Y[yr]}+${STAFF_Y[yr]}`,
      (results.totalOpex[yr] ?? 0) + results.annualSalaries, false, INT_FMT);
    tot(wsPL, 5, 2 + yr, `=${A(3,2+yr)}-${A(4,2+yr)}`, results.pnl.grossRevenue[yr] ?? 0);
  }

  // ══════════════════════════════════════════════════════════════════
  // SHEET 14 — CRR
  // ══════════════════════════════════════════════════════════════════
  const wsCRR = wb.addWorksheet("CRR");
  wsCRR.columns = [{ width: 30 }, ...yCols(n, 20)];
  title(wsCRR, 1, 1, "Cost-Revenue Ratio (CRR = Revenue ÷ OPEX)");
  yearHeaders(wsCRR, 2, n, "Metric", startYear);

  lbl(wsCRR, 3, 1, "Total Revenue");
  lbl(wsCRR, 4, 1, "Total Operating Expenses (OPEX)");
  lbl(wsCRR, 5, 1, "CRR  =Revenue / OPEX");
  for (let yr = 0; yr < n; yr++) {
    f(wsCRR, 3, 2 + yr, `=${REV_Y[yr]}`,  revTotals[yr] ?? 0, false, INT_FMT);
    f(wsCRR, 4, 2 + yr, `=${OPEX_Y[yr]}`, results.totalOpex[yr] ?? 0, false, INT_FMT);
    f(wsCRR, 5, 2 + yr, `=IF(${A(4,2+yr)}=0,0,${A(3,2+yr)}/${A(4,2+yr)})`,
      results.crr.crr[yr] ?? 0, true, "0.00");
  }

  // ══════════════════════════════════════════════════════════════════
  // SHEET 15 — Balance Sheet
  // ══════════════════════════════════════════════════════════════════
  const wsBS = wb.addWorksheet("Balance Sheet");
  wsBS.columns = [{ width: 40 }, ...yCols(n, 20)];
  title(wsBS, 1, 1, `${ci.companyName || "Company"} — Proforma Balance Sheet`);
  yearHeaders(wsBS, 2, n, "Category", startYear);

  let bsR = 3;
  const BS = results.balanceSheet;
  const bsRow = (label: string, yVals: number[], isTotal = false, isHdr = false) => {
    if (isHdr) {
      hdr(wsBS, bsR, 1, label, BLUE_HDR);
      for (let i = 1; i <= n; i++) hdr(wsBS, bsR, 1 + i, "", BLUE_HDR);
    } else {
      lbl(wsBS, bsR, 1, label);
    }
    if (!isHdr) {
      for (let yr = 0; yr < n; yr++) v(wsBS, bsR, 2 + yr, yVals[yr] ?? 0, isTotal, INT_FMT);
    }
    bsR++;
  };

  bsRow("CURRENT ASSETS", [], false, true);
  bsRow("Cash and Cash Equivalents", BS.cashAndEquivalents);
  bsRow("Accounts Receivable",       BS.accountsReceivable);
  bsRow("Inventory",                 BS.inventory);
  bsRow("Prepaid Expenses",          BS.prepaidExpenses);
  const bsCAStart = bsR - 4; const bsCAEnd = bsR - 1;
  bsRow("Total Current Assets",      BS.totalCurrentAssets, true);
  for (let yr = 0; yr < n; yr++) {
    f(wsBS, bsR - 1, 2 + yr, `=SUM(${RNG(bsCAStart,2+yr,bsCAEnd,2+yr)})`,
      BS.totalCurrentAssets[yr] ?? 0, true, INT_FMT);
  }

  bsRow("NON-CURRENT ASSETS", [], false, true);
  bsRow("Property, Plant & Equipment", BS.ppe);
  bsRow("Software / Technology Dev",   BS.softwareDev);
  const bsNCAStart = bsR - 2; const bsNCAEnd = bsR - 1;
  bsRow("Total Non-Current Assets",    BS.totalNonCurrentAssets, true);
  for (let yr = 0; yr < n; yr++) {
    f(wsBS, bsR - 1, 2 + yr, `=SUM(${RNG(bsNCAStart,2+yr,bsNCAEnd,2+yr)})`,
      BS.totalNonCurrentAssets[yr] ?? 0, true, INT_FMT);
  }

  bsRow("TOTAL ASSETS", BS.totalAssets, true);
  // bsR-6 = Total Current Assets row, bsR-2 = Total Non-Current Assets row
  for (let yr = 0; yr < n; yr++) {
    f(wsBS, bsR - 1, 2 + yr, `=${A(bsR-6,2+yr)}+${A(bsR-2,2+yr)}`,
      BS.totalAssets[yr] ?? 0, true, INT_FMT);
  }

  bsRow("LIABILITIES", [], false, true);
  bsRow("Accounts Payable",  BS.accountsPayable);
  bsRow("Commercial Loan",   BS.commercialLoan);
  bsRow("Deferred Revenue",  BS.deferredRevenue);
  const bsLiabStart = bsR - 3; const bsLiabEnd = bsR - 1;
  bsRow("Total Liabilities", BS.totalLiabilities, true);
  for (let yr = 0; yr < n; yr++) {
    f(wsBS, bsR - 1, 2 + yr, `=SUM(${RNG(bsLiabStart,2+yr,bsLiabEnd,2+yr)})`,
      BS.totalLiabilities[yr] ?? 0, true, INT_FMT);
  }

  bsRow("EQUITY", [], false, true);
  bsRow("Founder Capital",   BS.founderCapital);
  bsRow("Retained Earnings", BS.retainedEarnings);
  const bsEqStart = bsR - 2; const bsEqEnd = bsR - 1;
  bsRow("Total Equity",      BS.totalEquity, true);
  for (let yr = 0; yr < n; yr++) {
    f(wsBS, bsR - 1, 2 + yr, `=SUM(${RNG(bsEqStart,2+yr,bsEqEnd,2+yr)})`,
      BS.totalEquity[yr] ?? 0, true, INT_FMT);
  }

  bsRow("TOTAL LIABILITIES + EQUITY", BS.totalLiabilitiesAndEquity, true);

  // ══════════════════════════════════════════════════════════════════
  // SHEET 16 — Break-Even Analysis
  // ══════════════════════════════════════════════════════════════════
  const wsBEP = wb.addWorksheet("Break-Even");
  wsBEP.columns = [{ width: 40 }, { width: 22 }, { width: 40 }];
  title(wsBEP, 1, 1, "Break-Even Point Analysis");
  ["Parameter", `Value (${cur})`, "Source / Formula"].forEach((h, i) => hdr(wsBEP, 2, 1 + i, h));

  lbl(wsBEP, 3, 1, `Fixed Cost (CAPEX) → ${CAPEX_TOTAL}`);
  f(wsBEP,   3, 2, `=${CAPEX_TOTAL}`, results.breakEven.fixedCost, false, INT_FMT);

  lbl(wsBEP, 4, 1, "Selling Price Per Unit");
  v(wsBEP,   4, 2, results.breakEven.sellingPricePerUnit, false, INT_FMT);
  wsBEP.getCell(4, 3).value = "From first Product Sale revenue package";

  lbl(wsBEP, 5, 1, "Variable Cost Per Unit");
  v(wsBEP,   5, 2, results.breakEven.variableCostPerUnit, false, INT_FMT);
  wsBEP.getCell(5, 3).value = "Unit manufacturing cost from Products sheet";

  lbl(wsBEP, 6, 1, "Break-Even Units  =Fixed÷(Selling−Variable)");
  f(wsBEP,   6, 2,
    `=IF(${A(4,2)}-${A(5,2)}<=0,"N/A",${A(3,2)}/(${A(4,2)}-${A(5,2)}))`,
    results.breakEven.bepUnits, true, "0.00"
  );
  wsBEP.getCell(6, 3).value = `=B3/(B4-B5)`;

  lbl(wsBEP, 7, 1, "Break-Even Sales Value  =BEP_Units × Selling Price");
  f(wsBEP,   7, 2,
    `=IF(ISNUMBER(${A(6,2)}),${A(6,2)}*${A(4,2)},0)`,
    results.breakEven.bepSalesValue, true, INT_FMT
  );
  wsBEP.getCell(7, 3).value = `=B6*B4`;

  // ══════════════════════════════════════════════════════════════════
  // SHEET 17 — Loan Amortization
  // ══════════════════════════════════════════════════════════════════
  const wsLoan = wb.addWorksheet("Loan Amortization");
  wsLoan.columns = [{ width: 8 }, { width: 22 }, { width: 22 }, { width: 22 }, { width: 22 }];
  title(wsLoan, 1, 1, `Loan Amortization Schedule  (parameters → ${I(INP.loanAmount)} / ${I(INP.loanRate)} / ${I(INP.loanTerm)})`);

  lbl(wsLoan, 2, 1, "Loan Amount");
  f(wsLoan,   2, 2, `=${I(INP.loanAmount)}`, fin.loan.amount, false, INT_FMT);
  lbl(wsLoan, 3, 1, "Annual Interest Rate");
  f(wsLoan,   3, 2, `=${I(INP.loanRate)}`,   fin.loan.annualInterestRate, false, PCT_FMT);
  lbl(wsLoan, 4, 1, "Term (Years)");
  f(wsLoan,   4, 2, `=${I(INP.loanTerm)}`,   fin.loan.termYears);
  lbl(wsLoan, 5, 1, "Monthly Payment  =PMT(rate/12,term×12,-amount)");
  f(wsLoan,   5, 2,
    `=IF(${I(INP.loanAmount)}=0,0,PMT(${I(INP.loanRate)}/12,${I(INP.loanTerm)}*12,-${I(INP.loanAmount)}))`,
    results.loanAmortization.monthlyPayment, true, INT_FMT
  );

  [`Month`, `Payment (${cur})`, `Principal (${cur})`, `Interest (${cur})`, `Remaining Balance (${cur})`]
    .forEach((h, i) => hdr(wsLoan, 7, 1 + i, h));

  const RATE_REF = `${I(INP.loanRate)}/12`;

  results.loanAmortization.schedule.slice(0, 60).forEach((row, i) => {
    const r = 9 + i;
    v(wsLoan, r, 1, row.month);
    f(wsLoan, r, 2, `=${A(5,2)}`, row.payment, false, INT_FMT);
    const prevBal = i === 0 ? `$B$2` : A(r - 1, 5);
    f(wsLoan, r, 4, `=${prevBal}*${RATE_REF}`, row.interest, false, INT_FMT);
    f(wsLoan, r, 3, `=${A(r,2)}-${A(r,4)}`,    row.principal, i % 2 === 0, INT_FMT);
    f(wsLoan, r, 5, `=MAX(0,${prevBal}-${A(r,3)})`, row.balance, false, INT_FMT);
  });

  // ══════════════════════════════════════════════════════════════════
  // SHEET 18 — EBCR
  // ══════════════════════════════════════════════════════════════════
  const wsEBCR = wb.addWorksheet("EBCR");
  wsEBCR.columns = [{ width: 32 }, ...yCols(n, 20)];
  title(wsEBCR, 1, 1, "Earnings & Cost Ratio Summary");
  yearHeaders(wsEBCR, 2, n, "Metric", startYear);

  lbl(wsEBCR, 3, 1, "Total Revenue");
  lbl(wsEBCR, 4, 1, "Total Operating Expenses");
  lbl(wsEBCR, 5, 1, "Net Income Before Tax");
  for (let yr = 0; yr < n; yr++) {
    f(wsEBCR, 3, 2 + yr, `=${REV_Y[yr]}`,    revTotals[yr] ?? 0, false, INT_FMT);
    f(wsEBCR, 4, 2 + yr, `=${OPEX_Y[yr]}`,   results.totalOpex[yr] ?? 0, false, INT_FMT);
    f(wsEBCR, 5, 2 + yr, `=${IS_NET_BT[yr]}`, results.incomeStatement.netIncomeBeforeTax[yr] ?? 0, true, INT_FMT);
  }

  // ══════════════════════════════════════════════════════════════════
  // Workbook tab colours
  // ══════════════════════════════════════════════════════════════════
  const sheetColors: [ExcelJS.Worksheet, string][] = [
    [wsInp,   "FFF3CD"],
    [wsCX,    "D6EAF8"],
    [wsProd,  "D5F5E3"],
    [wsStaff, "EBF5FB"],
    [wsOPEX,  "FEF9E7"],
    [wsRev,   "E8F8F5"],
    [wsSF,    "E8F8F5"],
    [wsCF,    "EAF2FF"],
    [wsIS,    "F0FFF4"],
    [wsNPV,   "FDF2F8"],
    [wsCBA,   "FDF2F8"],
    [wsPB,    "FEF9E7"],
    [wsGoR,   "F9F9F9"],
    [wsPL,    "F0FFF4"],
    [wsCRR,   "F0FFF4"],
    [wsBS,    "EEF0F4"],
    [wsBEP,   "FFF5F5"],
    [wsLoan,  "F8F8F8"],
    [wsEBCR,  "F0FFF4"],
  ];
  sheetColors.forEach(([ws, col]) => {
    ws.getSheetValues;
    (ws as unknown as { tabColor?: { argb: string } }).tabColor = { argb: `FF${col}` };
  });

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
