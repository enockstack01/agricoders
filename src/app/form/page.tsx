"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { defaultFormData, buildDefaultFormData } from "@/lib/defaults";
import { FormSubmission } from "@/types";
import StepCompanyInfo from "@/components/form/StepCompanyInfo";
import StepBusinessDescription from "@/components/form/StepBusinessDescription";
import StepMarketAnalysis from "@/components/form/StepMarketAnalysis";
import StepTeam from "@/components/form/StepTeam";
import StepCapex from "@/components/form/StepCapex";
import StepProducts from "@/components/form/StepProducts";
import StepOpex from "@/components/form/StepOpex";
import StepRevenue from "@/components/form/StepRevenue";
import StepFinancialSettings from "@/components/form/StepFinancialSettings";
import StepReview from "@/components/form/StepReview";
import {
  Building2,
  BookOpen,
  TrendingUp,
  Users,
  Factory,
  Package,
  DollarSign,
  LineChart,
  Settings,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Layers,
  Loader2,
} from "lucide-react";

const STEPS = [
  { label: "Company Info",         icon: Building2 },
  { label: "Business Description", icon: BookOpen },
  { label: "Market Analysis",      icon: TrendingUp },
  { label: "Management Team",      icon: Users },
  { label: "CAPEX",                icon: Factory },
  { label: "Products",             icon: Package },
  { label: "Operating Expenses",   icon: DollarSign },
  { label: "Revenue Streams",      icon: LineChart },
  { label: "Financial Settings",   icon: Settings },
  { label: "Review & Submit",      icon: ClipboardCheck },
];

function FormPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Omit<FormSubmission, "userId">>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(true); // true while loading profile + optional edit

  useEffect(() => {
    const init = async () => {
      // Load user profile defaults first (for new plans)
      let profileData = null;
      if (!editId) {
        try {
          const { data } = await axios.get("/api/profile");
          profileData = data?.defaults ?? null;
        } catch { /* use base defaults */ }
      }

      if (editId) {
        // Editing an existing submission — load it directly
        try {
          const r = await axios.get(`/api/submissions/${editId}`);
          const { _id, userId, createdAt, updatedAt, __v, ...rest } = r.data;
          if (rest.financial && !rest.financial.products) rest.financial.products = [];
          if (rest.financial && !rest.financial.services)  rest.financial.services  = [];
          if (rest.companyInfo && !rest.companyInfo.currency) rest.companyInfo.currency = "USD";
          setFormData(rest);
        } catch (err) { console.error(err); }
      } else {
        // New plan — apply profile defaults
        setFormData(buildDefaultFormData(profileData));
      }
      setLoadingEdit(false);
    };
    init();
  }, [editId]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = <K extends keyof Omit<FormSubmission, "userId">>(
    key: K,
    value: Omit<FormSubmission, "userId">[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (editId) await axios.delete(`/api/submissions/${editId}`);
      const resp = await axios.post("/api/submissions", formData);
      router.push(`/dashboard?submitted=${resp.data.id}`);
    } catch {
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEdit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center gap-2 text-gray-500">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading submission…</span>
      </div>
    );
  }

  const stepProps = { formData, update };
  const progress = Math.round(((step) / (STEPS.length - 1)) * 100);

  const renderStep = () => {
    switch (step) {
      case 0: return <StepCompanyInfo {...stepProps} />;
      case 1: return <StepBusinessDescription {...stepProps} />;
      case 2: return <StepMarketAnalysis {...stepProps} />;
      case 3: return <StepTeam {...stepProps} />;
      case 4: return <StepCapex {...stepProps} />;
      case 5: return <StepProducts {...stepProps} />;
      case 6: return <StepOpex {...stepProps} />;
      case 7: return <StepRevenue {...stepProps} />;
      case 8: return <StepFinancialSettings {...stepProps} />;
      case 9: return <StepReview formData={formData} onSubmit={handleSubmit} submitting={submitting} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm transition-colors flex-shrink-0"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <div className="w-px h-4 bg-gray-200 flex-shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <Layers size={16} className="text-green-600 flex-shrink-0" />
            <span className="font-semibold text-gray-900 text-sm truncate">
              {editId ? "Edit Business Plan" : "New Business Plan"}
            </span>
          </div>
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0">Step {step + 1}/{STEPS.length}</span>
      </header>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step pills — scrollable on mobile */}
        <div className="px-4 sm:px-6 py-2 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 min-w-max">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = i < step;
              const active = i === step;
              return (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    active
                      ? "bg-green-600 text-white"
                      : done
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  }`}
                >
                  <Icon size={12} />
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Step header */}
            <div className="px-5 sm:px-7 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                  {(() => { const Icon = STEPS[step].icon; return <Icon size={16} />; })()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">{STEPS[step].label}</h2>
                  <p className="text-xs text-gray-400">Step {step + 1} of {STEPS.length}</p>
                </div>
              </div>
            </div>

            {/* Step body */}
            <div className="px-5 sm:px-7 py-6">
              {renderStep()}
            </div>
          </div>

          {/* Navigation */}
          {step < STEPS.length - 1 && (
            <div className="flex justify-between mt-4 gap-3">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={15} />
                Previous
              </button>
              <button
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function FormPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center gap-2 text-gray-500">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading…</span>
      </div>
    }>
      <FormPageContent />
    </Suspense>
  );
}
