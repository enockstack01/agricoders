"use client";
import { FormSubmission, OpexItem } from "@/types";
import { AddButton, RemoveButton } from "./FormField";

interface Props {
  formData: Omit<FormSubmission, "userId">;
  update: <K extends keyof Omit<FormSubmission, "userId">>(key: K, value: Omit<FormSubmission, "userId">[K]) => void;
}

const fmt = (n: number) => n.toLocaleString("en-US");

export default function StepOpex({ formData, update }: Props) {
  const opex = formData.financial.opexItems;

  const updateItem = (i: number, key: keyof OpexItem, val: string | number | boolean) => {
    const arr = [...opex];
    if (key === "isVariable") arr[i] = { ...arr[i], isVariable: val as boolean };
    else if (key === "item") arr[i] = { ...arr[i], item: val as string };
    else arr[i] = { ...arr[i], [key]: Number(val) };
    update("financial", { ...formData.financial, opexItems: arr });
  };

  const addItem = () => {
    update("financial", { ...formData.financial, opexItems: [...opex, { item: "", monthlyAmount: 0, growthRate: 0, isVariable: false }] });
  };

  const removeItem = (i: number) => {
    update("financial", { ...formData.financial, opexItems: opex.filter((_, idx) => idx !== i) });
  };

  const totalMonthly = opex.reduce((s, o) => s + o.monthlyAmount, 0);
  const totalAnnual = totalMonthly * 12;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">List all operating expenses. Mark items as <strong>Variable</strong> if they grow with production (they'll appear as Cost of Sales). Fixed items stay constant each year.</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 text-sm">
          <strong>Total Monthly OPEX:</strong><br />{fmt(totalMonthly)} RWF
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm">
          <strong>Total Annual OPEX (Y1):</strong><br />{fmt(totalAnnual)} RWF
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="px-2 py-2 text-left font-semibold min-w-48">Cost Item</th>
              <th className="px-2 py-2 text-right font-semibold w-32">Monthly (RWF)</th>
              <th className="px-2 py-2 text-right font-semibold w-24">Growth %/yr</th>
              <th className="px-2 py-2 text-center font-semibold w-24">Variable?</th>
              <th className="px-2 py-2 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {opex.map((o, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-1.5">
                  <input
                    value={o.item}
                    onChange={(e) => updateItem(i, "item", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Expense item"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="number"
                    min={0}
                    value={o.monthlyAmount}
                    onChange={(e) => updateItem(i, "monthlyAmount", parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round(o.growthRate * 100)}
                    onChange={(e) => updateItem(i, "growthRate", (parseInt(e.target.value) || 0) / 100)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right"
                    placeholder="10"
                  />
                </td>
                <td className="px-2 py-1.5 text-center">
                  <input
                    type="checkbox"
                    checked={o.isVariable}
                    onChange={(e) => updateItem(i, "isVariable", e.target.checked)}
                    className="w-4 h-4 accent-green-600"
                  />
                </td>
                <td className="px-2 py-1.5 text-center">
                  <RemoveButton onClick={() => removeItem(i)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddButton onClick={addItem} label="Add expense item" />
    </div>
  );
}
