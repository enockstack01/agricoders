"use client";
import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import AppShell, { NavRole } from "@/components/layout/AppShell";
import { PageHeader, Loading, Avatar } from "@/components/plan/ui";
import { UserProfileDefaults } from "@/types";
import {
  User,
  Building2,
  DollarSign,
  Percent,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Globe,
  Shield,
  Copy,
  Coins,
  Clock,
  Mail,
} from "@/components/plan/icons";

const CURRENCIES = ["USD","EUR","GBP","RWF","KES","NGN","ZAR","GHS","UGX","TZS","ETB","INR","CAD","AUD","BRL","MXN","JPY","CNY","SGD","AED"];
const COMPANY_TYPES = ["Private Limited Company","Public Limited Company","LLC","Sole Proprietorship","Partnership","LLP","Non-profit Organization","Cooperative","Other"];

function Section({ title, icon, tone = "green", children }: { title: string; icon: React.ReactNode; tone?: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3><span className={`icon-tile ${tone}`}>{icon}</span>{title}</h3>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      <label className="form-label">{label}</label>
      {hint && <p className="form-hint above">{hint}</p>}
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="form-control" />;
}

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="form-control">
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function RateInput({ label, hint, value, onChange }: { label: string; hint?: string; value: number; onChange: (v: number) => void }) {
  return (
    <Field label={label} hint={hint}>
      <div className="input-suffix">
        <input type="number" min={0} max={100} step={0.1}
          value={(value * 100).toFixed(1)}
          onChange={(e) => onChange((parseFloat(e.target.value) || 0) / 100)}
          className="form-control" />
        <Percent size={13} />
      </div>
    </Field>
  );
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const role = (user?.publicMetadata?.role as NavRole | undefined) ?? "user";

  const [defaults, setDefaults] = useState<UserProfileDefaults>({
    currency: "USD",
    location: "",
    companyType: "Private Limited Company",
    industry: "",
    authorTitle: "Founder & CEO",
    citRate: 0.30,
    rssbRate: 0.05,
    healthInsuranceRate: 0.00,
    maternityRate: 0.00,
    discountRate: 0.12,
    loanRate: 0.12,
    loanTermYears: 5,
  });

  const [credits, setCredits] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<{
    type: string; credits: number; balanceAfter: number; currency?: string;
    paymentAmount?: number; note?: string; createdAt: string;
  }[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, creditsRes] = await Promise.allSettled([
        axios.get("/api/profile"),
        axios.get<{ credits: number; transactions: typeof transactions }>("/api/credits"),
      ]);
      if (profileRes.status === "fulfilled") {
        setDefaults((prev) => ({ ...prev, ...profileRes.value.data.defaults }));
      }
      if (creditsRes.status === "fulfilled") {
        setCredits(creditsRes.value.data.credits ?? 0);
        setTransactions(creditsRes.value.data.transactions ?? []);
      }
    } catch { /* use defaults */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [isLoaded, load]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await axios.put("/api/profile", defaults);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof UserProfileDefaults, val: string | number) =>
    setDefaults((prev) => ({ ...prev, [key]: val }));

  const crumbs = [{ label: "Dashboard", href: "/plan/dashboard" }, { label: "Profile & Settings" }];

  if (!isLoaded || loading) {
    return (
      <AppShell role={role} title="Profile" breadcrumb={crumbs}>
        <Loading label="Loading profile…" />
      </AppShell>
    );
  }

  const saveButton = (
    <button onClick={handleSave} disabled={saving} className="btn btn-primary">
      {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <CheckCircle size={15} /> : <Save size={15} />}
      {saving ? "Saving…" : saved ? "Saved!" : "Save Defaults"}
    </button>
  );

  return (
    <AppShell role={role} title="Profile & Settings" breadcrumb={crumbs}>
      <PageHeader
        title="Profile & Default Settings"
        subtitle="These defaults pre-fill every new business plan you create. You can always override them in the form."
        actions={<span className="hidden sm:inline-flex">{saveButton}</span>}
      />

      {saved && (
        <div className="alert-item alert-success" style={{ marginBottom: 16 }}>
          <CheckCircle size={16} />
          <div className="alert-content">Profile saved. Your defaults will apply to all new business plans.</div>
        </div>
      )}
      {error && (
        <div className="alert-item alert-danger" style={{ marginBottom: 16 }}>
          <AlertCircle size={16} />
          <div className="alert-content">{error}</div>
        </div>
      )}

      <div className="chart-grid">
        {/* ── Account ─────────────────────────────────────────────────────── */}
        <Section title="Account" icon={<User size={15} />}>
          <div className="user-cell" style={{ marginBottom: 18 }}>
            <Avatar src={user?.imageUrl} name={user?.fullName ?? undefined} size="lg" />
            <div>
              <div className="cell-primary" style={{ fontSize: 15 }}>{user?.fullName || "—"}</div>
              <div className="cell-muted" style={{ overflowWrap: "anywhere" }}>{user?.primaryEmailAddress?.emailAddress || "—"}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                {role !== "user" && (
                  <span className={`badge ${role === "super_admin" ? "badge-purple" : "badge-info"}`}>
                    <Shield size={10} />
                    {role === "super_admin" ? "Super Admin" : "Admin"}
                  </span>
                )}
                <span className="cell-sub">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "—"}
                </span>
              </div>
            </div>
          </div>

          <Field label="Your Account ID" hint="Share this ID with an admin when requesting credits. Keep it private otherwise.">
            <div style={{ display: "flex", gap: 8 }}>
              <input readOnly value={user?.id || "—"} className="form-control mono" onFocus={(e) => e.target.select()} />
              <button
                onClick={() => {
                  if (user?.id) {
                    navigator.clipboard.writeText(user.id);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className="btn btn-secondary"
              >
                {copied ? <CheckCircle size={14} style={{ color: "var(--primary)" }} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </Field>

          <p className="form-hint" style={{ marginTop: 14 }}>
            To update your name, email, or profile photo, use the account button in the top-right corner.
          </p>
        </Section>

        {/* ── Credits ─────────────────────────────────────────────────────── */}
        <Section title="Credits" icon={<Coins size={15} />} tone="orange">
          <div className="stat-grid" style={{ marginBottom: 16, "--stat-min": "110px" } as React.CSSProperties}>
            <div className="stat-tile tone-green">
              <div className="stat-tile-label">Available</div>
              <div className="stat-tile-value">{credits ?? "—"}</div>
              <div className="stat-tile-sub">credits</div>
            </div>
            <div className="stat-tile tone-orange">
              <div className="stat-tile-label">Generation</div>
              <div className="stat-tile-value">5</div>
              <div className="stat-tile-sub">credits each</div>
            </div>
            <div className="stat-tile tone-blue">
              <div className="stat-tile-label">Downloads</div>
              <div className="stat-tile-value">Free</div>
              <div className="stat-tile-sub">stored copies</div>
            </div>
          </div>

          <div className="alert-item alert-info" style={{ marginBottom: 16 }}>
            <Mail size={15} />
            <div className="alert-content">
              To get more credits, contact your administrator. Each business plan generation costs <strong>5 credits</strong>.
            </div>
          </div>

          <label className="form-label">Transaction History</label>
          {transactions.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table compact">
                <tbody>
                  {transactions.slice(0, 10).map((tx, i) => (
                    <tr key={i}>
                      <td>
                        <span className={`badge ${tx.credits > 0 ? "badge-success" : "badge-danger"}`}>
                          {tx.credits > 0 ? `+${tx.credits}` : tx.credits}
                        </span>
                      </td>
                      <td style={{ textTransform: "capitalize" }}>
                        {tx.type}
                        {tx.paymentAmount && <span className="cell-sub"> ({tx.paymentAmount} {tx.currency})</span>}
                      </td>
                      <td className="cell-muted text-right" style={{ whiteSpace: "nowrap" }}>
                        Bal. {tx.balanceAfter} · <Clock size={10} style={{ display: "inline", verticalAlign: "-1px" }} />{" "}
                        {new Date(tx.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="form-hint">No transactions yet.</p>
          )}
        </Section>

        {/* ── Company Defaults ────────────────────────────────────────────── */}
        <Section title="Company Defaults" icon={<Building2 size={15} />} tone="blue">
          <div className="form-row">
            <Field label="Default Author Title" hint="Pre-filled in every new plan">
              <Input value={defaults.authorTitle} onChange={(v) => set("authorTitle", v)} placeholder="Founder & CEO" />
            </Field>
            <Field label="Default Location / Country" hint="City and country">
              <Input value={defaults.location} onChange={(v) => set("location", v)} placeholder="e.g. Nairobi, Kenya" />
            </Field>
            <Field label="Default Company Type">
              <SelectField value={defaults.companyType} onChange={(v) => set("companyType", v)} options={COMPANY_TYPES} />
            </Field>
            <Field label="Default Industry">
              <Input value={defaults.industry} onChange={(v) => set("industry", v)} placeholder="e.g. FinTech, Healthcare, AgriTech" />
            </Field>
          </div>
        </Section>

        {/* ── Currency ────────────────────────────────────────────────────── */}
        <Section title="Default Currency" icon={<Globe size={15} />} tone="purple">
          <Field label="Currency" hint="All monetary values will use this code">
            <div style={{ display: "flex", gap: 8 }}>
              <select
                value={CURRENCIES.includes(defaults.currency) ? defaults.currency : "__custom__"}
                onChange={(e) => { if (e.target.value !== "__custom__") set("currency", e.target.value); }}
                className="form-control"
              >
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                <option value="__custom__">Other</option>
              </select>
              {!CURRENCIES.includes(defaults.currency) && (
                <input value={defaults.currency} onChange={(e) => set("currency", e.target.value.toUpperCase())}
                  className="form-control" style={{ width: 96, flex: "none" }}
                  placeholder="XXX" maxLength={5} />
              )}
            </div>
          </Field>
          <p className="form-hint" style={{ marginTop: 14, lineHeight: 1.7 }}>
            Popular codes: <strong>USD</strong> (US Dollar), <strong>EUR</strong> (Euro), <strong>GBP</strong> (British Pound),
            <strong> RWF</strong> (Rwandan Franc), <strong>KES</strong> (Kenyan Shilling), <strong>NGN</strong> (Nigerian Naira)
          </p>
        </Section>

        {/* ── Financial Defaults (full width) ─────────────────────────────── */}
        <div style={{ gridColumn: "1 / -1", minWidth: 0 }}>
          <Section title="Default Financial Rates" icon={<DollarSign size={15} />}>
            <div className="form-row-4">
              <RateInput label="Corporate Income Tax (CIT)" hint="Tax on company profits" value={defaults.citRate} onChange={(v) => set("citRate", v)} />
              <RateInput label="NPV Discount Rate" hint="For NPV and cost-benefit" value={defaults.discountRate} onChange={(v) => set("discountRate", v)} />
              <RateInput label="Loan Interest Rate (% p.a.)" hint="Commercial loans" value={defaults.loanRate} onChange={(v) => set("loanRate", v)} />
              <Field label="Loan Term (Years)" hint="Repayment period">
                <Input type="number" value={defaults.loanTermYears} onChange={(v) => set("loanTermYears", parseInt(v) || 5)} placeholder="5" />
              </Field>
            </div>

            <h4 className="form-section-title" style={{ marginTop: 24 }}>Payroll Contribution Rates</h4>
            <div className="form-row-3">
              <RateInput label="Social Security / Pension" hint="Employee pension contribution" value={defaults.rssbRate} onChange={(v) => set("rssbRate", v)} />
              <RateInput label="Health Insurance" hint="Contribution rate" value={defaults.healthInsuranceRate} onChange={(v) => set("healthInsuranceRate", v)} />
              <RateInput label="Other Payroll Deduction" hint="e.g. maternity/parental leave" value={defaults.maternityRate} onChange={(v) => set("maternityRate", v)} />
            </div>

            <div className="alert-item alert-warning" style={{ marginTop: 20 }}>
              <AlertCircle size={15} />
              <div className="alert-content">
                <strong className="alert-kicker">Note</strong>
                These rates apply to all new business plans created from your account. You can still override any rate inside an individual plan in the Financial Settings step.
              </div>
            </div>
          </Section>
        </div>
      </div>

      {/* Sticky save bar on mobile */}
      <div className="sm:hidden mobile-save-bar" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 800 }}>
        <div style={{ background: "var(--white)", borderTop: "1px solid var(--border)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span className="form-hint" style={{ margin: 0, color: saved ? "var(--primary)" : error ? "var(--red)" : undefined }}>
            {saved ? "Saved!" : error ? error : "Unsaved changes"}
          </span>
          {saveButton}
        </div>
      </div>
      <div className="h-20 sm:hidden" />
    </AppShell>
  );
}
