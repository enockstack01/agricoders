"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import axios from "axios";
import AppShell, { NavRole } from "@/components/layout/AppShell";
import StatsCard from "@/components/ui/StatsCard";
import {
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
} from "lucide-react";

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

function CountStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        disabled={value === 0}
      >
        −
      </button>
      <span className="w-5 text-center text-sm font-semibold text-gray-800">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
      >
        +
      </button>
    </div>
  );
}

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={24} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Request Sent!</h3>
            <p className="text-xs text-gray-500 mb-5">
              Your credit request has been submitted. The admin will review it shortly and credits will
              appear in your account once approved.
            </p>
            <div className="flex gap-2 justify-center">
              <Link
                href="/profile"
                onClick={onClose}
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200 transition-colors"
              >
                View History
              </Link>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 mb-5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${required === 0 ? "bg-green-100" : "bg-amber-100"}`}>
                <Coins size={20} className={required === 0 ? "text-green-600" : "text-amber-600"} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {required === 0 ? "Request Credits" : "Insufficient Credits"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {required === 0 ? (
                    "Select the documents you need and submit a credit request. The admin will review and approve it."
                  ) : (
                    <>
                      You need <strong>{required}</strong> credits but have{" "}
                      <strong className="text-red-600">{balance}</strong>. Request more from your admin below.
                    </>
                  )}
                </p>
              </div>
            </div>

            <p className="text-xs font-semibold text-gray-700 mb-3">
              Which documents do you need? ({CREDITS_PER_DOC} credits each)
            </p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                <div>
                  <p className="text-xs font-medium text-gray-800">Business Plan (.docx)</p>
                  <p className="text-xs text-gray-400">Narrative + charts</p>
                </div>
                <CountStepper value={bpCount} onChange={setBpCount} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
                <div>
                  <p className="text-xs font-medium text-gray-800">Financial Model (.xlsx)</p>
                  <p className="text-xs text-gray-400">19-sheet spreadsheet</p>
                </div>
                <CountStepper value={fmCount} onChange={setFmCount} />
              </div>
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note for the admin (optional)…"
              rows={2}
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            />

            <div className="flex items-center justify-between mb-4 bg-gray-50 rounded-lg px-4 py-2">
              <span className="text-xs text-gray-600">Credits to request</span>
              <span className="text-sm font-bold text-gray-900">{totalCredits}</span>
            </div>

            {error && (
              <p className="text-xs text-red-600 mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium rounded-lg border border-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                {submitting ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Send size={12} />
                )}
                {submitting ? "Sending…" : "Send Request"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

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

  const loadMeta = useCallback(async (subs: Submission[]) => {
    if (subs.length === 0) return;
    try {
      const ids = subs.map((s) => s._id).join(",");
      const r = await axios.get<StoredMeta>(`/api/documents/meta?ids=${ids}`);
      setStoredMeta(r.data || {});
    } catch {
      // non-fatal
    }
  }, []);

  const loadCredits = useCallback(async () => {
    try {
      const r = await axios.get<{ credits: number }>("/api/credits");
      setCredits(r.data.credits ?? 0);
    } catch {
      // non-fatal
    }
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    setDbError(null);
    Promise.all([
      axios.get("/api/submissions"),
      loadCredits(),
    ])
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

  useEffect(() => { load(); }, [load]);

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

  // Generate fresh document, save to DB, download
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

      // Update credit balance from response header
      const remaining = resp.headers["x-credits-remaining"];
      if (remaining !== undefined) setCredits(parseInt(remaining) || 0);

      triggerDownload(
        resp.data,
        `${companyName.replace(/\s+/g, "_")}_${type === "business-plan" ? "Business_Plan" : "Financial_Model"}.${ext}`
      );
      // Refresh stored meta after generation
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

  // Download previously stored document (no regeneration)
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

  return (
    <AppShell role={role} title="Dashboard" breadcrumb={[{ label: "Dashboard" }]}>
      {/* Credit modal */}
      {creditModal && (
        <CreditsModal
          required={creditModal.required}
          balance={creditModal.balance}
          onClose={() => setCreditModal(null)}
        />
      )}

      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your business plans and financial models
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Credit balance badge */}
          <Link
            href="/profile"
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              credits === 0
                ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                : credits !== null && credits < 10
                ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            }`}
            title="Credits balance — click to view profile"
          >
            <Coins size={14} />
            {credits === null ? "…" : `${credits} credit${credits !== 1 ? "s" : ""}`}
          </Link>
          {/* Request Credits button */}
          <button
            onClick={() => setCreditModal({ required: 0, balance: credits ?? 0 })}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            <Send size={14} className="text-green-600" />
            Request Credits
          </button>
          <Link
            href="/form"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <PlusCircle size={16} />
            New Business Plan
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatsCard label="Total Plans" value={fmt(totalPlans)} sub="all time" icon={<FileText size={18} />} accent="green" />
        <StatsCard label="This Month" value={fmt(thisMonth)} sub="plans created" icon={<Calendar size={18} />} accent="blue" />
        <StatsCard
          label="Latest Plan"
          value={latestPlan?.companyInfo?.companyName ?? "—"}
          sub={latestPlan ? new Date(latestPlan.createdAt).toLocaleDateString() : "No plans yet"}
          icon={<TrendingUp size={18} />}
          accent="purple"
        />
      </div>

      {/* Feature info row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { icon: <Layers size={15} />, title: "AI-Enhanced Documents", desc: "Our intelligent system creates the entire business plan proposal." },
          { icon: <BarChart2 size={15} />, title: "Python Chart Engine", desc: "6 matplotlib charts embedded in your Word document automatically." },
          { icon: <Download size={15} />, title: "Multi-Format Export", desc: "Business Plan (.docx, PDF) + 19-sheet Financial Model (.xlsx, PDF)." },
        ].map((f) => (
          <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3 items-start">
            <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
              {f.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800">{f.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Database error banner */}
      {dbError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-red-800 text-sm">
                {dbError.code === "CLUSTER_PAUSED" ? "MongoDB Atlas Cluster is Paused"
                  : dbError.code === "IP_BLOCKED" ? "MongoDB Atlas IP Not Whitelisted"
                  : "Database Connection Failed"}
              </p>
              <p className="text-sm text-red-700 mt-1">{dbError.message}</p>
              {dbError.detail && (
                <p className="text-xs text-red-500 mt-1 font-mono break-all">{dbError.detail}</p>
              )}
              <div className="mt-3 bg-white border border-red-200 rounded-lg p-4 space-y-2">
                {dbError.code === "CLUSTER_PAUSED" && (
                  <>
                    <p className="font-semibold text-gray-900 text-sm">Resume your free-tier cluster (takes ~2 min):</p>
                    <ol className="list-decimal pl-4 space-y-1.5 text-sm text-gray-700">
                      <li>Open <a href="https://cloud.mongodb.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">cloud.mongodb.com</a></li>
                      <li>Click your project → find <strong>Cluster0</strong></li>
                      <li>You&apos;ll see a <strong>&quot;Cluster Paused&quot;</strong> notice — click <strong>Resume</strong></li>
                      <li>Wait ~1–2 minutes for the cluster to wake up</li>
                      <li>Click <strong>Retry connection</strong> below</li>
                    </ol>
                  </>
                )}
                {dbError.code === "IP_BLOCKED" && (
                  <>
                    <p className="font-semibold text-gray-900 text-sm">Whitelist your IP address:</p>
                    <ol className="list-decimal pl-4 space-y-1.5 text-sm text-gray-700">
                      <li>Open <a href="https://cloud.mongodb.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">cloud.mongodb.com</a></li>
                      <li>Left sidebar → <strong>Network Access</strong></li>
                      <li>Click <strong>+ Add IP Address</strong></li>
                      <li>Click <strong>&quot;Add Current IP Address&quot;</strong> or type <code className="bg-gray-100 px-1 rounded text-xs font-mono">0.0.0.0/0</code> for dev</li>
                      <li>Confirm — takes ~30 seconds</li>
                    </ol>
                  </>
                )}
                {dbError.code === "AUTH_FAILED" && (
                  <p className="text-sm text-gray-700">Check the <code className="bg-gray-100 px-1 rounded text-xs font-mono">MONGODB_URI</code> in your <code className="bg-gray-100 px-1 rounded text-xs font-mono">.env.local</code>.</p>
                )}
                <button onClick={load} disabled={loading} className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-xs font-medium rounded-lg transition-colors">
                  <Loader2 size={12} className={loading ? "animate-spin" : ""} />
                  {loading ? "Connecting…" : "Retry connection"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submissions table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 text-sm">Your Business Plans</h2>
          {submissions.length > 0 && (
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search plans…"
                className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm w-full sm:w-52 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            {search ? (
              <>
                <AlertCircle size={32} className="text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-600 mb-1">No results for &quot;{search}&quot;</p>
                <button onClick={() => setSearch("")} className="text-xs text-green-600 hover:underline">Clear search</button>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <FileText size={24} className="text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">No plans yet</p>
                <p className="text-xs text-gray-400 mb-4">Create your first business plan to get started</p>
                <Link href="/form" className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors">
                  <PlusCircle size={13} />
                  Create Business Plan
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Company</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Industry</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Location</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Business Plan</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Financial Model</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((s) => {
                    const cn = s.companyInfo?.companyName || "Unnamed";
                    const meta = storedMeta[s._id] || {};
                    return (
                      <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-medium text-gray-900 text-sm truncate max-w-[160px]">{cn}</p>
                            {s.companyInfo?.productName && (
                              <p className="text-xs text-gray-400 truncate max-w-[160px]">{s.companyInfo.productName}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-500 text-sm hidden md:table-cell">{s.companyInfo?.companyFocus || "—"}</td>
                        <td className="px-4 py-4 text-gray-500 text-sm hidden lg:table-cell">{s.companyInfo?.location || "—"}</td>
                        <td className="px-4 py-4 text-gray-500 text-sm whitespace-nowrap">
                          {new Date(s.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </td>

                        {/* Business Plan actions */}
                        <td className="px-5 py-4">
                          <DocDropdown
                            submissionId={s._id}
                            companyName={cn}
                            type="business-plan"
                            viewType="docx"
                            storedDate={meta.docx}
                            downloading={downloading}
                            onGenerate={handleGenerate}
                            onDownloadStored={handleDownloadStored}
                          />
                        </td>

                        {/* Financial Model actions */}
                        <td className="px-5 py-4">
                          <DocDropdown
                            submissionId={s._id}
                            companyName={cn}
                            type="financial-model"
                            viewType="xlsx"
                            storedDate={meta.xlsx}
                            downloading={downloading}
                            onGenerate={handleGenerate}
                            onDownloadStored={handleDownloadStored}
                          />
                        </td>

                        {/* Manage */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/form?edit=${s._id}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium rounded-lg transition-colors"
                            >
                              <Edit2 size={11} />
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(s._id)}
                              disabled={deleting === s._id}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-lg transition-colors disabled:opacity-60"
                            >
                              {deleting === s._id ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile / tablet card list */}
            <div className="lg:hidden divide-y divide-gray-100">
              {filtered.map((s) => {
                const cn = s.companyInfo?.companyName || "Unnamed";
                const meta = storedMeta[s._id] || {};
                return (
                  <div key={s._id} className="px-4 py-5 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{cn}</p>
                        <p className="text-xs text-gray-400">
                          {[s.companyInfo?.companyFocus, s.companyInfo?.location].filter(Boolean).join(" · ") || "No industry/location"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(s.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Link href={`/form?edit=${s._id}`} className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors">
                          <Edit2 size={13} />
                        </Link>
                        <button onClick={() => handleDelete(s._id)} disabled={deleting === s._id} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                          {deleting === s._id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        </button>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="flex gap-2 flex-wrap">
                      <DocDropdown
                        submissionId={s._id}
                        companyName={cn}
                        type="business-plan"
                        viewType="docx"
                        storedDate={meta.docx}
                        downloading={downloading}
                        onGenerate={handleGenerate}
                        onDownloadStored={handleDownloadStored}
                      />
                      <DocDropdown
                        submissionId={s._id}
                        companyName={cn}
                        type="financial-model"
                        viewType="xlsx"
                        storedDate={meta.xlsx}
                        downloading={downloading}
                        onGenerate={handleGenerate}
                        onDownloadStored={handleDownloadStored}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400">
              {filtered.length} plan{filtered.length !== 1 ? "s" : ""}
              {search ? ` matching "${search}"` : " total"}
            </p>
          </div>
        )}
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
  const creditCost = "5 cr";
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
      const rect = triggerRef.current.getBoundingClientRect();
      const dropW = 228;
      let left = rect.left + window.scrollX;
      if (rect.left + dropW > window.innerWidth - 8) {
        left = rect.right + window.scrollX - dropW;
      }
      setDropPos({ top: rect.bottom + window.scrollY + 4, left: Math.max(8, left) });
    }
    setOpen(o => !o);
  };

  return (
    <>
      <button
        ref={triggerRef}
        onClick={handleTrigger}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
          isDocx
            ? "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
        }`}
      >
        {isDocx ? <FileText size={12} /> : <BarChart2 size={12} />}
        <span>{isDocx ? "Business Plan" : "Financial Model"}</span>
        {storedDate && <span className="text-[10px] opacity-60 hidden sm:inline">· {fmtDate(storedDate)}</span>}
        <ChevronDown size={11} className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          ref={dropRef}
          style={{ position: "fixed", top: dropPos.top, left: dropPos.left, zIndex: 9999 }}
          className="w-56 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
        >
          {/* Generate */}
          <div className="p-1">
            <button
              onClick={() => { onGenerate(submissionId, type, companyName); setOpen(false); }}
              disabled={isAnyLoading}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-xs transition-colors disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                {isGenerating
                  ? <Loader2 size={12} className="animate-spin text-gray-400" />
                  : <RefreshCw size={12} className="text-gray-400" />
                }
                <span className="font-medium text-gray-700">{isGenerating ? "Generating…" : "Generate & Download"}</span>
              </span>
              <span className="text-gray-400 text-[10px]">{creditCost}</span>
            </button>
          </div>

          {/* Download stored */}
          {storedDate ? (
            <div className="border-t border-gray-100 p-1">
              <button
                onClick={() => { onDownloadStored(submissionId, type, companyName); setOpen(false); }}
                disabled={isAnyLoading}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-xs transition-colors disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  {isDownloadingStored
                    ? <Loader2 size={12} className="animate-spin text-gray-400" />
                    : <Download size={12} className="text-gray-400" />
                  }
                  <span className="text-gray-700">
                    {isDownloadingStored ? "Downloading…" : `Download ${ext} · ${fmtDate(storedDate)}`}
                  </span>
                </span>
                <span className="text-green-600 text-[10px] font-medium">Free</span>
              </button>
            </div>
          ) : (
            <div className="border-t border-gray-100 px-3 py-2">
              <p className="text-[10px] text-gray-400">No stored version yet — generate one first.</p>
            </div>
          )}

        </div>
      )}
    </>
  );
}
