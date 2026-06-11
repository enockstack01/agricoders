"use client";
import { useState } from "react";
import axios from "axios";
import { FormSubmission } from "@/types";
import { FormTextArea, SectionTitle, AddButton, RemoveButton } from "./FormField";

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
      {loading ? (
        <span className="inline-block w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <span>✨</span>
      )}
      {loading ? "Generating…" : label}
    </button>
  );
}

export default function StepBusinessDescription({ formData, update }: Props) {
  const bd = formData.businessDescription;
  const ci = formData.companyInfo;
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const set = <K extends keyof typeof bd>(key: K, val: typeof bd[K]) => {
    update("businessDescription", { ...bd, [key]: val });
  };

  const updateGoal = (type: "shortTermGoals" | "mediumTermGoals" | "longTermGoals", i: number, val: string) => {
    const arr = [...bd[type]];
    arr[i] = val;
    set(type, arr);
  };

  const addGoal = (type: "shortTermGoals" | "mediumTermGoals" | "longTermGoals") => {
    set(type, [...bd[type], ""]);
  };

  const removeGoal = (type: "shortTermGoals" | "mediumTermGoals" | "longTermGoals", i: number) => {
    set(type, bd[type].filter((_, idx) => idx !== i));
  };

  const aiContext = {
    companyName: ci.companyName,
    companyFocus: ci.companyFocus,
    location: ci.location,
    companyType: ci.companyType,
    productName: ci.productName,
    currency: ci.currency,
    products: bd.products,
    existingVision: bd.vision,
    existingMission: bd.mission,
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "AI generation failed";
      alert(`AI generation failed: ${msg}. Check your ANTHROPIC_API_KEY is set.`);
    } finally {
      setLoading((l) => ({ ...l, [section]: false }));
    }
  }

  return (
    <div className="space-y-4">
      {/* AI info banner */}
      <div className="bg-purple-50 border border-purple-100 rounded-lg px-4 py-3 text-sm text-purple-800">
        <strong>✨ AI Assist</strong> — Click any "Generate with AI" button to auto-fill that section based on your company info from Step 1. You can edit any generated content.
      </div>

      <SectionTitle>Vision &amp; Mission</SectionTitle>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">Vision Statement</label>
            <AIButton label="Generate with AI" loading={!!loading["vision"]}
              onClick={() => generateSection("vision", (d) => set("vision", d as string))} />
          </div>
          <textarea
            value={bd.vision}
            onChange={(e) => set("vision", e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="To be the leading platform in our industry…"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">Mission Statement</label>
            <AIButton label="Generate with AI" loading={!!loading["mission"]}
              onClick={() => generateSection("mission", (d) => set("mission", d as string))} />
          </div>
          <textarea
            value={bd.mission}
            onChange={(e) => set("mission", e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="To deliver outstanding products/services that…"
          />
        </div>
      </div>

      <SectionTitle>Goals</SectionTitle>
      {(
        [
          { key: "shortTermGoals", label: "Short-term Goals (0–12 months)", aiSection: "shortTermGoals" },
          { key: "mediumTermGoals", label: "Medium-term Goals (1–3 years)", aiSection: "mediumTermGoals" },
          { key: "longTermGoals", label: "Long-term Goals (3–5 years)", aiSection: "longTermGoals" },
        ] as const
      ).map(({ key, label, aiSection }) => (
        <div key={key}>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <AIButton label="Generate with AI" loading={!!loading[aiSection]}
              onClick={() => generateSection(aiSection, (d) => set(key, d as string[]))} />
          </div>
          {bd[key].map((g, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={g}
                onChange={(e) => updateGoal(key, i, e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={`Goal ${i + 1}`}
              />
              <RemoveButton onClick={() => removeGoal(key, i)} />
            </div>
          ))}
          <AddButton onClick={() => addGoal(key)} label="Add goal" />
        </div>
      ))}

      <SectionTitle>Core Values</SectionTitle>
      <div className="flex justify-end mb-1">
        <AIButton label="Generate with AI" loading={!!loading["values"]}
          onClick={() => generateSection("values", (d) => set("values", d as typeof bd.values))} />
      </div>
      {bd.values.map((v, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start p-3 bg-gray-50 rounded-lg">
          <input
            value={v.name}
            onChange={(e) => {
              const arr = [...bd.values];
              arr[i] = { ...arr[i], name: e.target.value };
              set("values", arr);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Value name"
          />
          <div className="md:col-span-2 flex gap-2">
            <input
              value={v.description}
              onChange={(e) => {
                const arr = [...bd.values];
                arr[i] = { ...arr[i], description: e.target.value };
                set("values", arr);
              }}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Description"
            />
            <RemoveButton onClick={() => set("values", bd.values.filter((_, idx) => idx !== i))} />
          </div>
        </div>
      ))}
      <AddButton onClick={() => set("values", [...bd.values, { name: "", description: "" }])} label="Add value" />

      <SectionTitle>Products &amp; Services</SectionTitle>
      {bd.products.map((p, i) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start p-3 bg-gray-50 rounded-lg">
          <input
            value={p.name}
            onChange={(e) => {
              const arr = [...bd.products];
              arr[i] = { ...arr[i], name: e.target.value };
              set("products", arr);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Product / service name"
          />
          <div className="md:col-span-2 flex gap-2">
            <input
              value={p.description}
              onChange={(e) => {
                const arr = [...bd.products];
                arr[i] = { ...arr[i], description: e.target.value };
                set("products", arr);
              }}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Brief description"
            />
            <RemoveButton onClick={() => set("products", bd.products.filter((_, idx) => idx !== i))} />
          </div>
        </div>
      ))}
      <AddButton onClick={() => set("products", [...bd.products, { name: "", description: "" }])} label="Add product/service" />

      {(bd.workingModelSteps.length > 0 || true) && (
        <>
          <SectionTitle>How It Works (Operating Model)</SectionTitle>
          <div className="flex justify-end mb-1">
            <AIButton label="Generate with AI" loading={!!loading["workingModelSteps"]}
              onClick={() => generateSection("workingModelSteps", (d) => set("workingModelSteps", d as string[]))} />
          </div>
          {bd.workingModelSteps.map((s, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={s} onChange={(e) => { const a = [...bd.workingModelSteps]; a[i] = e.target.value; set("workingModelSteps", a); }}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder={`Step ${i + 1}`} />
              <RemoveButton onClick={() => set("workingModelSteps", bd.workingModelSteps.filter((_, idx) => idx !== i))} />
            </div>
          ))}
          <AddButton onClick={() => set("workingModelSteps", [...bd.workingModelSteps, ""])} label="Add step" />
        </>
      )}

      <SectionTitle>Technologies Used</SectionTitle>
      <div className="flex justify-end mb-1">
        <AIButton label="Generate with AI" loading={!!loading["technologies"]}
          onClick={() => generateSection("technologies", (d) => set("technologies", d as string[]))} />
      </div>
      {bd.technologies.map((t, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input value={t} onChange={(e) => { const a = [...bd.technologies]; a[i] = e.target.value; set("technologies", a); }}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder={`Technology ${i + 1}`} />
          <RemoveButton onClick={() => set("technologies", bd.technologies.filter((_, idx) => idx !== i))} />
        </div>
      ))}
      <AddButton onClick={() => set("technologies", [...bd.technologies, ""])} label="Add technology" />

      <SectionTitle>SWOT Analysis</SectionTitle>
      <div className="flex justify-end mb-2">
        <AIButton label="Generate full SWOT with AI" loading={!!loading["swot"]}
          onClick={() => generateSection("swot", (d) => {
            const s = d as typeof bd.swot;
            set("swot", s);
          })} />
      </div>
      {(["strengths", "weaknesses", "opportunities", "threats"] as const).map((key) => (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
          {bd.swot[key].map((item, i) => (
            <div key={i} className="flex gap-2 mb-1">
              <input
                value={item}
                onChange={(e) => {
                  const arr = [...bd.swot[key]];
                  arr[i] = e.target.value;
                  set("swot", { ...bd.swot, [key]: arr });
                }}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} ${i + 1}`}
              />
              <RemoveButton onClick={() => set("swot", { ...bd.swot, [key]: bd.swot[key].filter((_, idx) => idx !== i) })} />
            </div>
          ))}
          <AddButton onClick={() => set("swot", { ...bd.swot, [key]: [...bd.swot[key], ""] })} label={`Add ${key}`} />
        </div>
      ))}

      <SectionTitle>PESTEL Analysis</SectionTitle>
      <div className="flex justify-end mb-2">
        <AIButton label="Generate full PESTEL with AI" loading={!!loading["pestel"]}
          onClick={() => generateSection("pestel", (d) => set("pestel", d as typeof bd.pestel))} />
      </div>
      {(["political", "economic", "social", "technological", "environmental", "legal"] as const).map((key) => (
        <div key={key} className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
          <textarea
            value={bd.pestel[key]}
            onChange={(e) => set("pestel", { ...bd.pestel, [key]: e.target.value })}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder={`${key} factors and their impact on the business…`}
          />
        </div>
      ))}
    </div>
  );
}
