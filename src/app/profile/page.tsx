"use client";
import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import AppShell, { NavRole } from "@/components/layout/AppShell";
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
  ChevronDown,
  Copy,
  Coins,
  Clock,
  CreditCard,
  Zap,
} from "lucide-react";
import { CREDIT_PACKAGES } from "@/lib/credit-packages";
import type { PackageId } from "@/lib/credit-packages";

const CURRENCIES = ["USD","EUR","GBP","RWF","KES","NGN","ZAR","GHS","UGX","TZS","ETB","INR","CAD","AUD","BRL","MXN","JPY","CNY","SGD","AED"];
const COMPANY_TYPES = ["Private Limited Company","Public Limited Company","LLC","Sole Proprietorship","Partnership","LLP","Non-profit Organization","Cooperative","Other"];

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
          {icon}
        </div>
        <h2 className="font-semibold text-gray-900 text-sm">{title}</h2>
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" />
  );
}

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer pr-8">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

function RateInput({ label, hint, value, onChange }: { label: string; hint?: string; value: number; onChange: (v: number) => void }) {
  return (
    <Field label={label} hint={hint}>
      <div className="relative">
        <input type="number" min={0} max={100} step={0.1}
          value={(value * 100).toFixed(1)}
          onChange={(e) => onChange((parseFloat(e.target.value) || 0) / 100)}
          className="w-full border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" />
        <Percent size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
  const [buyingPkg, setBuyingPkg] = useState<PackageId | null>(null);

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

  useEffect(() => { if (isLoaded) load(); }, [isLoaded, load]);

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

  const handleBuyCredits = async (packageId: PackageId) => {
    setBuyingPkg(packageId);
    try {
      const res = await axios.post<{ url: string }>("/api/payments/create-checkout", { packageId });
      window.location.href = res.data.url;
    } catch {
      setError("Failed to start checkout. Please try again.");
      setBuyingPkg(null);
    }
  };

  const set = (key: keyof UserProfileDefaults, val: string | number) =>
    setDefaults((prev) => ({ ...prev, [key]: val }));

  if (!isLoaded || loading) {
    return (
      <AppShell role={role} title="Profile" breadcrumb={[{ label: "Dashboard", href: "/dashboard" }, { label: "Profile" }]}>
        <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading profile…</span>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role={role} title="Profile & Settings" breadcrumb={[{ label: "Dashboard", href: "/dashboard" }, { label: "Profile" }]}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Profile &amp; Default Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            These defaults pre-fill every new business plan you create. You can always override them in the form.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors self-start sm:self-auto flex-shrink-0"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <CheckCircle size={15} /> : <Save size={15} />}
          {saving ? "Saving…" : saved ? "Saved!" : "Save Defaults"}
        </button>
      </div>

      {/* Feedback */}
      {saved && (
        <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
          <CheckCircle size={15} />
          Profile saved. Your defaults will apply to all new business plans.
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* ── User Account ──────────────────────────────────────────────────── */}
        <Section title="Account" icon={<User size={15} />}>
          <div className="flex items-center gap-4">
            {user?.imageUrl
              ? <img src={user.imageUrl} alt="" className="w-14 h-14 rounded-full object-cover flex-shrink-0 border border-gray-200" />
              : <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><User size={22} className="text-gray-500" /></div>
            }
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{user?.fullName || "—"}</p>
              <p className="text-sm text-gray-500">{user?.primaryEmailAddress?.emailAddress || "—"}</p>
              <div className="flex items-center gap-2 mt-1">
                {role !== "user" && (
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${
                    role === "super_admin" ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-blue-100 text-blue-700 border-blue-200"
                  }`}>
                    <Shield size={10} />
                    {role === "super_admin" ? "Super Admin" : "Admin"}
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Account ID — copy button */}
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Your Account ID</p>
            <p className="text-xs text-gray-500 mb-2">
              Share this ID with an admin when requesting credits. Keep it private otherwise.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs font-mono bg-white border border-gray-200 rounded px-2.5 py-1.5 text-gray-700 truncate select-all">
                {user?.id || "—"}
              </code>
              <button
                onClick={() => {
                  if (user?.id) {
                    navigator.clipboard.writeText(user.id);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs rounded-lg transition-colors flex-shrink-0"
              >
                {copied ? <CheckCircle size={12} className="text-green-600" /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs text-gray-400">
            To update your name, email, or profile photo, use the account button in the top-right corner.
          </p>
        </Section>

        {/* ── Credits ───────────────────────────────────────────────────────── */}
        <Section title="Credits" icon={<Coins size={15} />}>
          {/* Balance row */}
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <p className="text-3xl font-bold text-gray-900">{credits ?? "—"}</p>
              <p className="text-xs text-gray-500 mt-0.5">Available credits</p>
            </div>
            <div className="text-right text-xs text-gray-500 space-y-0.5">
              <p>Generation cost: <strong className="text-gray-700">5 credits</strong></p>
              <p>Downloads: <strong className="text-green-700">Free</strong></p>
            </div>
          </div>

          {/* Buy Credits heading */}
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={13} className="text-green-600" />
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Buy Credits</p>
          </div>

          {/* Credit packages */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
            {CREDIT_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handleBuyCredits(pkg.id)}
                disabled={buyingPkg !== null}
                className={`relative flex flex-col items-center text-center rounded-xl border px-3 py-3.5 transition-all group disabled:opacity-60 disabled:cursor-not-allowed ${
                  pkg.popular
                    ? "border-green-400 bg-green-50 hover:bg-green-100 shadow-sm"
                    : "border-gray-200 bg-white hover:border-green-300 hover:bg-gray-50"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold bg-green-600 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                    Most Popular
                  </span>
                )}
                {pkg.saves && (
                  <span className="text-[9px] font-semibold text-green-600 mb-0.5">{pkg.saves}</span>
                )}
                <p className="text-lg font-extrabold text-gray-900 leading-none">{pkg.credits}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">credits</p>
                <p className="text-sm font-bold text-gray-800 mt-1.5">
                  ${(pkg.usdCents / 100).toFixed(0)}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">{pkg.description}</p>
                <div className={`mt-2.5 w-full py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  pkg.popular
                    ? "bg-green-600 text-white group-hover:bg-green-700"
                    : "bg-gray-100 text-gray-700 group-hover:bg-green-600 group-hover:text-white"
                }`}>
                  {buyingPkg === pkg.id ? (
                    <span className="flex items-center justify-center gap-1">
                      <Loader2 size={11} className="animate-spin" />
                      Opening…
                    </span>
                  ) : "Buy"}
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5 text-xs text-blue-700 mb-5">
            <Zap size={12} className="flex-shrink-0 mt-0.5 text-blue-500" />
            <span>
              Secure payment via <strong>Stripe</strong>. Supports cards, Apple Pay, Google Pay, bank transfers, and more. Credits are added instantly after payment.
            </span>
          </div>

          {/* Transaction history */}
          {transactions.length > 0 ? (
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Transaction History</p>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                {transactions.slice(0, 10).map((tx, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 bg-white text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.credits > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {tx.credits > 0 ? `+${tx.credits}` : tx.credits}
                      </span>
                      <span className="text-gray-600 capitalize">{tx.type}</span>
                      {tx.paymentAmount && (
                        <span className="text-gray-400">({tx.paymentAmount} {tx.currency})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>Balance: {tx.balanceAfter}</span>
                      <Clock size={10} />
                      <span>{new Date(tx.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400">No transactions yet.</p>
          )}
        </Section>

        {/* ── Company Defaults ──────────────────────────────────────────────── */}
        <Section title="Company Defaults" icon={<Building2 size={15} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Default Author Title" hint="Pre-filled in every new plan">
              <Input value={defaults.authorTitle} onChange={(v) => set("authorTitle", v)} placeholder="Founder & CEO" />
            </Field>
            <Field label="Default Location / Country">
              <Input value={defaults.location} onChange={(v) => set("location", v)} placeholder="e.g. Nairobi, Kenya" />
            </Field>
            <Field label="Default Company Type">
              <SelectField value={defaults.companyType} onChange={(v) => set("companyType", v)} options={COMPANY_TYPES} />
            </Field>
            <Field label="Default Industry" hint="Your primary sector">
              <Input value={defaults.industry} onChange={(v) => set("industry", v)} placeholder="e.g. FinTech, Healthcare, AgriTech" />
            </Field>
          </div>
        </Section>

        {/* ── Currency ──────────────────────────────────────────────────────── */}
        <Section title="Default Currency" icon={<Globe size={15} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Currency" hint="All monetary values will use this code">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    value={CURRENCIES.includes(defaults.currency) ? defaults.currency : "__custom__"}
                    onChange={(e) => { if (e.target.value !== "__custom__") set("currency", e.target.value); }}
                    className="appearance-none w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer pr-8"
                  >
                    {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    <option value="__custom__">Other</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {!CURRENCIES.includes(defaults.currency) && (
                  <input value={defaults.currency} onChange={(e) => set("currency", e.target.value.toUpperCase())}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="XXX" maxLength={5} />
                )}
              </div>
            </Field>
            <div className="flex items-end pb-1">
              <p className="text-xs text-gray-400 leading-relaxed">
                Popular codes: <strong>USD</strong> (US Dollar), <strong>EUR</strong> (Euro), <strong>GBP</strong> (British Pound),
                <strong> RWF</strong> (Rwandan Franc), <strong>KES</strong> (Kenyan Shilling), <strong>NGN</strong> (Nigerian Naira)
              </p>
            </div>
          </div>
        </Section>

        {/* ── Financial Defaults ────────────────────────────────────────────── */}
        <Section title="Default Financial Rates" icon={<DollarSign size={15} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
            <RateInput label="Corporate Income Tax (CIT)" hint="Default tax on company profits" value={defaults.citRate} onChange={(v) => set("citRate", v)} />
            <RateInput label="NPV Discount Rate" hint="For NPV and cost-benefit calculations" value={defaults.discountRate} onChange={(v) => set("discountRate", v)} />
            <Field label="Default Loan Interest Rate (% p.a.)" hint="Annual interest on commercial loans">
              <div className="relative">
                <input type="number" min={0} max={100} step={0.1}
                  value={(defaults.loanRate * 100).toFixed(1)}
                  onChange={(e) => set("loanRate", (parseFloat(e.target.value) || 0) / 100)}
                  className="w-full border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" />
                <Percent size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </Field>
            <Field label="Default Loan Term (Years)">
              <Input type="number" value={defaults.loanTermYears} onChange={(v) => set("loanTermYears", parseInt(v) || 5)} placeholder="5" />
            </Field>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Payroll Contribution Rates</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <RateInput label="Social Security / Pension" hint="Employee pension contribution rate" value={defaults.rssbRate} onChange={(v) => set("rssbRate", v)} />
              <RateInput label="Health Insurance" value={defaults.healthInsuranceRate} onChange={(v) => set("healthInsuranceRate", v)} />
              <RateInput label="Other Payroll Deduction" hint="e.g. maternity/parental leave" value={defaults.maternityRate} onChange={(v) => set("maternityRate", v)} />
            </div>
          </div>

          <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-700">
            <strong>Note:</strong> These rates apply to all new business plans created from your account.
            You can still override any rate inside an individual plan in the Financial Settings step.
          </div>
        </Section>
      </div>

      {/* Sticky save bar on mobile */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-3 z-20">
        {saved
          ? <p className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle size={13} />Saved!</p>
          : error
          ? <p className="text-xs text-red-600 font-medium flex items-center gap-1"><AlertCircle size={13} />{error}</p>
          : <p className="text-xs text-gray-400">Unsaved changes</p>
        }
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors">
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
      <div className="h-16 sm:hidden" /> {/* bottom spacer for mobile */}
    </AppShell>
  );
}
