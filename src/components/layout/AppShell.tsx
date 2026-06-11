"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  FileText,
  Users,
  Shield,
  PlusCircle,
  Menu,
  X,
  BarChart2,
  ChevronRight,
  Layers,
  UserCircle,
} from "lucide-react";

const YEAR = new Date().getFullYear();

export type NavRole = "user" | "admin" | "super_admin";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: NavRole[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",       href: "/dashboard",   icon: <LayoutDashboard size={18} />, roles: ["user", "admin", "super_admin"] },
  { label: "New Plan",        href: "/form",         icon: <PlusCircle size={18} />,      roles: ["user", "admin", "super_admin"] },
  { label: "Admin Panel",     href: "/admin",        icon: <BarChart2 size={18} />,       roles: ["admin", "super_admin"] },
  { label: "User Management", href: "/super-admin",  icon: <Users size={18} />,           roles: ["super_admin"] },
  { label: "Profile",         href: "/profile",      icon: <UserCircle size={18} />,      roles: ["user", "admin", "super_admin"] },
];

interface Props {
  role: NavRole;
  children: React.ReactNode;
  title?: string;
  breadcrumb?: { label: string; href?: string }[];
}

export default function AppShell({ role, children, title, breadcrumb }: Props) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visibleNav = NAV_ITEMS.filter((n) => n.roles.includes(role));

  const roleBadge =
    role === "super_admin"
      ? { label: "Super Admin", cls: "bg-purple-100 text-purple-700 border-purple-200" }
      : role === "admin"
      ? { label: "Admin", cls: "bg-blue-100 text-blue-700 border-blue-200" }
      : null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
          <Layers size={16} className="text-white" />
        </div>
        <span className="font-bold text-gray-900 text-base tracking-tight">Logistack Plan</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visibleNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className={active ? "text-green-600" : "text-gray-400"}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: role badge */}
      {roleBadge && (
        <div className="px-4 py-3 border-t border-gray-100">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${roleBadge.cls}`}>
            <Shield size={11} />
            {roleBadge.label}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-200 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] bg-white shadow-xl z-50 flex flex-col">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 flex-shrink-0"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb / Title */}
            {breadcrumb && breadcrumb.length > 0 ? (
              <nav className="flex items-center gap-1 text-sm min-w-0" aria-label="breadcrumb">
                {breadcrumb.map((b, i) => (
                  <span key={i} className="flex items-center gap-1 min-w-0">
                    {i > 0 && <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />}
                    {b.href ? (
                      <Link href={b.href} className="text-gray-500 hover:text-gray-700 truncate">{b.label}</Link>
                    ) : (
                      <span className="text-gray-900 font-medium truncate">{b.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            ) : title ? (
              <h1 className="text-sm font-semibold text-gray-900 truncate">{title}</h1>
            ) : null}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/form"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <PlusCircle size={14} />
              New Plan
            </Link>
            <UserButton />
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 px-4 lg:px-6 py-6 max-w-7xl mx-auto w-full">
            {children}
          </div>
          {/* App footer */}
          <div className="bg-gray-950 border-t border-gray-800 px-4 lg:px-6 py-4 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-green-600 flex items-center justify-center flex-shrink-0">
                  <Layers size={11} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-400">Logistack Plan</span>
                <span className="text-gray-700 text-xs hidden sm:inline">·</span>
                <span className="text-xs text-gray-600 hidden sm:inline">AI-Powered Business Planning Platform</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <a href="/api/health" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-gray-400 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  System Status
                </a>
                <span className="text-gray-700">&copy; {YEAR} Logistack Plan</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
