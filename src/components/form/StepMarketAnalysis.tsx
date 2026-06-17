"use client";
import { useState } from "react";
import axios from "axios";
import { FormSubmission } from "@/types";
import { FormInput, SectionTitle, AddButton, RemoveButton, GridRow } from "./FormField";

interface Props {
  formData: Omit<FormSubmission, "userId">;
  update: <K extends keyof Omit<FormSubmission, "userId">>(key: K, value: Omit<FormSubmission, "userId">[K]) => void;
}

function AIButton({ label, loading, onClick }: { label: string; loading: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading
        ? <span className="inline-block w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        : <span>✨</span>}
      {loading ? "Generating…" : label}
    </button>
  );
}

export default function StepMarketAnalysis({ formData, update }: Props) {
  const ma = formData.marketAnalysis;
  const ci = formData.companyInfo;
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const set = <K extends keyof typeof ma>(key: K, val: typeof ma[K]) => {
    update("marketAnalysis", { ...ma, [key]: val });
  };

  const aiContext = {
    companyName: ci.companyName,
    companyFocus: ci.companyFocus,
    location: ci.location,
    companyType: ci.companyType,
    productName: ci.productName,
    currency: ci.currency,
    products: formData.businessDescription.products,
  };

  async function generateSection(section: string, apply: (data: unknown) => void) {
    if (!ci.companyName && !ci.companyFocus) {
      alert("Please fill in Company Name and Industry in Step 1 first.");
      return;
    }
    setLoading((l) => ({ ...l, [section]: true }));
    try {
      const { data } = await axios.post("/api/ai/generate", { section, ...aiContext });
      apply(data.content);
    } catch {
      alert("AI generation failed. Ensure your ANTHROPIC_API_KEY is configured.");
    } finally {
      setLoading((l) => ({ ...l, [section]: false }));
    }
  }

  return (
    <div className="space-y-4">
      <SectionTitle>Global Market Size (USD Billions)</SectionTitle>
      <GridRow cols={3}>
        <FormInput label="Market Size 2024 ($B)" type="number" value={ma.globalMarketSize2024} onChange={(v) => set("globalMarketSize2024", parseFloat(v) || 0)} placeholder="0" />
        <FormInput label="Market Size 2025 ($B)" type="number" value={ma.globalMarketSize2025} onChange={(v) => set("globalMarketSize2025", parseFloat(v) || 0)} placeholder="0" />
        <FormInput label="Market Size 2030 ($B)" type="number" value={ma.globalMarketSize2030} onChange={(v) => set("globalMarketSize2030", parseFloat(v) || 0)} placeholder="0" />
      </GridRow>
      <GridRow cols={2}>
        <FormInput label="Sector GDP Contribution (%)" type="number" value={ma.gdpContribution} onChange={(v) => set("gdpContribution", parseFloat(v) || 0)} placeholder="0" hint="% this sector contributes to GDP" />
        <FormInput label="Sector Employment (%)" type="number" value={ma.employmentPercentage} onChange={(v) => set("employmentPercentage", parseFloat(v) || 0)} placeholder="0" hint="% of workforce employed in this sector" />
      </GridRow>

      <SectionTitle>Target Market Segments</SectionTitle>
      <div className="flex justify-end mb-1">
        <AIButton label="Generate segments with AI" loading={!!loading["marketSegments"]}
          onClick={() => generateSection("marketSegments", (d) => {
            const segs = d as { name: string; description: string }[];
            set("targetSegments", segs);
          })} />
      </div>
      {ma.targetSegments.map((s, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg items-start">
          <input
            value={s.name}
            onChange={(e) => {
              const arr = [...ma.targetSegments];
              arr[i] = { ...arr[i], name: e.target.value };
              set("targetSegments", arr);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Segment name"
          />
          <div className="md:col-span-2 flex gap-2">
            <input
              value={s.description}
              onChange={(e) => {
                const arr = [...ma.targetSegments];
                arr[i] = { ...arr[i], description: e.target.value };
                set("targetSegments", arr);
              }}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Description"
            />
            <RemoveButton onClick={() => set("targetSegments", ma.targetSegments.filter((_, idx) => idx !== i))} />
          </div>
        </div>
      ))}
      <AddButton onClick={() => set("targetSegments", [...ma.targetSegments, { name: "", description: "" }])} label="Add segment" />

      <SectionTitle>Competitor Analysis</SectionTitle>
      <div className="flex justify-end mb-1">
        <AIButton label="Suggest competitors with AI" loading={!!loading["competitors"]}
          onClick={() => generateSection("competitors", (d) => {
            const comps = d as { name: string; description: string }[];
            set("competitors", comps);
          })} />
      </div>
      {ma.competitors.map((c, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg items-start">
          <input
            value={c.name}
            onChange={(e) => {
              const arr = [...ma.competitors];
              arr[i] = { ...arr[i], name: e.target.value };
              set("competitors", arr);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Competitor name"
          />
          <div className="md:col-span-2 flex gap-2">
            <input
              value={c.description}
              onChange={(e) => {
                const arr = [...ma.competitors];
                arr[i] = { ...arr[i], description: e.target.value };
                set("competitors", arr);
              }}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Description"
            />
            <RemoveButton onClick={() => set("competitors", ma.competitors.filter((_, idx) => idx !== i))} />
          </div>
        </div>
      ))}
      <AddButton onClick={() => set("competitors", [...ma.competitors, { name: "", description: "" }])} label="Add competitor" />

      <SectionTitle>Marketing Strategies</SectionTitle>
      <div className="flex justify-end mb-1">
        <AIButton label="Generate with AI" loading={!!loading["marketingStrategies"]}
          onClick={() => generateSection("marketingStrategies", (d) => set("marketingStrategies", d as string[]))} />
      </div>
      {ma.marketingStrategies.map((s, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            value={s}
            onChange={(e) => {
              const arr = [...ma.marketingStrategies];
              arr[i] = e.target.value;
              set("marketingStrategies", arr);
            }}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder={`Marketing strategy ${i + 1}`}
          />
          <RemoveButton onClick={() => set("marketingStrategies", ma.marketingStrategies.filter((_, idx) => idx !== i))} />
        </div>
      ))}
      <AddButton onClick={() => set("marketingStrategies", [...ma.marketingStrategies, ""])} label="Add strategy" />

      <SectionTitle>Distribution Channels</SectionTitle>
      <div className="flex justify-end mb-1">
        <AIButton label="Generate with AI" loading={!!loading["distributionChannels"]}
          onClick={() => generateSection("distributionChannels", (d) => set("distributionChannels", d as string[]))} />
      </div>
      {ma.distributionChannels.map((s, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            value={s}
            onChange={(e) => {
              const arr = [...ma.distributionChannels];
              arr[i] = e.target.value;
              set("distributionChannels", arr);
            }}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder={`Channel ${i + 1}`}
          />
          <RemoveButton onClick={() => set("distributionChannels", ma.distributionChannels.filter((_, idx) => idx !== i))} />
        </div>
      ))}
      <AddButton onClick={() => set("distributionChannels", [...ma.distributionChannels, ""])} label="Add channel" />
    </div>
  );
}
