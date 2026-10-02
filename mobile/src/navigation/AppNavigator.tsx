import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '../theme/ThemeProvider';
import { useLayout } from '../components/ui';
import { CustomDrawer } from './CustomDrawer';
import { TopBar } from './TopBar';
import { DashboardScreen } from '../screens/DashboardScreen';
import { PlansScreen } from '../screens/PlansScreen';
import { PlanWizardScreen } from '../screens/wizard/PlanWizardScreen';
import { CreditsScreen } from '../screens/CreditsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

export type DrawerParams = {
  dashboard: undefined;
  plans: undefined;
  /** editId: plan to edit; nonce: forces a fresh blank wizard for "New Business Plan" */
  'plan-form': { editId?: string; nonce?: number } | undefined;
  credits: { request?: boolean } | undefined;
  settings: undefined;
};

const Drawer = createDrawerNavigator<DrawerParams>();

/** Remounts the wizard per plan (or per "new" tap) so it never shows a previous draft. */
function PlanFormHost({ route }: { route: { params?: DrawerParams['plan-form'] } }) {
  const editId = route.params?.editId;
  return <PlanWizardScreen key={editId ?? `new-${route.params?.nonce ?? 0}`} editId={editId} />;
}

export function AppNavigator() {
  const { colors } = useTheme();
  // web: the sidebar is fixed from 768px up and becomes a slide-out menu below it
  const { isTablet } = useLayout();
  return (
    <Drawer.Navigator
      initialRouteName="dashboard"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={({ navigation }) => ({
        header: () => <TopBar navigation={navigation} showMenu={!isTablet} />,
        drawerType: isTablet ? 'permanent' : 'front',
        drawerStyle: { width: 260, backgroundColor: '#1B5E20', borderRightWidth: 0 },
        overlayColor: 'rgba(0,0,0,0.5)',
        sceneStyle: { backgroundColor: colors.bg },
        swipeEdgeWidth: 40,
      })}
    >
      <Drawer.Screen name="dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="plans" component={PlansScreen} options={{ title: 'My Business Plans' }} />
      <Drawer.Screen name="plan-form" component={PlanFormHost} options={{ title: 'Business Plan' }} />
      <Drawer.Screen name="credits" component={CreditsScreen} options={{ title: 'Credits' }} />
      <Drawer.Screen name="settings" component={SettingsScreen} options={{ title: 'Profile & Settings' }} />
    </Drawer.Navigator>
  );
}
