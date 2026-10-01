"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import axios from "axios";
import AppShell, { NavRole } from "@/components/layout/AppShell";
import StatsCard from "@/components/ui/StatsCard";
import { Loading, EmptyState, Modal, Stepper } from "@/components/plan/ui";
import {
  Sparkles,
  FileText,
  Download,
  Edit2,
  Trash2,
  PlusCircle,
  Search,
  BarChart2,
  Calendar,
  Layers,
  Loader2,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Coins,
  ChevronDown,
  CheckCircle2,
  Send,
  Settings,
  Zap,
} from "@/components/plan/icons";

interface Submission {
  _id: string;
  companyInfo: {
    companyName: string;
    productName: string;
    companyFocus?: string;
    location?: string;
    currency?: string;
  };
  createdAt: string;
}

type StoredMeta = Record<string, { docx?: string; xlsx?: string }>;

const fmt = (n: number) => n.toLocaleString();
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" });

const CREDITS_PER_DOC = 5;

const GEN_MESSAGES = [
  "Analysing your business data…",
  "Generating AI narrative…",
  "Building financial projections…",
  "Embedding professional charts…",
  "Formatting your document…",
  "Finalising everything…",
];

// ── Generating overlay ────────────────────────────────────────────────────────
function GeneratingOverlay({ docType, companyName }: { docType: string; companyName: string }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const msgIv = setInterval(() => {
      setMsgIdx((i) => (i + 1) % GEN_MESSAGES.length);
    }, 3500);
    const progIv = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 6, 88));
    }, 2000);
    return () => { clearInterval(msgIv); clearInterval(progIv); };
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal modal-sm">
        <div className="modal-body" style={{ textAlign: "center", padding: "32px 28px" }}>
          <div style={{ position: "relative", width: 64, height: 64, margin: "0 auto 20px" }}>
            <div className="spinner lg" />
            <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
              {docType === "business-plan" ? <FileText size={22} /> : <BarChart2 size={22} />}
            </span>
          </div>
          <h3 className="section-title" style={{ marginBottom: 4 }}>
            Generating {docType === "business-plan" ? "Business Plan" : "Financial Model"}
          </h3>
          <p className="page-subtitle" style={{ marginTop: 0, marginBottom: 20 }}>{companyName}</p>
          <div className="progress-bar" style={{ marginBottom: 14 }}>
            <div className="progress-bar-fill" style={{ width: `${progress}%`, transitionDuration: "2s" }} />
          </div>
          <p className="text-primary" style={{ fontSize: 14, fontWeight: 600, minHeight: 18, color: "var(--primary)" }}>
            {GEN_MESSAGES[msgIdx]}
          </p>
          <p className="form-hint" style={{ marginTop: 10 }}>
            This usually takes 30–90 seconds. Please do not close this page.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Credits request modal ─────────────────────────────────────────────────────
function CreditsModal({ required, balance, onClose }: { required: number; balance: number; onClose: () => void }) {
  const [bpCount, setBpCount] = useState(required > 0 ? 1 : 0);
  const [fmCount, setFmCount] = useState(0);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const totalCredits = (bpCount + fmCount) * CREDITS_PER_DOC;
  const canSubmit = totalCredits > 0 && !submitting;

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

  if (submitted) {
    return (
      <Modal onClose={onClose}>
        <EmptyState
          icon={<CheckCircle2 size={30} />}
          title="Request Sent!"
          description="Your credit request has been submitted. The admin will review it shortly and credits will appear in your account once approved."
          action={
            <div className="page-header-actions" style={{ justifyContent: "center" }}>
              <Link href="/plan/profile" onClick={onClose} className="btn btn-secondary">View History</Link>
              <button onClick={onClose} className="btn btn-primary">Done</button>
            </div>
          }
        />
      </Modal>
    );
  }

  return (
    <Modal
      title={required === 0 ? "Request Credits" : "Insufficient Credits"}
      icon={<span className={`icon-tile ${required === 0 ? "green" : "orange"}`}><Coins size={16} /></span>}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button onClick={handleSubmit} disabled={!canSubmit} className="btn btn-primary">
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {submitting ? "Sending…" : "Send Request"}
          </button>
        </>
      }
    >
      {required === 0 ? (
        <p className="page-subtitle" style={{ marginTop: 0, marginBottom: 18 }}>
          Select the documents you need and submit a credit request.
        </p>
      ) : (
        <div className="alert-item alert-warning" style={{ marginBottom: 18 }}>
          <AlertCircle size={16} />
          <div className="alert-content">
            You need <strong>{required}</strong> credits but have <strong>{balance}</strong>. Request more from your admin below.
          </div>
        </div>
      )}

      <label className="form-label">Which documents do you need? ({CREDITS_PER_DOC} credits each)</label>
      <div className="option-row">
        <div>
          <div className="title">Business Plan (.docx)</div>
          <div className="sub">Narrative + charts</div>
        </div>
        <Stepper value={bpCount} onChange={setBpCount} />
      </div>
      <div className="option-row">
        <div>
          <div className="title">Financial Model (.xlsx)</div>
          <div className="sub">19-sheet spreadsheet</div>
        </div>
        <Stepper value={fmCount} onChange={setFmCount} />
      </div>

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

      <div className="stat-tile tone-green" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left", padding: "12px 14px" }}>
        <span className="stat-tile-label" style={{ margin: 0 }}>Credits to request</span>
        <span className="stat-tile-value" style={{ fontSize: 22 }}>{totalCredits}</span>
      </div>

      {error && <p className="form-error" style={{ marginTop: 12 }}>{error}</p>}
    </Modal>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const role = (user?.publicMetadata?.role as NavRole | undefined) ?? "user";

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [storedMeta, setStoredMeta] = useState<StoredMeta>({});
  const [credits, setCredits] = useState<number | null>(null);
  const [creditModal, setCreditModal] = useState<{ required: number; balance: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<{ code: string; message: string; detail?: string } | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  // Derive generating state for overlay
  const isGenerating = downloading !== null && downloading.endsWith("-gen");
  const generatingDocType = downloading?.includes("business-plan") ? "business-plan" : "financial-model";
  const generatingCompanyName = (() => {
    if (!downloading) return "";
    const sub = submissions.find((s) => downloading.startsWith(s._id));
    return sub?.companyInfo?.companyName ?? "";
  })();

  const loadMeta = useCallback(async (subs: Submission[]) => {
    if (subs.length === 0) return;
    try {
      const ids = subs.map((s) => s._id).join(",");
      const r = await axios.get<StoredMeta>(`/api/documents/meta?ids=${ids}`);
      setStoredMeta(r.data || {});
    } catch { /* non-fatal */ }
  }, []);

  const loadCredits = useCallback(async () => {
    try {
      const r = await axios.get<{ credits: number }>("/api/credits");
      setCredits(r.data.credits ?? 0);
    } catch { /* non-fatal */ }
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    setDbError(null);
    Promise.all([axios.get("/api/submissions"), loadCredits()])
      .then(([r]) => {
        const subs = Array.isArray(r.data) ? r.data : [];
        setSubmissions(subs);
        loadMeta(subs);
      })
      .catch((err) => {
        const data = err?.response?.data;
        if (data?.error && data?.message) {
          setDbError({ code: data.error, message: data.message, detail: data.detail });
        } else {
          setDbError({ code: "UNKNOWN", message: "Failed to load submissions. Please try again." });
        }
      })
      .finally(() => setLoading(false));
  }, [loadMeta, loadCredits]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this submission?")) return;
    setDeleting(id);
    try {
      await axios.delete(`/api/submissions/${id}`);
      setSubmissions((prev) => prev.filter((s) => s._id !== id));
      setStoredMeta((prev) => { const n = { ...prev }; delete n[id]; return n; });
    } finally {
      setDeleting(null);
    }
  };

  const handleGenerate = async (
    id: string,
    type: "business-plan" | "financial-model",
    companyName: string
  ) => {
    const key = `${id}-${type}-gen`;
    setDownloading(key);
    try {
      const ext = type === "business-plan" ? "docx" : "xlsx";
      const resp = await axios.get(`/api/generate/${type}?id=${id}`, { responseType: "blob" });
      const remaining = resp.headers["x-credits-remaining"];
      if (remaining !== undefined) setCredits(parseInt(remaining) || 0);
      triggerDownload(
        resp.data,
        `${companyName.replace(/\s+/g, "_")}_${type === "business-plan" ? "Business_Plan" : "Financial_Model"}.${ext}`
      );
      const metaRes = await axios.get<StoredMeta>(`/api/documents/meta?ids=${id}`);
      setStoredMeta((prev) => ({ ...prev, ...metaRes.data }));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 402) {
        const data = err.response.data;
        setCreditModal({ required: data.required ?? 10, balance: data.balance ?? 0 });
      } else {
        alert("Generation failed. Please try again.");
      }
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadStored = async (
    id: string,
    type: "business-plan" | "financial-model",
    companyName: string
  ) => {
    const key = `${id}-${type}-stored`;
    setDownloading(key);
    try {
      const ext = type === "business-plan" ? "docx" : "xlsx";
      const resp = await axios.get(
        `/api/generate/${type}?id=${id}&stored=true&name=${encodeURIComponent(companyName)}`,
        { responseType: "blob" }
      );
      triggerDownload(
        resp.data,
        `${companyName.replace(/\s+/g, "_")}_${type === "business-plan" ? "Business_Plan" : "Financial_Model"}.${ext}`
      );
    } catch {
      alert("Download failed. The document may no longer be available.");
    } finally {
      setDownloading(null);
    }
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const filtered = submissions.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.companyInfo?.companyName?.toLowerCase().includes(q) ||
      s.companyInfo?.companyFocus?.toLowerCase().includes(q) ||
      s.companyInfo?.location?.toLowerCase().includes(q)
    );
  });

  const totalPlans = submissions.length;
  const latestPlan = submissions[0];
  const thisMonth = submissions.filter((s) => {
    const d = new Date(s.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  if (!isLoaded) return null;

  const creditTone = credits === 0 ? "var(--red)" : credits !== null && credits < 10 ? "#F57F17" : "var(--primary)";

  return (
    <AppShell role={role} title="Dashboard" breadcrumb={[{ label: "Dashboard" }]}>
      {isGenerating && (
        <GeneratingOverlay docType={generatingDocType} companyName={generatingCompanyName} />
      )}

      {creditModal && (
        <CreditsModal
          required={creditModal.required}
          balance={creditModal.balance}
          onClose={() => setCreditModal(null)}
        />
      )}

      <section className="hero-banner">
        <div style={{ minWidth: 0 }}>
          <span className="hero-kicker"><Sparkles size={14} />Agriplan</span>
          <h1>Welcome back{user?.firstName ? `, ${user.firstName}` : ""} 👋</h1>
          <p>Manage your business plans and financial models — generate investor-ready documents in minutes.</p>
        </div>
        <div className="hero-actions">
          <button onClick={() => setCreditModal({ required: 0, balance: credits ?? 0 })} className="btn btn-secondary">
            <Send size={16} />
            Request Credits
          </button>
          <Link href="/plan/form" className="btn btn-primary">
            <PlusCircle size={18} />
            New Business Plan
          </Link>
        </div>
      </section>

      {/* KPIs */}
      <div className="kpi-grid">
        <StatsCard label="Total Plans" value={fmt(totalPlans)} sub="all time" icon={<FileText size={18} />} accent="green" />
        <StatsCard label="This Month" value={fmt(thisMonth)} sub="plans created" icon={<Calendar size={18} />} accent="blue" />
        <StatsCard
          label="Credit Balance"
          value={credits === null ? "…" : fmt(credits)}
          sub={credits === null ? undefined : `${Math.floor(credits / CREDITS_PER_DOC)} generation${Math.floor(credits / CREDITS_PER_DOC) === 1 ? "" : "s"} available`}
          icon={<Coins size={18} />}
          accent={credits === 0 ? "rose" : credits !== null && credits < 10 ? "amber" : "green"}
        />
        <StatsCard
          label="Latest Plan"
          value={latestPlan?.companyInfo?.companyName ?? "—"}
          sub={latestPlan ? new Date(latestPlan.createdAt).toLocaleDateString() : "No plans yet"}
          icon={<TrendingUp size={18} />}
          accent="purple"
        />
      </div>

      {/* Database error */}
      {dbError && (
        <div className="alert-item alert-danger" style={{ marginBottom: 24, padding: 18 }}>
          <AlertCircle size={18} />
          <div className="alert-content">
            <strong className="alert-kicker">
              {dbError.code === "CLUSTER_PAUSED" ? "MongoDB Atlas cluster is paused"
                : dbError.code === "IP_BLOCKED" ? "MongoDB Atlas IP not whitelisted"
                : "Database connection failed"}
            </strong>
            <p>{dbError.message}</p>
            {dbError.detail && <p className="mono" style={{ marginTop: 4, overflowWrap: "anywhere" }}>{dbError.detail}</p>}
            {dbError.code === "CLUSTER_PAUSED" && (
              <ol style={{ listStyle: "decimal", paddingLeft: 18, marginTop: 10 }}>
                <li>Open <a href="https://cloud.mongodb.com" target="_blank" rel="noreferrer">cloud.mongodb.com</a></li>
                <li>Click your project → find <strong>Cluster0</strong></li>
                <li>Click <strong>Resume</strong> and wait ~2 minutes</li>
              </ol>
            )}
            {dbError.code === "IP_BLOCKED" && (
              <ol style={{ listStyle: "decimal", paddingLeft: 18, marginTop: 10 }}>
                <li>Open <a href="https://cloud.mongodb.com" target="_blank" rel="noreferrer">cloud.mongodb.com</a></li>
                <li>Left sidebar → <strong>Network Access</strong> → <strong>+ Add IP Address</strong></li>
              </ol>
            )}
            {dbError.code === "AUTH_FAILED" && (
              <p style={{ marginTop: 8 }}>
                Check the <code className="cm-code">MONGODB_URI</code> in your <code className="cm-code">.env.local</code>.
              </p>
            )}
            <button onClick={load} disabled={loading} className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              {loading ? "Connecting…" : "Retry connection"}
            </button>
          </div>
        </div>
      )}

      {/* Business plans table */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3><span className="icon-tile"><FileText size={15} /></span>Your Business Plans</h3>
          {submissions.length > 0 && (
            <div className="table-search">
              <Search size={14} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search plans…" />
            </div>
          )}
        </div>

        {loading ? (
          <Loading label="Loading your plans…" />
        ) : filtered.length === 0 ? (
          search ? (
            <EmptyState
              icon={<Search size={26} />}
              title={`No results for "${search}"`}
              action={<button onClick={() => setSearch("")} className="btn btn-secondary btn-sm">Clear search</button>}
            />
          ) : (
            <EmptyState
              icon={<FileText size={28} />}
              title="No plans yet"
              description="Create your first business plan to get started."
              action={
                <Link href="/plan/form" className="btn btn-primary">
                  <PlusCircle size={14} />
                  Create Business Plan
                </Link>
              }
            />
          )
        ) : (
          <>
            {/* Desktop table */}
            <div className="table-responsive hidden lg:block">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Industry</th>
                    <th className="hidden 2xl:table-cell">Location</th>
                    <th>Created</th>
                    <th>Business Plan</th>
                    <th>Financial Model</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => {
                    const cn = s.companyInfo?.companyName || "Unnamed";
                    const meta = storedMeta[s._id] || {};
                    return (
                      <tr key={s._id}>
                        <td>
                          <div className="cell-primary truncate" style={{ maxWidth: 180 }}>{cn}</div>
                          {s.companyInfo?.productName && (
                            <div className="cell-sub truncate" style={{ maxWidth: 180 }}>{s.companyInfo.productName}</div>
                          )}
                          {s.companyInfo?.location && (
                            <div className="cell-sub truncate 2xl:hidden" style={{ maxWidth: 180 }}>{s.companyInfo.location}</div>
                          )}
                        </td>
                        <td className="cell-muted">{s.companyInfo?.companyFocus || "—"}</td>
                        <td className="cell-muted hidden 2xl:table-cell">{s.companyInfo?.location || "—"}</td>
                        <td className="cell-muted" style={{ whiteSpace: "nowrap" }}>
                          {new Date(s.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td>
                          <DocDropdown
                            submissionId={s._id} companyName={cn} type="business-plan" viewType="docx"
                            storedDate={meta.docx} downloading={downloading}
                            onGenerate={handleGenerate} onDownloadStored={handleDownloadStored}
                          />
                        </td>
                        <td>
                          <DocDropdown
                            submissionId={s._id} companyName={cn} type="financial-model" viewType="xlsx"
                            storedDate={meta.xlsx} downloading={downloading}
                            onGenerate={handleGenerate} onDownloadStored={handleDownloadStored}
                          />
                        </td>
                        <td>
                          <div className="table-actions">
                            <Link href={`/plan/form?edit=${s._id}`} className="btn-icon" title="Edit plan">
                              <Edit2 size={14} />
                            </Link>
                            <button
                              onClick={() => handleDelete(s._id)}
                              disabled={deleting === s._id}
                              className="btn-icon btn-icon-danger"
                              title="Delete plan"
                            >
                              {deleting === s._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile / tablet list */}
            <div className="lg:hidden">
              {filtered.map((s) => {
                const cn = s.companyInfo?.companyName || "Unnamed";
                const meta = storedMeta[s._id] || {};
                return (
                  <div key={s._id} className="list-row">
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
                      <div style={{ minWidth: 0 }}>
                        <div className="cell-primary">{cn}</div>
                        <div className="cell-sub">
                          {[s.companyInfo?.companyFocus, s.companyInfo?.location].filter(Boolean).join(" · ") || "No industry/location"}
                        </div>
                        <div className="cell-sub">{new Date(s.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="table-actions" style={{ alignItems: "flex-start" }}>
                        <Link href={`/plan/form?edit=${s._id}`} className="btn-icon" title="Edit plan">
                          <Edit2 size={14} />
                        </Link>
                        <button onClick={() => handleDelete(s._id)} disabled={deleting === s._id} className="btn-icon btn-icon-danger" title="Delete plan">
                          {deleting === s._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <DocDropdown
                        submissionId={s._id} companyName={cn} type="business-plan" viewType="docx"
                        storedDate={meta.docx} downloading={downloading}
                        onGenerate={handleGenerate} onDownloadStored={handleDownloadStored}
                      />
                      <DocDropdown
                        submissionId={s._id} companyName={cn} type="financial-model" viewType="xlsx"
                        storedDate={meta.xlsx} downloading={downloading}
                        onGenerate={handleGenerate} onDownloadStored={handleDownloadStored}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card-footer">
              {filtered.length} plan{filtered.length !== 1 ? "s" : ""}
              {search ? ` matching "${search}"` : " total"}
            </div>
          </>
        )}
      </div>

      {/* Quick actions + what's included */}
      <div className="chart-grid">
        <div className="card">
          <div className="card-header"><h3><span className="icon-tile"><Zap size={15} /></span>Quick Actions</h3></div>
          <div className="card-body">
            <div className="quick-actions-grid">
              <Link href="/plan/form" className="quick-action-btn">
                <span className="icon-tile"><PlusCircle size={15} /></span>
                <span><span className="title" style={{ display: "block" }}>New Business Plan</span><span className="sub">Start the 10-step wizard</span></span>
              </Link>
              <button type="button" onClick={() => setCreditModal({ required: 0, balance: credits ?? 0 })} className="quick-action-btn" style={{ textAlign: "left" }}>
                <span className="icon-tile"><Coins size={15} /></span>
                <span>
                  <span className="title" style={{ display: "block" }}>Request Credits</span>
                  <span className="sub">Balance: <strong style={{ color: creditTone }}>{credits ?? "…"}</strong></span>
                </span>
              </button>
              <Link href="/plan/profile" className="quick-action-btn">
                <span className="icon-tile"><Settings size={15} /></span>
                <span><span className="title" style={{ display: "block" }}>Plan Defaults</span><span className="sub">Currency, tax & loan rates</span></span>
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3><span className="icon-tile"><Layers size={15} /></span>What&apos;s Included</h3></div>
          <div className="card-body">
            {[
              { icon: <Layers size={15} />, tone: "green", title: "AI-Enhanced Documents", desc: "Our intelligent system creates the entire business plan proposal." },
              { icon: <BarChart2 size={15} />, tone: "blue", title: "Python Chart Engine", desc: "6 matplotlib charts embedded in your Word document automatically." },
              { icon: <Download size={15} />, tone: "purple", title: "Multi-Format Export", desc: "Business Plan (.docx) + 19-sheet Financial Model (.xlsx)." },
            ].map((f) => (
              <div key={f.title} className="summary-row" style={{ justifyContent: "flex-start", flexWrap: "nowrap", alignItems: "flex-start" }}>
                <span className={`icon-tile ${f.tone}`}>{f.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div className="cell-primary">{f.title}</div>
                  <div className="cell-sub" style={{ fontSize: 14 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// ── Document dropdown component ───────────────────────────────────────────────

interface DocDropdownProps {
  submissionId: string;
  companyName: string;
  type: "business-plan" | "financial-model";
  viewType: "docx" | "xlsx";
  storedDate?: string;
  downloading: string | null;
  onGenerate: (id: string, type: "business-plan" | "financial-model", name: string) => void;
  onDownloadStored: (id: string, type: "business-plan" | "financial-model", name: string) => void;
}

function DocDropdown({
  submissionId, companyName, type, viewType, storedDate,
  downloading, onGenerate, onDownloadStored,
}: DocDropdownProps) {
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const genKey = `${submissionId}-${type}-gen`;
  const storedKey = `${submissionId}-${type}-stored`;
  const isDocx = viewType === "docx";
  const isGenerating = downloading === genKey;
  const isDownloadingStored = downloading === storedKey;
  const isAnyLoading = !!downloading;
  const ext = isDocx ? ".docx" : ".xlsx";

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        dropRef.current && !dropRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleTrigger = () => {
    if (!open && triggerRef.current) {
      // Menu is position:fixed, so viewport coordinates are used as-is
      const rect = triggerRef.current.getBoundingClientRect();
      const dropW = 250;
      let left = rect.left;
      if (rect.left + dropW > window.innerWidth - 8) left = rect.right - dropW;
      setDropPos({ top: rect.bottom + 6, left: Math.max(8, left) });
    }
    setOpen((o) => !o);
  };

  return (
    <>
      <button
        ref={triggerRef}
        onClick={handleTrigger}
        className={`badge ${isDocx ? "badge-info" : "badge-success"}`}
        style={{ padding: "7px 10px", cursor: "pointer", fontSize: 14 }}
        aria-expanded={open}
      >
        {isDocx ? <FileText size={13} /> : <BarChart2 size={13} />}
        {isDocx ? "Business Plan" : "Financial Model"}
        {storedDate && <span style={{ opacity: 0.65, fontWeight: 500 }} className="hidden sm:inline">· {fmtDate(storedDate)}</span>}
        <ChevronDown size={12} style={{ transition: "transform .15s", transform: open ? "rotate(180deg)" : undefined }} />
      </button>

      {open && (
        <div ref={dropRef} className="dropdown-menu" style={{ position: "fixed", top: dropPos.top, left: dropPos.left, right: "auto", width: 250, zIndex: 1500 }}>
          <button
            onClick={() => { onGenerate(submissionId, type, companyName); setOpen(false); }}
            disabled={isAnyLoading}
            className="dropdown-item"
          >
            {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            <span style={{ fontWeight: 600 }}>{isGenerating ? "Generating…" : "Generate & Download"}</span>
            <span className="meta">{CREDITS_PER_DOC} cr</span>
          </button>
          <div className="dropdown-divider" />
          {storedDate ? (
            <button
              onClick={() => { onDownloadStored(submissionId, type, companyName); setOpen(false); }}
              disabled={isAnyLoading}
              className="dropdown-item"
            >
              {isDownloadingStored ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              <span>{isDownloadingStored ? "Downloading…" : `Download ${ext} · ${fmtDate(storedDate)}`}</span>
              <span className="meta" style={{ color: "var(--primary)", fontWeight: 700 }}>Free</span>
            </button>
          ) : (
            <div className="dropdown-empty" style={{ padding: "10px 16px", textAlign: "left", fontSize: 14 }}>
              No stored version yet — generate one first.
            </div>
          )}
        </div>
      )}
    </>
  );
}
