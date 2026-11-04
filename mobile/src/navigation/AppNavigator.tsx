import { StatusBar } from 'expo-status-bar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '../theme/ThemeProvider';
import { useLayout } from '../components/ui';
import { CustomDrawer } from './CustomDrawer';
import { BottomBar } from './BottomBar';
import { TopBar, LeftAction } from './TopBar';
import { DashboardScreen } from '../screens/DashboardScreen';
import { PlansScreen } from '../screens/PlansScreen';
import { PlanWizardScreen } from '../screens/wizard/PlanWizardScreen';
import { CreditsScreen } from '../screens/CreditsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AdminScreen } from '../screens/admin/AdminScreen';
import { UserManagementScreen } from '../screens/admin/UserManagementScreen';
import { useRole } from '../lib/useResource';

export type DrawerParams = {
  dashboard: undefined;
  plans: undefined;
  /** editId: plan to edit; nonce: forces a fresh blank wizard for "New Business Plan" */
  'plan-form': { editId?: string; nonce?: number } | undefined;
  credits: { request?: boolean } | undefined;
  settings: undefined;
  admin: undefined;
  'user-management': undefined;
};

const Tabs = createBottomTabNavigator<DrawerParams>();
const Drawer = createDrawerNavigator<DrawerParams>();

const TITLES: Record<keyof DrawerParams, string> = {
  dashboard: 'Dashboard',
  plans: 'My Business Plans',
  'plan-form': 'Business Plan',
  credits: 'Credits',
  settings: 'Profile & Settings',
  admin: 'Admin Panel',
  'user-management': 'User Management',
};

/** Remounts the wizard per plan (or per "new" tap) so it never shows a previous draft. */
function PlanFormHost({ route }: { route: { params?: DrawerParams['plan-form'] } }) {
  const editId = route.params?.editId;
  return <PlanWizardScreen key={editId ?? `new-${route.params?.nonce ?? 0}`} editId={editId} />;
}

/** Back goes to the previous screen; if there is none (first screen), to the dashboard. */
function goBackOrHome(navigation: any) {
  if (navigation.canGoBack()) navigation.goBack();
  else navigation.navigate('dashboard');
}

/** Which button the app bar shows on the left, per screen. */
const LEFT: Partial<Record<keyof DrawerParams, LeftAction>> = {
  'plan-form': 'close',
  admin: 'back',
  'user-management': 'back',
};

/* ---------------------------------------------------------------- phones */
function PhoneNavigator({ role }: { role: string }) {
  const { colors } = useTheme();
  return (
    <Tabs.Navigator
      initialRouteName="dashboard"
      backBehavior="history"
      tabBar={(props) => <BottomBar {...props} />}
      screenOptions={{
        sceneStyle: { backgroundColor: colors.bg },
        header: ({ navigation, route }) => (
          <TopBar
            title={TITLES[route.name as keyof DrawerParams]}
            left={LEFT[route.name as keyof DrawerParams] ?? 'none'}
            onLeft={() => goBackOrHome(navigation)}
          />
        ),
      }}
    >
      <Tabs.Screen name="dashboard" component={DashboardScreen} />
      <Tabs.Screen name="plans" component={PlansScreen} />
      <Tabs.Screen name="plan-form" component={PlanFormHost} />
      <Tabs.Screen name="credits" component={CreditsScreen} />
      <Tabs.Screen name="settings" component={SettingsScreen} />
      {role === 'admin' || role === 'super_admin' ? <Tabs.Screen name="admin" component={AdminScreen} /> : null}
      {role === 'super_admin' ? <Tabs.Screen name="user-management" component={UserManagementScreen} /> : null}
    </Tabs.Navigator>
  );
}

/* --------------------------------------------------------------- tablets */
function TabletNavigator({ role }: { role: string }) {
  const { colors } = useTheme();
  return (
    <Drawer.Navigator
      initialRouteName="dashboard"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        header: ({ navigation, route }) => (
          <TopBar
            title={TITLES[route.name as keyof DrawerParams]}
            showAvatar
            onAvatar={() => navigation.navigate('settings')}
          />
        ),
        drawerType: 'permanent',
        drawerStyle: { width: 260, backgroundColor: '#1B5E20', borderRightWidth: 0 },
        overlayColor: 'rgba(0,0,0,0.5)',
        sceneStyle: { backgroundColor: colors.bg },
        swipeEdgeWidth: 40,
      }}
    >
      <Drawer.Screen name="dashboard" component={DashboardScreen} />
      <Drawer.Screen name="plans" component={PlansScreen} />
      <Drawer.Screen name="plan-form" component={PlanFormHost} />
      <Drawer.Screen name="credits" component={CreditsScreen} />
      <Drawer.Screen name="settings" component={SettingsScreen} />
      {role === 'admin' || role === 'super_admin' ? <Drawer.Screen name="admin" component={AdminScreen} /> : null}
      {role === 'super_admin' ? <Drawer.Screen name="user-management" component={UserManagementScreen} /> : null}
    </Drawer.Navigator>
  );
}

export function AppNavigator() {
  // tablets keep the permanent side menu; phones get the bottom tab bar
  const { isTablet } = useLayout();
  const role = useRole();
  return (
    <>
      {/* light status bar icons on the forest green app bar; the sign in screens keep their own */}
      <StatusBar style="light" />
      {isTablet ? <TabletNavigator role={role} /> : <PhoneNavigator role={role} />}
    </>
  );
}
