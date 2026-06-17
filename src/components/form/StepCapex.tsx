"use client";
import { FormSubmission, CapexItem } from "@/types";
import { SectionTitle, AddButton, RemoveButton } from "./FormField";

interface Props {
  formData: Omit<FormSubmission, "userId">;
  update: <K extends keyof Omit<FormSubmission, "userId">>(key: K, value: Omit<FormSubmission, "userId">[K]) => void;
}

const fmt = (n: number) => n.toLocaleString("en-US");

export default function StepCapex({ formData, update }: Props) {
  const capex = formData.financial.capex;

  const updateItem = (i: number, key: keyof CapexItem, val: string | number) => {
    const arr = [...capex];
    arr[i] = { ...arr[i], [key]: typeof arr[i][key] === "number" ? Number(val) : val };
    update("financial", { ...formData.financial, capex: arr });
  };

  const addItem = () => {
    update("financial", { ...formData.financial, capex: [...capex, { item: "", quantity: 1, costPerUnit: 0 }] });
  };

  const removeItem = (i: number) => {
    update("financial", { ...formData.financial, capex: capex.filter((_, idx) => idx !== i) });
  };

  const total = capex.reduce((s, c) => s + c.quantity * c.costPerUnit, 0);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Capital expenses are one-time investments in equipment and infrastructure. Also used as the initial investment for financial calculations.</p>

      <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-lg px-4 py-3 text-sm dark:text-green-300">
        <strong>Total CAPEX (Initial Investment):</strong> {fmt(total)} RWF
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="px-3 py-2 text-left font-semibold">Item</th>
              <th className="px-3 py-2 text-right font-semibold w-24">Qty</th>
              <th className="px-3 py-2 text-right font-semibold w-36">Cost/Unit (RWF)</th>
              <th className="px-3 py-2 text-right font-semibold w-36">Total (RWF)</th>
              <th className="px-3 py-2 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {capex.map((c, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"}>
                <td className="px-2 py-1.5">
                  <input
                    value={c.item}
                    onChange={(e) => updateItem(i, "item", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Item name"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="number"
                    min={0}
                    value={c.quantity}
                    onChange={(e) => updateItem(i, "quantity", parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="number"
                    min={0}
                    value={c.costPerUnit}
                    onChange={(e) => updateItem(i, "costPerUnit", parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right"
                  />
                </td>
                <td className="px-3 py-1.5 text-right font-medium text-gray-700">{fmt(c.quantity * c.costPerUnit)}</td>
                <td className="px-2 py-1.5 text-center">
                  <RemoveButton onClick={() => removeItem(i)} />
                </td>
              </tr>
            ))}
            <tr className="bg-green-50 dark:bg-green-900/10 font-semibold">
              <td colSpan={3} className="px-3 py-2 text-right">Total</td>
              <td className="px-3 py-2 text-right text-green-700 dark:text-green-400">{fmt(total)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <AddButton onClick={addItem} label="Add CAPEX item" />
    </div>
  );
}
