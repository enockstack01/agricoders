"use client";
import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import AppShell, { NavRole } from "@/components/layout/AppShell";
import StatsCard from "@/components/ui/StatsCard";
import Badge, { roleBadgeVariant } from "@/components/ui/Badge";
import MiniBarChart from "@/components/ui/MiniBarChart";
import {
  Users,
  FileText,
  BarChart2,
  Activity,
  Search,
  ChevronDown,
  Loader2,
  Shield,
  AlertTriangle,
  RefreshCw,
  Coins,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  Inbox,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  totalSubmissions: number;
  plansThisWeek: number;
  activeUsers: number;
  admins: number;
  dailyCounts: Record<string, number>;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  submissionCount: number;
  lastActive: string | number | null;
  createdAt: number;
  imageUrl: string;
  credits: number;
}

interface AdminSubmission {
  _id: string;
  userId: string;
  userName: string;
  companyInfo?: { companyName?: string; companyFocus?: string; location?: string; currency?: string };
  createdAt: string;
}

interface CreditRequestItem {
  _id: string;
  userId: string;
  status: "pending" | "approved" | "rejected";
  documents: { type: string; count: number }[];
  creditsRequested: number;
  note?: string;
  adminNote?: string;
  reviewedAt?: string;
  createdAt: string;
  user: { name: string; email: string; imageUrl: string };
}

type Tab = "overview" | "users" | "submissions" | "credits" | "requests";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const role = (user?.publicMetadata?.role as NavRole | undefined) ?? "user";

  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [submissionsTotal, setSubmissionsTotal] = useState(0);
  const [submissionsPage, setSubmissionsPage] = useState(1);
  const [submissionsSearch, setSubmissionsSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [requests, setRequests] = useState<CreditRequestItem[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestsFilter, setRequestsFilter] = useState<"pending" | "all">("pending");
  const [forbidden, setForbidden] = useState(false);

  // Redirect non-admins
  useEffect(() => {
    if (isLoaded && role === "user") router.replace("/dashboard");
  }, [isLoaded, role, router]);

  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const { data } = await axios.get("/api/admin/stats");
      setStats(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 403) setForbidden(true);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const { data } = await axios.get("/api/admin/users");
      setUsers(data.users);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const loadSubmissions = useCallback(async (page = 1, search = "") => {
    setLoadingSubmissions(true);
    try {
      const { data } = await axios.get(`/api/admin/submissions?page=${page}&limit=20&search=${encodeURIComponent(search)}`);
      setSubmissions(data.submissions);
      setSubmissionsTotal(data.total);
    } finally {
      setLoadingSubmissions(false);
    }
  }, []);

  const loadRequests = useCallback(async (filter: "pending" | "all" = "pending") => {
    setLoadingRequests(true);
    try {
      const { data } = await axios.get(`/api/admin/credits/requests?status=${filter}`);
      setRequests(data);
    } finally {
      setLoadingRequests(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  useEffect(() => {
    if (tab === "users" && users.length === 0) loadUsers();
    if (tab === "submissions") loadSubmissions(submissionsPage, submissionsSearch);
    if (tab === "requests") loadRequests(requestsFilter);
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isLoaded || role === "user") return null;

  if (forbidden) {
    return (
      <AppShell role={role} title="Admin Panel" breadcrumb={[{ label: "Dashboard", href: "/dashboard" }, { label: "Admin" }]}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertTriangle size={40} className="text-amber-400 mb-3" />
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Access Denied</h2>
          <p className="text-sm text-gray-500">You need Admin or Super Admin role to view this page.</p>
        </div>
      </AppShell>
    );
  }

  const pendingRequestCount = requests.filter((r) => r.status === "pending").length;

  const TABS: { key: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: "overview", label: "Overview", icon: <BarChart2 size={15} /> },
    { key: "users", label: "Users", icon: <Users size={15} /> },
    { key: "submissions", label: "All Plans", icon: <FileText size={15} /> },
    { key: "credits", label: "Credits", icon: <Coins size={15} /> },
    { key: "requests", label: "Requests", icon: <Inbox size={15} />, badge: pendingRequestCount },
  ];

  const filteredUsers = userSearch
    ? users.filter((u) => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
    : users;

  const totalPages = Math.ceil(submissionsTotal / 20);

  return (
    <AppShell
      role={role}
      title="Admin Panel"
      breadcrumb={[{ label: "Dashboard", href: "/dashboard" }, { label: "Admin Panel" }]}
    >
      {/* Tab bar */}
      <div className="flex items-center gap-0.5 bg-gray-100 p-1 rounded-xl mb-6 w-full sm:w-auto sm:inline-flex">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-1 sm:flex-none justify-center ${
              tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.icon}
            {t.label}
            {t.badge != null && t.badge > 0 && (
              <span className="ml-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Overview ─────────────────────────────────────── */}
      {tab === "overview" && (
        <div className="space-y-6">
          {loadingStats ? (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading stats…</span>
            </div>
          ) : stats ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard label="Total Users" value={stats.totalUsers.toLocaleString()} sub="registered" icon={<Users size={18} />} accent="blue" />
                <StatsCard label="Total Plans" value={stats.totalSubmissions.toLocaleString()} sub="all time" icon={<FileText size={18} />} accent="green" />
                <StatsCard label="Plans This Week" value={stats.plansThisWeek.toLocaleString()} sub="last 7 days" icon={<Activity size={18} />} accent="purple" />
                <StatsCard label="Active Users" value={stats.activeUsers.toLocaleString()} sub="have created plans" icon={<Shield size={18} />} accent="amber" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Activity chart */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 text-sm">Plans Created — Last 7 Days</h3>
                    <button onClick={loadStats} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                      <RefreshCw size={14} />
                    </button>
                  </div>
                  <MiniBarChart data={stats.dailyCounts} />
                </div>

                {/* Summary table */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 text-sm mb-4">System Summary</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Total registered users", val: stats.totalUsers },
                      { label: "Users with plans", val: stats.activeUsers },
                      { label: "Inactive users (no plans)", val: stats.totalUsers - stats.activeUsers },
                      { label: "Admin/Super Admin accounts", val: stats.admins },
                      { label: "Plans created this week", val: stats.plansThisWeek },
                      { label: "Avg plans per active user", val: stats.activeUsers > 0 ? (stats.totalSubmissions / stats.activeUsers).toFixed(1) : "—" },
                    ].map((r) => (
                      <div key={r.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-gray-600">{r.label}</span>
                        <span className="text-sm font-semibold text-gray-900">{typeof r.val === "number" ? r.val.toLocaleString() : r.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400 text-sm">Failed to load stats.</div>
          )}
        </div>
      )}

      {/* ── Users ────────────────────────────────────────── */}
      {tab === "users" && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">All Users ({users.length})</h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users…"
                className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm w-full sm:w-52 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading users…</span>
            </div>
          ) : (
            <>
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">User ID</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Plans</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Credits</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Last Active</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {u.imageUrl ? (
                              <img src={u.imageUrl} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <Users size={12} className="text-gray-500" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">{u.name || "—"}</p>
                              <p className="text-xs text-gray-400 truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 hidden xl:table-cell">
                          <span className="font-mono text-[11px] text-gray-400 select-all">{u.id}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant={roleBadgeVariant(u.role)}>
                            {u.role === "super_admin" ? "Super Admin" : u.role === "admin" ? "Admin" : "User"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-sm font-semibold ${u.submissionCount > 0 ? "text-green-700" : "text-gray-400"}`}>
                            {u.submissionCount}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                            u.credits === 0
                              ? "bg-red-50 text-red-600"
                              : u.credits < 10
                              ? "bg-amber-50 text-amber-700"
                              : "bg-green-50 text-green-700"
                          }`}>
                            <Coins size={10} />
                            {u.credits}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 text-sm hidden lg:table-cell">
                          {u.lastActive ? new Date(u.lastActive).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 text-sm hidden lg:table-cell">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile user cards */}
              <div className="sm:hidden divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="px-4 py-3.5 flex items-center gap-3">
                    {u.imageUrl
                      ? <img src={u.imageUrl} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                      : <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><Users size={14} className="text-gray-500" /></div>
                    }
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{u.name || "—"}</p>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                      <p className="text-[10px] font-mono text-gray-300 truncate select-all mt-0.5">{u.id}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant={roleBadgeVariant(u.role)}>
                          {u.role === "super_admin" ? "Super Admin" : u.role === "admin" ? "Admin" : "User"}
                        </Badge>
                        <span className="text-xs text-gray-400">{u.submissionCount} plan{u.submissionCount !== 1 ? "s" : ""}</span>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                          u.credits === 0
                            ? "bg-red-50 text-red-600"
                            : u.credits < 10
                            ? "bg-amber-50 text-amber-700"
                            : "bg-green-50 text-green-700"
                        }`}>
                          <Coins size={9} />
                          {u.credits} cr
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── All Submissions ───────────────────────────────── */}
      {tab === "submissions" && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">All Business Plans ({submissionsTotal})</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={submissionsSearch}
                  onChange={(e) => { setSubmissionsSearch(e.target.value); setSubmissionsPage(1); loadSubmissions(1, e.target.value); }}
                  placeholder="Search companies…"
                  className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm w-full sm:w-52 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button onClick={() => loadSubmissions(submissionsPage, submissionsSearch)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors flex-shrink-0">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {loadingSubmissions ? (
            <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading…</span>
            </div>
          ) : (
            <>
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Company</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Owner</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Industry</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Currency</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {submissions.map((s) => (
                      <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-gray-900 text-sm truncate max-w-[160px]">{s.companyInfo?.companyName || "—"}</p>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 text-sm hidden md:table-cell truncate max-w-[140px]">{s.userName}</td>
                        <td className="px-4 py-3.5 text-gray-500 text-sm hidden lg:table-cell">{s.companyInfo?.companyFocus || "—"}</td>
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          {s.companyInfo?.currency && (
                            <Badge variant="gray">{s.companyInfo.currency}</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 text-sm whitespace-nowrap">
                          {new Date(s.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden divide-y divide-gray-100">
                {submissions.map((s) => (
                  <div key={s._id} className="px-4 py-3.5">
                    <p className="text-sm font-medium text-gray-900">{s.companyInfo?.companyName || "—"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.userName} · {s.companyInfo?.companyFocus || "No industry"}</p>
                    <p className="text-xs text-gray-400">{new Date(s.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
                  <span className="text-xs text-gray-400">Page {submissionsPage} of {totalPages}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { const p = submissionsPage - 1; setSubmissionsPage(p); loadSubmissions(p, submissionsSearch); }}
                      disabled={submissionsPage <= 1}
                      className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => { const p = submissionsPage + 1; setSubmissionsPage(p); loadSubmissions(p, submissionsSearch); }}
                      disabled={submissionsPage >= totalPages}
                      className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Credits tab ─────────────────────────────────────────────────────── */}
      {tab === "credits" && <AdminCreditsPanel />}

      {/* ── Requests tab ────────────────────────────────────────────────────── */}
      {tab === "requests" && (
        <AdminRequestsPanel
          requests={requests}
          loading={loadingRequests}
          filter={requestsFilter}
          onFilterChange={(f) => { setRequestsFilter(f); loadRequests(f); }}
          onRefresh={() => loadRequests(requestsFilter)}
          onReviewed={(id, status, adminNote) => {
            setRequests((prev) =>
              prev.map((r) => r._id === id ? { ...r, status, adminNote } : r)
            );
          }}
        />
      )}
    </AppShell>
  );
}

// ── Admin Requests Panel ──────────────────────────────────────────────────────

function AdminRequestsPanel({
  requests,
  loading,
  filter,
  onFilterChange,
  onRefresh,
  onReviewed,
}: {
  requests: CreditRequestItem[];
  loading: boolean;
  filter: "pending" | "all";
  onFilterChange: (f: "pending" | "all") => void;
  onRefresh: () => void;
  onReviewed: (id: string, status: "approved" | "rejected", adminNote?: string) => void;
}) {
  const [reviewing, setReviewing] = useState<{ id: string; action: "approve" | "reject" } | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function startReview(id: string, action: "approve" | "reject") {
    setReviewing({ id, action });
    setAdminNote("");
    setError("");
  }

  function cancelReview() {
    setReviewing(null);
    setAdminNote("");
    setError("");
  }

  async function confirmReview() {
    if (!reviewing) return;
    setSubmitting(true);
    setError("");
    try {
      await axios.patch(`/api/admin/credits/requests/${reviewing.id}`, {
        action: reviewing.action,
        adminNote: adminNote.trim() || undefined,
      });
      onReviewed(reviewing.id, reviewing.action === "approve" ? "approved" : "rejected", adminNote.trim() || undefined);
      setReviewing(null);
      setAdminNote("");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Action failed. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const DOC_LABELS: Record<string, string> = {
    "business-plan": "Business Plan",
    "financial-model": "Financial Model",
  };

  const STATUS_COLORS: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="space-y-4">
      {/* Header + filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg w-fit">
          {(["pending", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f === "pending" ? "Pending" : "All Requests"}
            </button>
          ))}
        </div>
        <button
          onClick={onRefresh}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading requests…</span>
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-gray-200 rounded-xl">
          <Inbox size={32} className="text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-500">No {filter === "pending" ? "pending" : ""} requests</p>
          <p className="text-xs text-gray-400 mt-1">Users will appear here when they request credits.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const isReviewing = reviewing?.id === req._id;
            return (
              <div
                key={req._id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* User */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {req.user.imageUrl ? (
                      <img src={req.user.imageUrl} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <Users size={14} className="text-gray-500" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{req.user.name || "—"}</p>
                      <p className="text-xs text-gray-400 truncate">{req.user.email}</p>
                    </div>
                  </div>

                  {/* Request details */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap gap-1.5">
                      {req.documents.map((d, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium"
                        >
                          <FileText size={10} />
                          {d.count}× {DOC_LABELS[d.type] ?? d.type}
                        </span>
                      ))}
                      <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-semibold">
                        <Coins size={10} />
                        {req.creditsRequested} credits
                      </span>
                    </div>
                    {req.note && (
                      <p className="text-xs text-gray-500 italic">&ldquo;{req.note}&rdquo;</p>
                    )}
                    {req.adminNote && (
                      <p className="text-xs text-gray-400">Admin note: <span className="text-gray-600">{req.adminNote}</span></p>
                    )}
                    <p className="text-xs text-gray-400">
                      <Clock size={10} className="inline mr-1" />
                      {new Date(req.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>

                  {/* Status + actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full border capitalize ${STATUS_COLORS[req.status]}`}>
                      {req.status}
                    </span>
                    {req.status === "pending" && !isReviewing && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => startReview(req._id, "approve")}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          <CheckCircle size={12} />
                          Approve
                        </button>
                        <button
                          onClick={() => startReview(req._id, "reject")}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-medium rounded-lg transition-colors"
                        >
                          <XCircle size={12} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inline review form */}
                {isReviewing && (
                  <div className={`px-5 py-4 border-t ${reviewing.action === "approve" ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
                    <p className="text-xs font-semibold mb-2 text-gray-700">
                      {reviewing.action === "approve"
                        ? `Approve and grant ${req.creditsRequested} credits to ${req.user.name}?`
                        : `Reject this request from ${req.user.name}?`}
                    </p>
                    <input
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Add a note for the user (optional)…"
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white mb-3"
                    />
                    {error && (
                      <p className="text-xs text-red-600 mb-2">{error}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={cancelReview}
                        disabled={submitting}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmReview}
                        disabled={submitting}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-lg transition-colors disabled:opacity-60 ${
                          reviewing.action === "approve"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {submitting && <Loader2 size={11} className="animate-spin" />}
                        {reviewing.action === "approve" ? "Confirm Approve" : "Confirm Reject"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Admin Credits Panel ───────────────────────────────────────────────────────

function AdminCreditsPanel() {
  // Assign state
  const [assignUserId, setAssignUserId] = useState("");
  const [assignCredits, setAssignCredits] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [assignNote, setAssignNote] = useState("");
  const [assignSubmitting, setAssignSubmitting] = useState(false);
  const [assignResult, setAssignResult] = useState<{ ok: boolean; message: string } | null>(null);

  // Lookup state
  const [lookupId, setLookupId] = useState("");
  const [lookupData, setLookupData] = useState<{
    credits: number;
    transactions: { type: string; credits: number; balanceAfter: number; paymentAmount?: number; currency?: string; note?: string; createdAt: string }[];
  } | null>(null);
  const [looking, setLooking] = useState(false);
  const [lookupError, setLookupError] = useState("");

  // Deduct state
  const [deductUserId, setDeductUserId] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState("");
  const [deductAmt, setDeductAmt] = useState("");
  const [deductNote, setDeductNote] = useState("");
  const [deductSubmitting, setDeductSubmitting] = useState(false);
  const [deductResult, setDeductResult] = useState<{ ok: boolean; message: string } | null>(null);

  // Collapsible
  const [openSection, setOpenSection] = useState<"assign" | "lookup" | "deduct" | null>("assign");
  const toggle = (s: "assign" | "lookup" | "deduct") =>
    setOpenSection((prev) => (prev === s ? null : s));

  const CURRENCIES = ["USD", "EUR", "GBP", "RWF", "KES", "NGN", "ZAR", "UGX", "TZS"];

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignUserId.trim() || !assignCredits) return;
    setAssignSubmitting(true);
    setAssignResult(null);
    try {
      const { data } = await axios.post("/api/admin/credits/assign", {
        userId: assignUserId.trim(),
        credits: parseInt(assignCredits),
        paymentAmount: paymentAmount || undefined,
        currency,
        note: assignNote || undefined,
      });
      setAssignResult({ ok: true, message: `Assigned ${assignCredits} credits. New balance: ${data.newBalance}` });
      setAssignUserId(""); setAssignCredits(""); setPaymentAmount(""); setAssignNote("");
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? (err.response?.data?.error || "Failed") : "Failed";
      setAssignResult({ ok: false, message: msg });
    } finally {
      setAssignSubmitting(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim()) return;
    setLooking(true);
    setLookupError("");
    setLookupData(null);
    try {
      const { data } = await axios.get(`/api/admin/credits/assign?userId=${encodeURIComponent(lookupId.trim())}`);
      setLookupData(data);
    } catch {
      setLookupError("Failed to load user credits. Check the User ID.");
    } finally {
      setLooking(false);
    }
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deductUserId.trim()) return;
    setChecking(true);
    setCheckError("");
    setBalance(null);
    setDeductAmt("");
    setDeductResult(null);
    try {
      const { data } = await axios.get(`/api/admin/credits/assign?userId=${encodeURIComponent(deductUserId.trim())}`);
      setBalance(data.credits as number);
    } catch {
      setCheckError("Could not load balance. Check the User ID and try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleDeduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deductUserId.trim() || !deductAmt || balance === null) return;
    setDeductSubmitting(true);
    setDeductResult(null);
    try {
      const { data } = await axios.post("/api/admin/credits/deduct", {
        userId: deductUserId.trim(),
        credits: parseInt(deductAmt),
        note: deductNote || undefined,
      });
      setDeductResult({ ok: true, message: `Dismissed ${data.deducted} credits. New balance: ${data.newBalance}` });
      setBalance(data.newBalance as number);
      setDeductAmt("");
      setDeductNote("");
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? (err.response?.data?.error || "Failed") : "Failed";
      setDeductResult({ ok: false, message: msg });
    } finally {
      setDeductSubmitting(false);
    }
  };

  const maxDeduct = balance ?? 0;

  return (
    <div className="space-y-1.5 max-w-xl">

      {/* ── Assign Credits ──────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => toggle("assign")}
          className="w-full px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <Coins size={14} className="text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm leading-tight">Assign Credits</p>
              <p className="text-xs text-gray-400 leading-tight mt-0.5">Add credits to a user account</p>
            </div>
          </div>
          <ChevronDown size={14} className={`text-gray-400 transition-transform flex-shrink-0 ${openSection === "assign" ? "rotate-180" : ""}`} />
        </button>
        {openSection === "assign" && (
          <form onSubmit={handleAssign} className="px-5 pb-5 pt-3 border-t border-gray-100 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">User Account ID <span className="text-red-500">*</span></label>
              <input
                value={assignUserId}
                onChange={(e) => setAssignUserId(e.target.value)}
                placeholder="user_2abc123def..."
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-400 mt-1">User can find this in Profile → Account.</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Credits <span className="text-red-500">*</span></label>
                <input
                  type="number" min={1} value={assignCredits}
                  onChange={(e) => setAssignCredits(e.target.value)}
                  placeholder="50" required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Amount</label>
                <input
                  type="number" min={0} step={0.01} value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Currency</label>
                <select
                  value={currency} onChange={(e) => setCurrency(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Note</label>
              <input
                value={assignNote} onChange={(e) => setAssignNote(e.target.value)}
                placeholder="e.g. Monthly subscription payment"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {assignResult && (
              <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${assignResult.ok ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
                {assignResult.ok ? <CheckCircle size={14} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />}
                {assignResult.message}
              </div>
            )}
            <div className="flex items-center justify-between gap-3 pt-0.5">
              <p className="text-xs text-gray-400">1 credit = $1</p>
              <button
                type="submit" disabled={assignSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {assignSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Coins size={13} />}
                {assignSubmitting ? "Assigning…" : "Assign Credits"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── Lookup Credits ──────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => toggle("lookup")}
          className="w-full px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Search size={14} className="text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm leading-tight">Lookup User Credits</p>
              <p className="text-xs text-gray-400 leading-tight mt-0.5">Check balance and transaction history</p>
            </div>
          </div>
          <ChevronDown size={14} className={`text-gray-400 transition-transform flex-shrink-0 ${openSection === "lookup" ? "rotate-180" : ""}`} />
        </button>
        {openSection === "lookup" && (
          <div className="px-5 pb-5 pt-3 border-t border-gray-100">
            <form onSubmit={handleLookup} className="flex gap-2 mb-3">
              <input
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                placeholder="Paste User Account ID…"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit" disabled={looking}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {looking ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
                Lookup
              </button>
            </form>
            {lookupError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-3">
                <AlertCircle size={14} /> {lookupError}
              </div>
            )}
            {lookupData && (
              <>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
                  <span className="text-sm text-gray-600 font-medium">Current Balance</span>
                  <span className="text-xl font-bold text-gray-900">{lookupData.credits} credits</span>
                </div>
                {lookupData.transactions.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Recent Transactions</p>
                    <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden max-h-56 overflow-y-auto">
                      {lookupData.transactions.map((tx, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2 bg-white text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded-full font-medium ${tx.credits > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {tx.credits > 0 ? `+${tx.credits}` : tx.credits}
                            </span>
                            <span className="text-gray-600 capitalize">{tx.type}</span>
                            {tx.paymentAmount && <span className="text-gray-400">({tx.paymentAmount} {tx.currency})</span>}
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <span>→ {tx.balanceAfter}</span>
                            <Clock size={10} />
                            <span>{new Date(tx.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No transactions yet for this account.</p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Dismiss Credits ─────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => toggle("deduct")}
          className="w-full px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertCircle size={14} className="text-red-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm leading-tight">Dismiss Credits</p>
              <p className="text-xs text-gray-400 leading-tight mt-0.5">Remove credits from a user account</p>
            </div>
          </div>
          <ChevronDown size={14} className={`text-gray-400 transition-transform flex-shrink-0 ${openSection === "deduct" ? "rotate-180" : ""}`} />
        </button>
        {openSection === "deduct" && (
          <div className="px-5 pb-5 pt-3 border-t border-gray-100 space-y-3">
            <form onSubmit={handleCheck} className="space-y-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">User Account ID <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <input
                  value={deductUserId}
                  onChange={(e) => { setDeductUserId(e.target.value); setBalance(null); setDeductResult(null); }}
                  placeholder="user_2abc123def..."
                  required
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <button
                  type="submit" disabled={checking || !deductUserId.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-900 hover:bg-black disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                >
                  {checking ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
                  {checking ? "Checking…" : "Check Balance"}
                </button>
              </div>
              {checkError && (
                <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  <AlertCircle size={13} /> {checkError}
                </div>
              )}
            </form>
            {balance !== null && (
              <form onSubmit={handleDeduct} className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 font-medium">Current Balance</span>
                  <span className={`text-xl font-bold ${balance === 0 ? "text-red-500" : "text-gray-900"}`}>
                    {balance} credits
                  </span>
                </div>
                {balance === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-1">This user has no credits to dismiss.</p>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Credits to Dismiss <span className="text-red-500">*</span></label>
                        <input
                          type="number" min={1} max={maxDeduct} value={deductAmt}
                          onChange={(e) => setDeductAmt(e.target.value)}
                          placeholder={`1 – ${maxDeduct}`} required
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                        />
                        <p className="text-xs text-gray-400 mt-1">Max {maxDeduct}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Reason</label>
                        <input
                          value={deductNote} onChange={(e) => setDeductNote(e.target.value)}
                          placeholder="e.g. Correction"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                        />
                      </div>
                    </div>
                    {deductResult && (
                      <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${deductResult.ok ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
                        {deductResult.ok ? <CheckCircle size={14} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />}
                        {deductResult.message}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={deductSubmitting || !deductAmt || parseInt(deductAmt) < 1 || parseInt(deductAmt) > maxDeduct}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      {deductSubmitting ? <Loader2 size={14} className="animate-spin" /> : <AlertCircle size={14} />}
                      {deductSubmitting ? "Dismissing…" : "Dismiss Credits"}
                    </button>
                  </>
                )}
              </form>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
