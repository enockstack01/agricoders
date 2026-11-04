import { StyleSheet, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { ff } from '../theme/theme';
import { haptics } from '../lib/haptics';
import { Icon } from '../components/Icon';
import { PressableScale } from '../components/PressableScale';

type Tab = { name: string; label: string; icon: string; center?: boolean };

/** The five places people go most. New plan sits in the middle as the main action. */
const TABS: Tab[] = [
  { name: 'dashboard', label: 'Home', icon: 'house' },
  { name: 'plans', label: 'Plans', icon: 'folder-open' },
  { name: 'plan-form', label: 'New plan', icon: 'plus', center: true },
  { name: 'credits', label: 'Credits', icon: 'coins' },
  { name: 'settings', label: 'Profile', icon: 'user' },
];

/** Screens reached from Profile (admin tools) keep the Profile tab highlighted. */
const UNDER_PROFILE = ['admin', 'user-management'];

/** Bottom tab bar for phones: icon pill and label, 56 px tall plus the gesture bar inset. */
export function BottomBar({ state, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const current = state.routes[state.index].name;

  // the plan wizard is a full screen flow with its own Back and Next bar
  if (current === 'plan-form') return null;

  const activeTab = UNDER_PROFILE.includes(current) ? 'settings' : current;

  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: 'row', backgroundColor: colors.card, paddingBottom: insets.bottom,
        borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border,
      }}
    >
      {TABS.map((tab) => {
        const active = activeTab === tab.name;
        const color = active ? colors.primary : colors.textLight;
        return (
          <PressableScale
            key={tab.name}
            feedback="none"
            scaleTo={0.94}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: active }}
            onPress={() => {
              haptics.select();
              if (tab.name === 'plan-form') navigation.navigate('plan-form', { editId: undefined, nonce: Date.now() });
              else navigation.navigate(tab.name);
            }}
            style={{ flex: 1, minHeight: 60, alignItems: 'center', justifyContent: 'center', gap: 3, paddingTop: 6, paddingBottom: 4 }}
          >
            {tab.center ? (
              <View style={{ width: 44, height: 32, borderRadius: 16, backgroundColor: '#1B5E20', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={tab.icon} size={16} color="#FFFFFF" />
              </View>
            ) : (
              <View style={{ width: 56, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: active ? colors.primaryLight : 'transparent' }}>
                <Icon name={tab.icon} size={18} color={color} />
              </View>
            )}
            <Text style={{ fontSize: 12, lineHeight: 15, fontFamily: ff(active || tab.center ? '700' : '500'), color: tab.center ? colors.primary : color }} numberOfLines={1}>
              {tab.label}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}
