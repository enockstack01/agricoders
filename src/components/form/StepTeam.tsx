"use client";
import { FormSubmission, StaffMember } from "@/types";
import { SectionTitle, AddButton, RemoveButton } from "./FormField";

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

      <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 text-sm">
        <strong>Total Annual Payroll:</strong> {fmt(totalAnnualSalary)} RWF
        <span className="text-gray-500 ml-2">({staff.reduce((s, m) => s + m.count, 0)} staff members)</span>
      </div>

      {staff.map((m, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Staff #{i + 1}</span>
            <RemoveButton onClick={() => removeMember(i)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Role / Title</label>
              <input
                value={m.role}
                onChange={(e) => updateMember(i, "role", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. Chief Executive Officer (CEO)"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Number of Employees</label>
              <input
                type="number"
                min={1}
                value={m.count}
                onChange={(e) => updateMember(i, "count", parseInt(e.target.value) || 1)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Monthly Salary Per Employee (RWF)</label>
              <input
                type="number"
                min={0}
                value={m.salaryPerEmployee}
                onChange={(e) => updateMember(i, "salaryPerEmployee", parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="2200000"
              />
              <p className="text-xs text-gray-400 mt-1">Annual: {fmt(m.salaryPerEmployee * m.count * 12)} RWF</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Responsibilities</label>
              <textarea
                value={m.responsibilities}
                onChange={(e) => updateMember(i, "responsibilities", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                rows={2}
                placeholder="Key responsibilities..."
              />
            </div>
          </div>
        </div>
      ))}

      <AddButton onClick={addMember} label="Add staff member" />

      <SectionTitle>Payroll Tax Rates (Pre-configured)</SectionTitle>
      <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1 text-gray-600">
        <p>• <strong>RSSB Pension:</strong> {(formData.financial.rssbRate * 100).toFixed(1)}% of gross salary</p>
        <p>• <strong>Employee Health Insurance:</strong> {(formData.financial.healthInsuranceRate * 100).toFixed(1)}% of gross salary</p>
        <p>• <strong>Maternity:</strong> {(formData.financial.maternityRate * 100).toFixed(1)}% of gross salary</p>
        <p>• <strong>Payroll Tax:</strong> Progressive rate (0%/10%/2%/30%) per RWF income brackets</p>
      </div>
    </div>
  );
}
