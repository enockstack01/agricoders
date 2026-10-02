import { Plus, X } from "@/components/plan/icons";

// Form primitives for the plan wizard — CropManager form markup
// (.form-group / .form-label / .form-control), styled by app/plan/cropmanager.css.

interface InputProps {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  rows?: number;
}

function Label({ label, required, hint }: { label: string; required?: boolean; hint?: string }) {
  return (
    <>
      <label className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      {hint && <p className="form-hint above">{hint}</p>}
    </>
  );
}

export function FormInput({ label, value, onChange, type = "text", placeholder, required, hint }: InputProps) {
  return (
    <div>
      <Label label={label} required={required} hint={hint} />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-control"
      />
    </div>
  );
}

export function FormTextArea({ label, value, onChange, placeholder, required, hint, rows = 3 }: InputProps) {
  return (
    <div>
      <Label label={label} required={required} hint={hint} />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="form-control"
      />
    </div>
  );
}

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  options: SelectOption[];
  required?: boolean;
  hint?: string;
  placeholder?: string;
}

export function FormSelect({ label, value, onChange, options, required, hint, placeholder }: SelectProps) {
  return (
    <div>
      <Label label={label} required={required} hint={hint} />
      <select value={value} onChange={(e) => onChange(e.target.value)} className="form-control">
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FormCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="cm-check" style={{ minHeight: 36 }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="form-section-title">{children}</h3>;
}

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>
      <Plus size={14} />
      {label}
    </button>
  );
}

export function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Remove"
      title="Remove"
      className="btn-icon btn-icon-danger"
      style={{ width: 38, height: 38 }}
    >
      <X size={16} />
    </button>
  );
}

export function GridRow({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  // Tailwind grid (not .form-row) so callers' `sm:col-span-*` children line up with the breakpoints
  const colClass = cols === 3 ? "sm:grid-cols-3" : cols === 4 ? "sm:grid-cols-4" : "sm:grid-cols-2";
  return <div className={`grid grid-cols-1 ${colClass} gap-4`}>{children}</div>;
}

// ── Responsive data table ─────────────────────────────────────────────────
// Renders a normal <table> at `lg:` and up, and a stacked card-per-row list
// below `lg:`. Column `render` functions are shared between both layouts, so
// interactive cells (inputs, selects, remove buttons) work identically in
// either mode.

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T, index: number) => React.ReactNode;
  headClassName?: string;
  cellClassName?: string;
  /** Omit this column from the mobile card view (e.g. a purely decorative or redundant column). */
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string | number;
  emptyMessage?: string;
  /** Rendered top-right of each mobile card, e.g. a remove button. */
  mobileActions?: (row: T, index: number) => React.ReactNode;
}

export function DataTable<T>({ columns, rows, rowKey, emptyMessage = "No entries yet.", mobileActions }: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="inset-panel" style={{ textAlign: "center", color: "var(--text-light)", fontSize: 13, padding: "24px 14px" }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="table-responsive hidden lg:block">
        <table className="data-table compact">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={col.headClassName ?? ""}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={rowKey(row, i)}>
                {columns.map((col) => (
                  <td key={col.key} className={col.cellClassName ?? ""}>
                    {col.render(row, i)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="lg:hidden space-y-3">
        {rows.map((row, i) => (
          <div key={rowKey(row, i)} className="inset-panel" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mobileActions && <div style={{ display: "flex", justifyContent: "flex-end", margin: "-6px -6px 0 0" }}>{mobileActions(row, i)}</div>}
            {columns
              .filter((c) => !c.hideOnMobile)
              .map((col) => (
                <div key={col.key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span className="stat-tile-label" style={{ marginBottom: 0 }}>{col.header}</span>
                  <div>{col.render(row, i)}</div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </>
  );
}
