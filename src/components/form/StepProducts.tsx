"use client";
import { useState } from "react";
import {
  FormSubmission,
  ManufacturedProduct,
  ProductComponent,
  ServiceOffering,
  SERVICE_TYPES,
  DELIVERY_MODELS,
  PRICING_MODELS,
} from "@/types";
import { AddButton, RemoveButton, FormInput, FormTextArea, FormSelect, GridRow, DataTable, DataTableColumn } from "./FormField";
import { Package, Briefcase } from "lucide-react";

interface Props {
  formData: Omit<FormSubmission, "userId">;
  update: <K extends keyof Omit<FormSubmission, "userId">>(key: K, value: Omit<FormSubmission, "userId">[K]) => void;
}

const fmt = (n: number) => n.toLocaleString("en-US");

const cellInput =
  "w-full border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors";

type TabKey = "products" | "services";

export default function StepProducts({ formData, update }: Props) {
  const products = formData.financial.products ?? [];
  const services = formData.financial.services ?? [];
  const cur = formData.companyInfo.currency || "USD";
  const [tab, setTab] = useState<TabKey>("products");

  // ── Products helpers ───────────────────────────────────────────────────────
  const setProducts = (arr: ManufacturedProduct[]) =>
    update("financial", { ...formData.financial, products: arr });

  const addProduct = () =>
    setProducts([...products, { name: "", description: "", batchSize: 10, components: [{ item: "", quantity: 1, costPerUnit: 0 }] }]);

  const removeProduct = (pi: number) => setProducts(products.filter((_, i) => i !== pi));

  const updateProduct = (pi: number, key: keyof ManufacturedProduct, val: string | number) => {
    const arr = [...products];
    arr[pi] = { ...arr[pi], [key]: typeof arr[pi][key as keyof ManufacturedProduct] === "number" ? Number(val) : val };
    setProducts(arr);
  };

  const updateComponent = (pi: number, ci: number, key: keyof ProductComponent, val: string | number) => {
    const arr = [...products];
    const comps = [...arr[pi].components];
    comps[ci] = { ...comps[ci], [key]: typeof comps[ci][key] === "number" ? Number(val) : val };
    arr[pi] = { ...arr[pi], components: comps };
    setProducts(arr);
  };

  const addComponent = (pi: number) => {
    const arr = [...products];
    arr[pi] = { ...arr[pi], components: [...arr[pi].components, { item: "", quantity: 1, costPerUnit: 0 }] };
    setProducts(arr);
  };

  const removeComponent = (pi: number, ci: number) => {
    const arr = [...products];
    arr[pi] = { ...arr[pi], components: arr[pi].components.filter((_, i) => i !== ci) };
    setProducts(arr);
  };

  // ── Services helpers ───────────────────────────────────────────────────────
  const setServices = (arr: ServiceOffering[]) =>
    update("financial", { ...formData.financial, services: arr });

  const addService = () =>
    setServices([...services, { name: "", description: "", serviceType: "Consulting", deliveryModel: "Remote", pricingModel: "Monthly Retainer" }]);

  const removeService = (i: number) => setServices(services.filter((_, idx) => idx !== i));

  const updateService = (i: number, key: keyof ServiceOffering, val: string) => {
    const arr = [...services];
    arr[i] = { ...arr[i], [key]: val };
    setServices(arr);
  };

  const serviceTypeOptions = SERVICE_TYPES.map((t) => ({ value: t, label: t }));
  const deliveryModelOptions = DELIVERY_MODELS.map((d) => ({ value: d, label: d }));
  const pricingModelOptions = PRICING_MODELS.map((p) => ({ value: p, label: p }));

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">
        Add the physical <strong>products</strong> your business manufactures and/or the <strong>services</strong> you deliver.
        You can add any combination — both, either, or leave both empty for a pure trading/retail model.
      </p>

      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setTab("products")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "products" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          <Package size={15} />
          Products
          {products.length > 0 && (
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full px-1.5 py-0.5 font-semibold">{products.length}</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab("services")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "services" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          <Briefcase size={15} />
          Services
          {services.length > 0 && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full px-1.5 py-0.5 font-semibold">{services.length}</span>
          )}
        </button>
      </div>

      {/* ── PRODUCTS TAB ──────────────────────────────────────────────────────── */}
      {tab === "products" && (
        <div className="space-y-5">
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-lg px-4 py-3 text-sm text-green-800 dark:text-green-300">
            <strong>Manufactured Products</strong> — Physical goods your business produces. Each product has a bill of materials and a batch size used to calculate the unit manufacturing cost.
            Leave empty if you only deliver services.
          </div>

          {products.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 dark:text-gray-500">
              <Package size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No products added</p>
              <p className="text-xs mt-0.5">Add a product below, or switch to Services.</p>
            </div>
          )}

          {products.map((product, pi) => {
            const totalCost = product.components.reduce((s, c) => s + c.quantity * c.costPerUnit, 0);
            const unitCost = product.batchSize > 0 ? totalCost / product.batchSize : 0;

            const bomColumns: DataTableColumn<ProductComponent>[] = [
              {
                key: "item",
                header: "Component / Material",
                render: (c, ci) => (
                  <input
                    value={c.item}
                    onChange={(e) => updateComponent(pi, ci, "item", e.target.value)}
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
                render: (c, ci) => (
                  <input
                    type="number"
                    min={0}
                    value={c.quantity}
                    onChange={(e) => updateComponent(pi, ci, "quantity", parseInt(e.target.value) || 0)}
                    className={`${cellInput} text-right`}
                  />
                ),
              },
              {
                key: "costPerUnit",
                header: `Cost/Unit (${cur})`,
                headClassName: "text-right",
                cellClassName: "text-right",
                render: (c, ci) => (
                  <input
                    type="number"
                    min={0}
                    value={c.costPerUnit}
                    onChange={(e) => updateComponent(pi, ci, "costPerUnit", parseFloat(e.target.value) || 0)}
                    className={`${cellInput} text-right`}
                  />
                ),
              },
              {
                key: "total",
                header: "Total",
                headClassName: "text-right",
                cellClassName: "text-right font-medium text-gray-700 dark:text-gray-300",
                render: (c) => fmt(c.quantity * c.costPerUnit),
              },
              {
                key: "remove",
                header: "",
                cellClassName: "text-center",
                hideOnMobile: true,
                render: (_, ci) => <RemoveButton onClick={() => removeComponent(pi, ci)} />,
              },
            ];

            return (
              <div key={pi} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="bg-green-600 text-white px-4 py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-sm">
                    Product {pi + 1}{product.name ? `: ${product.name}` : ""}
                  </span>
                  <RemoveButton onClick={() => removeProduct(pi)} />
                </div>
                <div className="p-4 space-y-4">
                  <GridRow cols={3}>
                    <div className="sm:col-span-2">
                      <FormInput
                        label="Product Name"
                        required
                        value={product.name}
                        onChange={(v) => updateProduct(pi, "name", v)}
                        placeholder="e.g. Widget Pro, SolarKit, Smart Sensor"
                      />
                    </div>
                    <FormInput
                      label="Batch Size (units/run)"
                      type="number"
                      value={product.batchSize}
                      onChange={(v) => updateProduct(pi, "batchSize", parseInt(v) || 1)}
                    />
                  </GridRow>
                  <FormInput
                    label="Description"
                    value={product.description}
                    onChange={(v) => updateProduct(pi, "description", v)}
                    placeholder="Brief description of what this product does"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-lg px-4 py-3 text-sm">
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">Batch Total</p>
                      <p className="font-bold text-green-800 dark:text-green-300">{fmt(totalCost)} {cur}</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg px-4 py-3 text-sm">
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Unit Cost (avg)</p>
                      <p className="font-bold text-blue-800 dark:text-blue-300">{fmt(Math.round(unitCost))} {cur}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Bill of Materials</p>
                    <DataTable
                      columns={bomColumns}
                      rows={product.components}
                      rowKey={(_, ci) => ci}
                      emptyMessage="No components yet."
                      mobileActions={(_, ci) => <RemoveButton onClick={() => removeComponent(pi, ci)} />}
                    />
                    <div className="mt-2">
                      <AddButton onClick={() => addComponent(pi)} label="Add component" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <AddButton onClick={addProduct} label="Add Product" />
        </div>
      )}

      {/* ── SERVICES TAB ──────────────────────────────────────────────────────── */}
      {tab === "services" && (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg px-4 py-3 text-sm text-blue-800 dark:text-blue-300">
            <strong>Service Offerings</strong> — Intangible services your business delivers (consulting, SaaS, training, support, etc.).
            Services have no manufacturing cost — their pricing and revenue is configured in the Revenue step.
          </div>

          {services.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 dark:text-gray-500">
              <Briefcase size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No services added</p>
              <p className="text-xs mt-0.5">Add a service below, or switch to Products.</p>
            </div>
          )}

          {services.map((svc, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <div className="bg-blue-600 text-white px-4 py-2.5 flex items-center justify-between">
                <span className="font-semibold text-sm">
                  Service {i + 1}{svc.name ? `: ${svc.name}` : ""}
                </span>
                <RemoveButton onClick={() => removeService(i)} />
              </div>
              <div className="p-4 space-y-4">
                <FormInput
                  label="Service Name"
                  required
                  value={svc.name}
                  onChange={(v) => updateService(i, "name", v)}
                  placeholder="e.g. Cloud Migration Consulting, Monthly Analytics Subscription"
                />
                <FormTextArea
                  label="Description"
                  value={svc.description}
                  onChange={(v) => updateService(i, "description", v)}
                  rows={2}
                  placeholder="What does this service deliver? Who is it for?"
                />

                <GridRow cols={2}>
                  <FormSelect
                    label="Service Type"
                    value={svc.serviceType}
                    onChange={(v) => updateService(i, "serviceType", v)}
                    options={serviceTypeOptions}
                  />
                  <FormSelect
                    label="Delivery Model"
                    value={svc.deliveryModel}
                    onChange={(v) => updateService(i, "deliveryModel", v)}
                    options={deliveryModelOptions}
                  />
                </GridRow>
                <GridRow cols={2}>
                  <FormSelect
                    label="Pricing Model"
                    value={svc.pricingModel}
                    onChange={(v) => updateService(i, "pricingModel", v)}
                    options={pricingModelOptions}
                  />
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg px-3 py-2.5 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                    <Briefcase size={13} className="mt-0.5 flex-shrink-0" />
                    <span>Service pricing and customer volumes are configured in the <strong>Revenue Streams</strong> step.</span>
                  </div>
                </GridRow>
              </div>
            </div>
          ))}
          <AddButton onClick={addService} label="Add Service" />
        </div>
      )}
    </div>
  );
}
