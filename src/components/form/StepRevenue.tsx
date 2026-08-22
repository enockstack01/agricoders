"use client";
import { FormSubmission, RevenuePackage } from "@/types";
import { AddButton, RemoveButton, FormInput, FormSelect, FormCheckbox, GridRow } from "./FormField";
import { Package, Briefcase } from "lucide-react";

interface Props {
  formData: Omit<FormSubmission, "userId">;
  update: <K extends keyof Omit<FormSubmission, "userId">>(key: K, value: Omit<FormSubmission, "userId">[K]) => void;
}

const fmt = (n: number) => n.toLocaleString("en-US");

function isProductSale(pkg: RevenuePackage): boolean {
  return !!(pkg.isProductSale || pkg.isKitSale);
}

function getSellingPrice(pkg: RevenuePackage): number {
  return pkg.productSellingPrice ?? pkg.kitSellingPrice ?? 0;
}

export default function StepRevenue({ formData, update }: Props) {
  const packages = formData.financial.revenuePackages;
  const cur = formData.companyInfo.currency || "USD";

  // Collect names from both manufactured products and service offerings
  const productNames = (formData.financial.products ?? [])
    .map((p) => ({ name: p.name, type: "product" as const }))
    .filter((p) => p.name);
  const serviceNames = (formData.financial.services ?? [])
    .map((s) => ({ name: s.name, type: "service" as const }))
    .filter((s) => s.name);
  const allOfferings = [...productNames, ...serviceNames];

  const offeringOptions = [
    { value: "", label: "— select offering —" },
    ...productNames.map((p) => ({ value: p.name, label: `${p.name} (Product)` })),
    ...serviceNames.map((s) => ({ value: s.name, label: `${s.name} (Service)` })),
    { value: "__other__", label: "Other (type below)" },
  ];

  const updatePkg = (i: number, key: keyof RevenuePackage, val: string | number | boolean) => {
    const arr = [...packages];
    if (key === "isProductSale" || key === "isKitSale") {
      arr[i] = { ...arr[i], isProductSale: val as boolean, isKitSale: val as boolean };
    } else if (key === "product" || key === "packageName") {
      arr[i] = { ...arr[i], [key]: val as string };
    } else if (key === "productSellingPrice" || key === "kitSellingPrice") {
      arr[i] = { ...arr[i], productSellingPrice: Number(val), kitSellingPrice: Number(val) };
    } else {
      arr[i] = { ...arr[i], [key]: Number(val) };
    }
    update("financial", { ...formData.financial, revenuePackages: arr });
  };

  const addPkg = () => {
    update("financial", {
      ...formData.financial,
      revenuePackages: [...packages, {
        product: "", packageName: "", pricePerUnitPerMonth: 0,
        customersPerMonth: 0, annualCustomers: 0, growthRate: 0.1,
        isProductSale: false, isKitSale: false,
      }],
    });
  };

  const removePkg = (i: number) => {
    update("financial", { ...formData.financial, revenuePackages: packages.filter((_, idx) => idx !== i) });
  };

  const calcY1 = (pkg: RevenuePackage) => {
    if (isProductSale(pkg)) return getSellingPrice(pkg) * pkg.annualCustomers;
    return pkg.pricePerUnitPerMonth * 12 * pkg.annualCustomers;
  };

  const totalY1 = packages.reduce((s, p) => s + calcY1(p), 0);

  // Determine if selected offering is a service (services are always recurring by default)
  const isServiceOffering = (offeringName: string) =>
    serviceNames.some((s) => s.name === offeringName);

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">
        Define revenue streams for your products and services.
        For <strong>recurring revenue</strong> (subscriptions, retainers, SaaS), set the monthly price per customer.
        For <strong>one-time product sales</strong>, enable &quot;Product Sale&quot; and set the selling price per unit.
      </p>

      {allOfferings.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Defined offerings:</span>
          {productNames.map((p) => (
            <span key={p.name} className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full px-2.5 py-0.5 border border-green-200 dark:border-green-800">
              <Package size={10} />{p.name}
            </span>
          ))}
          {serviceNames.map((s) => (
            <span key={s.name} className="inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full px-2.5 py-0.5 border border-blue-200 dark:border-blue-800">
              <Briefcase size={10} />{s.name}
            </span>
          ))}
        </div>
      )}

      <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800 rounded-lg px-4 py-3 text-sm font-medium text-green-800 dark:text-green-300">
        Estimated Year 1 Total Revenue: {fmt(totalY1)} {cur}
      </div>

      {packages.map((p, i) => {
        const linkedIsService = isServiceOffering(p.product);
        return (
          <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Revenue Stream #{i + 1}</span>
                {linkedIsService && (
                  <span className="ml-2 inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full px-2 py-0.5">
                    <Briefcase size={10} />Service
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* Only show "Product Sale" toggle for manufactured products (not services) */}
                {!linkedIsService && (
                  <FormCheckbox
                    label="Product Sale (one-time)"
                    checked={isProductSale(p)}
                    onChange={(v) => updatePkg(i, "isProductSale", v)}
                  />
                )}
                <RemoveButton onClick={() => removePkg(i)} />
              </div>
            </div>

            <GridRow cols={2}>
              {/* Product/Service selector */}
              <div>
                {allOfferings.length > 0 ? (
                  <FormSelect
                    label="Product / Service"
                    value={p.product}
                    onChange={(v) => {
                      updatePkg(i, "product", v);
                      // Auto-disable "Product Sale" if selecting a service
                      if (isServiceOffering(v)) {
                        updatePkg(i, "isProductSale", false);
                      }
                    }}
                    options={offeringOptions}
                  />
                ) : (
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Product / Service</label>
                )}
                {(p.product === "__other__" || allOfferings.length === 0) && (
                  <input
                    value={p.product === "__other__" ? "" : p.product}
                    onChange={(e) => updatePkg(i, "product", e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors mt-1"
                    placeholder="e.g. SaaS Platform, Consulting Retainer"
                    autoFocus
                  />
                )}
              </div>

              {/* Package/Tier name */}
              <FormInput
                label="Package / Tier Name"
                value={p.packageName}
                onChange={(v) => updatePkg(i, "packageName", v)}
                placeholder="e.g. Starter, Professional, Enterprise"
              />

              {/* Price field — changes based on sale type */}
              {isProductSale(p) && !linkedIsService ? (
                <FormInput
                  label={`Selling Price Per Unit (${cur})`}
                  type="number"
                  value={getSellingPrice(p)}
                  onChange={(v) => updatePkg(i, "productSellingPrice", parseFloat(v) || 0)}
                />
              ) : (
                <FormInput
                  label={`${linkedIsService ? "Price Per Unit Per Month / Per Period" : "Price Per Unit Per Month"} (${cur})`}
                  type="number"
                  value={p.pricePerUnitPerMonth}
                  onChange={(v) => updatePkg(i, "pricePerUnitPerMonth", parseFloat(v) || 0)}
                />
              )}

              {/* Volume */}
              <FormInput
                label={isProductSale(p) ? "Units Sold (Year 1)" : "Customers / Clients (Year 1)"}
                type="number"
                value={p.annualCustomers}
                onChange={(v) => updatePkg(i, "annualCustomers", parseInt(v) || 0)}
              />

              {/* Growth */}
              <FormInput
                label="Annual Growth Rate (%)"
                type="number"
                value={Math.round(p.growthRate * 100)}
                onChange={(v) => updatePkg(i, "growthRate", (parseInt(v) || 0) / 100)}
                placeholder="10"
              />

              {/* Y1 preview */}
              <div className="flex items-center">
                <p className="text-xs font-semibold text-green-700 dark:text-green-400">
                  Y1 Revenue: {fmt(calcY1(p))} {cur}
                </p>
              </div>
            </GridRow>
          </div>
        );
      })}

      <AddButton onClick={addPkg} label="Add revenue stream" />
    </div>
  );
}
