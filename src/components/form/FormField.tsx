import { Plus, X, ChevronDown, Check } from "lucide-react";

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

const inputBase =
  "w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors";

export function FormInput({ label, value, onChange, type = "text", placeholder, required, hint }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{hint}</p>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputBase}
      />
    </div>
  );
}

export function FormTextArea({ label, value, onChange, placeholder, required, hint, rows = 3 }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{hint}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`${inputBase} resize-y`}
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
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{hint}</p>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputBase} appearance-none pr-9 cursor-pointer`}
        >
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
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        />
      </div>
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
    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      <span className="relative flex items-center justify-center w-9 h-9 -m-1.5 flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer absolute inset-0 opacity-0 cursor-pointer"
        />
        <span className="w-[18px] h-[18px] rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 peer-checked:bg-green-600 peer-checked:border-green-600 flex items-center justify-center transition-colors pointer-events-none">
          <Check size={12} strokeWidth={3} className="text-white opacity-0 peer-checked:opacity-100" />
        </span>
      </span>
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    </label>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3 pb-1.5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
      {children}
    </h3>
  );
}

export function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors py-1.5"
    >
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
      className="flex-shrink-0 flex items-center justify-center w-9 h-9 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
    >
      <X size={16} />
    </button>
  );
}

export function GridRow({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  const colClass = cols === 3 ? "sm:grid-cols-3" : cols === 4 ? "sm:grid-cols-4" : "sm:grid-cols-2";
  return (
    <div className={`grid grid-cols-1 ${colClass} gap-4`}>
      {children}
    </div>
  );
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
    return <p className="text-sm text-gray-400 dark:text-gray-500 py-6 text-center">{emptyMessage}</p>;
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ${col.headClassName ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {rows.map((row, i) => (
              <tr key={rowKey(row, i)} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`px-3 py-2 align-middle ${col.cellClassName ?? ""}`}>
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
          <div
            key={rowKey(row, i)}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 space-y-3"
          >
            {mobileActions && <div className="flex justify-end -mt-1.5 -mr-1.5">{mobileActions(row, i)}</div>}
            {columns
              .filter((c) => !c.hideOnMobile)
              .map((col) => (
                <div key={col.key} className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                    {col.header}
                  </span>
                  <div>{col.render(row, i)}</div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </>
  );
}
