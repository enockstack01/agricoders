"use client";
import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import AppShell, { NavRole } from "@/components/layout/AppShell";
import StatsCard from "@/components/ui/StatsCard";
import Badge, { roleBadgeVariant } from "@/components/ui/Badge";
import {
  Users,
  FileText,
  Shield,
  Search,
  Loader2,
  AlertTriangle,
  ChevronDown,
  CheckCircle,
  RefreshCw,
  Activity,
  BarChart2,
} from "lucide-react";

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
    if (isLoaded && role !== "super_admin") router.replace("/dashboard");
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

  useEffect(() => { loadUsers(); loadStats(); }, [loadUsers, loadStats]);

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

  return (
    <AppShell
      role={role}
      title="User Management"
      breadcrumb={[{ label: "Dashboard", href: "/dashboard" }, { label: "Super Admin" }]}
    >
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
          toast.ok ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.ok ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Stats row */}
      {loadingStats ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatsCard label="Total Users" value={stats.totalUsers} sub="registered" icon={<Users size={18} />} accent="blue" />
          <StatsCard label="Total Plans" value={stats.totalSubmissions} sub="all time" icon={<FileText size={18} />} accent="green" />
          <StatsCard label="Admin Accounts" value={adminCount + superAdminCount} sub={`${adminCount} admin, ${superAdminCount} super`} icon={<Shield size={18} />} accent="purple" />
          <StatsCard label="Active Users" value={stats.activeUsers} sub="have plans" icon={<Activity size={18} />} accent="amber" />
        </div>
      )}

      {/* Role management */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">User Role Management</h2>
            <p className="text-xs text-gray-400 mt-0.5">Assign and change user roles across the platform</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Role filter */}
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
                <option value="super_admin">Super Admins</option>
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users…"
                className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm w-full sm:w-52 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button onClick={() => { loadUsers(); loadStats(); }} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors flex-shrink-0">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {loadingUsers ? (
          <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading users…</span>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Current Role</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Plans</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Last Active</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Joined</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((u) => {
                    const isSelf = u.id === user?.id;
                    return (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {u.imageUrl
                              ? <img src={u.imageUrl} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                              : <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><Users size={12} className="text-gray-500" /></div>
                            }
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="font-medium text-gray-900 text-sm truncate max-w-[140px]">{u.name || "—"}</p>
                                {isSelf && <span className="text-xs text-gray-400">(you)</span>}
                              </div>
                              <p className="text-xs text-gray-400 truncate max-w-[160px]">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant={roleBadgeVariant(u.role)}>
                            {u.role === "super_admin" ? "Super Admin" : u.role === "admin" ? "Admin" : "User"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <span className={`text-sm font-semibold ${u.submissionCount > 0 ? "text-green-700" : "text-gray-400"}`}>{u.submissionCount}</span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 text-sm hidden lg:table-cell">
                          {u.lastActive ? new Date(u.lastActive).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 text-sm hidden lg:table-cell">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3.5">
                          {isSelf ? (
                            <span className="text-xs text-gray-400">Cannot change own role</span>
                          ) : (
                            <div className="relative w-36">
                              {updating === u.id ? (
                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                  <Loader2 size={13} className="animate-spin" />
                                  Updating…
                                </div>
                              ) : (
                                <>
                                  <select
                                    value={u.role}
                                    onChange={(e) => updateRole(u.id, e.target.value as NavRole)}
                                    className="appearance-none w-full pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                                  >
                                    {ROLE_OPTIONS.map((opt) => (
                                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                  </select>
                                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-100">
              {filtered.map((u) => {
                const isSelf = u.id === user?.id;
                return (
                  <div key={u.id} className="px-4 py-4">
                    <div className="flex items-center gap-3 mb-3">
                      {u.imageUrl
                        ? <img src={u.imageUrl} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                        : <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><Users size={14} className="text-gray-500" /></div>
                      }
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{u.name || "—"}{isSelf ? " (you)" : ""}</p>
                        <p className="text-xs text-gray-400 truncate">{u.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={roleBadgeVariant(u.role)}>
                            {u.role === "super_admin" ? "Super Admin" : u.role === "admin" ? "Admin" : "User"}
                          </Badge>
                          <span className="text-xs text-gray-400">{u.submissionCount} plan{u.submissionCount !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                    </div>
                    {!isSelf && (
                      <div className="relative">
                        <select
                          value={u.role}
                          onChange={(e) => updateRole(u.id, e.target.value as NavRole)}
                          disabled={updating === u.id}
                          className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer disabled:opacity-60"
                        >
                          {ROLE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        {updating === u.id
                          ? <Loader2 size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
                          : <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        }
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-sm">No users match your filters.</div>
            )}

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400">{filtered.length} user{filtered.length !== 1 ? "s" : ""} shown</p>
            </div>
          </>
        )}
      </div>

      {/* Role legend */}
      <div className="mt-5 bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">Role Permissions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              role: "User", variant: "gray" as const,
              perms: ["Create and manage own business plans", "Download generated documents", "Access personal dashboard"],
            },
            {
              role: "Admin", variant: "blue" as const,
              perms: ["All User permissions", "View all users and their plans", "Access admin analytics dashboard", "View system statistics"],
            },
            {
              role: "Super Admin", variant: "purple" as const,
              perms: ["All Admin permissions", "Change user roles", "Promote users to Admin", "Full platform control"],
            },
          ].map((r) => (
            <div key={r.role} className="p-4 rounded-xl border border-gray-100 bg-gray-50">
              <div className="mb-2">
                <Badge variant={r.variant}>{r.role}</Badge>
              </div>
              <ul className="space-y-1.5">
                {r.perms.map((p) => (
                  <li key={p} className="flex items-start gap-1.5 text-xs text-gray-600">
                    <Shield size={11} className="text-green-500 mt-0.5 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
