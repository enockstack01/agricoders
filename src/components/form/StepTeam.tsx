"use client";
import { FormSubmission, StaffMember } from "@/types";
import { SectionTitle, AddButton, RemoveButton, FormInput, FormTextArea, GridRow } from "./FormField";

interface Props {
  formData: Omit<FormSubmission, "userId">;
  update: <K extends keyof Omit<FormSubmission, "userId">>(key: K, value: Omit<FormSubmission, "userId">[K]) => void;
}

const fmt = (n: number) => n.toLocaleString("en-US");

export default function StepTeam({ formData, update }: Props) {
  const staff = formData.staff;

  const updateMember = (i: number, key: keyof StaffMember, val: string | number) => {
    const arr = [...staff];
    arr[i] = { ...arr[i], [key]: typeof arr[i][key] === "number" ? Number(val) : val };
    update("staff", arr);
  };

  const addMember = () => {
    update("staff", [...staff, { role: "", count: 1, responsibilities: "", salaryPerEmployee: 0 }]);
  };

  const removeMember = (i: number) => {
    update("staff", staff.filter((_, idx) => idx !== i));
  };

  const totalAnnualSalary = staff.reduce((s, m) => s + m.salaryPerEmployee * m.count * 12, 0);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Define your management team, their roles, counts, and monthly salaries. Payroll taxes and benefits will be calculated automatically.</p>

      <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-lg px-4 py-3 text-sm dark:text-green-300">
        <strong>Total Annual Payroll:</strong> {fmt(totalAnnualSalary)} RWF
        <span className="text-gray-500 dark:text-gray-400 ml-2">({staff.reduce((s, m) => s + m.count, 0)} staff members)</span>
      </div>

      {staff.map((m, i) => (
        <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Staff #{i + 1}</span>
            <RemoveButton onClick={() => removeMember(i)} />
          </div>
          <GridRow cols={2}>
            <FormInput
              label="Role / Title"
              value={m.role}
              onChange={(v) => updateMember(i, "role", v)}
              placeholder="e.g. Chief Executive Officer (CEO)"
            />
            <FormInput
              label="Number of Employees"
              type="number"
              value={m.count}
              onChange={(v) => updateMember(i, "count", parseInt(v) || 1)}
            />
            <div>
              <FormInput
                label="Monthly Salary Per Employee (RWF)"
                type="number"
                value={m.salaryPerEmployee}
                onChange={(v) => updateMember(i, "salaryPerEmployee", parseInt(v) || 0)}
                placeholder="2200000"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Annual: {fmt(m.salaryPerEmployee * m.count * 12)} RWF</p>
            </div>
            <FormTextArea
              label="Responsibilities"
              value={m.responsibilities}
              onChange={(v) => updateMember(i, "responsibilities", v)}
              rows={2}
              placeholder="Key responsibilities..."
            />
          </GridRow>
        </div>
      ))}

      <AddButton onClick={addMember} label="Add staff member" />

      <SectionTitle>Payroll Tax Rates (Pre-configured)</SectionTitle>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-sm space-y-1 text-gray-600 dark:text-gray-300">
        <p>• <strong>RSSB Pension:</strong> {(formData.financial.rssbRate * 100).toFixed(1)}% of gross salary</p>
        <p>• <strong>Employee Health Insurance:</strong> {(formData.financial.healthInsuranceRate * 100).toFixed(1)}% of gross salary</p>
        <p>• <strong>Maternity:</strong> {(formData.financial.maternityRate * 100).toFixed(1)}% of gross salary</p>
        <p>• <strong>Payroll Tax:</strong> Progressive rate (0%/10%/2%/30%) per RWF income brackets</p>
      </div>
    </div>
  );
}
