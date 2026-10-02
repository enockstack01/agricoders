import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { radius, spacing } from '../theme/theme';
import { AppText, IconButton } from './ui';
import { Icon } from './Icon';
import { NumberField, TextField } from './fields';
import { haptics } from '../lib/haptics';

/*
 * Field helpers for Agriplan's plan forms (website FormField.tsx equivalents):
 * numeric/percent inputs that keep a numeric value, editable string lists, repeatable
 * item cards and the "Generate with AI" button.
 */

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'RWF', 'KES', 'NGN', 'ZAR', 'GHS', 'UGX', 'TZS', 'ETB', 'INR', 'CAD', 'AUD', 'BRL', 'MXN', 'JPY', 'CNY', 'SGD', 'AED'];
export const COMPANY_TYPES = ['Private Limited Company', 'Public Limited Company', 'LLC', 'Sole Proprietorship', 'Partnership', 'LLP', 'Non-profit Organization', 'Cooperative', 'Other'];

/** Number input that edits as text (so "1." or "" are allowed mid-typing) but reports a number. */
export function NumField({
  label, value, onChange, hint, required, integer, placeholder,
}: {
  label?: string; value: number; onChange: (v: number) => void; hint?: string; required?: boolean; integer?: boolean; placeholder?: string;
}) {
  const [text, setText] = useState(value ? String(value) : '');
  // follow outside changes (e.g. AI fill, reset) without fighting the user's typing
  useEffect(() => {
    const parsed = integer ? parseInt(text, 10) : parseFloat(text);
    if ((Number.isNaN(parsed) ? 0 : parsed) !== (value || 0)) setText(value ? String(value) : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <NumberField
      label={label}
      hint={hint}
      required={required}
      placeholder={placeholder ?? '0'}
      value={text}
      onChangeValue={(t) => {
        const clean = t.replace(/[^0-9.\-]/g, '');
        setText(clean);
        const n = integer ? parseInt(clean, 10) : parseFloat(clean);
        onChange(Number.isNaN(n) ? 0 : n);
      }}
    />
  );
}

/** Rate stored as a fraction (0.3) but edited as a percentage (30). */
export function PercentField({ label, value, onChange, hint }: { label: string; value: number; onChange: (v: number) => void; hint?: string }) {
  return (
    <NumField
      label={`${label} (%)`}
      hint={hint}
      value={Math.round((value || 0) * 10000) / 100}
      onChange={(pct) => onChange(pct / 100)}
    />
  );
}

/** "+ Add …" outline button (website AddButton). */
export function AddRowButton({ label, onPress }: { label: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => { haptics.select(); onPress(); }}
      accessibilityRole="button"
      style={({ pressed }) => ({
        flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start',
        borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, paddingHorizontal: 14, minHeight: 38,
        backgroundColor: pressed ? colors.primaryLight : 'transparent',
      })}
    >
      <Icon name="plus" size={12} color={colors.primary} />
      <AppText weight="600" style={{ fontSize: 12, color: colors.primary }}>{label}</AppText>
    </Pressable>
  );
}

/** Editable list of strings (goals, steps, technologies, strategies…). */
export function StringList({
  items, onChange, placeholder, addLabel,
}: {
  items: string[]; onChange: (v: string[]) => void; placeholder?: string; addLabel: string;
}) {
  return (
    <View style={{ gap: spacing.sm }}>
      {items.map((v, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ flex: 1 }}>
            <TextField
              value={v}
              placeholder={placeholder}
              onChangeValue={(t) => { const next = [...items]; next[i] = t; onChange(next); }}
            />
          </View>
          <IconButton name="xmark" label="Remove" onPress={() => onChange(items.filter((_, j) => j !== i))} />
        </View>
      ))}
      <AddRowButton label={addLabel} onPress={() => onChange([...items, ''])} />
    </View>
  );
}

/** Bordered card for one repeatable item (staff member, CAPEX line, product…). */
export function ItemCard({ title, onRemove, children }: { title: string; onRemove: () => void; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, backgroundColor: colors.bg, padding: 14, gap: spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <AppText weight="600" style={{ flex: 1, fontSize: 13 }} numberOfLines={1}>{title}</AppText>
        <IconButton name="trash-can" label="Remove" color={colors.red} onPress={onRemove} />
      </View>
      {children}
    </View>
  );
}

/** Uppercase sub-heading inside a step (website .form-section-title). */
export function FormSection({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: spacing.md, marginTop: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.border, flexWrap: 'wrap' }}>
        <AppText weight="700" style={{ fontSize: 13, flex: 1 }}>{title}</AppText>
        {right}
      </View>
      {children}
    </View>
  );
}

/** "✨ Generate with AI" pill (website AIButton). */
export function AIButton({ onPress, loading, label = 'Generate with AI' }: { onPress: () => void; loading?: boolean; label?: string }) {
  const { colors, isDark } = useTheme();
  const purple = isDark ? '#CE93D8' : '#7B1FA2';
  return (
    <Pressable
      onPress={() => { haptics.select(); onPress(); }}
      disabled={loading}
      accessibilityRole="button"
      style={({ pressed }) => ({
        flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, minHeight: 32, borderRadius: radius.md,
        backgroundColor: isDark ? '#2D1A3D' : '#F3E5F5', opacity: loading ? 0.6 : pressed ? 0.85 : 1,
        borderWidth: 1, borderColor: isDark ? '#4A2A5C' : '#E1BEE7',
      })}
    >
      <Icon name={loading ? 'spinner' : 'wand-magic-sparkles'} size={11} color={purple} />
      <AppText weight="600" style={{ fontSize: 11.5, color: purple }}>{loading ? 'Generating…' : label}</AppText>
    </Pressable>
  );
}

/** Tinted info box (website .callout). */
export function Callout({ tone = 'success', children }: { tone?: 'success' | 'info' | 'warning'; children: React.ReactNode }) {
  const { isDark } = useTheme();
  const c = {
    success: [isDark ? '#1A3D1E' : '#E8F5E9', '#2E7D32'],
    info: [isDark ? '#1A3A5C' : '#E3F2FD', '#1976D2'],
    warning: [isDark ? '#3D3420' : '#FFF8E1', '#F9A825'],
  }[tone];
  return (
    <View style={{ backgroundColor: c[0], borderLeftWidth: 3, borderLeftColor: c[1], borderRadius: radius.md, padding: 12 }}>
      {typeof children === 'string' ? <AppText style={{ fontSize: 13 }}>{children}</AppText> : children}
    </View>
  );
}
