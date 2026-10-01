"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { defaultFormData, buildDefaultFormData } from "@/lib/defaults";
import { FormSubmission } from "@/types";
import AppShell, { NavRole } from "@/components/layout/AppShell";
import { PageHeader, Loading, EmptyState, Stepper } from "@/components/plan/ui";
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
  ChevronDown,
  Loader2,
  Coins,
  Send,
  CheckCircle2,
  Check,
  AlertCircle,
} from "@/components/plan/icons";

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
    <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
      {submitted ? (
        <EmptyState
          icon={<CheckCircle2 size={30} />}
          title="Request Sent!"
          description="Your credit request has been submitted. The admin will review it and credits will appear in your account once approved."
          action={<button onClick={onBack} className="btn btn-primary">Back to Dashboard</button>}
        />
      ) : (
        <>
          <div className="card-header">
            <h3><span className="icon-tile orange"><Coins size={16} /></span>Insufficient Credits</h3>
          </div>
          <div className="card-body">
            <div className="alert-item alert-warning" style={{ marginBottom: 18 }}>
              <AlertCircle size={16} />
              <div className="alert-content">
                You need <strong>{required} credits</strong> to create a plan. Your balance:{" "}
                <strong>{credits} credit{credits === 1 ? "" : "s"}</strong>.
              </div>
            </div>

            <label className="form-label">Request credits from your admin ({CREDITS_PER_DOC} credits each)</label>
            {[
              { label: "Business Plan (.docx)", sub: "Narrative + charts", count: bpCount, setCount: setBpCount },
              { label: "Financial Model (.xlsx)", sub: "19-sheet spreadsheet", count: fmCount, setCount: setFmCount },
            ].map(({ label, sub, count, setCount }) => (
              <div key={label} className="option-row">
                <div>
                  <div className="title">{label}</div>
                  <div className="sub">{sub}</div>
                </div>
                <Stepper value={count} onChange={setCount} />
              </div>
            ))}

            <div className="form-group" style={{ marginTop: 16 }}>
              <label className="form-label">Note for the admin</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional…"
                rows={2}
                className="form-control"
                style={{ minHeight: 60 }}
              />
            </div>

            <div className="summary-row">
              <span className="label">Credits to request</span>
              <span className="value" style={{ fontSize: 18 }}>{totalCredits}</span>
            </div>

            {error && <p className="form-error">{error}</p>}
          </div>
          <div className="modal-footer">
            <button onClick={onBack} className="btn btn-secondary">Back</button>
            <button onClick={handleSubmit} disabled={totalCredits === 0 || submitting} className="btn btn-primary">
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {submitting ? "Sending…" : "Send Request"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Below 1024px the step list card is hidden; this labelled dropdown replaces it.
function MobileStepJumper({ step, setStep }: { step: number; setStep: (i: number) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const CurrentIcon = STEPS[step].icon;

  return (
    <div ref={ref} className="wizard-mobile">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="card"
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", textAlign: "left" }}
      >
        <span className="icon-tile"><CurrentIcon size={15} /></span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span className="cell-sub" style={{ display: "block" }}>Step {step + 1} of {STEPS.length}</span>
          <span className="cell-primary truncate" style={{ display: "block" }}>{STEPS[step].label}</span>
        </span>
        <ChevronDown size={16} style={{ color: "var(--text-light)", transform: open ? "rotate(180deg)" : undefined, transition: "transform .2s" }} />
      </button>
      {open && (
        <div className="dropdown-menu">
          <StepList step={step} setStep={(i) => { setStep(i); setOpen(false); }} />
        </div>
      )}
    </div>
  );
}

function StepList({ step, setStep }: { step: number; setStep: (i: number) => void }) {
  return (
    <div className="wizard-steps">
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        const done = i < step;
        const active = i === step;
        return (
          <button
            key={i}
            type="button"
            onClick={() => setStep(i)}
            className={`wizard-step${active ? " active" : done ? " done" : ""}`}
          >
            <span className="wizard-step-num">{done ? <Check size={12} strokeWidth={3} /> : i + 1}</span>
            <Icon size={15} style={{ opacity: 0.7, flexShrink: 0 }} />
            <span className="truncate">{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function FormPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { user, isLoaded } = useUser();
  const role = (user?.publicMetadata?.role as NavRole | undefined) ?? "user";

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
          // drop database-only fields before loading the submission into the form
          const rest = { ...r.data };
          for (const key of ["_id", "userId", "createdAt", "updatedAt", "__v"]) delete rest[key];
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
  }, [editId]);

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
      router.push(`/plan/dashboard?submitted=${resp.data.id}`);
    } catch {
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const goTo = (i: number) => {
    setStep(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const title = editId ? "Edit Business Plan" : "New Business Plan";
  const breadcrumb = [{ label: "Dashboard", href: "/plan/dashboard" }, { label: title }];

  if (!isLoaded) return null;

  if (loadingEdit) {
    return (
      <AppShell role={role} title={title} breadcrumb={breadcrumb}>
        <Loading label={editId ? "Loading submission…" : "Preparing your plan…"} />
      </AppShell>
    );
  }

  // Credit gate — only applies when creating a new plan (not editing an existing one)
  if (!editId && credits !== null && credits < REQUIRED_CREDITS) {
    return (
      <AppShell role={role} title={title} breadcrumb={breadcrumb}>
        <CreditGate credits={credits} required={REQUIRED_CREDITS} onBack={() => router.push("/plan/dashboard")} />
      </AppShell>
    );
  }

  const stepProps = { formData, update };
  const progress = Math.round((step / (STEPS.length - 1)) * 100);
  const StepIcon = STEPS[step].icon;

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
    <AppShell role={role} title={title} breadcrumb={breadcrumb}>
      <PageHeader
        title={title}
        subtitle="Work through each section — your answers drive the business plan narrative and the financial model."
        actions={
          <button onClick={() => router.push("/plan/dashboard")} className="btn btn-secondary">
            <ChevronLeft size={15} />
            Dashboard
          </button>
        }
      />

      <div className="wizard-layout">
        {/* Step list */}
        <aside className="wizard-sidebar card">
          <div className="card-header">
            <h3>Plan Sections</h3>
            <span className="badge badge-primary">{progress}%</span>
          </div>
          <div className="progress-bar thin">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <StepList step={step} setStep={goTo} />
        </aside>

        <div style={{ minWidth: 0 }}>
          <MobileStepJumper step={step} setStep={goTo} />

          <div className="card">
            <div className="card-header">
              <h3>
                <span className="icon-tile"><StepIcon size={16} /></span>
                <span>
                  {STEPS[step].label}
                  <span className="cell-sub" style={{ display: "block", fontWeight: 500 }}>Step {step + 1} of {STEPS.length}</span>
                </span>
              </h3>
            </div>
            <div className="progress-bar thin">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="card-body" style={{ padding: "24px 24px 28px" }}>
              {renderStep()}
            </div>
          </div>

          {step < STEPS.length - 1 && (
            <div className="wizard-nav">
              <button onClick={() => goTo(Math.max(0, step - 1))} disabled={step === 0} className="btn btn-secondary">
                <ChevronLeft size={15} />
                Previous
              </button>
              <button onClick={() => goTo(Math.min(STEPS.length - 1, step + 1))} className="btn btn-primary">
                Next<span className="hidden sm:inline">: {STEPS[step + 1].label}</span>
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default function FormPage() {
  return (
    <Suspense
      fallback={
        <div className="cm-app">
          <Loading label="Loading…" />
        </div>
      }
    >
      <FormPageContent />
    </Suspense>
  );
}
