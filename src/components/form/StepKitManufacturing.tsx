"use client";
import { FormSubmission, KitComponent } from "@/types";
import { AddButton, RemoveButton } from "./FormField";

interface Props {
  formData: Omit<FormSubmission, "userId">;
  update: <K extends keyof Omit<FormSubmission, "userId">>(key: K, value: Omit<FormSubmission, "userId">[K]) => void;
}

const fmt = (n: number) => n.toLocaleString("en-US");

export default function StepKitManufacturing({ formData, update }: Props) {
  const components = formData.financial.kitComponents ?? [];

  const updateComp = (i: number, key: keyof KitComponent, val: string | number) => {
    const arr = [...components];
    arr[i] = { ...arr[i], [key]: typeof arr[i][key] === "number" ? Number(val) : val };
    update("financial", { ...formData.financial, kitComponents: arr });
  };

  const addComp = () => {
    update("financial", { ...formData.financial, kitComponents: [...components, { item: "", quantity: 10, costPerUnit: 0 }] });
  };

  const removeComp = (i: number) => {
    update("financial", { ...formData.financial, kitComponents: components.filter((_, idx) => idx !== i) });
  };

  const totalCost = components.reduce((s, c) => s + c.quantity * c.costPerUnit, 0);
  const unitCost = components[0]?.quantity ? totalCost / components[0].quantity : 0;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">List the components used to manufacture one IoT Smart Kit batch. Typical batch size is 10 units.</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 text-sm">
          <strong>Total Cost (batch):</strong><br />{fmt(totalCost)} RWF
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm">
          <strong>Cost Per Unit (avg):</strong><br />{fmt(unitCost)} RWF
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="px-3 py-2 text-left font-semibold">Component</th>
              <th className="px-3 py-2 text-right font-semibold w-24">Qty</th>
              <th className="px-3 py-2 text-right font-semibold w-36">Cost/Unit (RWF)</th>
              <th className="px-3 py-2 text-right font-semibold w-36">Total (RWF)</th>
              <th className="px-3 py-2 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {components.map((c, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-2 py-1.5">
                  <input
                    value={c.item}
                    onChange={(e) => updateComp(i, "item", e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="Component name"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="number"
                    min={0}
                    value={c.quantity}
                    onChange={(e) => updateComp(i, "quantity", parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right"
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="number"
                    min={0}
                    value={c.costPerUnit}
                    onChange={(e) => updateComp(i, "costPerUnit", parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-right"
                  />
                </td>
                <td className="px-3 py-1.5 text-right font-medium">{fmt(c.quantity * c.costPerUnit)}</td>
                <td className="px-2 py-1.5 text-center">
                  <RemoveButton onClick={() => removeComp(i)} />
                </td>
              </tr>
            ))}
            <tr className="bg-green-50 font-semibold">
              <td colSpan={3} className="px-3 py-2 text-right">Grand Total</td>
              <td className="px-3 py-2 text-right text-green-700">{fmt(totalCost)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <AddButton onClick={addComp} label="Add component" />
    </div>
  );
}
