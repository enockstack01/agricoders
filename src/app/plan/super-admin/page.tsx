"use client";
import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import AppShell, { NavRole } from "@/components/layout/AppShell";
import StatsCard from "@/components/ui/StatsCard";
import Badge, { roleBadgeVariant } from "@/components/ui/Badge";
import { PageHeader, Loading, EmptyState, Toast, Avatar } from "@/components/plan/ui";
import {
  Users,
  FileText,
  Shield,
  Search,
  Loader2,
  RefreshCw,
  Activity,
  CheckCircle2,
} from "@/components/plan/icons";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  submissionCount: number;
  lastActive: string | number | null;
  createdAt: number;
  imageUrl: string;
}

interface Stats {
  totalUsers: number;
  totalSubmissions: number;
  plansThisWeek: number;
  activeUsers: number;
  admins: number;
  dailyCounts: Record<string, number>;
}

const ROLE_OPTIONS: { value: NavRole; label: string }[] = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
];

const roleLabel = (r: string) => (r === "super_admin" ? "Super Admin" : r === "admin" ? "Admin" : "User");

export default function SuperAdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const role = (user?.publicMetadata?.role as NavRole | undefined) ?? "user";

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (isLoaded && role !== "super_admin") router.replace("/plan/dashboard");
  }, [isLoaded, role, router]);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const { data } = await axios.get("/api/admin/users");
      setUsers(data.users);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const { data } = await axios.get("/api/admin/stats");
      setStats(data);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { loadUsers(); loadStats(); }, 0);
    return () => clearTimeout(t);
  }, [loadUsers, loadStats]);

  const updateRole = async (userId: string, newRole: NavRole) => {
    setUpdating(userId);
    try {
      await axios.put("/api/admin/users/role", { userId, role: newRole });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
      showToast("Role updated successfully", true);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.error ?? "Failed" : "Failed";
      showToast(msg, false);
    } finally {
      setUpdating(null);
    }
  };

  if (!isLoaded || role !== "super_admin") return null;

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const adminCount = users.filter((u) => u.role === "admin").length;
  const superAdminCount = users.filter((u) => u.role === "super_admin").length;

  const roleSelect = (u: AdminUser) => (
    <select
      value={u.role}
      onChange={(e) => updateRole(u.id, e.target.value as NavRole)}
      disabled={updating === u.id}
      className="table-filter-select"
      style={{ width: "100%", minWidth: 140 }}
    >
      {ROLE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );

  return (
    <AppShell role={role} title="User Management" breadcrumb={[{ label: "Dashboard", href: "/plan/dashboard" }, { label: "User Management" }]}>
      <Toast toast={toast} />

      <PageHeader
        title="User Management"
        subtitle="Assign and change user roles across the platform"
        actions={
          <button onClick={() => { loadUsers(); loadStats(); }} className="btn btn-secondary">
            <RefreshCw size={14} />
            Refresh
          </button>
        }
      />

      {loadingStats ? (
        <div className="kpi-grid">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 84 }} />)}
        </div>
      ) : stats && (
        <div className="kpi-grid">
          <StatsCard label="Total Users" value={stats.totalUsers} sub="registered" icon={<Users size={18} />} accent="blue" />
          <StatsCard label="Total Plans" value={stats.totalSubmissions} sub="all time" icon={<FileText size={18} />} accent="green" />
          <StatsCard label="Admin Accounts" value={adminCount + superAdminCount} sub={`${adminCount} admin, ${superAdminCount} super`} icon={<Shield size={18} />} accent="purple" />
          <StatsCard label="Active Users" value={stats.activeUsers} sub="have plans" icon={<Activity size={18} />} accent="amber" />
        </div>
      )}

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h3><span className="icon-tile"><Users size={15} /></span>User Role Management</h3>
          <div className="table-toolbar-right">
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="table-filter-select">
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
              <option value="super_admin">Super Admins</option>
            </select>
            <div className="table-search">
              <Search size={14} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…" />
            </div>
          </div>
        </div>

        {loadingUsers ? (
          <Loading label="Loading users…" />
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Search size={26} />} title="No users match your filters" />
        ) : (
          <>
            <div className="table-responsive hidden lg:block">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Current Role</th>
                    <th>Plans</th>
                    <th>Last Active</th>
                    <th>Joined</th>
                    <th>Change Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => {
                    const isSelf = u.id === user?.id;
                    return (
                      <tr key={u.id}>
                        <td>
                          <div className="user-cell">
                            <Avatar src={u.imageUrl} name={u.name || u.email} />
                            <div>
                              <div className="cell-primary truncate" style={{ maxWidth: 180 }}>
                                {u.name || "—"} {isSelf && <span className="cell-sub">(you)</span>}
                              </div>
                              <div className="cell-sub truncate" style={{ maxWidth: 200 }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><Badge variant={roleBadgeVariant(u.role)}>{roleLabel(u.role)}</Badge></td>
                        <td>
                          <span className={u.submissionCount > 0 ? "cell-primary" : "cell-muted"} style={u.submissionCount > 0 ? { color: "var(--primary)" } : undefined}>
                            {u.submissionCount}
                          </span>
                        </td>
                        <td className="cell-muted">{u.lastActive ? new Date(u.lastActive).toLocaleDateString() : "—"}</td>
                        <td className="cell-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td style={{ width: 180 }}>
                          {isSelf ? (
                            <span className="cell-sub">Cannot change own role</span>
                          ) : updating === u.id ? (
                            <span className="cell-sub" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                              <Loader2 size={13} className="animate-spin" /> Updating…
                            </span>
                          ) : (
                            roleSelect(u)
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden">
              {filtered.map((u) => {
                const isSelf = u.id === user?.id;
                return (
                  <div key={u.id} className="list-row">
                    <div className="user-cell" style={{ marginBottom: isSelf ? 0 : 12 }}>
                      <Avatar src={u.imageUrl} name={u.name || u.email} />
                      <div>
                        <div className="cell-primary truncate">{u.name || "—"}{isSelf ? " (you)" : ""}</div>
                        <div className="cell-sub truncate">{u.email}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                          <Badge variant={roleBadgeVariant(u.role)}>{roleLabel(u.role)}</Badge>
                          <span className="cell-sub">{u.submissionCount} plan{u.submissionCount !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                    </div>
                    {!isSelf && roleSelect(u)}
                  </div>
                );
              })}
            </div>

            <div className="card-footer">{filtered.length} user{filtered.length !== 1 ? "s" : ""} shown</div>
          </>
        )}
      </div>

      {/* Role legend */}
      <div className="card">
        <div className="card-header">
          <h3><span className="icon-tile purple"><Shield size={15} /></span>Role Permissions</h3>
        </div>
        <div className="card-body">
          <div className="stat-grid" style={{ "--stat-min": "220px" } as React.CSSProperties}>
            {[
              { role: "User", variant: "gray" as const, perms: ["Create and manage own business plans", "Download generated documents", "Access personal dashboard"] },
              { role: "Admin", variant: "blue" as const, perms: ["All User permissions", "View all users and their plans", "Access admin analytics dashboard", "View system statistics"] },
              { role: "Super Admin", variant: "purple" as const, perms: ["All Admin permissions", "Change user roles", "Promote users to Admin", "Full platform control"] },
            ].map((r) => (
              <div key={r.role} className="stat-tile" style={{ textAlign: "left", padding: 16 }}>
                <div style={{ marginBottom: 10 }}><Badge variant={r.variant}>{r.role}</Badge></div>
                <ul style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {r.perms.map((p) => (
                    <li key={p} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: "var(--text-light)" }}>
                      <CheckCircle2 size={13} style={{ color: "var(--primary)", marginTop: 2, flexShrink: 0 }} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
