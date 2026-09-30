"use client";
import { FormSubmission, KitComponent } from "@/types";
import { AddButton, RemoveButton, DataTable, DataTableColumn } from "./FormField";

interface Props {
  formData: Omit<FormSubmission, "userId">;
  update: <K extends keyof Omit<FormSubmission, "userId">>(key: K, value: Omit<FormSubmission, "userId">[K]) => void;
}

const fmt = (n: number) => n.toLocaleString("en-US");

const cellInput =
  "form-control form-control-sm";

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

  const columns: DataTableColumn<KitComponent>[] = [
    {
      key: "item",
      header: "Component",
      render: (c, i) => (
        <input
          value={c.item}
          onChange={(e) => updateComp(i, "item", e.target.value)}
          className={cellInput}
          placeholder="Component name"
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
          onChange={(e) => updateComp(i, "quantity", parseInt(e.target.value) || 0)}
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
          onChange={(e) => updateComp(i, "costPerUnit", parseInt(e.target.value) || 0)}
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
      render: (_, i) => <RemoveButton onClick={() => removeComp(i)} />,
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">List the components used to manufacture one IoT Smart Kit batch. Typical batch size is 10 units.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="callout callout-success px-4 py-3 text-sm dark:text-green-300">
          <strong>Total Cost (batch):</strong><br />{fmt(totalCost)} RWF
        </div>
        <div className="callout callout-info px-4 py-3 text-sm dark:text-blue-300">
          <strong>Cost Per Unit (avg):</strong><br />{fmt(unitCost)} RWF
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={components}
        rowKey={(_, i) => i}
        emptyMessage="No components yet."
        mobileActions={(_, i) => <RemoveButton onClick={() => removeComp(i)} />}
      />

      <AddButton onClick={addComp} label="Add component" />
    </div>
  );
}
