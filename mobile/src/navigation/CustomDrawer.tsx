import React from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/clerk-expo';
import { ff } from '../theme/theme';
import { Icon } from '../components/Icon';
import { AgriplanLogo } from '../components/AgriplanLogo';
import { useRole } from '../lib/useResource';
import { WEB_ORIGIN } from '../env';
import { useConfirm } from '../components/Confirm';
import { haptics } from '../lib/haptics';
import { NAV_SECTIONS } from './navConfig';

/*
 * The web app's sidebar (layout.css .sidebar): dark green gradient, logo row with a
 * translucent tile and two-tone "Agriplan", uppercase section labels, 13px items
 * with a highlighted background and #66BB6A left accent on the active page.
 */
const TEXT = 'rgba(255,255,255,0.7)';
const TEXT_ACTIVE = '#FFFFFF';
const ACTIVE_BG = 'rgba(255,255,255,0.12)';
const PRESSED_BG = 'rgba(255,255,255,0.08)';
const DIVIDER = 'rgba(255,255,255,0.1)';

function NavItem({ icon, label, active, onPress, danger }: { icon: string; label: string; active?: boolean; onPress: () => void; danger?: boolean }) {
  const color = danger ? '#FFCDD2' : active ? TEXT_ACTIVE : TEXT;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="menuitem"
      accessibilityState={{ selected: !!active }}
      style={({ pressed }) => ({
        flexDirection: 'row', alignItems: 'center', gap: 12,
        paddingVertical: 11, paddingLeft: 17, paddingRight: 20,
        borderLeftWidth: 3, borderLeftColor: active ? '#66BB6A' : 'transparent',
        backgroundColor: active ? ACTIVE_BG : pressed ? PRESSED_BG : 'transparent',
      })}
    >
      <View style={{ width: 20, alignItems: 'center' }}>
        <Icon name={icon} size={14} color={color} />
      </View>
      <Text style={{ color, fontSize: 13, fontFamily: ff('500') }} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

export function CustomDrawer(props: DrawerContentComponentProps) {
  const { signOut } = useAuth();
  const confirm = useConfirm();
  const insets = useSafeAreaInsets();
  const activeRoute = props.state.routeNames[props.state.index];

  const role = useRole();

  const go = (route: string) => {
    haptics.select();
    // "New Business Plan" always opens a blank wizard (fresh key), never the last edit
    if (route === 'plan-form') props.navigation.navigate(route, { editId: undefined, nonce: Date.now() });
    else props.navigation.navigate(route);
  };

  const onSignOut = async () => {
    const ok = await confirm('Sign out of Agriplan on this device?', { confirmLabel: 'Sign out', danger: true });
    if (ok) signOut();
  };

  return (
    <LinearGradient colors={['#1B5E20', '#0D3B12']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      {/* .sidebar-header */}
      <View
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 12,
          paddingTop: insets.top + 14, paddingBottom: 16, paddingHorizontal: 18,
          borderBottomWidth: 1, borderBottomColor: DIVIDER,
        }}
      >
        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
          <AgriplanLogo size={24} scale={0.9} />
        </View>
        <Text style={{ fontSize: 17, fontFamily: ff('700'), color: '#FFFFFF' }}>
          Agri<Text style={{ color: '#81C784' }}>plan</Text>
        </Text>
      </View>

      {/* .sidebar-nav */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 12 }}>
        {NAV_SECTIONS.map((section) => (
          <View key={section.label || 'root'}>
            {section.label ? (
              <Text
                style={{
                  fontSize: 10, fontFamily: ff('700'), textTransform: 'uppercase', letterSpacing: 1.2,
                  color: 'rgba(255,255,255,0.35)', paddingTop: 16, paddingBottom: 6, paddingHorizontal: 20,
                }}
              >
                {section.label}
              </Text>
            ) : null}
            {section.items.map((item) => (
              <NavItem key={item.route} icon={item.icon} label={item.label} active={activeRoute === item.route} onPress={() => go(item.route)} />
            ))}
          </View>
        ))}
      </ScrollView>

      {/* .sidebar-footer */}
      <View style={{ borderTopWidth: 1, borderTopColor: DIVIDER, paddingTop: 6, paddingBottom: insets.bottom + 8 }}>
        {role !== 'user' ? (
          <NavItem icon="arrow-up-right-from-square" label="Admin Panel (website)" onPress={() => Linking.openURL(`${WEB_ORIGIN}/plan/admin`)} />
        ) : null}
        <NavItem icon="logout" label="Sign out" onPress={onSignOut} danger />
      </View>
    </LinearGradient>
  );
}
