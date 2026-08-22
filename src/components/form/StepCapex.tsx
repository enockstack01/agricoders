"use client";
import { FormSubmission, CapexItem } from "@/types";
import { AddButton, RemoveButton, DataTable, DataTableColumn } from "./FormField";

interface Props {
  formData: Omit<FormSubmission, "userId">;
  update: <K extends keyof Omit<FormSubmission, "userId">>(key: K, value: Omit<FormSubmission, "userId">[K]) => void;
}

const fmt = (n: number) => n.toLocaleString("en-US");

const cellInput =
  "w-full border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors";

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

  const columns: DataTableColumn<CapexItem>[] = [
    {
      key: "item",
      header: "Item",
      render: (c, i) => (
        <input
          value={c.item}
          onChange={(e) => updateItem(i, "item", e.target.value)}
          className={cellInput}
          placeholder="Item name"
        />
      ),
    },
    {
      key: "quantity",
      header: "Qty",
      headClassName: "text-right",
      cellClassName: "text-right",
      render: (c, i) => (
        <input
          type="number"
          min={0}
          value={c.quantity}
          onChange={(e) => updateItem(i, "quantity", parseInt(e.target.value) || 0)}
          className={`${cellInput} text-right`}
        />
      ),
    },
    {
      key: "costPerUnit",
      header: "Cost/Unit (RWF)",
      headClassName: "text-right",
      cellClassName: "text-right",
      render: (c, i) => (
        <input
          type="number"
          min={0}
          value={c.costPerUnit}
          onChange={(e) => updateItem(i, "costPerUnit", parseInt(e.target.value) || 0)}
          className={`${cellInput} text-right`}
        />
      ),
    },
    {
      key: "total",
      header: "Total (RWF)",
      headClassName: "text-right",
      cellClassName: "text-right font-medium text-gray-700 dark:text-gray-300",
      render: (c) => fmt(c.quantity * c.costPerUnit),
    },
    {
      key: "remove",
      header: "",
      cellClassName: "text-center",
      hideOnMobile: true,
      render: (_, i) => <RemoveButton onClick={() => removeItem(i)} />,
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Capital expenses are one-time investments in equipment and infrastructure. Also used as the initial investment for financial calculations.</p>

      <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-lg px-4 py-3 text-sm dark:text-green-300">
        <strong>Total CAPEX (Initial Investment):</strong> {fmt(total)} RWF
      </div>

      <DataTable
        columns={columns}
        rows={capex}
        rowKey={(_, i) => i}
        emptyMessage="No CAPEX items yet."
        mobileActions={(_, i) => <RemoveButton onClick={() => removeItem(i)} />}
      />

      <AddButton onClick={addItem} label="Add CAPEX item" />
    </div>
  );
}
