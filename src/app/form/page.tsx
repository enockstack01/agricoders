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
  Coins,
  Send,
  CheckCircle2,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const REQUIRED_CREDITS = 5;

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

const CREDITS_PER_DOC = 5;

function CreditGate({ credits, required, onBack }: { credits: number; required: number; onBack: () => void }) {
  const [bpCount, setBpCount] = useState(1);
  const [fmCount, setFmCount] = useState(0);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const totalCredits = (bpCount + fmCount) * CREDITS_PER_DOC;

  async function handleSubmit() {
    setError("");
    setSubmitting(true);
    const documents: { type: "business-plan" | "financial-model"; count: number }[] = [];
    if (bpCount > 0) documents.push({ type: "business-plan", count: bpCount });
    if (fmCount > 0) documents.push({ type: "financial-model", count: fmCount });
    try {
      await axios.post("/api/credits/request", { documents, note: note.trim() || undefined });
      setSubmitted(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Failed to submit request. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white text-sm transition-colors"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Dashboard</span>
        </button>
        <ThemeToggle compact />
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm w-full max-w-md p-8">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={28} className="text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Request Sent!</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Your credit request has been submitted. The admin will review it and credits will appear in your account once approved.
              </p>
              <button
                onClick={onBack}
                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <Coins size={24} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Insufficient Credits</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    You need <strong>{required} credits</strong> to create a plan. Your balance:{" "}
                    <strong className="text-red-600 dark:text-red-400">{credits} credit{credits === 1 ? "" : "s"}</strong>.
                  </p>
                </div>
              </div>

              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Request credits from your admin — select what you need ({CREDITS_PER_DOC} credits each):
              </p>

              <div className="space-y-3 mb-4">
                {[
                  { label: "Business Plan (.docx)", sub: "Narrative + charts", count: bpCount, setCount: setBpCount },
                  { label: "Financial Model (.xlsx)", sub: "19-sheet spreadsheet", count: fmCount, setCount: setFmCount },
                ].map(({ label, sub, count, setCount }) => (
                  <div key={label} className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{label}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{sub}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCount(Math.max(0, count - 1))}
                        disabled={count === 0}
                        className="w-7 h-7 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40"
                      >−</button>
                      <span className="w-5 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">{count}</span>
                      <button
                        type="button"
                        onClick={() => setCount(count + 1)}
                        className="w-7 h-7 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >+</button>
                    </div>
                  </div>
                ))}
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note for the admin (optional)…"
                rows={2}
                className="w-full text-xs border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />

              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5 mb-4">
                <span className="text-xs text-gray-600 dark:text-gray-400">Credits to request</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{totalCredits}</span>
              </div>

              {error && (
                <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 mb-3">
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={onBack}
                  className="flex-1 py-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={totalCredits === 0 || submitting}
                  className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  {submitting ? "Sending…" : "Send Request"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FormPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Omit<FormSubmission, "userId">>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(true); // true while loading profile + optional edit
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      // Check credit balance first
      try {
        const { data } = await axios.get<{ credits: number }>("/api/credits");
        setCredits(data.credits ?? 0);
      } catch {
        setCredits(0);
      }

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading submission…</span>
      </div>
    );
  }

  // Credit gate — only applies when creating a new plan (not editing an existing one)
  if (!editId && credits !== null && credits < REQUIRED_CREDITS) {
    return <CreditGate credits={credits} required={REQUIRED_CREDITS} onBack={() => router.push("/dashboard")} />;
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Top bar */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white text-sm transition-colors flex-shrink-0"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <Layers size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
            <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {editId ? "Edit Business Plan" : "New Business Plan"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-400 dark:text-gray-500">Step {step + 1}/{STEPS.length}</span>
          <ThemeToggle compact />
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="h-1 bg-gray-100 dark:bg-gray-800">
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
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300"
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
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Step header */}
            <div className="px-5 sm:px-7 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                  {(() => { const Icon = STEPS[step].icon; return <Icon size={16} />; })()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">{STEPS[step].label}</h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Step {step + 1} of {STEPS.length}</p>
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
                className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading…</span>
      </div>
    }>
      <FormPageContent />
    </Suspense>
  );
}
