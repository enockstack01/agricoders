"use client";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import AppShell, { NavRole } from "@/components/layout/AppShell";
import StatsCard from "@/components/ui/StatsCard";
import Badge from "@/components/ui/Badge";
import {
  ShieldAlert,
  Skull,
  Database,
  RefreshCw,
  Loader2,
  ChevronDown,
  ChevronUp,
  MapPin,
  PawPrint,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Settings,
} from "lucide-react";

interface Summary {
  openAlerts: number;
  zoonoticOpenAlerts: number;
  severityCounts: Record<string, number>;
  totalRecordsSynced: number;
  sync: {
    status: "ok" | "error" | "not_configured";
    lastSyncedAt: string | null;
    lastRunAt: string | null;
    lastRunError: string | null;
    recordsFetchedLastRun: number;
    alertsCreatedLastRun: number;
  };
}

interface Alert {
  _id: string;
  type: "zoonotic_watchlist" | "mortality_spike" | "symptom_cluster";
  disease?: string;
  zoonotic: boolean;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  farmIds: string[];
  species: string[];
  district?: string;
  status: "open" | "reviewed" | "dismissed";
  detectedAt: string;
}

interface LivestockRecordRow {
  _id: string;
  species: string;
  farmName?: string;
  farmId?: string;
  eventType: string;
  diagnosis?: string;
  symptoms: string[];
  recordedAt: string;
}

const SEVERITY_STYLE: Record<Alert["severity"], { badge: "rose" | "amber" | "blue" | "gray"; dot: string }> = {
  critical: { badge: "rose", dot: "bg-rose-500" },
  high: { badge: "amber", dot: "bg-amber-500" },
  medium: { badge: "blue", dot: "bg-blue-500" },
  low: { badge: "gray", dot: "bg-gray-400" },
};

const TYPE_LABEL: Record<Alert["type"], string> = {
  zoonotic_watchlist: "Watchlist disease",
  mortality_spike: "Mortality spike",
  symptom_cluster: "Outbreak cluster",
};

function fmtDate(iso: string | null | undefined) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function OneHealthPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const role = (user?.publicMetadata?.role as NavRole | undefined) ?? "user";

  const [summary, setSummary] = useState<Summary | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"open" | "reviewed" | "dismissed" | "all">("open");
  const [severityFilter, setSeverityFilter] = useState<"all" | Alert["severity"]>("all");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [records, setRecords] = useState<LivestockRecordRow[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && role === "user") router.replace("/plan/dashboard");
  }, [isLoaded, role, router]);

  const loadSummary = useCallback(async () => {
    try {
      const { data } = await axios.get<Summary>("/api/onehealth/summary");
      setSummary(data);
    } catch {
      /* handled by empty state */
    }
  }, []);

  const loadAlerts = useCallback(async (p = 1, status = statusFilter, severity = severityFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), status, severity });
      const { data } = await axios.get(`/api/onehealth/alerts?${params}`);
      setAlerts(data.alerts);
      setTotal(data.total);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, severityFilter]);

  useEffect(() => {
    const t = setTimeout(() => {
      loadSummary();
      loadAlerts(1, statusFilter, severityFilter);
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, severityFilter]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await axios.post("/api/onehealth/sync");
      await loadSummary();
      await loadAlerts(page, statusFilter, severityFilter);
    } finally {
      setSyncing(false);
    }
  };

  const toggleExpand = async (alert: Alert) => {
    if (expanded === alert._id) {
      setExpanded(null);
      return;
    }
    setExpanded(alert._id);
    setLoadingRecords(true);
    try {
      const { data } = await axios.get(`/api/onehealth/alerts/${alert._id}`);
      setRecords(data.records);
    } finally {
      setLoadingRecords(false);
    }
  };

  const updateStatus = async (id: string, status: Alert["status"]) => {
    setUpdating(id);
    try {
      await axios.patch(`/api/onehealth/alerts/${id}`, { status });
      setAlerts((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
      loadSummary();
    } finally {
      setUpdating(null);
    }
  };

  if (!isLoaded || role === "user") return null;

  return (
    <AppShell
      role={role}
      title="One Health Intelligence"
      breadcrumb={[{ label: "Dashboard", href: "/plan/dashboard" }, { label: "One Health" }]}
    >
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">One Health Intelligence</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Disease risk signals synced automatically from LivestockPro.
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {syncing ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
          Sync now
        </button>
      </div>

      {summary?.sync.status === "not_configured" && (
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 mb-6 text-sm text-amber-800 dark:text-amber-300">
          <Settings size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">LivestockPro connection not configured yet</p>
            <p className="mt-0.5">
              Set <code className="font-mono">LIVESTOCK_API_URL</code> and <code className="font-mono">LIVESTOCK_API_KEY</code> once
              LivestockPro exposes the records feed — this dashboard will start syncing automatically.
            </p>
          </div>
        </div>
      )}

      {summary?.sync.status === "error" && (
        <div className="flex items-start gap-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl px-4 py-3 mb-6 text-sm text-rose-800 dark:text-rose-300">
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Last sync failed</p>
            <p className="mt-0.5">{summary.sync.lastRunError ?? "Unknown error"}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          label="Open alerts"
          value={summary?.openAlerts ?? "—"}
          icon={<ShieldAlert size={18} />}
          accent="rose"
        />
        <StatsCard
          label="Zoonotic risk (open)"
          value={summary?.zoonoticOpenAlerts ?? "—"}
          icon={<Skull size={18} />}
          accent="amber"
        />
        <StatsCard
          label="Records synced"
          value={summary?.totalRecordsSynced ?? "—"}
          icon={<Database size={18} />}
          accent="blue"
        />
        <StatsCard
          label="Last sync"
          value={summary ? fmtDate(summary.sync.lastSyncedAt) : "—"}
          sub={summary?.sync.status === "ok" ? "Healthy" : summary?.sync.status}
          icon={<RefreshCw size={18} />}
          accent="green"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {(["open", "reviewed", "dismissed", "all"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              statusFilter === s
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {s}
          </button>
        ))}
        <span className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
        {(["all", "critical", "high", "medium", "low"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSeverityFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              severityFilter === s
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <ShieldAlert size={28} className="text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No {statusFilter !== "all" ? statusFilter : ""} alerts</p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              Risk signals detected from LivestockPro data will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {alerts.map((a) => {
              const style = SEVERITY_STYLE[a.severity];
              const isOpen = expanded === a._id;
              return (
                <div key={a._id}>
                  <button
                    onClick={() => toggleExpand(a)}
                    className="w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${style.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{a.title}</p>
                        {a.zoonotic && <Badge variant="rose">Zoonotic</Badge>}
                        <Badge variant={style.badge}>{a.severity}</Badge>
                        <Badge variant="gray">{TYPE_LABEL[a.type]}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{a.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400 dark:text-gray-500 flex-wrap">
                        {a.district && <span className="flex items-center gap-1"><MapPin size={11} />{a.district}</span>}
                        <span className="flex items-center gap-1"><PawPrint size={11} />{a.species.join(", ")}</span>
                        <span>{a.farmIds.length} farm{a.farmIds.length === 1 ? "" : "s"}</span>
                        <span>Detected {fmtDate(a.detectedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {a.status === "open" && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateStatus(a._id, "reviewed"); }}
                            disabled={updating === a._id}
                            title="Mark reviewed"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateStatus(a._id, "dismissed"); }}
                            disabled={updating === a._id}
                            title="Dismiss"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pl-9">
                      {loadingRecords ? (
                        <div className="flex items-center gap-2 text-xs text-gray-400 py-3">
                          <Loader2 size={13} className="animate-spin" /> Loading records…
                        </div>
                      ) : (
                        <div className="border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
                          {records.map((r) => (
                            <div key={r._id} className="px-3 py-2 text-xs border-b last:border-b-0 border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 flex-wrap">
                              <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">{r.species}</span>
                                <span className="text-gray-400 dark:text-gray-600"> · {r.farmName ?? r.farmId ?? "Unknown farm"}</span>
                                {r.diagnosis && <span className="text-gray-500 dark:text-gray-400"> · {r.diagnosis}</span>}
                                {r.symptoms?.length > 0 && (
                                  <span className="text-gray-400 dark:text-gray-600"> · {r.symptoms.join(", ")}</span>
                                )}
                              </div>
                              <span className="text-gray-400 dark:text-gray-600 flex-shrink-0">{fmtDate(r.recordedAt)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {total > 20 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
            <span>Page {page} of {Math.ceil(total / 20)}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => loadAlerts(page - 1)}
                className="px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page >= Math.ceil(total / 20)}
                onClick={() => loadAlerts(page + 1)}
                className="px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
