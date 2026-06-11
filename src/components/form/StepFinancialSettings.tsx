"use client";
import { FormSubmission } from "@/types";
import { FormInput, SectionTitle, GridRow } from "./FormField";

interface Props {
  formData: Omit<FormSubmission, "userId">;
  update: <K extends keyof Omit<FormSubmission, "userId">>(key: K, value: Omit<FormSubmission, "userId">[K]) => void;
}

export default function StepFinancialSettings({ formData, update }: Props) {
  const fin = formData.financial;

  const setFin = <K extends keyof typeof fin>(key: K, val: typeof fin[K]) => {
    update("financial", { ...fin, [key]: val });
  };

  const setLoan = (key: keyof typeof fin.loan, val: number) => {
    update("financial", { ...fin, loan: { ...fin.loan, [key]: val } });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Configure global financial parameters used across all calculations.</p>

      <SectionTitle>Commercial Loan</SectionTitle>
      <GridRow cols={3}>
        <FormInput
          label="Loan Amount"
          type="number"
          value={fin.loan.amount}
          onChange={(v) => setLoan("amount", parseInt(v) || 0)}
          placeholder="0"
          hint={`Enter in ${formData.companyInfo.currency || "your currency"}`}
        />
        <FormInput
          label="Annual Interest Rate (%)"
          type="number"
          value={Math.round(fin.loan.annualInterestRate * 100)}
          onChange={(v) => setLoan("annualInterestRate", (parseInt(v) || 0) / 100)}
          placeholder="12"
        />
        <FormInput
          label="Loan Term (Years)"
          type="number"
          value={fin.loan.termYears}
          onChange={(v) => setLoan("termYears", parseInt(v) || 5)}
          placeholder="5"
        />
      </GridRow>

      <SectionTitle>Projection Period</SectionTitle>
      <GridRow cols={2}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Projection Years <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-400 mb-1">Enter how many years the financial projections should cover (e.g. 3, 5, 10, 20).</p>
          <input
            type="number"
            min={1}
            max={50}
            step={1}
            value={fin.projectionYears ?? 5}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (!isNaN(v) && v >= 1) setFin("projectionYears", v);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="5"
          />
          <p className="text-xs text-gray-400 mt-1">Financial model tables display up to 5 years; the narrative will reference the full projection period.</p>
        </div>
        <div />
      </GridRow>

      <SectionTitle>NPV &amp; Discount Rate</SectionTitle>
      <GridRow cols={2}>
        <FormInput
          label="Discount Rate for NPV & CBA (%)"
          type="number"
          value={Math.round(fin.discountRate * 100)}
          onChange={(v) => setFin("discountRate", (parseInt(v) || 12) / 100)}
          placeholder="12"
          hint="Typically 10–15% depending on the country risk and sector benchmark rate."
        />
        <FormInput
          label="Corporate Income Tax (CIT) Rate (%)"
          type="number"
          value={Math.round(fin.citRate * 100)}
          onChange={(v) => setFin("citRate", (parseInt(v) || 30) / 100)}
          placeholder="30"
          hint="Enter your jurisdiction's standard CIT rate (e.g. 30%, 25%, 20%)."
        />
      </GridRow>

      <SectionTitle>Payroll Contribution Rates</SectionTitle>
      <GridRow cols={3}>
        <FormInput
          label="Social Security / Pension Rate (%)"
          type="number"
          value={(fin.rssbRate * 100).toFixed(1)}
          onChange={(v) => setFin("rssbRate", parseFloat(v) / 100 || 0)}
          placeholder="5"
          hint="Employee social security or pension contribution rate."
        />
        <FormInput
          label="Health Insurance Rate (%)"
          type="number"
          value={(fin.healthInsuranceRate * 100).toFixed(1)}
          onChange={(v) => setFin("healthInsuranceRate", parseFloat(v) / 100 || 0)}
          placeholder="0"
        />
        <FormInput
          label="Other Payroll Deduction (%)"
          type="number"
          value={(fin.maternityRate * 100).toFixed(1)}
          onChange={(v) => setFin("maternityRate", parseFloat(v) / 100 || 0)}
          placeholder="0"
          hint="E.g. maternity/parental leave contribution."
        />
      </GridRow>

      <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-800">
        <strong>Note:</strong> Income tax on salaries is computed using progressive brackets. Adjust the payroll contribution rates above to match your country's statutory requirements. The Corporate Income Tax (CIT) rate applies only to positive net income before tax.
      </div>
    </div>
  );
}
