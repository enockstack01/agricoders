"use client";
import { FormSubmission } from "@/types";
import { computeFinancials } from "@/lib/calculations";
import { Loader2, CheckCircle2 } from "@/components/plan/icons";
import { DataTable, DataTableColumn } from "./FormField";

interface Props {
  formData: Omit<FormSubmission, "userId">;
  onSubmit: () => void;
  submitting: boolean;
}

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function StepReview({ formData, onSubmit, submitting }: Props) {
  const { companyInfo: ci, staff, financial: fin } = formData;
  const results = computeFinancials(fin, staff);
  const cur = ci.currency || "USD";
  const n = fin.projectionYears ?? 5;

  const hasProducts = results.productResults.length > 0;
  const lastIdx = results.totalRevenue.length - 1;

  // Year-by-year projection: metrics-as-rows, years-as-columns is naturally a
  // matrix rather than a simple row list. We treat each metric as a DataTable
  // "row" and each year as a column — this keeps the primitive's mobile
  // stacked-card fallback meaningful (metric name + a value per year, listed
  // vertically) instead of forcing a horizontally-scrolling wall of numbers.
  type ProjectionRow = { label: string; data: number[] };
  const projectionRows: ProjectionRow[] = [
    { label: "Total Revenue", data: results.totalRevenue },
    { label: "Total OPEX", data: results.totalOpex },
    { label: "Net Income (After Tax)", data: results.incomeStatement.netIncomeAfterTax },
    { label: "Cash Balance", data: results.cashFlow.endingBalance },
  ];
  const projectionColumns: DataTableColumn<ProjectionRow>[] = [
    {
      key: "metric",
      header: "Metric",
      cellClassName: "cell-primary",
      render: (row) => row.label,
    },
    ...Array.from({ length: n }, (_, i): DataTableColumn<ProjectionRow> => ({
      key: `year-${i}`,
      header: `Year ${i + 1}`,
      headClassName: "text-right",
      cellClassName: "text-right",
      render: (row) => (
        <span className={(row.data[i] ?? 0) < 0 ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-gray-100"}>
          {fmt(row.data[i] ?? 0)}
        </span>
      ),
    })),
  ];

  const summaryItems = [
    { label: "Company", value: ci.companyName || "—" },
    { label: "Product / Project", value: ci.productName || "—" },
    { label: "Author", value: ci.authorName || "—" },
    { label: "Location", value: ci.location || "—" },
    { label: "Industry", value: ci.companyFocus || "—" },
    { label: "Currency", value: cur },
    { label: "Staff Members", value: `${staff.reduce((s, m) => s + m.count, 0)} people` },
    { label: "Total Monthly Payroll", value: `${fmt(staff.reduce((s, m) => s + m.salaryPerEmployee * m.count, 0))} ${cur}` },
    { label: "Initial Investment (CAPEX)", value: `${fmt(results.capexTotal)} ${cur}` },
    ...(hasProducts
      ? results.productResults.map((pr) => ({ label: `Unit Cost: ${pr.name}`, value: `${fmt(Math.round(pr.unitCost))} ${cur}` }))
      : []),
    { label: "Annual OPEX (Y1)", value: `${fmt(results.totalOpex[0] ?? 0)} ${cur}` },
    { label: "Year 1 Revenue", value: `${fmt(results.totalRevenue[0] ?? 0)} ${cur}` },
    { label: `Year ${n} Revenue`, value: `${fmt(results.totalRevenue[lastIdx] ?? 0)} ${cur}` },
    { label: "Net Income After Tax (Y1)", value: `${fmt(results.incomeStatement.netIncomeAfterTax[0] ?? 0)} ${cur}` },
    { label: `Net Income After Tax (Y${n})`, value: `${fmt(results.incomeStatement.netIncomeAfterTax[lastIdx] ?? 0)} ${cur}` },
    { label: "Payback Period", value: results.payback.years > 0 ? `${results.payback.years.toFixed(2)} yrs (${results.payback.months.toFixed(1)} mo)` : "N/A" },
    { label: "IRR", value: `${(results.npv.irr * 100).toFixed(1)}%` },
    { label: "NPV Total", value: `${fmt(results.npv.npvTotal)} ${cur}` },
    { label: `B/C Ratio (Y${n})`, value: (results.cba.bcRatio[lastIdx] ?? 0).toFixed(2) },
    ...(hasProducts
      ? [{ label: "Break-Even (Units)", value: `${results.breakEven.bepUnits.toFixed(0)} units` }]
      : []),
  ];

  return (
    <div className="space-y-6">
      <p className="page-subtitle" style={{ marginTop: 0 }}>
        Review the computed financial summary below. When ready, click <strong>Submit &amp; Generate Documents</strong> to save your data. You can then download your Business Plan (.docx) and Financial Model (.xlsx) from the dashboard.
      </p>

      <div>
        <h3 className="form-section-title">Financial Summary Preview</h3>
        <div className="stat-grid" style={{ "--stat-min": "190px" } as React.CSSProperties}>
          {summaryItems.map((item) => (
            <div key={item.label} className="stat-tile" style={{ textAlign: "left", padding: "12px 14px" }}>
              <div className="stat-tile-label">{item.label}</div>
              <div className="cell-primary" style={{ overflowWrap: "anywhere" }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="form-section-title">{n}-Year Revenue &amp; Income Projection ({cur})</h3>
        <DataTable
          columns={projectionColumns}
          rows={projectionRows}
          rowKey={(row) => row.label}
        />
      </div>

      <div className="callout callout-warning p-4">
        <strong>What happens next:</strong> Your data will be saved. On the dashboard you can download:
        <ul className="mt-1 list-disc pl-4 space-y-0.5 text-xs">
          <li><strong>Business Plan (.docx)</strong> — Complete formatted Word document with all sections and financial tables</li>
          <li><strong>Financial Model (.xlsx)</strong> — Full Excel workbook with all calculations across 19 sheets</li>
        </ul>
      </div>

      <button onClick={onSubmit} disabled={submitting} className="btn btn-primary btn-lg btn-block">
        {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
        {submitting ? "Saving & Generating..." : "Submit & Generate Documents"}
      </button>
    </div>
  );
}
