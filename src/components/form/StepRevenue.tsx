"use client";
import { FormSubmission, RevenuePackage } from "@/types";
import { AddButton, RemoveButton } from "./FormField";
import { Package, Briefcase, ChevronDown } from "lucide-react";

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
        For <strong>one-time product sales</strong>, enable "Product Sale" and set the selling price per unit.
      </p>

      {allOfferings.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500 font-medium">Defined offerings:</span>
          {productNames.map((p) => (
            <span key={p.name} className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 rounded-full px-2.5 py-0.5 border border-green-200">
              <Package size={10} />{p.name}
            </span>
          ))}
          {serviceNames.map((s) => (
            <span key={s.name} className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 rounded-full px-2.5 py-0.5 border border-blue-200">
              <Briefcase size={10} />{s.name}
            </span>
          ))}
        </div>
      )}

      <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 text-sm font-medium text-green-800">
        Estimated Year 1 Total Revenue: {fmt(totalY1)} {cur}
      </div>

      {packages.map((p, i) => {
        const linkedIsService = isServiceOffering(p.product);
        return (
          <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Revenue Stream #{i + 1}</span>
                {linkedIsService && (
                  <span className="ml-2 inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
                    <Briefcase size={10} />Service
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* Only show "Product Sale" toggle for manufactured products (not services) */}
                {!linkedIsService && (
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isProductSale(p)}
                      onChange={(e) => updatePkg(i, "isProductSale", e.target.checked)}
                      className="accent-green-600"
                    />
                    Product Sale (one-time)
                  </label>
                )}
                <RemoveButton onClick={() => removePkg(i)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Product/Service selector */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Product / Service</label>
                {allOfferings.length > 0 ? (
                  <div className="relative">
                    <select
                      value={p.product}
                      onChange={(e) => {
                        updatePkg(i, "product", e.target.value);
                        // Auto-disable "Product Sale" if selecting a service
                        if (isServiceOffering(e.target.value)) {
                          updatePkg(i, "isProductSale", false);
                        }
                      }}
                      className="appearance-none w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer pr-8"
                    >
                      <option value="">— select offering —</option>
                      {productNames.length > 0 && (
                        <optgroup label="Products">
                          {productNames.map((pn) => <option key={pn.name} value={pn.name}>{pn.name}</option>)}
                        </optgroup>
                      )}
                      {serviceNames.length > 0 && (
                        <optgroup label="Services">
                          {serviceNames.map((sn) => <option key={sn.name} value={sn.name}>{sn.name}</option>)}
                        </optgroup>
                      )}
                      <option value="__other__">Other (type below)</option>
                    </select>
                    <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                ) : null}
                {(p.product === "__other__" || allOfferings.length === 0) && (
                  <input
                    value={p.product === "__other__" ? "" : p.product}
                    onChange={(e) => updatePkg(i, "product", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mt-1"
                    placeholder="e.g. SaaS Platform, Consulting Retainer"
                    autoFocus
                  />
                )}
              </div>

              {/* Package/Tier name */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Package / Tier Name</label>
                <input
                  value={p.packageName}
                  onChange={(e) => updatePkg(i, "packageName", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. Starter, Professional, Enterprise"
                />
              </div>

              {/* Price field — changes based on sale type */}
              {isProductSale(p) && !linkedIsService ? (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Selling Price Per Unit ({cur})</label>
                  <input type="number" min={0} value={getSellingPrice(p)}
                    onChange={(e) => updatePkg(i, "productSellingPrice", parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {linkedIsService ? "Price Per Unit Per Month / Per Period" : "Price Per Unit Per Month"} ({cur})
                  </label>
                  <input type="number" min={0} value={p.pricePerUnitPerMonth}
                    onChange={(e) => updatePkg(i, "pricePerUnitPerMonth", parseFloat(e.target.value) || 0)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              )}

              {/* Volume */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {isProductSale(p) ? "Units Sold (Year 1)" : "Customers / Clients (Year 1)"}
                </label>
                <input type="number" min={0} value={p.annualCustomers}
                  onChange={(e) => updatePkg(i, "annualCustomers", parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              {/* Growth */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Annual Growth Rate (%)</label>
                <input type="number" min={0} max={200} step={1}
                  value={Math.round(p.growthRate * 100)}
                  onChange={(e) => updatePkg(i, "growthRate", (parseInt(e.target.value) || 0) / 100)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="10" />
              </div>

              {/* Y1 preview */}
              <div className="flex items-center">
                <p className="text-xs font-semibold text-green-700">
                  Y1 Revenue: {fmt(calcY1(p))} {cur}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <AddButton onClick={addPkg} label="Add revenue stream" />
    </div>
  );
}
