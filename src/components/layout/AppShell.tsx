"use client";
// Agriplan app shell — the CropManager layout: fixed green-gradient sidebar with
// labelled sections + collapse toggle, white fixed topbar, padded content column.
import { Fragment, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useClerk, useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  Menu,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  LogOut,
  Moon,
  Sun,
  Shield,
  Home,
  Coins,
} from "@/components/plan/icons";
import NotificationBell from "@/components/ui/NotificationBell";
import { useTheme } from "@/contexts/ThemeContext";
import { LogoMark } from "@/components/plan/ui";

export type NavRole = "user" | "admin" | "super_admin";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: NavRole[];
}

const ALL: NavRole[] = ["user", "admin", "super_admin"];

const SECTIONS: { label?: string; items: NavItem[] }[] = [
  { items: [{ label: "Dashboard", href: "/plan/dashboard", icon: <LayoutDashboard />, roles: ALL }] },
  {
    label: "Planning",
    items: [{ label: "New Business Plan", href: "/plan/form", icon: <PlusCircle />, roles: ALL }],
  },
  {
    label: "Administration",
    items: [
      { label: "Admin Panel", href: "/plan/admin", icon: <BarChart2 />, roles: ["admin", "super_admin"] },
      { label: "User Management", href: "/plan/super-admin", icon: <Users />, roles: ["super_admin"] },
    ],
  },
  {
    label: "Account",
    items: [{ label: "Profile & Settings", href: "/plan/profile", icon: <UserCircle />, roles: ALL }],
  },
];

const ROLE_LABEL: Record<NavRole, string> = { user: "Planner", admin: "Admin", super_admin: "Super Admin" };

interface Props {
  role: NavRole;
  children: React.ReactNode;
  title?: string;
  breadcrumb?: { label: string; href?: string }[];
}

export default function AppShell({ role, children, title, breadcrumb }: Props) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { theme, toggle } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sections = SECTIONS
    .map((s) => ({ ...s, items: s.items.filter((i) => i.roles.includes(role)) }))
    .filter((s) => s.items.length > 0);

  const crumbs = breadcrumb && breadcrumb.length > 0 ? breadcrumb : title ? [{ label: title }] : [];
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="cm-app">
      <div className="app-layout">
        <div className={`sidebar-overlay ${mobileOpen ? "active" : ""}`} onClick={() => setMobileOpen(false)} />

        <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "sidebar-mobile-open" : ""}`}>
          <div className="sidebar-header">
            <div className="sidebar-logo-icon">
              <LogoMark size={20} />
            </div>
            <div className="sidebar-logo-text">
              Agri<span>plan</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            {role !== "user" && (
              <div className="sidebar-role">
                <span className="badge">
                  <Shield size={11} />
                  {ROLE_LABEL[role]}
                </span>
              </div>
            )}
            {sections.map((section, i) => (
              <Fragment key={section.label ?? i}>
                {section.label && <div className="sidebar-label">{section.label}</div>}
                {section.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={active ? "nav-active" : undefined}
                      title={collapsed ? item.label : undefined}
                    >
                      {item.icon}
                      <span className="sidebar-nav-text">{item.label}</span>
                    </Link>
                  );
                })}
              </Fragment>
            ))}

            <div className="sidebar-label">Session</div>
            <Link href="/" title={collapsed ? "Agricoders home" : undefined}>
              <Home />
              <span className="sidebar-nav-text">Agricoders Home</span>
            </Link>
            <button type="button" onClick={() => signOut({ redirectUrl: "/plan" })} title={collapsed ? "Logout" : undefined}>
              <LogOut />
              <span className="sidebar-nav-text">Logout</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <button className="sidebar-toggle" onClick={() => setCollapsed((c) => !c)}>
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              <span className="sidebar-nav-text">Collapse</span>
            </button>
          </div>
        </aside>

        <main className={`main-content ${collapsed ? "main-content-expanded" : ""}`}>
          <header className="topbar">
            <div className="topbar-left">
              <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <Menu size={20} />
              </button>
              {crumbs.length > 0 && (
                <nav className="topbar-breadcrumb" aria-label="breadcrumb">
                  {crumbs.map((b, i) => (
                    <Fragment key={i}>
                      {i > 0 && <ChevronRight size={14} className="sep" />}
                      {b.href ? (
                        <Link href={b.href} className="topbar-hide-sm">{b.label}</Link>
                      ) : (
                        <span className="current">{b.label}</span>
                      )}
                    </Fragment>
                  ))}
                </nav>
              )}
            </div>

            <div className="topbar-right">
              <Link href="/plan/form" className="btn btn-primary btn-sm topbar-hide-sm" style={{ marginRight: 4 }}>
                <PlusCircle size={14} />
                New Plan
              </Link>
              <button
                className="topbar-btn"
                onClick={toggle}
                title="Toggle Dark Mode"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <NotificationBell />
              <div className="topbar-user">
                <div className="topbar-user-info">
                  <div className="topbar-user-name">{user?.fullName || user?.firstName || "User"}</div>
                  <div className="topbar-user-role">{ROLE_LABEL[role]}</div>
                </div>
                <UserButton />
              </div>
            </div>
          </header>

          <div className="main-content-inner">{children}</div>
        </main>

        {/* Mobile bottom tab bar (≤768px) — Snapchat-style, raised centre "new plan" button */}
        <nav className="bottom-nav" aria-label="Primary">
          <Link href="/plan/dashboard" className={isActive("/plan/dashboard") ? "active" : undefined}>
            <LayoutDashboard />
            Home
          </Link>
          {role === "user" ? (
            <Link href="/plan/profile">
              <Coins />
              Credits
            </Link>
          ) : (
            <Link href="/plan/admin" className={isActive("/plan/admin") ? "active" : undefined}>
              <BarChart2 />
              Admin
            </Link>
          )}
          <Link href="/plan/form" className="bottom-nav-cta" aria-label="New business plan">
            <span className="cta-bubble"><PlusCircle /></span>
          </Link>
          <Link href="/plan/profile" className={isActive("/plan/profile") ? "active" : undefined}>
            <UserCircle />
            Profile
          </Link>
          <a href="#menu" onClick={(e) => { e.preventDefault(); setMobileOpen(true); }}>
            <Menu />
            More
          </a>
        </nav>
      </div>
    </div>
  );
}
