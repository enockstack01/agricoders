"use client";
// CropManager-style building blocks for the Logistack Plan app.
// Markup mirrors Crop-Manager/client/src/components/ui.jsx; styles live in app/plan/cropmanager.css.
import { useEffect } from "react";
import { Layers, X, CheckCircle2, AlertTriangle, Inbox } from "@/components/plan/icons";

export function LogoMark({ size = 20 }: { size?: number }) {
  return <Layers size={size} strokeWidth={2.2} />;
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="page-header">
      <div style={{ minWidth: 0 }}>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}

export function Loading({ label = "Loading data..." }: { label?: string }) {
  return (
    <div className="loading-state">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}

export function EmptyState({
  icon = <Inbox size={28} />,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc">{description}</p>}
      {action}
    </div>
  );
}

export function Modal({
  title,
  icon,
  onClose,
  size = "sm",
  footer,
  children,
}: {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  onClose: () => void;
  size?: "sm" | "md" | "lg";
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal ${size === "sm" ? "modal-sm" : size === "lg" ? "modal-lg" : ""}`} role="dialog" aria-modal="true">
        {title && (
          <div className="modal-header">
            <h3 className="modal-title">{icon}{title}</h3>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close">
              <X size={16} />
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function Toast({ toast }: { toast: { msg: string; ok: boolean } | null }) {
  if (!toast) return null;
  return (
    <div className="toast-container">
      <div className={`toast ${toast.ok ? "toast-success" : "toast-error"}`} role="status">
        {toast.ok ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
        <span className="toast-message">{toast.msg}</span>
      </div>
    </div>
  );
}

export function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="stepper">
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} disabled={value === 0} aria-label="Decrease">
        −
      </button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} aria-label="Increase">
        +
      </button>
    </div>
  );
}

export function Avatar({ src, name, size }: { src?: string; name?: string; size?: "lg" }) {
  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <span className={`avatar${size === "lg" ? " avatar-lg" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? <img src={src} alt="" /> : initial}
    </span>
  );
}

export function Pager({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="card-footer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
      <span>Page {page} of {totalPages}</span>
      <div className="pagination">
        <button className="page-btn" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button>
        <button className="page-btn active">{page}</button>
        <button className="page-btn" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</button>
      </div>
    </div>
  );
}
