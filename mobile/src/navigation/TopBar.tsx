import { useState } from 'react';
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
import { OfflineStrip } from '../components/OfflineStrip';

/** 48 px touch target with a white icon, for use on the forest app bar. */
function BarButton({ icon, onPress, label, badge }: { icon: string; onPress: () => void; label: string; badge?: number }) {
  return (
    <Pressable
      onPress={() => {
        haptics.select();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={badge ? `${label}, ${badge} unread` : label}
      style={({ pressed }) => ({
        width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center',
        backgroundColor: pressed ? 'rgba(255,255,255,0.14)' : 'transparent',
      })}
    >
      <Icon name={icon} size={20} color="#FFFFFF" />
      {badge ? (
        <View
          style={{
            position: 'absolute', top: 5, right: 4, minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 4,
            backgroundColor: '#F9A825', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#111611', fontSize: 12, lineHeight: 15, fontFamily: ff('700') }}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

// one icon and tone per notification type (same as the website's notification bell)
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
        flexDirection: 'row', gap: 12, paddingVertical: 14, paddingHorizontal: 12, borderRadius: radius.md, minHeight: 64,
        backgroundColor: n.read ? 'transparent' : colors.primaryLight,
        borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth, borderBottomColor: colors.border,
      }}
    >
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDark ? bgDark : bgLight, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={s.icon} size={15} color={fg} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText weight="700" style={{ fontSize: 15 }}>{n.title}</AppText>
        <AppText variant="subtitle" style={{ fontSize: 14, marginTop: 2 }}>{n.body}</AppText>
        <AppText variant="caption" style={{ marginTop: 4 }}>{formatDateTime(n.createdAt)}</AppText>
      </View>
      {!n.read ? <View accessibilityLabel="Unread" style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 6 }} /> : null}
    </Pressable>
  );
}

export type LeftAction = 'none' | 'back' | 'close';

/**
 * App bar: solid forest green with the screen title, so you always know where you are. It has an
 * optional back or close button on the left and the notification bell on the right (plus the
 * profile picture on tablets, where the bottom tab bar is replaced by the side menu).
 */
export function TopBar({
  title,
  left = 'none',
  onLeft,
  showAvatar,
  onAvatar,
}: {
  title: string;
  left?: LeftAction;
  onLeft?: () => void;
  showAvatar?: boolean;
  onAvatar?: () => void;
}) {
  const { colors } = useTheme();
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
    <View style={{ backgroundColor: '#1B5E20' }}>
      <View style={{ paddingTop: insets.top }}>
        <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', paddingLeft: left === 'none' ? 20 : 4, paddingRight: 4, gap: 4 }}>
          {left !== 'none' ? (
            <BarButton icon={left === 'close' ? 'xmark' : 'arrow-left'} label={left === 'close' ? 'Close' : 'Back'} onPress={() => onLeft?.()} />
          ) : null}
          <Text
            accessibilityRole="header"
            numberOfLines={1}
            style={{ flex: 1, color: '#FFFFFF', fontSize: 21, fontFamily: ff('700'), marginLeft: left === 'none' ? 0 : 4 }}
          >
            {title}
          </Text>
          <BarButton icon="bell" label="Notifications" badge={unread} onPress={() => setNotifOpen(true)} />
          {showAvatar ? (
            <Pressable
              onPress={onAvatar}
              accessibilityRole="button"
              accessibilityLabel="Profile & Settings"
              style={({ pressed }) => ({ marginHorizontal: 6, opacity: pressed ? 0.8 : 1 })}
            >
              {avatar ? (
                <Image source={{ uri: avatar }} style={{ width: 36, height: 36, borderRadius: 18 }} />
              ) : (
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#1B5E20', fontFamily: ff('700'), fontSize: 14 }}>{initials}</Text>
                </View>
              )}
            </Pressable>
          ) : null}
        </View>
      </View>
      <OfflineStrip />

      <Sheet
        visible={notifOpen}
        onClose={() => setNotifOpen(false)}
        title="Notifications"
        size="sm"
        footer={unread ? (
          <Pressable
            onPress={() => markAllRead.mutate()}
            accessibilityRole="button"
            style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 }}
          >
            <AppText weight="700" style={{ fontSize: 15, color: colors.primary }}>Mark all read</AppText>
          </Pressable>
        ) : undefined}
      >
        {notifs.length === 0 ? (
          <View style={{ alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl }}>
            <Icon name="bell" size={28} color={colors.textLight} />
            <AppText weight="700" style={{ fontSize: 16 }}>You're all caught up</AppText>
            <AppText variant="subtitle" style={{ textAlign: 'center' }}>Updates about your documents and credits show up here.</AppText>
          </View>
        ) : (
          notifs.map((n, i) => (
            <NotifRow key={n._id} n={n} last={i === notifs.length - 1} onToggle={() => setRead.mutate({ id: n._id, read: !n.read })} />
          ))
        )}
      </Sheet>
    </View>
  );
}
