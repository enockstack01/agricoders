"use client";
import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import AppShell, { NavRole } from "@/components/layout/AppShell";
import StatsCard from "@/components/ui/StatsCard";
import Badge, { roleBadgeVariant } from "@/components/ui/Badge";
import MiniBarChart from "@/components/ui/MiniBarChart";
import { PageHeader, Loading, EmptyState, Avatar, Pager } from "@/components/plan/ui";
import {
  Users,
  FileText,
  BarChart2,
  Activity,
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  Shield,
  AlertTriangle,
  RefreshCw,
  Coins,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  Inbox,
  ShieldAlert,
  Skull,
  Database,
  MapPin,
  PawPrint,
  Settings,
  ListChecks,
} from "@/components/plan/icons";

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

type Tab = "overview" | "users" | "submissions" | "credits" | "requests" | "onehealth";

const roleLabel = (r: string) => (r === "super_admin" ? "Super Admin" : r === "admin" ? "Admin" : "User");
const creditBadge = (c: number) => (c === 0 ? "badge-danger" : c < 10 ? "badge-warning" : "badge-success");

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
    if (isLoaded && role === "user") router.replace("/plan/dashboard");
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

  useEffect(() => {
    const t = setTimeout(loadStats, 0);
    return () => clearTimeout(t);
  }, [loadStats]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (tab === "users" && users.length === 0) loadUsers();
      if (tab === "submissions") loadSubmissions(submissionsPage, submissionsSearch);
      if (tab === "requests") loadRequests(requestsFilter);
    }, 0);
    return () => clearTimeout(t);
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isLoaded || role === "user") return null;

  const crumbs = [{ label: "Dashboard", href: "/plan/dashboard" }, { label: "Admin Panel" }];

  if (forbidden) {
    return (
      <AppShell role={role} title="Admin Panel" breadcrumb={crumbs}>
        <EmptyState
          icon={<AlertTriangle size={28} />}
          title="Access Denied"
          description="You need Admin or Super Admin role to view this page."
        />
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
    { key: "onehealth", label: "One Health", icon: <ShieldAlert size={15} /> },
  ];

  const filteredUsers = userSearch
    ? users.filter((u) => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
    : users;

  const totalPages = Math.ceil(submissionsTotal / 20);

  return (
    <AppShell role={role} title="Admin Panel" breadcrumb={crumbs}>
      <PageHeader title="Admin Panel" subtitle="Platform-wide KPIs, users, business plans, credits and disease-risk signals" />

      <div className="cm-tabs">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`cm-tab ${tab === t.key ? "active" : ""}`}>
            {t.icon}
            {t.label}
            {t.badge != null && t.badge > 0 && <span className="tab-count">{t.badge}</span>}
          </button>
        ))}
      </div>

      {/* ── Overview ─────────────────────────────────────── */}
      {tab === "overview" && (
        loadingStats ? (
          <Loading label="Loading stats…" />
        ) : stats ? (
          <>
            <div className="kpi-grid">
              <StatsCard label="Total Users" value={stats.totalUsers.toLocaleString()} sub="registered" icon={<Users size={18} />} accent="blue" />
              <StatsCard label="Total Plans" value={stats.totalSubmissions.toLocaleString()} sub="all time" icon={<FileText size={18} />} accent="green" />
              <StatsCard label="Plans This Week" value={stats.plansThisWeek.toLocaleString()} sub="last 7 days" icon={<Activity size={18} />} accent="purple" />
              <StatsCard label="Active Users" value={stats.activeUsers.toLocaleString()} sub="have created plans" icon={<Shield size={18} />} accent="amber" />
            </div>

            <div className="chart-grid">
              <div className="chart-card">
                <div className="chart-card-header">
                  <h3>Plans Created — Last 7 Days</h3>
                  <button onClick={loadStats} className="btn-icon" title="Refresh"><RefreshCw size={14} /></button>
                </div>
                <div className="chart-card-body">
                  <MiniBarChart data={stats.dailyCounts} />
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-card-header"><h3>System Summary</h3></div>
                <div className="chart-card-body" style={{ paddingTop: 8, paddingBottom: 8 }}>
                  {[
                    { label: "Total registered users", val: stats.totalUsers },
                    { label: "Users with plans", val: stats.activeUsers },
                    { label: "Inactive users (no plans)", val: stats.totalUsers - stats.activeUsers },
                    { label: "Admin/Super Admin accounts", val: stats.admins },
                    { label: "Plans created this week", val: stats.plansThisWeek },
                    { label: "Avg plans per active user", val: stats.activeUsers > 0 ? (stats.totalSubmissions / stats.activeUsers).toFixed(1) : "—" },
                  ].map((r) => (
                    <div key={r.label} className="summary-row">
                      <span className="label">{r.label}</span>
                      <span className="value">{typeof r.val === "number" ? r.val.toLocaleString() : r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyState icon={<AlertTriangle size={28} />} title="Failed to load stats" action={<button onClick={loadStats} className="btn btn-secondary">Try again</button>} />
        )
      )}

      {/* ── Users ────────────────────────────────────────── */}
      {tab === "users" && (
        <div className="card">
          <div className="card-header">
            <h3><span className="icon-tile blue"><Users size={15} /></span>All Users ({users.length})</h3>
            <div className="table-search">
              <Search size={14} />
              <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="Search users…" />
            </div>
          </div>

          {loadingUsers ? (
            <Loading label="Loading users…" />
          ) : (
            <>
              <div className="table-responsive hidden lg:block">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th className="hidden xl:table-cell">User ID</th>
                      <th>Role</th>
                      <th>Plans</th>
                      <th>Credits</th>
                      <th>Last Active</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="user-cell">
                            <Avatar src={u.imageUrl} name={u.name || u.email} />
                            <div>
                              <div className="cell-primary truncate">{u.name || "—"}</div>
                              <div className="cell-sub truncate">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden xl:table-cell"><span className="mono cell-muted" style={{ userSelect: "all" }}>{u.id}</span></td>
                        <td><Badge variant={roleBadgeVariant(u.role)}>{roleLabel(u.role)}</Badge></td>
                        <td>
                          <span className={u.submissionCount > 0 ? "cell-primary" : "cell-muted"} style={u.submissionCount > 0 ? { color: "var(--primary)" } : undefined}>
                            {u.submissionCount}
                          </span>
                        </td>
                        <td><span className={`badge ${creditBadge(u.credits)}`}><Coins size={10} />{u.credits}</span></td>
                        <td className="cell-muted">{u.lastActive ? new Date(u.lastActive).toLocaleDateString() : "—"}</td>
                        <td className="cell-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="lg:hidden">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="list-row">
                    <div className="user-cell">
                      <Avatar src={u.imageUrl} name={u.name || u.email} />
                      <div>
                        <div className="cell-primary truncate">{u.name || "—"}</div>
                        <div className="cell-sub truncate">{u.email}</div>
                        <div className="mono cell-sub truncate" style={{ userSelect: "all" }}>{u.id}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                          <Badge variant={roleBadgeVariant(u.role)}>{roleLabel(u.role)}</Badge>
                          <span className="cell-sub">{u.submissionCount} plan{u.submissionCount !== 1 ? "s" : ""}</span>
                          <span className={`badge ${creditBadge(u.credits)}`}><Coins size={10} />{u.credits} cr</span>
                        </div>
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
        <div className="card">
          <div className="card-header">
            <h3><span className="icon-tile"><FileText size={15} /></span>All Business Plans ({submissionsTotal})</h3>
            <div className="table-toolbar-right">
              <div className="table-search">
                <Search size={14} />
                <input
                  value={submissionsSearch}
                  onChange={(e) => { setSubmissionsSearch(e.target.value); setSubmissionsPage(1); loadSubmissions(1, e.target.value); }}
                  placeholder="Search companies…"
                />
              </div>
              <button onClick={() => loadSubmissions(submissionsPage, submissionsSearch)} className="btn-icon" title="Refresh">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {loadingSubmissions ? (
            <Loading />
          ) : submissions.length === 0 ? (
            <EmptyState icon={<FileText size={28} />} title="No business plans found" />
          ) : (
            <>
              <div className="table-responsive hidden lg:block">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Owner</th>
                      <th>Industry</th>
                      <th>Currency</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s) => (
                      <tr key={s._id}>
                        <td><div className="cell-primary truncate" style={{ maxWidth: 200 }}>{s.companyInfo?.companyName || "—"}</div></td>
                        <td className="cell-muted"><div className="truncate" style={{ maxWidth: 160 }}>{s.userName}</div></td>
                        <td className="cell-muted">{s.companyInfo?.companyFocus || "—"}</td>
                        <td>{s.companyInfo?.currency && <Badge variant="gray">{s.companyInfo.currency}</Badge>}</td>
                        <td className="cell-muted" style={{ whiteSpace: "nowrap" }}>
                          {new Date(s.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="lg:hidden">
                {submissions.map((s) => (
                  <div key={s._id} className="list-row">
                    <div className="cell-primary">{s.companyInfo?.companyName || "—"}</div>
                    <div className="cell-sub">{s.userName} · {s.companyInfo?.companyFocus || "No industry"}</div>
                    <div className="cell-sub">{new Date(s.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>

              <Pager
                page={submissionsPage}
                totalPages={totalPages}
                onChange={(p) => { setSubmissionsPage(p); loadSubmissions(p, submissionsSearch); }}
              />
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

      {/* ── One Health tab ──────────────────────────────────────────────────── */}
      {tab === "onehealth" && <OneHealthPanel />}
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

  const STATUS_BADGE: Record<string, string> = {
    pending: "badge-warning",
    approved: "badge-success",
    rejected: "badge-danger",
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3><span className="icon-tile orange"><Inbox size={15} /></span>Credit Requests</h3>
        <div className="table-toolbar-right">
          <div className="cm-tabs sm">
            {(["pending", "all"] as const).map((f) => (
              <button key={f} onClick={() => onFilterChange(f)} className={`cm-tab ${filter === f ? "active" : ""}`}>
                {f === "pending" ? "Pending" : "All Requests"}
              </button>
            ))}
          </div>
          <button onClick={onRefresh} className="btn-icon" title="Refresh"><RefreshCw size={14} /></button>
        </div>
      </div>

      {loading ? (
        <Loading label="Loading requests…" />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={<Inbox size={28} />}
          title={`No ${filter === "pending" ? "pending " : ""}requests`}
          description="Users will appear here when they request credits."
        />
      ) : (
        <div>
          {requests.map((req) => {
            const isReviewing = reviewing?.id === req._id;
            return (
              <div key={req._id} className="list-row">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="user-cell" style={{ flex: 1 }}>
                    <Avatar src={req.user.imageUrl} name={req.user.name || req.user.email} />
                    <div>
                      <div className="cell-primary truncate">{req.user.name || "—"}</div>
                      <div className="cell-sub truncate">{req.user.email}</div>
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {req.documents.map((d, i) => (
                        <span key={i} className="badge badge-info"><FileText size={10} />{d.count}× {DOC_LABELS[d.type] ?? d.type}</span>
                      ))}
                      <span className="badge badge-neutral"><Coins size={10} />{req.creditsRequested} credits</span>
                    </div>
                    {req.note && <p className="cell-muted" style={{ fontStyle: "italic", marginTop: 6, fontSize: 12 }}>&ldquo;{req.note}&rdquo;</p>}
                    {req.adminNote && <p className="cell-sub" style={{ marginTop: 4 }}>Admin note: {req.adminNote}</p>}
                    <p className="cell-sub" style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={10} />
                      {new Date(req.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
                    <span className={`badge ${STATUS_BADGE[req.status]}`} style={{ textTransform: "capitalize" }}>{req.status}</span>
                    {req.status === "pending" && !isReviewing && (
                      <>
                        <button onClick={() => startReview(req._id, "approve")} className="btn btn-primary btn-sm">
                          <CheckCircle size={13} /> Approve
                        </button>
                        <button onClick={() => startReview(req._id, "reject")} className="btn btn-secondary btn-sm" style={{ color: "var(--red)" }}>
                          <XCircle size={13} /> Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isReviewing && (
                  <div className={`alert-item ${reviewing.action === "approve" ? "alert-success" : "alert-danger"}`} style={{ marginTop: 14 }}>
                    <div className="alert-content">
                      <strong className="alert-kicker">
                        {reviewing.action === "approve"
                          ? `Approve and grant ${req.creditsRequested} credits to ${req.user.name}?`
                          : `Reject this request from ${req.user.name}?`}
                      </strong>
                      <input
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="Add a note for the user (optional)…"
                        className="form-control"
                        style={{ margin: "8px 0 10px" }}
                      />
                      {error && <p className="form-error" style={{ marginBottom: 8 }}>{error}</p>}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={cancelReview} disabled={submitting} className="btn btn-secondary btn-sm">Cancel</button>
                        <button
                          onClick={confirmReview}
                          disabled={submitting}
                          className={`btn btn-sm ${reviewing.action === "approve" ? "btn-primary" : "btn-danger"}`}
                        >
                          {submitting && <Loader2 size={12} className="animate-spin" />}
                          {reviewing.action === "approve" ? "Confirm Approve" : "Confirm Reject"}
                        </button>
                      </div>
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

function ResultAlert({ result }: { result: { ok: boolean; message: string } | null }) {
  if (!result) return null;
  return (
    <div className={`alert-item ${result.ok ? "alert-success" : "alert-danger"}`}>
      {result.ok ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
      <div className="alert-content">{result.message}</div>
    </div>
  );
}

function CollapsibleCard({
  open,
  onToggle,
  tone,
  icon,
  title,
  sub,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  tone: string;
  icon: React.ReactNode;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card">
      <button
        type="button"
        onClick={onToggle}
        className="card-header"
        style={{ width: "100%", textAlign: "left", borderBottom: open ? undefined : "none", cursor: "pointer", flexWrap: "nowrap" }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
          <span className={`icon-tile ${tone}`}>{icon}</span>
          <span>
            {title}
            <span className="cell-sub" style={{ display: "block", fontWeight: 500 }}>{sub}</span>
          </span>
        </span>
        <ChevronDown size={16} style={{ color: "var(--text-light)", flexShrink: 0, transform: open ? "rotate(180deg)" : undefined, transition: "transform .2s" }} />
      </button>
      {open && <div className="card-body">{children}</div>}
    </div>
  );
}

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

  const handleAssign = async (e: React.SubmitEvent<HTMLFormElement>) => {
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

  const handleLookup = async (e: React.SubmitEvent<HTMLFormElement>) => {
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

  const handleCheck = async (e: React.SubmitEvent<HTMLFormElement>) => {
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

  const handleDeduct = async (e: React.SubmitEvent<HTMLFormElement>) => {
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
    <div style={{ maxWidth: 680, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Assign Credits ──────────────────────────── */}
      <CollapsibleCard
        open={openSection === "assign"} onToggle={() => toggle("assign")}
        tone="green" icon={<Coins size={15} />} title="Assign Credits" sub="Add credits to a user account"
      >
        <form onSubmit={handleAssign}>
          <div className="form-group">
            <label className="form-label">User Account ID<span className="required">*</span></label>
            <input value={assignUserId} onChange={(e) => setAssignUserId(e.target.value)} placeholder="user_2abc123def..." required className="form-control mono" />
            <p className="form-hint">User can find this in Profile → Account.</p>
          </div>
          <div className="form-row-3 form-group">
            <div>
              <label className="form-label">Credits<span className="required">*</span></label>
              <input type="number" min={1} value={assignCredits} onChange={(e) => setAssignCredits(e.target.value)} placeholder="50" required className="form-control" />
            </div>
            <div>
              <label className="form-label">Amount</label>
              <input type="number" min={0} step={0.01} value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="0.00" className="form-control" />
            </div>
            <div>
              <label className="form-label">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="form-control">
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Note</label>
            <input value={assignNote} onChange={(e) => setAssignNote(e.target.value)} placeholder="e.g. Monthly subscription payment" className="form-control" />
          </div>
          <ResultAlert result={assignResult} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 14 }}>
            <span className="form-hint" style={{ margin: 0 }}>1 credit = $1</span>
            <button type="submit" disabled={assignSubmitting} className="btn btn-primary">
              {assignSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Coins size={14} />}
              {assignSubmitting ? "Assigning…" : "Assign Credits"}
            </button>
          </div>
        </form>
      </CollapsibleCard>

      {/* ── Lookup Credits ──────────────────────────── */}
      <CollapsibleCard
        open={openSection === "lookup"} onToggle={() => toggle("lookup")}
        tone="blue" icon={<Search size={15} />} title="Lookup User Credits" sub="Check balance and transaction history"
      >
        <form onSubmit={handleLookup} style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input value={lookupId} onChange={(e) => setLookupId(e.target.value)} placeholder="Paste User Account ID…" className="form-control mono" />
          <button type="submit" disabled={looking} className="btn btn-blue">
            {looking ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Lookup
          </button>
        </form>
        {lookupError && (
          <div className="alert-item alert-danger"><AlertCircle size={15} /><div className="alert-content">{lookupError}</div></div>
        )}
        {lookupData && (
          <>
            <div className="stat-tile tone-blue" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left", marginBottom: 14 }}>
              <span className="stat-tile-label" style={{ margin: 0 }}>Current Balance</span>
              <span className="stat-tile-value" style={{ fontSize: 20 }}>{lookupData.credits} credits</span>
            </div>
            {lookupData.transactions.length > 0 ? (
              <>
                <label className="form-label">Recent Transactions</label>
                <div className="table-responsive" style={{ maxHeight: 240 }}>
                  <table className="data-table compact">
                    <tbody>
                      {lookupData.transactions.map((tx, i) => (
                        <tr key={i}>
                          <td><span className={`badge ${tx.credits > 0 ? "badge-success" : "badge-danger"}`}>{tx.credits > 0 ? `+${tx.credits}` : tx.credits}</span></td>
                          <td style={{ textTransform: "capitalize" }}>
                            {tx.type}
                            {tx.paymentAmount && <span className="cell-sub"> ({tx.paymentAmount} {tx.currency})</span>}
                          </td>
                          <td className="cell-muted text-right" style={{ whiteSpace: "nowrap" }}>
                            → {tx.balanceAfter} · {new Date(tx.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="form-hint">No transactions yet for this account.</p>
            )}
          </>
        )}
      </CollapsibleCard>

      {/* ── Dismiss Credits ─────────────────────────── */}
      <CollapsibleCard
        open={openSection === "deduct"} onToggle={() => toggle("deduct")}
        tone="red" icon={<AlertCircle size={15} />} title="Dismiss Credits" sub="Remove credits from a user account"
      >
        <form onSubmit={handleCheck} className="form-group">
          <label className="form-label">User Account ID<span className="required">*</span></label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={deductUserId}
              onChange={(e) => { setDeductUserId(e.target.value); setBalance(null); setDeductResult(null); }}
              placeholder="user_2abc123def..."
              required
              className="form-control mono"
            />
            <button type="submit" disabled={checking || !deductUserId.trim()} className="btn btn-secondary">
              {checking ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              {checking ? "Checking…" : "Check Balance"}
            </button>
          </div>
          {checkError && (
            <div className="alert-item alert-danger" style={{ marginTop: 10 }}><AlertCircle size={15} /><div className="alert-content">{checkError}</div></div>
          )}
        </form>
        {balance !== null && (
          <form onSubmit={handleDeduct}>
            <div className={`stat-tile ${balance === 0 ? "" : "tone-orange"}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left", marginBottom: 14 }}>
              <span className="stat-tile-label" style={{ margin: 0 }}>Current Balance</span>
              <span className="stat-tile-value" style={{ fontSize: 20, color: balance === 0 ? "var(--red)" : undefined }}>{balance} credits</span>
            </div>
            {balance === 0 ? (
              <p className="form-hint" style={{ textAlign: "center" }}>This user has no credits to dismiss.</p>
            ) : (
              <>
                <div className="form-row form-group">
                  <div>
                    <label className="form-label">Credits to Dismiss<span className="required">*</span></label>
                    <input type="number" min={1} max={maxDeduct} value={deductAmt} onChange={(e) => setDeductAmt(e.target.value)} placeholder={`1 – ${maxDeduct}`} required className="form-control" />
                    <p className="form-hint">Max {maxDeduct}</p>
                  </div>
                  <div>
                    <label className="form-label">Reason</label>
                    <input value={deductNote} onChange={(e) => setDeductNote(e.target.value)} placeholder="e.g. Correction" className="form-control" />
                  </div>
                </div>
                <ResultAlert result={deductResult} />
                <button
                  type="submit"
                  disabled={deductSubmitting || !deductAmt || parseInt(deductAmt) < 1 || parseInt(deductAmt) > maxDeduct}
                  className="btn btn-danger btn-block"
                  style={{ marginTop: 14 }}
                >
                  {deductSubmitting ? <Loader2 size={14} className="animate-spin" /> : <AlertCircle size={14} />}
                  {deductSubmitting ? "Dismissing…" : "Dismiss Credits"}
                </button>
              </>
            )}
          </form>
        )}
      </CollapsibleCard>
    </div>
  );
}

// ── One Health Panel ──────────────────────────────────────────────────────────

interface OneHealthSummary {
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

interface OneHealthAlert {
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

interface OneHealthRecordRow {
  _id: string;
  species: string;
  farmName?: string;
  farmId?: string;
  eventType: string;
  diagnosis?: string;
  symptoms: string[];
  recordedAt: string;
}

// CropManager alert tones per severity
const OH_SEVERITY_STYLE: Record<OneHealthAlert["severity"], { badge: "rose" | "amber" | "blue" | "gray"; alert: string }> = {
  critical: { badge: "rose", alert: "alert-danger" },
  high: { badge: "amber", alert: "alert-warning" },
  medium: { badge: "blue", alert: "alert-info" },
  low: { badge: "gray", alert: "alert-success" },
};

const OH_TYPE_LABEL: Record<OneHealthAlert["type"], string> = {
  zoonotic_watchlist: "Watchlist disease",
  mortality_spike: "Mortality spike",
  symptom_cluster: "Outbreak cluster",
};

function ohFmtDate(iso: string | null | undefined) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function OneHealthPanel() {
  const [summary, setSummary] = useState<OneHealthSummary | null>(null);
  const [alerts, setAlerts] = useState<OneHealthAlert[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"open" | "reviewed" | "dismissed" | "all">("open");
  const [severityFilter, setSeverityFilter] = useState<"all" | OneHealthAlert["severity"]>("all");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [records, setRecords] = useState<OneHealthRecordRow[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    try {
      const { data } = await axios.get<OneHealthSummary>("/api/onehealth/summary");
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

  const toggleExpand = async (alert: OneHealthAlert) => {
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

  const updateStatus = async (id: string, status: OneHealthAlert["status"]) => {
    setUpdating(id);
    try {
      await axios.patch(`/api/onehealth/alerts/${id}`, { status });
      setAlerts((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
      loadSummary();
    } finally {
      setUpdating(null);
    }
  };

  return (
    <>
      <div className="page-header" style={{ marginBottom: 16 }}>
        <p className="page-subtitle" style={{ marginTop: 0 }}>
          Disease risk signals synced automatically from LivestockPro every few minutes.
        </p>
        <button onClick={handleSync} disabled={syncing} className="btn btn-primary">
          {syncing ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
          Sync now
        </button>
      </div>

      {summary?.sync.status === "not_configured" && (
        <div className="alert-item alert-warning" style={{ marginBottom: 20 }}>
          <Settings size={16} />
          <div className="alert-content">
            <strong className="alert-kicker">LivestockPro connection not configured yet</strong>
            Set <code className="cm-code">LIVESTOCK_API_URL</code> and <code className="cm-code">LIVESTOCK_API_KEY</code> once
            LivestockPro exposes the records feed — this dashboard will start syncing automatically.
          </div>
        </div>
      )}

      {summary?.sync.status === "error" && (
        <div className="alert-item alert-danger" style={{ marginBottom: 20 }}>
          <AlertTriangle size={16} />
          <div className="alert-content">
            <strong className="alert-kicker">Last sync failed</strong>
            {summary.sync.lastRunError ?? "Unknown error"}
          </div>
        </div>
      )}

      <div className="kpi-grid">
        <StatsCard label="Open alerts" value={summary?.openAlerts ?? "—"} icon={<ShieldAlert size={18} />} accent="rose" />
        <StatsCard label="Zoonotic risk (open)" value={summary?.zoonoticOpenAlerts ?? "—"} icon={<Skull size={18} />} accent="amber" />
        <StatsCard label="Records synced" value={summary?.totalRecordsSynced ?? "—"} icon={<Database size={18} />} accent="blue" />
        <StatsCard
          label="Last sync"
          value={summary ? ohFmtDate(summary.sync.lastSyncedAt) : "—"}
          sub={summary?.sync.status === "ok" ? "Healthy" : summary?.sync.status}
          icon={<RefreshCw size={18} />}
          accent="green"
        />
      </div>

      <div className="card">
        <div className="card-header">
          <h3><span className="icon-tile red"><ListChecks size={15} /></span>Risk Alerts</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            {(["open", "reviewed", "dismissed", "all"] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`chip ${statusFilter === s ? "active" : ""}`}>{s}</button>
            ))}
            <span style={{ width: 1, height: 20, background: "var(--border)", margin: "0 4px" }} />
            {(["all", "critical", "high", "medium", "low"] as const).map((s) => (
              <button key={s} onClick={() => setSeverityFilter(s)} className={`chip ${severityFilter === s ? "active" : ""}`}>{s}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <Loading label="Loading alerts…" />
        ) : alerts.length === 0 ? (
          <EmptyState
            icon={<ShieldAlert size={28} />}
            title={`No ${statusFilter !== "all" ? statusFilter + " " : ""}alerts`}
            description="Risk signals detected from LivestockPro data will appear here."
          />
        ) : (
          <div className="card-body">
            {alerts.map((a) => {
              const style = OH_SEVERITY_STYLE[a.severity];
              const isOpen = expanded === a._id;
              return (
                <div key={a._id} className={`alert-item ${style.alert}`} style={{ flexDirection: "column", gap: 0, cursor: "pointer" }} onClick={() => toggleExpand(a)}>
                  <div style={{ display: "flex", gap: 12, width: "100%", alignItems: "flex-start" }}>
                    <div className="alert-content">
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span className="cell-primary">{a.title}</span>
                        {a.zoonotic && <Badge variant="rose">Zoonotic</Badge>}
                        <Badge variant={style.badge}>{a.severity}</Badge>
                        <Badge variant="gray">{OH_TYPE_LABEL[a.type]}</Badge>
                      </div>
                      <p className="cell-muted" style={{ fontSize: 12, marginTop: 4 }}>{a.description}</p>
                      <div className="cell-sub" style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
                        {a.district && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><MapPin size={11} />{a.district}</span>}
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><PawPrint size={11} />{a.species.join(", ")}</span>
                        <span>{a.farmIds.length} farm{a.farmIds.length === 1 ? "" : "s"}</span>
                        <span>Detected {ohFmtDate(a.detectedAt)}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
                      {a.status === "open" && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateStatus(a._id, "reviewed"); }}
                            disabled={updating === a._id}
                            title="Mark reviewed"
                            className="btn-icon"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateStatus(a._id, "dismissed"); }}
                            disabled={updating === a._id}
                            title="Dismiss"
                            className="btn-icon btn-icon-danger"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      {isOpen ? <ChevronUp size={16} style={{ color: "var(--text-light)" }} /> : <ChevronDown size={16} style={{ color: "var(--text-light)" }} />}
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ width: "100%", marginTop: 12 }} onClick={(e) => e.stopPropagation()}>
                      {loadingRecords ? (
                        <span className="cell-sub" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <Loader2 size={13} className="animate-spin" /> Loading records…
                        </span>
                      ) : (
                        <div className="table-responsive">
                          <table className="data-table compact">
                            <tbody>
                              {records.map((r) => (
                                <tr key={r._id}>
                                  <td>
                                    <span className="cell-primary">{r.species}</span>
                                    <span className="cell-muted"> · {r.farmName ?? r.farmId ?? "Unknown farm"}</span>
                                    {r.diagnosis && <span className="cell-muted"> · {r.diagnosis}</span>}
                                    {r.symptoms?.length > 0 && <span className="cell-sub"> · {r.symptoms.join(", ")}</span>}
                                  </td>
                                  <td className="cell-muted text-right" style={{ whiteSpace: "nowrap" }}>{ohFmtDate(r.recordedAt)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <Pager page={page} totalPages={Math.ceil(total / 20)} onChange={(p) => loadAlerts(p)} />
      </div>
    </>
  );
}
