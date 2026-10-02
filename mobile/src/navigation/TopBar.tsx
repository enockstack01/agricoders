import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import { useTheme } from '../theme/ThemeProvider';
import { ff, KPI_TONES, radius, spacing } from '../theme/theme';
import { useNotificationMutations, useNotifications, Notif } from '../lib/useResource';
import { formatDateTime } from '../lib/format';
import { haptics } from '../lib/haptics';
import { Icon } from '../components/Icon';
import { AppText } from '../components/ui';
import { Sheet } from '../components/Sheet';

/** web .topbar-btn: 38px, radius 8, muted icon */
function TopbarButton({ icon, onPress, label, badge }: { icon: string; onPress: () => void; label: string; badge?: number }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => {
        haptics.select();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={4}
      style={({ pressed }) => ({
        width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center',
        backgroundColor: pressed ? colors.bg : 'transparent',
      })}
    >
      <Icon name={icon} size={17} color={colors.textLight} />
      {badge ? (
        <View
          style={{
            position: 'absolute', top: 4, right: 4, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4,
            backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 10, fontFamily: ff('700') }}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

// website NotificationBell: one icon + tone per notification type (.notif-icon.*)
const NOTIF_STYLE: Record<string, { icon: string; tone: keyof typeof KPI_TONES }> = {
  credits_approved: { icon: 'coins', tone: 'green' },
  credits_rejected: { icon: 'xmark', tone: 'red' },
  credits_assigned: { icon: 'coins', tone: 'blue' },
  credits_deducted: { icon: 'coins', tone: 'orange' },
  document_ready: { icon: 'file-lines', tone: 'purple' },
  credit_request_pending: { icon: 'clipboard-list', tone: 'orange' },
};

function NotifRow({ n, last, onToggle }: { n: Notif; last: boolean; onToggle: () => void }) {
  const { colors, isDark } = useTheme();
  const s = NOTIF_STYLE[n.type] ?? { icon: 'bell', tone: 'blue' as const };
  const [bgLight, bgDark, fg] = KPI_TONES[s.tone];
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityHint={n.read ? 'Mark as unread' : 'Mark as read'}
      style={{
        flexDirection: 'row', gap: 12, paddingVertical: 12, paddingHorizontal: 10, borderRadius: radius.md,
        backgroundColor: n.read ? 'transparent' : colors.primaryLight,
        borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth, borderBottomColor: colors.border,
      }}
    >
      <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: isDark ? bgDark : bgLight, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={s.icon} size={14} color={fg} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText weight="600" style={{ fontSize: 13 }}>{n.title}</AppText>
        <AppText variant="subtitle" style={{ fontSize: 12, marginTop: 2 }}>{n.body}</AppText>
        <AppText variant="caption" style={{ marginTop: 3 }}>{formatDateTime(n.createdAt)}</AppText>
      </View>
    </Pressable>
  );
}

/**
 * The website's .topbar: white bar with the menu button (phones), dark-mode toggle,
 * notifications bell with unread count, and the user's avatar (opens Profile & Settings).
 */
export function TopBar({ navigation, showMenu }: { navigation: any; showMenu: boolean }) {
  const { colors, isDark, setMode } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const [notifOpen, setNotifOpen] = useState(false);

  const { data: notifs = [] } = useNotifications();
  const { setRead, markAllRead } = useNotificationMutations();
  const unread = notifs.filter((n) => !n.read).length;

  const name = user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress || 'User';
  const initials = (name.match(/\b\w/g) || ['U']).slice(0, 2).join('').toUpperCase();
  const avatar = user?.hasImage ? user.imageUrl : null;

  return (
    <View style={{ paddingTop: insets.top, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, gap: 4 }}>
        {showMenu ? <TopbarButton icon="bars" label="Open menu" onPress={() => navigation.openDrawer()} /> : null}
        <View style={{ flex: 1 }} />
        <TopbarButton icon={isDark ? 'sun' : 'moon'} label="Toggle dark mode" onPress={() => setMode(isDark ? 'light' : 'dark')} />
        <TopbarButton icon="bell" label="Notifications" badge={unread} onPress={() => setNotifOpen(true)} />
        <Pressable
          onPress={() => navigation.navigate('settings')}
          accessibilityRole="button"
          accessibilityLabel="Profile & Settings"
          style={({ pressed }) => ({ marginLeft: 6, borderRadius: 17, opacity: pressed ? 0.8 : 1 })}
        >
          {avatar ? (
            <Image source={{ uri: avatar }} style={{ width: 34, height: 34, borderRadius: 17 }} />
          ) : (
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: colors.primary, fontFamily: ff('700'), fontSize: 14 }}>{initials}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <Sheet
        visible={notifOpen}
        onClose={() => setNotifOpen(false)}
        title="Notifications"
        size="sm"
        footer={unread ? (
          <Pressable onPress={() => markAllRead.mutate()} hitSlop={8} accessibilityRole="button">
            <AppText weight="600" style={{ fontSize: 12, color: colors.primary }}>Mark all read</AppText>
          </Pressable>
        ) : undefined}
      >
        {notifs.length === 0 ? (
          <AppText variant="subtitle" style={{ fontSize: 13, textAlign: 'center', paddingVertical: spacing.lg }}>No notifications yet</AppText>
        ) : (
          notifs.map((n, i) => (
            <NotifRow key={n._id} n={n} last={i === notifs.length - 1} onToggle={() => setRead.mutate({ id: n._id, read: !n.read })} />
          ))
        )}
      </Sheet>
    </View>
  );
}
