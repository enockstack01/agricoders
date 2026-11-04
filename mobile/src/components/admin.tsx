import { ScrollView, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { ff, radius, spacing } from '../theme/theme';
import { AppText, Badge } from './ui';
import { PressableScale } from './PressableScale';
import type { NavRole } from '../lib/useResource';

/** Pill tabs for switching between the sections of an admin screen. */
export function SegmentedTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { key: T; label: string; badge?: number }[];
  value: T;
  onChange: (key: T) => void;
}) {
  const { colors, isDark } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingVertical: 2 }}>
      {tabs.map((t) => {
        const active = t.key === value;
        return (
          <PressableScale
            key={t.key}
            onPress={() => onChange(t.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 8,
              paddingVertical: 9, paddingHorizontal: 18, borderRadius: radius.pill, borderWidth: 1,
              backgroundColor: active ? (isDark ? '#1B5E20' : colors.primary) : colors.card,
              borderColor: active ? (isDark ? '#1B5E20' : colors.primary) : colors.border,
            }}
          >
            <AppText weight="700" style={{ fontSize: 14, color: active ? '#FFFFFF' : colors.text }}>{t.label}</AppText>
            {t.badge ? (
              <View style={{ minWidth: 20, height: 20, paddingHorizontal: 6, borderRadius: 10, backgroundColor: '#F9A825', alignItems: 'center', justifyContent: 'center' }}>
                <AppText style={{ fontSize: 12, color: '#111611', fontFamily: ff('700') }}>{t.badge}</AppText>
              </View>
            ) : null}
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

export const ROLE_LABEL: Record<NavRole, string> = { user: 'User', admin: 'Admin', super_admin: 'Super Admin' };

export function RoleBadge({ role }: { role: NavRole }) {
  return <Badge label={ROLE_LABEL[role] ?? 'User'} tone={role === 'super_admin' ? 'danger' : role === 'admin' ? 'warning' : 'neutral'} />;
}

/** Round avatar with the person's initials. */
export function Initials({ name, size = 40 }: { name?: string; size?: number }) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  const text = ((parts[0]?.[0] ?? '?') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#1B5E20', alignItems: 'center', justifyContent: 'center' }}>
      <AppText weight="700" style={{ color: '#FFFFFF', fontSize: size * 0.38 }}>{text}</AppText>
    </View>
  );
}

/** "3 days ago" style label for a timestamp. */
export function timeAgo(ms?: number | string | null): string {
  if (!ms) return 'N/A';
  const t = typeof ms === 'number' ? ms : new Date(ms).getTime();
  if (Number.isNaN(t)) return 'N/A';
  const sec = Math.max(0, Math.round((Date.now() - t) / 1000));
  if (sec < 60) return 'just now';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day} day${day === 1 ? '' : 's'} ago`;
  return new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
