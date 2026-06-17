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
import { AddButton, RemoveButton } from "./FormField";
import { Package, Briefcase, ChevronDown } from "lucide-react";

interface Props {
  formData: Omit<FormSubmission, "userId">;
  update: <K extends keyof Omit<FormSubmission, "userId">>(key: K, value: Omit<FormSubmission, "userId">[K]) => void;
}

const fmt = (n: number) => n.toLocaleString("en-US");

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
            <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-1.5 py-0.5 font-semibold">{services.length}</span>
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
            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
              <Package size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No products added</p>
              <p className="text-xs mt-0.5">Add a product below, or switch to Services.</p>
            </div>
          )}

          {products.map((product, pi) => {
            const totalCost = product.components.reduce((s, c) => s + c.quantity * c.costPerUnit, 0);
            const unitCost = product.batchSize > 0 ? totalCost / product.batchSize : 0;
            return (
              <div key={pi} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="bg-green-600 text-white px-4 py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-sm">
                    Product {pi + 1}{product.name ? `: ${product.name}` : ""}
                  </span>
                  <RemoveButton onClick={() => removeProduct(pi)} />
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Product Name *</label>
                      <input value={product.name} onChange={(e) => updateProduct(pi, "name", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g. Widget Pro, SolarKit, Smart Sensor" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Batch Size (units/run)</label>
                      <input type="number" min={1} value={product.batchSize} onChange={(e) => updateProduct(pi, "batchSize", parseInt(e.target.value) || 1)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                      <input value={product.description} onChange={(e) => updateProduct(pi, "description", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Brief description of what this product does" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 text-sm">
                      <p className="text-xs text-green-600 font-medium">Batch Total</p>
                      <p className="font-bold text-green-800">{fmt(totalCost)} {cur}</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm">
                      <p className="text-xs text-blue-600 font-medium">Unit Cost (avg)</p>
                      <p className="font-bold text-blue-800">{fmt(Math.round(unitCost))} {cur}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Bill of Materials</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-700">
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Component / Material</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 w-20">Qty</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 w-32">Cost/Unit ({cur})</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 w-28">Total</th>
                            <th className="w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.components.map((c, ci) => (
                            <tr key={ci} className={ci % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"}>
                              <td className="px-2 py-1.5">
                                <input value={c.item} onChange={(e) => updateComponent(pi, ci, "item", e.target.value)}
                                  className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                                  placeholder="Component name" />
                              </td>
                              <td className="px-2 py-1.5">
                                <input type="number" min={0} value={c.quantity} onChange={(e) => updateComponent(pi, ci, "quantity", parseInt(e.target.value) || 0)}
                                  className="w-full border border-gray-200 rounded px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-green-500" />
                              </td>
                              <td className="px-2 py-1.5">
                                <input type="number" min={0} value={c.costPerUnit} onChange={(e) => updateComponent(pi, ci, "costPerUnit", parseFloat(e.target.value) || 0)}
                                  className="w-full border border-gray-200 rounded px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-green-500" />
                              </td>
                              <td className="px-3 py-1.5 text-right font-medium text-gray-700 text-sm">{fmt(c.quantity * c.costPerUnit)}</td>
                              <td className="px-1 py-1.5"><RemoveButton onClick={() => removeComponent(pi, ci)} /></td>
                            </tr>
                          ))}
                          <tr className="bg-green-50 dark:bg-green-900/10 font-semibold text-sm">
                            <td colSpan={3} className="px-3 py-2 text-right text-gray-600 dark:text-gray-400">Batch Total</td>
                            <td className="px-3 py-2 text-right text-green-700 dark:text-green-400">{fmt(totalCost)}</td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-800">
            <strong>Service Offerings</strong> — Intangible services your business delivers (consulting, SaaS, training, support, etc.).
            Services have no manufacturing cost — their pricing and revenue is configured in the Revenue step.
          </div>

          {services.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
              <Briefcase size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No services added</p>
              <p className="text-xs mt-0.5">Add a service below, or switch to Products.</p>
            </div>
          )}

          {services.map((svc, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-blue-600 text-white px-4 py-2.5 flex items-center justify-between">
                <span className="font-semibold text-sm">
                  Service {i + 1}{svc.name ? `: ${svc.name}` : ""}
                </span>
                <RemoveButton onClick={() => removeService(i)} />
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Service Name *</label>
                  <input value={svc.name} onChange={(e) => updateService(i, "name", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Cloud Migration Consulting, Monthly Analytics Subscription" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <textarea value={svc.description} onChange={(e) => updateService(i, "description", e.target.value)} rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    placeholder="What does this service deliver? Who is it for?" />
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Service Type</label>
                  <div className="relative">
                    <select value={svc.serviceType} onChange={(e) => updateService(i, "serviceType", e.target.value)}
                      className="appearance-none w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-8">
                      {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Delivery Model */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Delivery Model</label>
                  <div className="relative">
                    <select value={svc.deliveryModel} onChange={(e) => updateService(i, "deliveryModel", e.target.value)}
                      className="appearance-none w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-8">
                      {DELIVERY_MODELS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Pricing Model */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Pricing Model</label>
                  <div className="relative">
                    <select value={svc.pricingModel} onChange={(e) => updateService(i, "pricingModel", e.target.value)}
                      className="appearance-none w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-8">
                      {PRICING_MODELS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Info callout */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5 text-xs text-blue-700 flex items-start gap-2">
                  <Briefcase size={13} className="mt-0.5 flex-shrink-0" />
                  <span>Service pricing and customer volumes are configured in the <strong>Revenue Streams</strong> step.</span>
                </div>
              </div>
            </div>
          ))}
          <AddButton onClick={addService} label="Add Service" />
        </div>
      )}
    </div>
  );
}
