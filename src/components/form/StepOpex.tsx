"use client";
import { FormSubmission, OpexItem } from "@/types";
import { AddButton, RemoveButton, FormCheckbox, DataTable, DataTableColumn } from "./FormField";

interface Props {
  formData: Omit<FormSubmission, "userId">;
  update: <K extends keyof Omit<FormSubmission, "userId">>(key: K, value: Omit<FormSubmission, "userId">[K]) => void;
}

const fmt = (n: number) => n.toLocaleString("en-US");

const cellInput =
  "w-full border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors";

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

  const columns: DataTableColumn<OpexItem>[] = [
    {
      key: "item",
      header: "Cost Item",
      render: (o, i) => (
        <input
          value={o.item}
          onChange={(e) => updateItem(i, "item", e.target.value)}
          className={cellInput}
          placeholder="Expense item"
        />
      ),
    },
    {
      key: "monthlyAmount",
      header: "Monthly (RWF)",
      headClassName: "text-right",
      cellClassName: "text-right",
      render: (o, i) => (
        <input
          type="number"
          min={0}
          value={o.monthlyAmount}
          onChange={(e) => updateItem(i, "monthlyAmount", parseInt(e.target.value) || 0)}
          className={`${cellInput} text-right`}
        />
      ),
    },
    {
      key: "growthRate",
      header: "Growth %/yr",
      headClassName: "text-right",
      cellClassName: "text-right",
      render: (o, i) => (
        <input
          type="number"
          min={0}
          max={100}
          step={1}
          value={Math.round(o.growthRate * 100)}
          onChange={(e) => updateItem(i, "growthRate", (parseInt(e.target.value) || 0) / 100)}
          className={`${cellInput} text-right`}
          placeholder="10"
        />
      ),
    },
    {
      key: "isVariable",
      header: "Variable?",
      headClassName: "text-center",
      cellClassName: "text-center",
      render: (o, i) => (
        <FormCheckbox
          label="Variable"
          checked={o.isVariable}
          onChange={(v) => updateItem(i, "isVariable", v)}
        />
      ),
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
      <p className="text-sm text-gray-500">List all operating expenses. Mark items as <strong>Variable</strong> if they grow with production (they&apos;ll appear as Cost of Sales). Fixed items stay constant each year.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-lg px-4 py-3 text-sm dark:text-green-300">
          <strong>Total Monthly OPEX:</strong><br />{fmt(totalMonthly)} RWF
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg px-4 py-3 text-sm dark:text-blue-300">
          <strong>Total Annual OPEX (Y1):</strong><br />{fmt(totalAnnual)} RWF
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={opex}
        rowKey={(_, i) => i}
        emptyMessage="No operating expenses yet."
        mobileActions={(_, i) => <RemoveButton onClick={() => removeItem(i)} />}
      />

      <AddButton onClick={addItem} label="Add expense item" />
    </div>
  );
}
