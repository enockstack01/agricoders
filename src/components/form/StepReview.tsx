"use client";
import { FormSubmission } from "@/types";
import { computeFinancials } from "@/lib/calculations";

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
      <p className="text-sm text-gray-500">
        Review the computed financial summary below. When ready, click <strong>Submit &amp; Generate Documents</strong> to save your data. You can then download your Business Plan (.docx) and Financial Model (.xlsx) from the dashboard.
      </p>

      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
        <h3 className="font-semibold text-green-800 mb-4 text-sm">Financial Summary Preview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {summaryItems.map((item) => (
            <div key={item.label} className="bg-white rounded-lg p-3 border border-green-100">
              <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
              <p className="font-semibold text-gray-900 text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">{n}-Year Revenue &amp; Income Projection ({cur})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Metric</th>
                {Array.from({ length: n }, (_, i) => (
                  <th key={i} className="px-3 py-2 text-right font-semibold text-gray-700">Year {i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Total Revenue", data: results.totalRevenue },
                { label: "Total OPEX", data: results.totalOpex },
                { label: "Net Income (After Tax)", data: results.incomeStatement.netIncomeAfterTax },
                { label: "Cash Balance", data: results.cashFlow.endingBalance },
              ].map((row) => (
                <tr key={row.label} className="border-t border-gray-100">
                  <td className="px-3 py-2 font-medium text-gray-700">{row.label}</td>
                  {Array.from({ length: n }, (_, i) => (
                    <td key={i} className={`px-3 py-2 text-right text-sm ${(row.data[i] ?? 0) < 0 ? "text-red-600" : "text-gray-900"}`}>
                      {fmt(row.data[i] ?? 0)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-700">
        <strong>What happens next:</strong> Your data will be saved. On the dashboard you can download:
        <ul className="mt-1 list-disc pl-4 space-y-0.5 text-xs">
          <li><strong>Business Plan (.docx)</strong> — Complete formatted Word document with all sections and financial tables</li>
          <li><strong>Financial Model (.xlsx)</strong> — Full Excel workbook with all calculations across 19 sheets</li>
        </ul>
      </div>

      <button
        onClick={onSubmit}
        disabled={submitting}
        className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm"
      >
        {submitting ? "Saving & Generating..." : "✅ Submit & Generate Documents"}
      </button>
    </div>
  );
}
